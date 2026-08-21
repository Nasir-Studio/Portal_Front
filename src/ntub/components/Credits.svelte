<script lang="ts">
	import { programs } from '$ntub/data';
	import { checkedCourses, toggleCourse, earnedCredits, breakdown, myDept, ALL_DEPTS } from '$ntub/stores/credits';
	import { currentUser } from '$ntub/stores/auth';
	import type { Program, Course } from '$ntub/types';
	import NtubLayout from '../NtubLayout.svelte';

	const base = '/ntub';

	// 當前選中之工作表 Tab ('certificate' (證書總表) | 'all' (課程總表) | program.id | 'custom' | 'brochures')
	let activeSheet = $state('certificate');
	let searchQuery = $state('');
	let selectedCell = $state('A1');
	let formulaText = $state('=CERTIFICATE_ELIGIBILITY_ALL()');
	let showBrochureDetail = $state(true);

	// 預設主修科係為資訊管理系
	if (!$myDept) {
		myDept.set('資訊管理系');
	}

	// 自訂課程清單 (學生自由加入額外學分試算)
	interface CustomCourse {
		id: string;
		code: string;
		name: string;
		unit: string;
		type: '必修' | '選修';
		credits: number;
		term: string;
		checked: boolean;
	}

	let customCourses = $state<CustomCourse[]>([
		{ id: 'c-1', code: 'GE101', name: '大一英文 (一)', unit: '通識中心', type: '必修', credits: 2, term: '大一上', checked: true },
		{ id: 'c-2', code: 'GE102', name: '大一英文 (二)', unit: '通識中心', type: '必修', credits: 2, term: '大一下', checked: true },
		{ id: 'c-3', code: 'IM101', name: '計算機概論', unit: '資訊管理系', type: '必修', credits: 3, term: '大一上', checked: true },
		{ id: 'c-4', code: 'IM102', name: '程式設計 (Python)', unit: '資訊管理系', type: '必修', credits: 3, term: '大一下', checked: true },
		{ id: 'c-5', code: 'IM201', name: '資料結構', unit: '資訊管理系', type: '必修', credits: 3, term: '大二上', checked: false },
	]);

	let newCourseName = $state('');
	let newCourseUnit = $state('資訊管理系');
	let newCourseType = $state<'必修' | '選修'>('選修');
	let newCourseCredits = $state(3);
	let newCourseTerm = $state('大二下');

	const currentProgram = $derived(
		programs.find((p) => p.id === activeSheet) ?? programs[0]
	);

	// 🎓 9 大學程「修業證書取得資格」即時全自動試算統計
	const certificateSummaries = $derived(() => {
		return programs.map((p) => {
			const earned = earnedCredits($checkedCourses, p);
			const bd = breakdown($checkedCourses, p);
			const reqTotal = p.requirement.total;
			const reqMust = p.requirement.required ?? 0;
			const eleMust = p.requirement.elective ?? 0;

			// 計算跨系（外系）修課門數 (非 $myDept 所開設之已修課程)
			const crossDeptCourses = p.courses.filter(
				(c) => $checkedCourses.has(c.id) && ($myDept ? !c.unit.includes($myDept) : false)
			);
			const crossDeptCount = crossDeptCourses.length;

			// 跨系條件判定
			const passCross = !p.requirement.crossDept || crossDeptCount >= 1;
			// 必修條件判定
			const passReq = bd.required >= reqMust;
			// 選修條件判定
			const passEle = bd.elective >= eleMust;
			// 總學分條件判定
			const passTotal = earned >= reqTotal;

			// 總證書資格取得判定 (全部條件皆滿足)
			const isEligible = passTotal && passReq && passEle && passCross;

			const remaining = Math.max(0, reqTotal - earned);
			const progressPct = Math.min(100, Math.round((earned / reqTotal) * 100));

			let statusText = '✓ 已符合申請證書資格！';
			let reason = '';
			if (!isEligible) {
				const reasons: string[] = [];
				if (!passTotal) reasons.push(`尚缺 ${remaining} 學分`);
				if (!passReq) reasons.push(`必修缺 ${reqMust - bd.required} 學分`);
				if (!passCross) reasons.push('需跨系修 1 門外系');
				statusText = `尚未達標 (${reasons.join('、')})`;
				reason = reasons.join('、');
			}

			return {
				id: p.id,
				name: p.name,
				nameEn: p.nameEn,
				kind: p.kind,
				planningUnit: p.planningUnit,
				reqTotal,
				reqMust,
				eleMust,
				earned,
				earnedReq: bd.required,
				earnedEle: bd.elective,
				crossDeptReq: p.requirement.crossDept,
				crossDeptCount,
				passCross,
				passReq,
				passEle,
				passTotal,
				isEligible,
				remaining,
				progressPct,
				statusText,
				reason
			};
		});
	});

	// 已取得資格之學程總數
	const qualifiedCount = $derived(
		certificateSummaries().filter((c) => c.isEligible).length
	);

	// 全校所有學程課程合併扁平化清單 (去重複)
	const allCoursesFlat = $derived(() => {
		const map = new Map<string, { course: Course; programs: string[] }>();
		for (const p of programs) {
			for (const c of p.courses) {
				const existing = map.get(c.id);
				if (existing) {
					if (!existing.programs.includes(p.name)) existing.programs.push(p.name);
				} else {
					map.set(c.id, { course: c, programs: [p.name] });
				}
			}
		}
		return Array.from(map.values());
	});

	// 當前檢視之表格課程列
	const displayedRows = $derived(() => {
		let rows: Array<{
			id: string;
			code: string;
			name: string;
			unit: string;
			type: string;
			credits: number;
			term: string;
			notes: string;
			checked: boolean;
			isMine: boolean;
			isCustom?: boolean;
		}> = [];

		if (activeSheet === 'all') {
			rows = allCoursesFlat().map(({ course: c, programs: pList }) => ({
				id: c.id,
				code: c.id.toUpperCase(),
				name: c.name,
				unit: c.unit,
				type: c.type === 'required' ? '必修' : '選修',
				credits: c.credits,
				term: c.term ?? '全學年',
				notes: `所屬: ${pList.join('、')}`,
				checked: $checkedCourses.has(c.id),
				isMine: $myDept ? c.unit.includes($myDept) : false
			}));
		} else if (activeSheet === 'custom') {
			rows = customCourses.map((c) => ({
				id: c.id,
				code: c.code,
				name: c.name,
				unit: c.unit,
				type: c.type,
				credits: c.credits,
				term: c.term,
				notes: '自訂修課試算列',
				checked: c.checked,
				isMine: $myDept ? c.unit.includes($myDept) : true,
				isCustom: true
			}));
		} else if (activeSheet !== 'certificate' && activeSheet !== 'brochures') {
			const prog = currentProgram;
			rows = prog.courses.map((c) => ({
				id: c.id,
				code: c.id.toUpperCase(),
				name: c.name,
				unit: c.unit,
				type: c.type === 'required' ? '必修' : '選修',
				credits: c.credits,
				term: c.term ?? '依學期開設',
				notes: c.category ? (c.category === 'core' ? '核心必修' : '專業選修') : '',
				checked: $checkedCourses.has(c.id),
				isMine: $myDept ? c.unit.includes($myDept) : false
			}));
		}

		if (searchQuery.trim()) {
			const q = searchQuery.trim().toLowerCase();
			rows = rows.filter(
				(r) =>
					r.name.toLowerCase().includes(q) ||
					r.code.toLowerCase().includes(q) ||
					r.unit.toLowerCase().includes(q) ||
					r.type.includes(q)
			);
		}

		return rows;
	});

	// 即時試算表公式計算數值
	const sheetStats = $derived(() => {
		const rows = displayedRows();
		const totalAvailableCredits = rows.reduce((sum, r) => sum + r.credits, 0);
		const earnedCreditsSum = rows.filter((r) => r.checked).reduce((sum, r) => sum + r.credits, 0);
		const requiredCreditsSum = rows
			.filter((r) => r.checked && r.type === '必修')
			.reduce((sum, r) => sum + r.credits, 0);
		const electiveCreditsSum = rows
			.filter((r) => r.checked && r.type === '選修')
			.reduce((sum, r) => sum + r.credits, 0);
		const myDeptCreditsSum = rows
			.filter((r) => r.checked && r.isMine)
			.reduce((sum, r) => sum + r.credits, 0);
		const crossDeptCreditsSum = rows
			.filter((r) => r.checked && !r.isMine)
			.reduce((sum, r) => sum + r.credits, 0);

		let targetTotal = 128;
		let targetReq = 0;
		let targetEle = 0;
		let isProgramDone = false;

		if (activeSheet !== 'all' && activeSheet !== 'custom' && activeSheet !== 'certificate' && activeSheet !== 'brochures') {
			targetTotal = currentProgram.requirement.total;
			targetReq = currentProgram.requirement.required ?? 0;
			targetEle = currentProgram.requirement.elective ?? 0;
			isProgramDone = earnedCreditsSum >= targetTotal;
		}

		const progressPct = Math.min(100, Math.round((earnedCreditsSum / Math.max(1, targetTotal)) * 100));
		const remaining = Math.max(0, targetTotal - earnedCreditsSum);

		return {
			totalAvailableCredits,
			earnedCreditsSum,
			requiredCreditsSum,
			electiveCreditsSum,
			myDeptCreditsSum,
			crossDeptCreditsSum,
			targetTotal,
			targetReq,
			targetEle,
			progressPct,
			remaining,
			isProgramDone,
			checkedCount: rows.filter((r) => r.checked).length,
			totalCount: rows.length
		};
	});

	function handleCellClick(cellId: string, formula: string) {
		selectedCell = cellId;
		formulaText = formula;
	}

	function toggleRowChecked(row: ReturnType<typeof displayedRows>[0]) {
		if (row.isCustom) {
			const target = customCourses.find((c) => c.id === row.id);
			if (target) target.checked = !target.checked;
		} else {
			toggleCourse(row.id);
		}
	}

	function checkAllVisible() {
		for (const r of displayedRows()) {
			if (!r.checked) {
				if (r.isCustom) {
					const t = customCourses.find((c) => c.id === r.id);
					if (t) t.checked = true;
				} else {
					toggleCourse(r.id);
				}
			}
		}
	}

	function uncheckAllVisible() {
		for (const r of displayedRows()) {
			if (r.checked) {
				if (r.isCustom) {
					const t = customCourses.find((c) => c.id === r.id);
					if (t) t.checked = false;
				} else {
					toggleCourse(r.id);
				}
			}
		}
	}

	function checkMyDeptOnly() {
		if (!$myDept) return;
		for (const r of displayedRows()) {
			if (r.isMine && !r.checked) {
				if (r.isCustom) {
					const t = customCourses.find((c) => c.id === r.id);
					if (t) t.checked = true;
				} else {
					toggleCourse(r.id);
				}
			}
		}
	}

	function addCustomCourse() {
		if (!newCourseName.trim()) return;
		customCourses.push({
			id: `c-${Date.now()}`,
			code: `USR${customCourses.length + 101}`,
			name: newCourseName.trim(),
			unit: newCourseUnit,
			type: newCourseType,
			credits: Number(newCourseCredits) || 2,
			term: newCourseTerm,
			checked: true
		});
		newCourseName = '';
	}

	function removeCustomCourse(id: string) {
		customCourses = customCourses.filter((c) => c.id !== id);
	}

	// 📗 統一匯出單一完整多工作表 .xlsx Excel 試算表
	async function exportToUnifiedXLSX() {
		try {
			const XLSX = await import('xlsx');
			const wb = XLSX.utils.book_new();

			// Sheet 1: 🎓 證書資格審查總表 (含即時判定)
			const certRows = [
				['國立臺北商業大學 NTUB 學分學程暨微學程 — 修業證書資格審查總表'],
				[`學生所屬主修科系基準：${$myDept}（其餘系所課程自動判定為跨系/外系）`],
				[],
				['項次', '學程名稱', '類別', '應修門檻', '已修學分', '必修門檻', '必修已修', '選修門檻', '選修已修', '跨系要求', '跨系門數', '證書取得資格判定']
			];

			certificateSummaries().forEach((c, idx) => {
				certRows.push([
					idx + 1,
					c.name,
					c.kind,
					c.reqTotal,
					c.earned,
					c.reqMust,
					c.earnedReq,
					c.eleMust,
					c.earnedEle,
					c.crossDeptReq ? '需跨系1門' : '無限制',
					c.crossDeptCount,
					c.isEligible ? '🟢 ✓ 符合資格 (可申請證書)' : `🔴 尚未達標 (${c.reason})`
				]);
			});

			const wsCert = XLSX.utils.aoa_to_sheet(certRows);
			wsCert['!cols'] = [{ wch: 6 }, { wch: 28 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 32 }];
			XLSX.utils.book_append_sheet(wb, wsCert, '🎓證書資格審查總表');

			// Sheet 2: 📋 全校課程總表
			const allData = [
				['國立臺北商業大學 NTUB 學分學程與各系課程總表'],
				['狀態', '課程代碼', '課程名稱', '開課系所', '修別', '學分數', '開課學期', '所屬學程與備註']
			];
			for (const { course: c, programs: pList } of allCoursesFlat()) {
				allData.push([
					$checkedCourses.has(c.id) ? '已修' : '未修',
					c.id.toUpperCase(),
					c.name,
					c.unit,
					c.type === 'required' ? '必修' : '選修',
					c.credits,
					c.term || '全學年',
					pList.join('、')
				]);
			}
			const wsAll = XLSX.utils.aoa_to_sheet(allData);
			wsAll['!cols'] = [{ wch: 10 }, { wch: 14 }, { wch: 32 }, { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 30 }];
			XLSX.utils.book_append_sheet(wb, wsAll, '全校課程總表');

			// Sheet 3~11: 各學程獨立 Sheet
			for (const p of programs) {
				const pRows = [
					[`國立臺北商業大學 — ${p.name} (${p.kind}) 修業學分試算表`],
					[`門檻規定：總學分 ${p.requirement.total} 學分${p.requirement.required ? `，必修至少 ${p.requirement.required}` : ''}${p.requirement.elective ? `，選修至少 ${p.requirement.elective}` : ''}`],
					[],
					['狀態', '課程代碼', '課程名稱', '開課系所', '修別', '學分數', '開課學期', '本外系判定', '備註']
				];

				for (const c of p.courses) {
					pRows.push([
						$checkedCourses.has(c.id) ? '已修' : '未修',
						c.id.toUpperCase(),
						c.name,
						c.unit,
						c.type === 'required' ? '必修' : '選修',
						c.credits,
						c.term || '依學期開設',
						c.unit.includes($myDept) ? `本系 (${$myDept})` : '外系/跨系',
						c.category === 'core' ? '核心必修' : '專業選修'
					]);
				}

				const wsProg = XLSX.utils.aoa_to_sheet(pRows);
				wsProg['!cols'] = [{ wch: 10 }, { wch: 14 }, { wch: 30 }, { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 16 }, { wch: 20 }];
				const sheetTitle = p.name.replace(/學分學程|微學程/g, '').slice(0, 28);
				XLSX.utils.book_append_sheet(wb, wsProg, sheetTitle);
			}

			// 下載單一統一 .xlsx 檔案
			XLSX.writeFile(wb, `NTUB_學分修業與證書資格試算表_${new Date().toISOString().slice(0, 10)}.xlsx`);
		} catch (err) {
			console.error('XLSX export failed', err);
		}
	}
</script>

<NtubLayout>
<div class="sheet-app-container">
	<!-- 頁首說明與科系設定 -->
	<div class="sheet-hero-row">
		<div>
			<h1 class="sheet-main-title">📊 NTUB 學分修業與證書資格即時試算表</h1>
			<p class="sheet-sub-desc">
				全自動即時核算 9 大學分學程「修業證書取得資格」、必選修進度與跨系門檻。
				{#if $currentUser}
					<span class="user-badge">✓ 已登入雲端同步（{$currentUser.name}）</span>
				{:else}
					<span class="user-badge guest">未登入：暫存於瀏覽器 · <a href="{base}/login">登入同步</a></span>
				{/if}
			</p>
		</div>

		<!-- 科系快速篩選 (預設資訊管理系) -->
		<div class="dept-quick-selector">
			<span class="d-label">主修科系（本系基準）：</span>
			<select
				class="d-select"
				value={$myDept}
				onchange={(e) => myDept.set(e.currentTarget.value)}
			>
				{#each ALL_DEPTS as dept}
					<option value={dept}>{dept} {dept === '資訊管理系' ? '★ (預設本系)' : ''}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- 🧮 試算表統計儀表板 (KPI Cards) -->
	<div class="kpi-grid">
		<div class="kpi-card highlight-cert">
			<div class="kpi-label">🎓 證書資格達成總數</div>
			<div class="kpi-val">{qualifiedCount} <small>/ 共 9 大學程</small></div>
			<div class="kpi-sub-text">
				{#if qualifiedCount > 0}
					<span class="text-green-strong">✓ 已有 {qualifiedCount} 個學程符合申請資格！</span>
				{:else}
					<span>尚在修習中，勾選已修課程自動試算</span>
				{/if}
			</div>
		</div>

		<div class="kpi-card">
			<div class="kpi-label">當前檢視已修學分 (SUM)</div>
			<div class="kpi-val">{sheetStats().earnedCreditsSum} <small>/ 門檻 {sheetStats().targetTotal} 學分</small></div>
			<div class="kpi-prog-track">
				<div class="kpi-prog-bar" style="width: {sheetStats().progressPct}%;"></div>
			</div>
			<div class="kpi-sub-text">達成率：<strong>{sheetStats().progressPct}%</strong> ｜ 尚缺 {sheetStats().remaining} 學分</div>
		</div>

		<div class="kpi-card">
			<div class="kpi-label">必修 / 選修已修</div>
			<div class="kpi-val">{sheetStats().requiredCreditsSum} <small class="text-slate">必</small> ｜ {sheetStats().electiveCreditsSum} <small class="text-slate">選</small></div>
			<div class="kpi-sub-text">
				{#if sheetStats().targetReq > 0}
					必修門檻至少 {sheetStats().targetReq} 學分
				{:else}
					依各學程簡章規定
				{/if}
			</div>
		</div>

		<div class="kpi-card">
			<div class="kpi-label">本系 / 跨系（外系）修課比重</div>
			<div class="kpi-val">{sheetStats().myDeptCreditsSum} <small class="text-slate">本系 ({$myDept})</small> ｜ {sheetStats().crossDeptCreditsSum} <small class="text-orange">外系/跨系</small></div>
			<div class="kpi-sub-text">
				基準：<strong>{$myDept}</strong>（其他系所自動判定為外系）
			</div>
		</div>
	</div>

	<!-- 📖 併入之學程簡章與設置要點面板 (當切換到特定學程時即時顯示) -->
	{#if activeSheet !== 'all' && activeSheet !== 'custom' && activeSheet !== 'certificate' && activeSheet !== 'brochures'}
		<div class="program-brochure-card">
			<div class="pbc-header" onclick={() => (showBrochureDetail = !showBrochureDetail)}>
				<div class="pbc-title-group">
					<span class="pbc-badge" class:micro={currentProgram.kind === '微學程'}>{currentProgram.kind}</span>
					<h3 class="pbc-name">{currentProgram.name} — 簡章要點與證書資格規範</h3>
					<span class="pbc-unit">規劃單位：{currentProgram.planningUnit} ｜ 參與教學：{currentProgram.participatingUnits.join('、')}</span>
				</div>
				<button class="pbc-toggle-btn">
					{showBrochureDetail ? '收合簡章 ▲' : '展開簡章 ▼'}
				</button>
			</div>

			{#if showBrochureDetail}
				<div class="pbc-body">
					<div class="pbc-grid-3">
						<div class="pbc-col">
							<div class="pbc-block-title">📌 設置宗旨</div>
							<p class="pbc-block-text">{currentProgram.purpose}</p>
						</div>
						<div class="pbc-col">
							<div class="pbc-block-title">🎯 修業門檻與證書條件</div>
							<ul class="pbc-req-list">
								<li>應修總學分：<strong>{currentProgram.requirement.total} 學分</strong></li>
								{#if currentProgram.requirement.required !== undefined}
									<li>必修門檻：至少 <strong>{currentProgram.requirement.required} 學分</strong></li>
								{/if}
								{#if currentProgram.requirement.elective !== undefined}
									<li>選修門檻：至少 <strong>{currentProgram.requirement.elective} 學分</strong></li>
								{/if}
								<li>跨系修習：<strong>{currentProgram.requirement.crossDept ? '需至少跨系修習一門' : '無跨系限制'}</strong></li>
							</ul>
							<p class="pbc-rule-desc">{currentProgram.requirement.detail}</p>
						</div>
						<div class="pbc-col">
							<div class="pbc-block-title">📜 證書申請與核發程序</div>
							<p class="pbc-block-text">
								修滿本學程規定之科目與學分後，檢具歷年成績單，經學程負責單位審查無誤，並經教務長與校長核定後，由教務處核發正式「<strong>{currentProgram.name}修業證明書</strong>」。
							</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- 📊 試算表主介面 (Excel / Google Sheets 式表格框架) -->
	<div class="spreadsheet-window">
		<!-- 1. 試算表工具列 (Toolbar) -->
		<div class="sheet-toolbar">
			<div class="tool-left-group">
				<div class="formula-box">
					<span class="cell-name-box">{selectedCell}</span>
					<span class="fx-icon">fx</span>
					<input type="text" class="formula-input" readonly value={formulaText} />
				</div>
			</div>

			<div class="tool-right-group">
				{#if activeSheet !== 'certificate' && activeSheet !== 'brochures'}
					<div class="sheet-search-wrap">
						<input
							type="text"
							placeholder="🔍 搜尋課程名稱 / 代碼 / 系所…"
							bind:value={searchQuery}
							class="sheet-search-input"
						/>
						{#if searchQuery}
							<button class="clear-search-btn" onclick={() => (searchQuery = '')}>✕</button>
						{/if}
					</div>

					<button class="sheet-btn primary" onclick={checkAllVisible} title="將目前所有顯示的課程全部勾選">
						✓ 全部勾選
					</button>
					<button class="sheet-btn" onclick={uncheckAllVisible} title="清除目前所有勾選">
						✕ 全部取消
					</button>
					{#if $myDept}
						<button class="sheet-btn accent" onclick={checkMyDeptOnly} title="快速勾選所有屬於 {$myDept} 的課程">
							⚡ 勾選本系課程
						</button>
					{/if}
				{/if}

				<!-- 統一單一 XLSX 匯出按鈕 -->
				<button class="sheet-btn export xlsx" onclick={exportToUnifiedXLSX} title="將全校 9 大學程、證書資格審查總表與當前勾選狀態打包匯出為單一 Microsoft Excel (.xlsx) 檔案">
					📗 匯出完整 Excel (.xlsx)
				</button>
				<a href="/downloads/NTUB_學分學程修業完整試算表.xlsx" download="NTUB_學分學程修業完整試算表.xlsx" class="sheet-btn template" title="下載官方預先建置之 12 大工作表統一 Excel 範本 (.xlsx)">
					📂 完整範本檔 (.xlsx)
				</a>
			</div>
		</div>

		<!-- 2. 試算表資料格 (Data Grid Table) -->
		{#if activeSheet === 'certificate'}
			<!-- 🎓 9 大學程證書取得資格審查總表 (Certificate Eligibility Dashboard) -->
			<div class="cert-dashboard-view">
				<div class="cdv-head-bar">
					<div>
						<h2>🎓 國立臺北商業大學 9 大學分學程 — 修業證書取得資格即時審查總表</h2>
						<p>基準科系：<strong>{$myDept}</strong> ｜ 系統依據您的已修課程，自動即時審查各學程總學分、核心必修、專業選修與跨系門檻。</p>
					</div>
				</div>

				<div class="cert-scorecard-table-wrap">
					<table class="sheet-table cert-summary-table">
						<thead>
							<tr class="col-headers-row">
								<th class="row-num-header">#</th>
								<th style="width: 220px;">學程名稱</th>
								<th style="width: 80px; text-align:center;">類別</th>
								<th style="width: 100px; text-align:right;">應修總門檻</th>
								<th style="width: 100px; text-align:right;">已修總學分</th>
								<th style="width: 90px; text-align:right;">必修進度</th>
								<th style="width: 90px; text-align:right;">選修進度</th>
								<th style="width: 120px; text-align:center;">跨系修課判定</th>
								<th style="width: 220px; text-align:center;">證書取得資格判定</th>
								<th style="width: 120px; text-align:center;">操作</th>
							</tr>
						</thead>
						<tbody>
							{#each certificateSummaries() as item, idx (item.id)}
								<tr class="sheet-row cert-row" class:is-pass={item.isEligible}>
									<td class="row-num-cell">{idx + 1}</td>
									<td class="cell font-bold">
										{item.name}
										<span class="cert-dept-tag">{item.planningUnit}</span>
									</td>
									<td class="cell cell-center">
										<span class="tab-badge" class:micro={item.kind === '微學程'}>{item.kind}</span>
									</td>
									<td class="cell cell-credits font-mono">{item.reqTotal} 學分</td>
									<td class="cell cell-credits font-mono" class:text-green={item.passTotal}>
										<strong>{item.earned}</strong> 學分
									</td>
									<td class="cell cell-credits font-mono">
										{item.earnedReq} / {item.reqMust || '無'}
									</td>
									<td class="cell cell-credits font-mono">
										{item.earnedEle} / {item.eleMust || '無'}
									</td>
									<td class="cell cell-center">
										{#if item.crossDeptReq}
											{#if item.passCross}
												<span class="cert-status-tag pass">✓ 已跨修 {item.crossDeptCount} 門</span>
											{:else}
												<span class="cert-status-tag fail">✕ 尚缺 1 門外系</span>
											{/if}
										{:else}
											<span class="cert-status-tag neutral">無跨系限制</span>
										{/if}
									</td>
									<td class="cell cell-center">
										{#if item.isEligible}
											<span class="cert-badge-result qualified">
												🟢 ✓ 符合資格（可領證書）
											</span>
										{:else}
											<span class="cert-badge-result pending">
												🔴 尚未達標 ({item.reason})
											</span>
										{/if}
									</td>
									<td class="cell cell-center">
										<button class="sheet-btn primary sm" onclick={() => { activeSheet = item.id; handleCellClick('A1', `=PROGRAM("${item.name}")`); }}>
											修課勾選 →
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{:else if activeSheet === 'brochures'}
			<!-- 📖 全校 9 大學程簡章總覽工作表 -->
			<div class="brochure-sheet-view">
				<div class="bsv-header">
					<h2>國立臺北商業大學 9 大學分學程暨微學程設置要點與簡章總覽</h2>
					<p>收錄本校各學分學程之設置宗旨、修業門檻、參與教學單位與修業證明核發辦法。</p>
				</div>

				<div class="bsv-grid">
					{#each programs as p}
						<div class="bsv-card">
							<div class="bsv-card-top">
								<span class="bsv-badge" class:micro={p.kind === '微學程'}>{p.kind}</span>
								<h3 class="bsv-title">{p.name}</h3>
								<div class="bsv-en">{p.nameEn}</div>
							</div>
							<div class="bsv-row">
								<span class="lbl">門檻學分</span>
								<span class="val">總計 <strong>{p.requirement.total} 學分</strong>{p.requirement.required ? ` (必修至少 ${p.requirement.required})` : ''}</span>
							</div>
							<div class="bsv-row">
								<span class="lbl">跨系要求</span>
								<span class="val">{p.requirement.crossDept ? '需至少跨修一門' : '無限制'}</span>
							</div>
							<div class="bsv-row">
								<span class="lbl">規劃單位</span>
								<span class="val">{p.planningUnit}</span>
							</div>
							<div class="bsv-purpose-box">
								<strong>宗旨：</strong>{p.purpose}
							</div>
							<button class="sheet-btn primary full" onclick={() => { activeSheet = p.id; handleCellClick('A1', `=PROGRAM("${p.name}")`); }}>
								進入「{p.name}」試算表 →
							</button>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="sheet-grid-wrapper">
				<table class="sheet-table">
					<thead>
						<tr class="col-headers-row">
							<th class="row-num-header">#</th>
							<th class="col-header col-a">A <span class="col-sub">狀態</span></th>
							<th class="col-header col-b">B <span class="col-sub">課程代碼</span></th>
							<th class="col-header col-c">C <span class="col-sub">課程名稱</span></th>
							<th class="col-header col-d">D <span class="col-sub">開課系所</span></th>
							<th class="col-header col-e">E <span class="col-sub">修別</span></th>
							<th class="col-header col-f">F <span class="col-sub">學分 (Credits)</span></th>
							<th class="col-header col-g">G <span class="col-sub">學期 / 年級</span></th>
							<th class="col-header col-h">H <span class="col-sub">備註 / 本外系判定</span></th>
						</tr>
					</thead>
					<tbody>
						{#if displayedRows().length === 0}
							<tr>
								<td colspan="9" class="empty-sheet-msg">
									無符合篩選條件的課程資料。
								</td>
							</tr>
						{:else}
							{#each displayedRows() as row, idx (row.id)}
								<tr
									class="sheet-row"
									class:is-checked={row.checked}
									class:is-mine={row.isMine}
									onclick={() => handleCellClick(`C${idx + 2}`, `=COURSE_INFO("${row.code}", "${row.name}", ${row.credits})`)}
								>
									<td class="row-num-cell">{idx + 1}</td>

									<td class="cell cell-check" onclick={(e) => { e.stopPropagation(); toggleRowChecked(row); }}>
										<input
											type="checkbox"
											checked={row.checked}
											onchange={() => toggleRowChecked(row)}
											class="sheet-checkbox"
											id="chk-{row.id}"
										/>
										<label for="chk-{row.id}" class="check-label">
											{row.checked ? '已修畢' : '未修'}
										</label>
									</td>

									<td class="cell cell-mono">{row.code}</td>

									<td class="cell cell-name">
										<strong>{row.name}</strong>
										{#if row.isMine}
											<span class="mine-tag">本系 ({$myDept})</span>
										{:else}
											<span class="ext-tag">外系</span>
										{/if}
									</td>

									<td class="cell">{row.unit}</td>

									<td class="cell cell-center">
										<span class="type-badge" class:req={row.type === '必修'} class:ele={row.type === '選修'}>
											{row.type}
										</span>
									</td>

									<td class="cell cell-credits font-mono">
										{row.credits}
									</td>

									<td class="cell cell-term">{row.term}</td>

									<td class="cell cell-notes">
										{row.notes}
										{#if row.isCustom}
											<button class="del-row-btn" onclick={(e) => { e.stopPropagation(); removeCustomCourse(row.id); }} title="刪除此自訂列">✕</button>
										{/if}
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
					<tfoot>
						<tr class="sheet-summary-row">
							<td class="row-num-cell">Σ</td>
							<td class="cell cell-center font-bold">已選 {sheetStats().checkedCount} 門</td>
							<td class="cell font-mono">=COUNTIF(A)</td>
							<td class="cell font-bold">學分試算公式彙總加總列</td>
							<td class="cell font-mono">本系: {$myDept}</td>
							<td class="cell cell-center font-mono">必:{sheetStats().requiredCreditsSum} / 選:{sheetStats().electiveCreditsSum}</td>
							<td class="cell cell-credits total font-mono font-bold">
								{sheetStats().earnedCreditsSum}
							</td>
							<td class="cell font-mono">/ 門檻 {sheetStats().targetTotal}</td>
							<td class="cell font-bold" class:pass={sheetStats().earnedCreditsSum >= sheetStats().targetTotal}>
								{#if sheetStats().earnedCreditsSum >= sheetStats().targetTotal}
									✓ 已符合修業門檻！
								{:else}
									尚缺 {sheetStats().remaining} 學分
								{/if}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		{/if}

		<!-- 3. 自訂修課列新增面板 (Custom Row Adder) -->
		{#if activeSheet === 'custom'}
			<div class="custom-course-panel">
				<div class="custom-panel-head">
					<h4>➕ 新增一列自訂修課紀錄 (可試算校內通識、外系專題等任意學分)</h4>
				</div>
				<div class="custom-panel-form">
					<input type="text" placeholder="課程名稱 (例: 雲端計算實務)" bind:value={newCourseName} class="custom-input" />
					<input type="text" placeholder="開課系所 (例: 資訊管理系)" bind:value={newCourseUnit} class="custom-input small" />
					<select bind:value={newCourseType} class="custom-select">
						<option value="必修">必修</option>
						<option value="選修">選修</option>
					</select>
					<input type="number" min="1" max="10" placeholder="學分" bind:value={newCourseCredits} class="custom-input credits" />
					<input type="text" placeholder="學期 (例: 大三上)" bind:value={newCourseTerm} class="custom-input small" />
					<button class="sheet-btn primary" onclick={addCustomCourse}>+ 加入試算表</button>
				</div>
			</div>
		{/if}

		<!-- 4. 試算表底部分頁標籤 (Sheet Tabs - 像 Google Sheets / Excel 底部分頁) -->
		<div class="sheet-tabs-bar">
			<div class="sheet-tabs-scroll">
				<button
					class="sheet-tab-item cert-tab"
					class:active={activeSheet === 'certificate'}
					onclick={() => { activeSheet = 'certificate'; handleCellClick('A1', '=CERTIFICATE_EVALUATION()'); }}
				>
					🎓 證書資格審查總表
					{#if qualifiedCount > 0}
						<span class="tab-badge qualified-badge">✓ {qualifiedCount} 可領</span>
					{/if}
				</button>

				<button
					class="sheet-tab-item"
					class:active={activeSheet === 'all'}
					onclick={() => { activeSheet = 'all'; handleCellClick('A1', '=FILTER(ALL_COURSES)'); }}
				>
					📋 全校課程總表
				</button>

				{#each programs as p}
					<button
						class="sheet-tab-item"
						class:active={activeSheet === p.id}
						onclick={() => { activeSheet = p.id; handleCellClick('A1', `=PROGRAM("${p.name}", 門檻=${p.requirement.total})`); }}
					>
						📑 {p.name}
						<span class="tab-badge" class:micro={p.kind === '微學程'}>{p.kind}</span>
					</button>
				{/each}

				<button
					class="sheet-tab-item brochure-tab"
					class:active={activeSheet === 'brochures'}
					onclick={() => { activeSheet = 'brochures'; handleCellClick('A1', '=BROCHURES_ALL()'); }}
				>
					📖 簡章設置要點
				</button>

				<button
					class="sheet-tab-item custom-tab"
					class:active={activeSheet === 'custom'}
					onclick={() => { activeSheet = 'custom'; handleCellClick('A1', '=CUSTOM_USER_TABLE()'); }}
				>
					✏️ 自訂修課表 ({customCourses.length})
				</button>
			</div>
		</div>
	</div>
</div>
</NtubLayout>

<style>
	.sheet-app-container {
		max-width: 1380px;
		margin: 0 auto;
		padding: 0 0.5rem;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
	}

	.sheet-hero-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
		padding-bottom: 1.2rem;
		border-bottom: 1.5px solid #e2e8f0;
	}

	.sheet-main-title {
		font-size: 1.6rem;
		font-weight: 700;
		color: #0f172a;
		margin: 0 0 0.4rem;
	}

	.sheet-sub-desc {
		font-size: 0.9rem;
		color: #64748b;
		margin: 0;
	}

	.user-badge {
		display: inline-block;
		font-size: 12px;
		background: #dcfce7;
		color: #166534;
		padding: 2px 8px;
		border-radius: 4px;
		font-weight: 600;
		margin-left: 6px;
	}

	.user-badge.guest {
		background: #f1f5f9;
		color: #475569;
	}

	.user-badge.guest a {
		color: #ff6b00;
		text-decoration: underline;
	}

	.dept-quick-selector {
		display: flex;
		align-items: center;
		gap: 8px;
		background: #f8fafc;
		border: 1.5px solid #cbd5e1;
		padding: 6px 12px;
		border-radius: 6px;
	}

	.dept-quick-selector .d-label {
		font-size: 13px;
		font-weight: 600;
		color: #334155;
	}

	.dept-quick-selector .d-select {
		padding: 5px 10px;
		border: 1px solid #cbd5e1;
		border-radius: 4px;
		font-size: 13px;
		background: #ffffff;
		color: #0f172a;
		outline: none;
		font-weight: 600;
	}

	/* 🧮 KPI Cards */
	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.kpi-card {
		background: #ffffff;
		border: 1.5px solid #e2e8f0;
		border-radius: 8px;
		padding: 1.1rem 1.3rem;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
	}

	.kpi-card.highlight-cert {
		border-color: #16a34a;
		background: #f0fdf4;
	}

	.kpi-label {
		font-size: 12px;
		font-weight: 600;
		color: #64748b;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 4px;
	}

	.kpi-val {
		font-size: 1.7rem;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 6px;
	}

	.kpi-val small {
		font-size: 0.85rem;
		font-weight: 500;
		color: #64748b;
	}

	.kpi-prog-track {
		width: 100%;
		height: 6px;
		background: #fed7aa;
		border-radius: 9999px;
		overflow: hidden;
		margin: 6px 0;
	}

	.kpi-prog-bar {
		height: 100%;
		background: #ff6b00;
		transition: width 0.3s ease;
	}

	.kpi-sub-text {
		font-size: 12.5px;
		color: #64748b;
	}

	.text-slate { color: #0f172a; font-weight: 600; }
	.text-orange { color: #ea580c; font-weight: 600; }
	.text-green-strong { color: #166534; font-weight: 700; }

	/* 📖 簡章摘要卡片 */
	.program-brochure-card {
		background: #ffffff;
		border: 1.5px solid #0f172a;
		border-radius: 6px;
		margin-bottom: 1.2rem;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.pbc-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.9rem 1.4rem;
		background: #f8fafc;
		border-bottom: 1px solid #e2e8f0;
		cursor: pointer;
	}

	.pbc-title-group {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	.pbc-badge {
		font-size: 11px;
		font-weight: 700;
		padding: 2px 7px;
		background: #0f172a;
		color: #ffffff;
		border-radius: 3px;
	}

	.pbc-badge.micro {
		background: #ff6b00;
	}

	.pbc-name {
		font-size: 15px;
		font-weight: 700;
		color: #0f172a;
		margin: 0;
	}

	.pbc-unit {
		font-size: 12.5px;
		color: #64748b;
	}

	.pbc-toggle-btn {
		font-size: 12px;
		font-weight: 600;
		color: #ff6b00;
		background: #fff7ed;
		border: 1px solid #fed7aa;
		padding: 4px 10px;
		border-radius: 4px;
		cursor: pointer;
	}

	.pbc-body {
		padding: 1.4rem;
	}

	.pbc-grid-3 {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 1.5rem;
	}

	.pbc-block-title {
		font-size: 13.5px;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 8px;
		padding-bottom: 4px;
		border-bottom: 1.5px solid #f1f5f9;
	}

	.pbc-block-text {
		font-size: 13px;
		color: #475569;
		line-height: 1.6;
		margin: 0;
	}

	.pbc-req-list {
		list-style: none;
		padding: 0;
		margin: 0 0 8px;
		font-size: 13px;
		color: #334155;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.pbc-rule-desc {
		font-size: 12px;
		color: #64748b;
		margin: 0;
		line-height: 1.5;
	}

	/* 📊 試算表視窗主體 */
	.spreadsheet-window {
		background: #ffffff;
		border: 1.5px solid #0f172a;
		border-radius: 6px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
		overflow: hidden;
	}

	/* 1. 工具列 */
	.sheet-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.6rem 1rem;
		background: #f8fafc;
		border-bottom: 1.5px solid #e2e8f0;
		flex-wrap: wrap;
	}

	.formula-box {
		display: flex;
		align-items: center;
		background: #ffffff;
		border: 1px solid #cbd5e1;
		border-radius: 4px;
		overflow: hidden;
		min-width: 320px;
	}

	.cell-name-box {
		background: #f1f5f9;
		padding: 5px 10px;
		font-size: 12px;
		font-weight: 700;
		color: #334155;
		border-right: 1px solid #cbd5e1;
		font-family: monospace;
	}

	.fx-icon {
		padding: 0 8px;
		font-size: 13px;
		font-weight: 700;
		color: #94a3b8;
		font-style: italic;
	}

	.formula-input {
		border: none;
		outline: none;
		font-family: monospace;
		font-size: 13px;
		color: #0f172a;
		width: 100%;
		padding: 5px 8px;
	}

	.tool-right-group {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
	}

	.sheet-search-wrap {
		position: relative;
	}

	.sheet-search-input {
		padding: 6px 26px 6px 10px;
		border: 1px solid #cbd5e1;
		border-radius: 4px;
		font-size: 13px;
		width: 180px;
		outline: none;
	}

	.clear-search-btn {
		position: absolute;
		right: 6px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		font-size: 12px;
		color: #94a3b8;
		cursor: pointer;
	}

	.sheet-btn {
		padding: 6px 12px;
		font-size: 12.5px;
		font-weight: 600;
		border-radius: 4px;
		border: 1px solid #cbd5e1;
		background: #ffffff;
		color: #334155;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.sheet-btn.sm {
		padding: 3px 8px;
		font-size: 11.5px;
	}

	.sheet-btn:hover {
		background: #f1f5f9;
		border-color: #94a3b8;
	}

	.sheet-btn.primary {
		background: #0f172a;
		color: #ffffff;
		border-color: #0f172a;
	}

	.sheet-btn.primary:hover {
		background: #1e293b;
	}

	.sheet-btn.accent {
		background: #ff6b00;
		color: #ffffff;
		border-color: #ff6b00;
	}

	.sheet-btn.accent:hover {
		background: #ea580c;
	}

	.sheet-btn.export.xlsx {
		background: #15803d;
		color: #ffffff;
		border-color: #15803d;
	}

	.sheet-btn.export.xlsx:hover {
		background: #166534;
	}

	.sheet-btn.template {
		background: #0f172a;
		color: #ffffff;
		border-color: #0f172a;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.sheet-btn.template:hover {
		background: #334155;
	}

	/* 2. 表格網格 */
	.sheet-grid-wrapper {
		max-height: 520px;
		overflow-y: auto;
		overflow-x: auto;
	}

	.sheet-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
		table-layout: fixed;
		min-width: 960px;
	}

	.sheet-table th,
	.sheet-table td {
		border: 1px solid #e2e8f0;
		padding: 7px 10px;
		text-align: left;
	}

	.row-num-header,
	.row-num-cell {
		width: 42px;
		text-align: center !important;
		background: #f8fafc;
		color: #94a3b8;
		font-size: 11px;
		font-family: monospace;
		user-select: none;
	}

	.col-headers-row th {
		background: #f1f5f9;
		color: #475569;
		font-weight: 700;
		font-size: 12px;
		padding: 8px 10px;
		position: sticky;
		top: 0;
		z-index: 10;
		border-bottom: 2px solid #cbd5e1;
	}

	.col-sub {
		font-size: 11px;
		font-weight: 500;
		color: #64748b;
		margin-left: 4px;
	}

	.col-a { width: 90px; }
	.col-b { width: 110px; }
	.col-c { width: 230px; }
	.col-d { width: 130px; }
	.col-e { width: 80px; }
	.col-f { width: 95px; }
	.col-g { width: 100px; }
	.col-h { width: 180px; }

	.sheet-row {
		transition: background 0.1s ease;
		cursor: pointer;
	}

	.sheet-row:hover {
		background: #f8fafc;
	}

	.sheet-row.is-checked {
		background: #f0fdf4;
	}

	.sheet-row.is-checked:hover {
		background: #dcfce7;
	}

	.sheet-row.is-mine .cell-name strong {
		color: #0f172a;
	}

	.cell-check {
		text-align: center !important;
		cursor: pointer;
	}

	.sheet-checkbox {
		cursor: pointer;
		accent-color: #16a34a;
		transform: scale(1.15);
		margin-right: 4px;
	}

	.check-label {
		font-size: 11.5px;
		font-weight: 600;
		cursor: pointer;
		user-select: none;
	}

	.cell-mono {
		font-family: monospace;
		font-size: 12px;
		color: #64748b;
	}

	.cell-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mine-tag {
		font-size: 10px;
		font-weight: 700;
		color: #166534;
		background: #dcfce7;
		padding: 1px 5px;
		border-radius: 3px;
		margin-left: 6px;
	}

	.ext-tag {
		font-size: 10px;
		font-weight: 600;
		color: #ea580c;
		background: #fff7ed;
		padding: 1px 5px;
		border-radius: 3px;
		margin-left: 6px;
	}

	.cell-center {
		text-align: center !important;
	}

	.type-badge {
		font-size: 11px;
		font-weight: 600;
		padding: 2px 6px;
		border-radius: 3px;
	}

	.type-badge.req {
		background: #fee2e2;
		color: #b91c1c;
	}

	.type-badge.ele {
		background: #eff6ff;
		color: #1d4ed8;
	}

	.cell-credits {
		text-align: right !important;
		font-size: 13.5px;
		font-weight: 600;
		padding-right: 18px !important;
	}

	.cell-notes {
		font-size: 12px;
		color: #64748b;
		position: relative;
	}

	.del-row-btn {
		position: absolute;
		right: 6px;
		top: 50%;
		transform: translateY(-50%);
		background: #fee2e2;
		color: #dc2626;
		border: 1px solid #fca5a5;
		border-radius: 3px;
		font-size: 11px;
		cursor: pointer;
		padding: 1px 5px;
	}

	/* 加總列 */
	.sheet-summary-row td {
		background: #f8fafc;
		border-top: 2px solid #0f172a;
		border-bottom: 2px solid #0f172a;
		padding: 10px;
	}

	.cell-credits.total {
		font-size: 1.1rem;
		color: #ff6b00;
	}

	.font-bold { font-weight: 700; }
	.font-mono { font-family: monospace; }
	.pass { color: #166534; }
	.text-green { color: #16a34a !important; }

	.empty-sheet-msg {
		text-align: center !important;
		padding: 3rem !important;
		color: #94a3b8;
		font-size: 14px;
	}

	/* 🎓 證書審查總表視圖樣式 */
	.cert-dashboard-view {
		padding: 1.2rem;
		background: #ffffff;
	}

	.cdv-head-bar {
		margin-bottom: 1.2rem;
		padding-bottom: 0.8rem;
		border-bottom: 1.5px solid #e2e8f0;
	}

	.cdv-head-bar h2 {
		font-size: 1.3rem;
		font-weight: 700;
		color: #0f172a;
		margin: 0 0 4px;
	}

	.cdv-head-bar p {
		font-size: 13px;
		color: #64748b;
		margin: 0;
	}

	.cert-dept-tag {
		display: block;
		font-size: 11px;
		font-weight: 400;
		color: #64748b;
		margin-top: 2px;
	}

	.cert-row.is-pass {
		background: #f0fdf4;
	}

	.cert-status-tag {
		font-size: 11px;
		font-weight: 600;
		padding: 2px 6px;
		border-radius: 4px;
	}

	.cert-status-tag.pass {
		background: #dcfce7;
		color: #166534;
	}

	.cert-status-tag.fail {
		background: #fee2e2;
		color: #991b1b;
	}

	.cert-status-tag.neutral {
		background: #f1f5f9;
		color: #475569;
	}

	.cert-badge-result {
		font-size: 12px;
		font-weight: 700;
		padding: 4px 8px;
		border-radius: 4px;
		display: inline-block;
	}

	.cert-badge-result.qualified {
		background: #16a34a;
		color: #ffffff;
		box-shadow: 0 2px 6px rgba(22, 163, 74, 0.3);
	}

	.cert-badge-result.pending {
		background: #fff7ed;
		border: 1px solid #fed7aa;
		color: #c2410c;
	}

	/* 📖 簡章工作表視圖 */
	.brochure-sheet-view {
		padding: 1.5rem;
		background: #f8fafc;
		max-height: 520px;
		overflow-y: auto;
	}

	.bsv-header {
		margin-bottom: 1.5rem;
	}

	.bsv-header h2 {
		font-size: 1.3rem;
		color: #0f172a;
		margin: 0 0 4px;
	}

	.bsv-header p {
		font-size: 13px;
		color: #64748b;
		margin: 0;
	}

	.bsv-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 1.2rem;
	}

	.bsv-card {
		background: #ffffff;
		border: 1.5px solid #cbd5e1;
		border-radius: 8px;
		padding: 1.2rem;
		display: flex;
		flex-direction: column;
		gap: 8px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
	}

	.bsv-badge {
		font-size: 11px;
		font-weight: 700;
		background: #0f172a;
		color: #ffffff;
		padding: 2px 6px;
		border-radius: 3px;
	}

	.bsv-badge.micro {
		background: #ff6b00;
	}

	.bsv-title {
		font-size: 15px;
		font-weight: 700;
		color: #0f172a;
		margin: 4px 0 2px;
	}

	.bsv-en {
		font-size: 11.5px;
		color: #94a3b8;
		margin-bottom: 4px;
	}

	.bsv-row {
		display: flex;
		justify-content: space-between;
		font-size: 12.5px;
		border-bottom: 1px solid #f1f5f9;
		padding-bottom: 4px;
	}

	.bsv-row .lbl { color: #64748b; }
	.bsv-row .val { color: #0f172a; font-weight: 600; }

	.bsv-purpose-box {
		font-size: 12px;
		color: #475569;
		background: #f8fafc;
		padding: 8px;
		border-radius: 4px;
		line-height: 1.5;
		margin-top: 4px;
	}

	.sheet-btn.full {
		width: 100%;
		text-align: center;
		margin-top: auto;
	}

	/* 3. 自訂修課列面板 */
	.custom-course-panel {
		background: #f8fafc;
		border-top: 1.5px solid #e2e8f0;
		padding: 1rem 1.2rem;
	}

	.custom-panel-head h4 {
		margin: 0 0 0.6rem;
		font-size: 13.5px;
		color: #0f172a;
	}

	.custom-panel-form {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.custom-input {
		flex: 1;
		min-width: 180px;
		padding: 6px 10px;
		border: 1px solid #cbd5e1;
		border-radius: 4px;
		font-size: 13px;
	}

	.custom-input.small { max-width: 140px; }
	.custom-input.credits { max-width: 80px; }
	.custom-select {
		padding: 6px 10px;
		border: 1px solid #cbd5e1;
		border-radius: 4px;
		font-size: 13px;
		background: #ffffff;
	}

	/* 4. 試算表底部分頁 Tab */
	.sheet-tabs-bar {
		background: #f1f5f9;
		border-top: 1.5px solid #cbd5e1;
		padding: 4px 8px 0;
	}

	.sheet-tabs-scroll {
		display: flex;
		gap: 4px;
		overflow-x: auto;
		white-space: nowrap;
	}

	.sheet-tab-item {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 7px 14px;
		background: #e2e8f0;
		border: 1px solid #cbd5e1;
		border-bottom: none;
		border-radius: 6px 6px 0 0;
		font-size: 12.5px;
		font-weight: 600;
		color: #475569;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.sheet-tab-item:hover {
		background: #ffffff;
		color: #0f172a;
	}

	.sheet-tab-item.active {
		background: #ffffff;
		color: #0f172a;
		border-color: #0f172a;
		border-bottom: 2px solid #ffffff;
		margin-bottom: -1px;
		box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.04);
	}

	.sheet-tab-item.cert-tab {
		color: #15803d;
		font-weight: 700;
	}

	.sheet-tab-item.brochure-tab {
		color: #0284c7;
	}

	.sheet-tab-item.custom-tab {
		color: #ea580c;
	}

	.tab-badge {
		font-size: 10px;
		background: #f1f5f9;
		border: 1px solid #cbd5e1;
		padding: 1px 4px;
		border-radius: 3px;
	}

	.tab-badge.micro {
		background: #fff7ed;
		border-color: #fed7aa;
		color: #c2410c;
	}

	.tab-badge.qualified-badge {
		background: #16a34a;
		color: #ffffff;
		font-weight: 700;
	}

	@media (max-width: 768px) {
		.sheet-main-title { font-size: 1.3rem; }
		.formula-box { min-width: 100%; }
		.sheet-search-input { width: 100%; }
		.pbc-grid-3 { grid-template-columns: 1fr; }
	}
</style>
