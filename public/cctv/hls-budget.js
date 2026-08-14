/*
 * HlsBudget — 全域 HLS 串流預算管理器
 *
 * 解決「同時開太多攝影機導致 Chrome 硬體解碼器/worker 爆炸崩潰」。
 * 核心概念:
 *   - 同時「活著」的 HLS 串流上限 MAX_HLS (桌面 9 / 手機 4)。
 *   - 只有進入視口 (rootMargin 200px) 的卡片才啟動串流。
 *   - 超出上限時逐出最久沒使用的串流 (LRU)。
 *   - 離開視口 / 被逐出的卡片: 用 canvas 擷取最後一幀當定格牆, 釋放解碼器。
 *   - 串流致命錯誤: 顯示 NO SIGNAL, 進入視口時自動重試。
 *
 * 使用方式 (各頁 is:inline script 直接取用全域 HlsBudget):
 *   HlsBudget.observe(box, url)    // box = .cam-media / .cam-media-box / .cam-preview 容器
 *   HlsBudget.unobserve(box)       // 卡片移除時呼叫
 *   HlsBudget.clearAll()           // 整個頁面重渲前呼叫 (search 頁)
 *
 * 依賴: hls.js 的全域 Hls (由各頁 <script src=".../hls.js@1"> 載入)。
 */
(function () {
  'use strict';

  var IS_MOBILE = /(iPhone|iPod|Android|Mobile)/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && window.matchMedia('(max-width: 640px)').matches);

  var MAX_HLS = IS_MOBILE ? 4 : 9;
  var ROOT_MARGIN = '200px';

  var entries = new Map();      // box -> { box, url, video, hls, frozen, lastActive }
  var observer = null;

  function ensureObserver() {
    if (observer) return observer;
    observer = new IntersectionObserver(function (chunks) {
      chunks.forEach(function (chunk) {
        var box = chunk.target;
        var entry = entries.get(box);
        if (!entry) return;
        if (chunk.isIntersecting) {
          entry.lastActive = Date.now();
          startEntry(entry);
          ensureBudget(entry);
        } else {
          freezeEntry(entry);
        }
      });
    }, { rootMargin: ROOT_MARGIN });
    return observer;
  }

  function cctvSvg() {
    return '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>';
  }

  function showNoSignal(entry) {
    if (entry.frozen) return;
    clearMedia(entry);
    var d = document.createElement('div');
    d.className = 'cam-nosig';
    d.innerHTML = cctvSvg() + '<span>NO SIGNAL</span>';
    entry.box.appendChild(d);
    entry.frozen = d;
  }

  function clearMedia(entry) {
    if (entry.video) {
      if (entry.hls) {
        entry.hls.destroy();
        entry.hls = null;
      }
      if (entry.video.parentNode) entry.video.parentNode.removeChild(entry.video);
      entry.video = null;
    }
    if (entry.frozen) {
      if (entry.frozen.parentNode) entry.frozen.parentNode.removeChild(entry.frozen);
      entry.frozen = null;
    }
  }

  function createVideo(box) {
    var video = document.createElement('video');
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;position:absolute;inset:0;z-index:1';
    box.appendChild(video);
    return video;
  }

  function startEntry(entry) {
    if (entry.video && entry.hls) {
      // 已在播放中, 只是刷新存取時間
      return;
    }
    if (entry.video && entry.video.dataset.failed) {
      // 上次致命錯誤: 換新 video 重試
      clearMedia(entry);
    }
    if (entry.frozen) {
      // 殘留的定格 canvas / NO SIGNAL: 先移除, 避免蓋住新串流
      clearMedia(entry);
    }
    if (!entry.video) {
      entry.video = createVideo(entry.box);
    }
    var video = entry.video;
    video.dataset.failed = '';

    var url = entry.url;
    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        maxBufferLength: 10,
        maxMaxBufferLength: 20,
        startFragPrefetch: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      hls.on(Hls.Events.ERROR, function (e, data) {
        if (data.fatal) {
          if (entry.hls) {
            entry.hls.destroy();
            entry.hls = null;
          }
          video.dataset.failed = '1';
          showNoSignal(entry);
        }
      });
      entry.hls = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // iOS Safari 原生 HLS
      video.src = url;
      video.play().catch(function () {});
    } else {
      video.dataset.failed = '1';
      showNoSignal(entry);
    }
  }

  // 離開視口 / 被逐出: 擷取最後一幀為定格牆, 並銷毀串流釋放解碼器
  function freezeEntry(entry) {
    var video = entry.video;
    if (!video) return; // 已凍結過

    var canCapture = video.isConnected &&
      video.readyState >= 2 &&
      video.videoWidth > 0 && video.videoHeight > 0;
    if (canCapture) {
      try {
        var canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        canvas.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;position:absolute;inset:0;z-index:2';
        clearMedia(entry);
        entry.box.appendChild(canvas);
        entry.frozen = canvas;
        return;
      } catch (e) {
        // 擷取失敗則退回 NO SIGNAL
      }
    }
    showNoSignal(entry);
  }

  // 預算已滿: 逐出最久沒使用的「可見」串流 (LRU), 騰出解碼器
  function evictLru(exceptBox) {
    var oldest = null;
    var oldestT = Infinity;
    entries.forEach(function (e, box) {
      if (box === exceptBox) return;
      if (!e.video || !e.hls) return; // 只看活著的
      if (e.lastActive < oldestT) {
        oldestT = e.lastActive;
        oldest = e;
      }
    });
    if (oldest) freezeEntry(oldest);
  }

  function ensureBudget(entry) {
    var active = 0;
    entries.forEach(function (e) {
      if (e.video && e.hls) active++;
    });
    if (active > MAX_HLS) evictLru(entry.box);
  }

  // ---------- 公開 API ----------

  // box 進入視口時自動啟動串流, 離開時定格
  function observe(box, url) {
    if (!box || entries.has(box)) return;
    var entry = { box: box, url: url, video: null, hls: null, frozen: null, lastActive: Date.now() };
    entries.set(box, entry);
    ensureObserver().observe(box);
    // 若已可見 (例如頁面載入即在視口), 立即啟動; 否則等 observer 回呼
    if (isInViewport(box)) {
      entry.lastActive = Date.now();
      startEntry(entry);
      ensureBudget(entry);
    }
  }

  // 卡片移除 / 頁面重渲: 停止追蹤並銷毀
  function unobserve(box) {
    var entry = entries.get(box);
    if (!entry) return;
    if (observer) observer.unobserve(box);
    entries.delete(box);
    clearMedia(entry);
  }

  // 全部停止 (search 頁每次搜尋前呼叫)
  function clearAll() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    entries.forEach(function (entry) {
      clearMedia(entry);
    });
    entries.clear();
  }

  function isInViewport(el) {
    if (!el || !el.getBoundingClientRect) return false;
    var r = el.getBoundingClientRect();
    var vw = window.innerWidth || document.documentElement.clientWidth;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var m = 200;
    return r.bottom >= -m && r.top <= vh + m && r.right >= -m && r.left <= vw + m;
  }

  window.HlsBudget = {
    observe: observe,
    unobserve: unobserve,
    clearAll: clearAll,
    maxHls: MAX_HLS
  };
})();
