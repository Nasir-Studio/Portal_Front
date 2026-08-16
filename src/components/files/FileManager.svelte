<script>
  import { onMount } from 'svelte';

  // 私人檔案管理（Files_System 前端）
  // 網址固定不變，所有檔案操作皆由 JS 狀態管理 + fetch 後端。
  // API 基底：PUBLIC_API_URL 設定時指向該網域（如 https://api.nsir.uk），
  // 未設定時同源（/files）→ 與 Portal 同域部署時 cookie 自動帶上。
  const API_BASE = (import.meta.env.PUBLIC_API_URL || '').replace(/\/+$/, '') + '/files';

  let bucket = $state('');
  let prefix = $state('');
  let items = $state([]);
  let cursor = $state(undefined);
  let buckets = $state([]);
  let authenticated = $state(false);
  let error = $state('');
  let loading = $state(false);
  let lightboxOpen = $state(false);
  let lightboxName = $state('');
  let lightboxKind = $state('img');
  let lightboxSrc = $state('');

  const api = (path) => `${API_BASE}${path}`;
  const fileSrc = (key, opts = '') =>
    `${API_BASE}/f/${encodeURIComponent(bucket)}/${encodeURIComponent(key)}${opts}`;

  async function jsonFetch(path, options = {}) {
    const r = await fetch(api(path), { credentials: 'include', ...options });
    if (r.status === 401) {
      authenticated = false;
      throw new Error('unauthorized');
    }
    return r;
  }

  async function checkAuth() {
    const r = await jsonFetch('/api/me');
    const d = await r.json();
    authenticated = !!d.authenticated;
    if (authenticated) {
      await Promise.all([loadBuckets(), loadList()]);
    }
  }

  async function doLogin() {
    error = '';
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const r = await fetch(api('/api/login'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok) {
      authenticated = true;
      await Promise.all([loadBuckets(), loadList()]);
      return;
    }
    if (d.error === 'setup_required') {
      error = '管理員尚未設定密碼，請先在 Cloudflare Dashboard 設定 FILE_SYS_PASS。';
    } else if (d.error === 'too_many_attempts') {
      const mins = Math.ceil((d.retry_after ?? 900) / 60);
      error = `嘗試次數過多，請 ${mins} 分鐘後再試。`;
    } else {
      error = 'Email 或密碼錯誤。';
    }
  }

  async function doLogout() {
    await fetch(api('/api/logout'), { method: 'POST', credentials: 'include' });
    authenticated = false;
    items = [];
    buckets = [];
    prefix = '';
    cursor = undefined;
  }

  async function loadBuckets() {
    const r = await jsonFetch('/api/buckets');
    const d = await r.json();
    buckets = d.buckets;
    if (!bucket && buckets.length > 0) {
      bucket = buckets[0];
    }
  }

  async function loadList() {
    loading = true;
    try {
      const qs = `bucket=${encodeURIComponent(bucket)}&prefix=${encodeURIComponent(prefix)}`;
      const r = await jsonFetch(`/api/list?${qs}`);
      const d = await r.json();
      items = [
        ...d.folders.map((f) => ({ name: f, folder: true })),
        ...d.files.map((f) => ({ ...f, folder: false })),
      ];
      cursor = d.cursor;
    } finally {
      loading = false;
    }
  }

  async function loadMore() {
    if (!cursor) return;
    const qs = `bucket=${encodeURIComponent(bucket)}&prefix=${encodeURIComponent(prefix)}&cursor=${encodeURIComponent(cursor)}`;
    const r = await jsonFetch(`/api/list?${qs}`);
    const d = await r.json();
    items = [
      ...items,
      ...d.folders.map((f) => ({ name: f, folder: true })),
      ...d.files.map((f) => ({ ...f, folder: false })),
    ];
    cursor = d.cursor;
  }

  function openFolder(name) {
    prefix = prefix + name + '/';
    loadList();
  }

  function goUp() {
    if (!prefix) return;
    const parts = prefix.split('/').filter(Boolean);
    parts.pop();
    prefix = parts.length ? parts.join('/') + '/' : '';
    loadList();
  }

  async function newFolder() {
    const name = window.prompt('資料夾名稱：');
    if (!name || !name.trim()) return;
    const clean = name.trim().replace(/[/\\]/g, '_');
    const r = await fetch(api(`/api/folder?bucket=${encodeURIComponent(bucket)}`), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: prefix + clean + '/' }),
    });
    if (r.ok) await loadList();
    else window.alert('新增資料夾失敗');
  }

  async function deleteItem(item) {
    const key = item.folder ? prefix + item.name + '/' : prefix + item.name;
    if (!window.confirm(`確定刪除「${item.name}」？${item.folder ? '資料夾內所有檔案將一併刪除。' : ''}此操作無法復原。`)) return;
    const r = await jsonFetch(`/api/file?bucket=${encodeURIComponent(bucket)}&key=${encodeURIComponent(key)}`, { method: 'DELETE' });
    if (r.ok) await loadList();
    else window.alert('刪除失敗');
  }

  async function renameItem(item) {
    const from = item.folder ? prefix + item.name + '/' : prefix + item.name;
    const newName = window.prompt('新的名稱：', item.name);
    if (!newName || newName === item.name) return;
    const clean = newName.trim().replace(/[/\\]/g, '_');
    const to = prefix + clean + (item.folder ? '/' : '');
    const r = await fetch(api(`/api/rename?bucket=${encodeURIComponent(bucket)}`), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to }),
    });
    if (r.ok) await loadList();
    else window.alert('重新命名失敗');
  }

  async function copyLink(key) {
    try {
      await navigator.clipboard.writeText(fileSrc(key));
      window.alert('網址已複製');
    } catch {
      window.prompt('請手動複製網址：', fileSrc(key));
    }
  }

  function openLightbox(key, name) {
    lightboxKind = isImage(name)
      ? 'img'
      : isVideo(name)
        ? 'video'
        : isAudio(name)
          ? 'audio'
          : isPdf(name)
            ? 'iframe'
            : 'img';
    lightboxSrc = fileSrc(key, '?ts=' + Date.now());
    lightboxName = name;
    lightboxOpen = true;
  }

  function closeLightbox() {
    lightboxOpen = false;
    lightboxSrc = '';
    lightboxName = '';
  }

  const isImage = (name) => /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/i.test(name);
  const isVideo = (name) => /\.(mp4|webm|mov|m4v|ogv)$/i.test(name);
  const isAudio = (name) => /\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(name);
  const isPdf = (name) => /\.pdf$/i.test(name);

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }
  function formatTime(iso) {
    const d = new Date(iso);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  }

  const breadcrumbs = $derived(prefix.split('/').filter(Boolean));

  // 跨域部署（PUBLIC_API_URL 指向另一 domain）時，瀏覽器需要該 domain 的 Access cookie。
  // 用隱藏 iframe 觸發一次導覽式請求，讓 Cloudflare Access 完成跨域 SSO 並簽發 cookie。
  function warmAccessCookie() {
    if (!import.meta.env.PUBLIC_API_URL) return Promise.resolve();
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.src = api('/api/me');
      iframe.style.display = 'none';
      iframe.onload = () => resolve();
      iframe.onerror = () => resolve();
      document.body.appendChild(iframe);
    });
  }

  onMount(async () => {
    await warmAccessCookie();
    await checkAuth();
  });
</script>

{#if !authenticated}
  <div class="login-wrap">
    <div class="login-card">
      <h1>檔案管理</h1>
      <p class="sub">請以管理員帳號登入</p>
      <label for="email">Email</label>
      <input id="email" type="email" autocomplete="username" placeholder="hi@nasirlin.net" />
      <label for="password">密碼</label>
      <input id="password" type="password" autocomplete="current-password" />
      <button onclick={doLogin}>登入</button>
      <p class="login-error">{error}</p>
    </div>
  </div>
{:else}
  <header>
    <div class="breadcrumb">
      <button onclick={() => { prefix = ''; loadList(); }}>根目錄</button>
      {#each breadcrumbs as p, i}
        <button
          onclick={() => { prefix = breadcrumbs.slice(0, i + 1).join('/') + '/'; loadList(); }}
        >{p}</button>
      {/each}
    </div>
    <div class="toolbar">
      <label class="bucket-label" for="bucketSelect">儲存桶</label>
      <select id="bucketSelect" bind:value={bucket} onchange={loadList}>
        {#each buckets as b}
          <option value={b}>{b}</option>
        {/each}
      </select>
      <button onclick={goUp} disabled={!prefix}>⬆ 上一層</button>
      <button onclick={newFolder}>新增資料夾</button>
      <button onclick={doLogout}>登出</button>
    </div>
  </header>
  <main>
    <div class="grid">
      {#each items as item (item.folder ? 'd:' + item.name : 'f:' + item.name)}
        <div class="item">
          {#if item.folder}
            <div class="folder-icon" onclick={() => openFolder(item.name)}>📁</div>
            <div class="meta" onclick={() => openFolder(item.name)}>
              <div class="name">{item.name}</div>
            </div>
            <div class="hover-actions">
              <button title="重新命名" onclick={(e) => { e.stopPropagation(); renameItem(item); }}>✎</button>
              <button class="del" title="刪除" onclick={(e) => { e.stopPropagation(); deleteItem(item); }}>✕</button>
            </div>
          {:else if isImage(item.name) || isVideo(item.name)}
            <img
              class="thumb"
              src={fileSrc(prefix + item.name)}
              alt={item.name}
              loading="lazy"
              onclick={() => openLightbox(prefix + item.name, item.name)}
            />
            <div class="meta">
              <div class="name">{item.name}</div>
              <div class="sub">{formatSize(item.size)} · {formatTime(item.modifiedAt)}</div>
            </div>
            <div class="hover-actions">
              <button title="重新命名" onclick={(e) => { e.stopPropagation(); renameItem(item); }}>✎</button>
              <button title="複製網址" onclick={(e) => { e.stopPropagation(); copyLink(prefix + item.name); }}>🔗</button>
              <button title="下載" onclick={(e) => { e.stopPropagation(); window.open(fileSrc(prefix + item.name, '?download=1'), '_blank'); }}>⬇</button>
              <button class="del" title="刪除" onclick={(e) => { e.stopPropagation(); deleteItem(item); }}>✕</button>
            </div>
          {:else if isPdf(item.name)}
            <div class="folder-icon pdf" onclick={() => openLightbox(prefix + item.name, item.name)}>📕</div>
            <div class="meta">
              <div class="name">{item.name}</div>
              <div class="sub">{formatSize(item.size)} · {formatTime(item.modifiedAt)}</div>
            </div>
            <div class="hover-actions">
              <button title="重新命名" onclick={(e) => { e.stopPropagation(); renameItem(item); }}>✎</button>
              <button title="複製網址" onclick={(e) => { e.stopPropagation(); copyLink(prefix + item.name); }}>🔗</button>
              <button title="下載" onclick={(e) => { e.stopPropagation(); window.open(fileSrc(prefix + item.name, '?download=1'), '_blank'); }}>⬇</button>
              <button class="del" title="刪除" onclick={(e) => { e.stopPropagation(); deleteItem(item); }}>✕</button>
            </div>
          {:else if isAudio(item.name)}
            <div class="folder-icon audio" onclick={() => openLightbox(prefix + item.name, item.name)}>🎵</div>
            <div class="meta">
              <div class="name">{item.name}</div>
              <div class="sub">{formatSize(item.size)} · {formatTime(item.modifiedAt)}</div>
            </div>
            <div class="hover-actions">
              <button title="重新命名" onclick={(e) => { e.stopPropagation(); renameItem(item); }}>✎</button>
              <button title="複製網址" onclick={(e) => { e.stopPropagation(); copyLink(prefix + item.name); }}>🔗</button>
              <button title="下載" onclick={(e) => { e.stopPropagation(); window.open(fileSrc(prefix + item.name, '?download=1'), '_blank'); }}>⬇</button>
              <button class="del" title="刪除" onclick={(e) => { e.stopPropagation(); deleteItem(item); }}>✕</button>
            </div>
          {:else}
            <div class="folder-icon file" onclick={() => window.open(fileSrc(prefix + item.name, '?download=1'), '_blank')}>📄</div>
            <div class="meta">
              <div class="name">{item.name}</div>
              <div class="sub">{formatSize(item.size)} · {formatTime(item.modifiedAt)}</div>
            </div>
            <div class="hover-actions">
              <button title="重新命名" onclick={(e) => { e.stopPropagation(); renameItem(item); }}>✎</button>
              <button title="複製網址" onclick={(e) => { e.stopPropagation(); copyLink(prefix + item.name); }}>🔗</button>
              <button title="下載" onclick={(e) => { e.stopPropagation(); window.open(fileSrc(prefix + item.name, '?download=1'), '_blank'); }}>⬇</button>
              <button class="del" title="刪除" onclick={(e) => { e.stopPropagation(); deleteItem(item); }}>✕</button>
            </div>
          {/if}
        </div>
      {/each}
      {#if loading}
        <div class="empty-hint">載入中…</div>
      {:else if items.length === 0}
        <div class="empty-hint">此資料夾是空的</div>
      {/if}
      {#if cursor}
        <div class="more-wrap">
          <button class="more-btn" onclick={loadMore}>載入更多</button>
        </div>
      {/if}
    </div>
  </main>
  <footer>私人檔案管理</footer>
{/if}

{#if lightboxOpen}
  <div class="lightbox" onclick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}>
    <button class="lb-close" onclick={closeLightbox}>×</button>
    {#if lightboxKind === 'iframe'}
      <iframe src={lightboxSrc} title={lightboxName} allowfullscreen></iframe>
    {:else if lightboxKind === 'video' || lightboxKind === 'audio'}
      <svelte:element this={lightboxKind} src={lightboxSrc} controls />
    {:else}
      <img src={lightboxSrc} alt={lightboxName} />
    {/if}
    <div class="lb-name">{lightboxName}</div>
  </div>
{/if}

<style>
  header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    background: var(--panel, #fff);
    border-bottom: 1px solid var(--border, #e4e4e3);
    position: sticky;
    top: 0;
    z-index: 10;
    flex-wrap: wrap;
  }
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    flex-wrap: wrap;
    font-size: 14px;
  }
  .breadcrumb button {
    background: none;
    border: none;
    color: var(--accent, #2563eb);
    font-size: 14px;
    padding: 2px 4px;
  }
  .breadcrumb button:not(:first-child)::before {
    content: '/';
    color: var(--muted, #78716c);
    margin-right: 4px;
    cursor: default;
  }
  .toolbar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .toolbar button, .more-btn {
    padding: 6px 14px;
    border: 1px solid var(--border, #e4e4e3);
    border-radius: 8px;
    background: var(--panel, #fff);
    font-size: 13px;
  }
  .toolbar button:disabled { opacity: 0.5; cursor: not-allowed; }
  .toolbar select {
    padding: 6px 10px;
    border: 1px solid var(--border, #e4e4e3);
    border-radius: 8px;
    background: var(--panel, #fff);
    font-size: 13px;
  }
  .bucket-label { font-size: 12px; color: var(--muted, #78716c); }
  main { padding: 24px 20px; max-width: 1400px; margin: 0 auto; }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
  .empty-hint {
    grid-column: 1 / -1;
    text-align: center;
    color: var(--muted, #78716c);
    padding: 40px 0;
  }
  .item {
    background: var(--panel, #fff);
    border: 1px solid var(--border, #e4e4e3);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
  }
  .item:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
  .item .thumb {
    aspect-ratio: 1 / 1;
    width: 100%;
    object-fit: cover;
    display: block;
    background: #eee;
  }
  .item .folder-icon {
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 44px;
    color: #f59e0b;
    background: #fefce8;
  }
  .item .folder-icon.pdf { color: #dc2626; background: #fef2f2; }
  .item .folder-icon.audio { color: #7c3aed; background: #f5f3ff; }
  .item .folder-icon.file { color: #64748b; background: #f8fafc; }
  .item .meta { padding: 8px 10px; }
  .item .name {
    font-size: 13px;
    font-weight: 500;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .item .sub { font-size: 11px; color: var(--muted, #78716c); margin-top: 2px; }
  .item .hover-actions {
    position: absolute;
    top: 6px;
    right: 6px;
    display: none;
    gap: 4px;
  }
  .item:hover .hover-actions { display: flex; }
  .item .hover-actions button {
    width: 26px;
    height: 26px;
    border: none;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 13px;
    line-height: 1;
  }
  .item .hover-actions button.del:hover { background: var(--danger, #dc2626); }
  .more-wrap { grid-column: 1 / -1; text-align: center; }
  .login-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .login-card {
    background: var(--panel, #fff);
    border: 1px solid var(--border, #e4e4e3);
    border-radius: 12px;
    padding: 40px 36px;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }
  .login-card h1 { font-size: 20px; margin-bottom: 4px; }
  .login-card p.sub { color: var(--muted, #78716c); font-size: 13px; margin-bottom: 24px; }
  .login-card label { display: block; font-size: 13px; color: var(--muted, #78716c); margin: 14px 0 6px; }
  .login-card input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border, #e4e4e3);
    border-radius: 8px;
    font-size: 15px;
  }
  .login-card input:focus { outline: 2px solid var(--accent, #2563eb); border-color: transparent; }
  .login-card button {
    width: 100%;
    margin-top: 22px;
    padding: 11px;
    background: var(--accent, #2563eb);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
  }
  .login-card button:hover { background: var(--accent-dark, #1d4ed8); }
  .login-error { color: var(--danger, #dc2626); font-size: 13px; margin-top: 12px; min-height: 18px; }
  .lightbox {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .lightbox img, .lightbox video { max-width: 90vw; max-height: 85vh; border-radius: 8px; }
  .lightbox iframe { width: 90vw; height: 85vh; border: none; border-radius: 8px; background: #fff; }
  .lightbox audio { width: 80vw; }
  .lightbox .lb-close {
    position: absolute;
    top: 16px;
    right: 20px;
    font-size: 28px;
    color: #fff;
    background: none;
    border: none;
  }
  .lightbox .lb-name {
    position: absolute;
    bottom: 12px;
    left: 0;
    right: 0;
    text-align: center;
    color: #fff;
    font-size: 13px;
    padding: 8px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  }
  footer { text-align: center; color: var(--muted, #78716c); font-size: 12px; padding: 24px; }
</style>
