<script lang="ts">
	import { programs } from '$ntub/data';
	import { checkedCourses, toggleCourse, earnedCredits, breakdown, myDept, ALL_DEPTS } from '$ntub/stores/credits';
	import { currentUser } from '$ntub/stores/auth';
	import type { Program, Course } from '$ntub/types';
	import NtubLayout from '../NtubLayout.svelte';

	const base = '/ntub';

	// 當前選中之工作表 Tab ('all' 或 program.id 或 'custom')
	let activeSheet = $state('all');
	let searchQuery = $state('');
	let selectedCell = $state('A1');
	let formulaText = $state('=SUM(F2:F50)');

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
		} else {
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

		let targetTotal = 128; // 預設大學部畢業學分標準
		let targetReq = 0;
		let targetEle = 0;
		let isProgramDone = false;

		if (activeSheet !== 'all' && activeSheet !== 'custom') {
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

	// 匯出當前工作表為 CSV 試算表檔
	function exportToCSV() {
		const headers = ['狀態', '課程代碼', '課程名稱', '開課系所', '修別', '學分數', '學期/年級', '備註與學程'];
		const rows = displayedRows().map((r) => [
			r.checked ? '已修畢' : '未修',
			r.code,
			`"${r.name.replace(/"/g, '""')}"`,
			`"${r.unit}"`,
			r.type,
			r.credits,
			r.term,
			`"${r.notes.replace(/"/g, '""')}"`
		]);

		const stats = sheetStats();
		rows.push([]);
		rows.push(['--- 試算表統計彙總 ---']);
		rows.push(['總修畢學分', '', '', '', '', stats.earnedCreditsSum, '', `達成率: ${stats.progressPct}%`]);
		rows.push(['必修已修', '', '', '', '', stats.requiredCreditsSum]);
		rows.push(['選修已修', '', '', '', '', stats.electiveCreditsSum]);
		rows.push(['本系學分', '', '', '', '', stats.myDeptCreditsSum]);
		rows.push(['跨系學分', '', '', '', '', stats.crossDeptCreditsSum]);

		const csvContent = '﻿' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', `NTUB_學分修業試算表_${activeSheet}_${new Date().toISOString().slice(0, 10)}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<NtubLayout>
<div class="sheet-app-container">
	<!-- 頁首說明與科系設定 -->
	<div class="sheet-hero-row">
		<div>
			<h1 class="sheet-main-title">📊 NTUB 學分修業即時試算表</h1>
			<p class="sheet-sub-desc">
				完整整合北商大各系所課程與 9 大學分學程，支援即時公式加總、自訂修課與 CSV 匯出試算。
				{#if $currentUser}
					<span class="user-badge">✓ 已登入雲端同步（{$currentUser.name}）</span>
				{:else}
					<span class="user-badge guest">未登入：暫存於瀏覽器 · <a href="{base}/login">登入同步</a></span>
				{/if}
			</p>
		</div>

		<!-- 科系快速篩選 -->
		<div class="dept-quick-selector">
			<span class="d-label">我的主修科系：</span>
			<select
				class="d-select"
				value={$myDept}
				onchange={(e) => myDept.set(e.currentTarget.value)}
			>
				<option value="">-- 請選擇科系 (自動判斷本系/跨系) --</option>
				{#each ALL_DEPTS as dept}
					<option value={dept}>{dept}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- 🧮 試算表統計儀表板 (KPI Cards) -->
	<div class="kpi-grid">
		<div class="kpi-card highlight">
			<div class="kpi-label">已修畢總學分 (SUM)</div>
			<div class="kpi-val">{sheetStats().earnedCreditsSum} <small>/ 門檻 {sheetStats().targetTotal} 學分</small></div>
			<div class="kpi-prog-track">
				<div class="kpi-prog-bar" style="width: {sheetStats().progressPct}%;"></div>
			</div>
			<div class="kpi-sub-text">修業達成率：<strong>{sheetStats().progressPct}%</strong></div>
		</div>

		<div class="kpi-card">
			<div class="kpi-label">核心必修學分 (REQUIRED)</div>
			<div class="kpi-val">{sheetStats().requiredCreditsSum} <small>學分</small></div>
			<div class="kpi-sub-text">
				{#if sheetStats().targetReq > 0}
					門檻至少 {sheetStats().targetReq} 學分
				{:else}
					依學程簡章規定
				{/if}
			</div>
		</div>

		<div class="kpi-card">
			<div class="kpi-label">專業選修學分 (ELECTIVE)</div>
			<div class="kpi-val">{sheetStats().electiveCreditsSum} <small>學分</small></div>
			<div class="kpi-sub-text">
				{#if sheetStats().targetEle > 0}
					門檻至少 {sheetStats().targetEle} 學分
				{:else}
					專業領域延伸
				{/if}
			</div>
		</div>

		<div class="kpi-card">
			<div class="kpi-label">本系 / 跨系修課比重</div>
			<div class="kpi-val">{sheetStats().myDeptCreditsSum} <small class="text-slate">本系</small> ｜ {sheetStats().crossDeptCreditsSum} <small class="text-orange">跨系</small></div>
			<div class="kpi-sub-text">
				{#if $myDept}
					主修：{$myDept}
				{:else}
					※ 尚未選擇所屬科系
				{/if}
			</div>
		</div>
	</div>

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
				<button class="sheet-btn export" onclick={exportToCSV} title="將此試算表匯出為標準 CSV / Excel 格式">
					📥 匯出 CSV 試算表
				</button>
			</div>
		</div>

		<!-- 2. 試算表資料格 (Data Grid Table) -->
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
						<th class="col-header col-h">H <span class="col-sub">備註 / 學程判定</span></th>
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
								<!-- 列號 -->
								<td class="row-num-cell">{idx + 1}</td>

								<!-- A 欄：核取方塊 -->
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

								<!-- B 欄：課程代碼 -->
								<td class="cell cell-mono">{row.code}</td>

								<!-- C 欄：課程名稱 -->
								<td class="cell cell-name">
									<strong>{row.name}</strong>
									{#if row.isMine}
										<span class="mine-tag">本系</span>
									{/if}
								</td>

								<!-- D 欄：開課單位 -->
								<td class="cell">{row.unit}</td>

								<!-- E 欄：必選修 -->
								<td class="cell cell-center">
									<span class="type-badge" class:req={row.type === '必修'} class:ele={row.type === '選修'}>
										{row.type}
									</span>
								</td>

								<!-- F 欄：學分數 -->
								<td class="cell cell-credits font-mono">
									{row.credits}
								</td>

								<!-- G 欄：學期年級 -->
								<td class="cell cell-term">{row.term}</td>

								<!-- H 欄：備註與學程所屬 -->
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
					<!-- 試算表加總統計列 (Formula Summary Row) -->
					<tr class="sheet-summary-row">
						<td class="row-num-cell">Σ</td>
						<td class="cell cell-center font-bold">已選 {sheetStats().checkedCount} 門</td>
						<td class="cell font-mono">=COUNTIF(A)</td>
						<td class="cell font-bold">學分試算公式彙總加總列</td>
						<td class="cell font-mono">{ $myDept ? $myDept : '全校' }</td>
						<td class="cell cell-center font-mono">必: {sheetStats().requiredCreditsSum} / 選: {sheetStats().electiveCreditsSum}</td>
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
					class="sheet-tab-item"
					class:active={activeSheet === 'all'}
					onclick={() => { activeSheet = 'all'; handleCellClick('A1', '=FILTER(ALL_COURSES)'); }}
				>
					📋 總表 (全校課程總覽)
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
					class="sheet-tab-item custom-tab"
					class:active={activeSheet === 'custom'}
					onclick={() => { activeSheet = 'custom'; handleCellClick('A1', '=CUSTOM_USER_TABLE()'); }}
				>
					✏️ 自訂修課試算表 ({customCourses.length})
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

	.kpi-card.highlight {
		border-color: #ff6b00;
		background: #fffaf5;
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

	.sheet-btn.export {
		background: #166534;
		color: #ffffff;
		border-color: #166534;
	}

	.sheet-btn.export:hover {
		background: #14532d;
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

	.empty-sheet-msg {
		text-align: center !important;
		padding: 3rem !important;
		color: #94a3b8;
		font-size: 14px;
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

	@media (max-width: 768px) {
		.sheet-main-title { font-size: 1.3rem; }
		.formula-box { min-width: 100%; }
		.sheet-search-input { width: 100%; }
	}
</style>
