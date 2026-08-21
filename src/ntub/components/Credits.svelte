<script lang="ts">
	import { programs } from '$ntub/data';
	import { checkedCourses, toggleCourse, earnedCredits, breakdown, myDept, ALL_DEPTS } from '$ntub/stores/credits';
		import type { Program, Course } from '$ntub/types';
	import NtubLayout from '../NtubLayout.svelte';

	const base = '/ntub';

	let searchQuery = $state('');
	let selectedFilterProgram = $state('ALL'); // 快速篩選特定學程
	let selectedCell = $state('A1');
	let formulaText = $state('=CERTIFICATE_EVALUATION_ALL()');
	let showBrochureSection = $state(false);

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

	// 🎓 9 大學程「修業證書取得資格」即時自動多維度審查
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

			const passCross = !p.requirement.crossDept || crossDeptCount >= 1;
			const passReq = bd.required >= reqMust;
			const passEle = bd.elective >= eleMust;
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
				reason,
				purpose: p.purpose,
				detail: p.requirement.detail
			};
		});
	});

	// 已取得資格之學程總數
	const qualifiedCount = $derived(
		certificateSummaries().filter((c) => c.isEligible).length
	);

	// 全校所有學程課程合併扁平化清單 (去重複)
	const allCoursesFlat = $derived(() => {
		const map = new Map<string, { course: Course; programs: string[]; programIds: string[] }>();
		for (const p of programs) {
			for (const c of p.courses) {
				const existing = map.get(c.id);
				if (existing) {
					if (!existing.programs.includes(p.name)) {
						existing.programs.push(p.name);
						existing.programIds.push(p.id);
					}
				} else {
					map.set(c.id, { course: c, programs: [p.name], programIds: [p.id] });
				}
			}
		}
		return Array.from(map.values());
	});

	// 當前大一統表格顯示之課程列
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
			programNames: string;
			programIds: string[];
			checked: boolean;
			isMine: boolean;
			isCustom?: boolean;
		}> = [];

		// 1. 全校學程課程
		allCoursesFlat().forEach(({ course: c, programs: pList, programIds }) => {
			rows.push({
				id: c.id,
				code: c.id.toUpperCase(),
				name: c.name,
				unit: c.unit,
				type: c.type === 'required' ? '必修' : '選修',
				credits: c.credits,
				term: c.term ?? '全學年',
				notes: c.category ? (c.category === 'core' ? '核心必修' : '專業選修') : '',
				programNames: pList.join('、'),
				programIds,
				checked: $checkedCourses.has(c.id),
				isMine: $myDept ? c.unit.includes($myDept) : false
			});
		});

		// 2. 自訂修課列
		customCourses.forEach((c) => {
			rows.push({
				id: c.id,
				code: c.code,
				name: c.name,
				unit: c.unit,
				type: c.type,
				credits: c.credits,
				term: c.term,
				notes: '自訂修課',
				programNames: '個人自訂學分',
				programIds: ['custom'],
				checked: c.checked,
				isMine: $myDept ? c.unit.includes($myDept) : true,
				isCustom: true
			});
		});

		// 依學程下拉篩選
		if (selectedFilterProgram !== 'ALL') {
			if (selectedFilterProgram === 'custom') {
				rows = rows.filter((r) => r.isCustom);
			} else {
				rows = rows.filter((r) => r.programIds.includes(selectedFilterProgram));
			}
		}

		// 關鍵字搜尋
		if (searchQuery.trim()) {
			const q = searchQuery.trim().toLowerCase();
			rows = rows.filter(
				(r) =>
					r.name.toLowerCase().includes(q) ||
					r.code.toLowerCase().includes(q) ||
					r.unit.toLowerCase().includes(q) ||
					r.type.includes(q) ||
					r.programNames.toLowerCase().includes(q)
			);
		}

		return rows;
	});

	// 即時試算表全域統計
	const globalStats = $derived(() => {
		const rows = displayedRows();
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

		const gradTarget = 128; // 大學部畢業標準
		const gradPct = Math.min(100, Math.round((earnedCreditsSum / gradTarget) * 100));

		return {
			earnedCreditsSum,
			requiredCreditsSum,
			electiveCreditsSum,
			myDeptCreditsSum,
			crossDeptCreditsSum,
			gradTarget,
			gradPct,
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

	// 📗 匯出完全支援 Google Sheets / Excel 之「13 大多工作表分頁」+「核取方塊」.xlsx 檔案
	async function exportMasterXLSX() {
		try {
			const XLSX = await import('xlsx');
			const wb = XLSX.utils.book_new();

			// 輔助函式：產生標準 Boolean 核取方塊儲存格
			function boolCell(val: boolean) {
				return { t: 'b', v: Boolean(val) };
			}

			// ==========================================
			// 1. Sheet 1: 🎓證書資格審查總表 (含連動公式)
			// ==========================================
			const certRows: any[][] = [
				['國立臺北商業大學 NTUB 學分學程暨微學程 — 修業證書資格審查總表 (Google Sheets 專用)'],
				[`基準科系：${$myDept}（開課單位非資管系者自動判定為跨系/外系） ｜ 勾選各分頁核取方塊自動即時連動加總`],
				[],
				[
					'項次',
					'學程名稱',
					'學程類別',
					'應修總門檻',
					'已修總學分',
					'核心必修門檻',
					'必修已修',
					'專業選修門檻',
					'選修已修',
					'跨系要求',
					'跨系已修門數',
					'證書取得資格判定 (公式即時連動)',
					'所屬工作表分頁'
				]
			];

			programs.forEach((p, idx) => {
				const sheetName = p.name.replace(/學分學程|微學程/g, '').slice(0, 25);
				const rowNum = idx + 5;
				const courseCount = p.courses.length;
				const summaryStartRow = courseCount + 6;

				certRows.push([
					idx + 1,
					p.name,
					p.kind,
					p.requirement.total,
					{ f: `'${sheetName}'!F${summaryStartRow}` },
					p.requirement.required || 0,
					{ f: `'${sheetName}'!F${summaryStartRow + 1}` },
					p.requirement.elective || 0,
					{ f: `'${sheetName}'!F${summaryStartRow + 2}` },
					p.requirement.crossDept ? '需跨修至少1門外系' : '無跨系限制',
					{ f: `'${sheetName}'!F${summaryStartRow + 4}` },
					{ f: `IF(AND(E${rowNum}>=D${rowNum}, G${rowNum}>=F${rowNum}, IF(J${rowNum}="需跨修至少1門外系", K${rowNum}>=1, TRUE)), "符合資格 (可申請證書)", "尚未達標 (學分不足或缺跨系)")` },
					sheetName
				]);
			});



			const wsCert = XLSX.utils.aoa_to_sheet(certRows);
			wsCert['!cols'] = [{ wch: 6 }, { wch: 28 }, { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 14 }, { wch: 34 }, { wch: 18 }];
			XLSX.utils.book_append_sheet(wb, wsCert, '證書資格審查總表');

			// ==========================================
			// 2. Sheet 2: 📋全校課程總表 (含當前即時勾選狀態)
			// ==========================================
			const allData: any[][] = [
				['國立臺北商業大學 NTUB 學分學程與各系課程總表'],
				['A 欄為核取方塊 (TRUE 已修 / FALSE 未修) ｜ 開課單位非資管系者自動為跨系/外系'],
				[],
				['修業狀態 (核取方塊)', '課程代碼', '課程名稱', '開課系所', '修別', '學分數', '開課學期', '本系/外系判定', '所屬學分學程']
			];

			const allStartRow = 5;
			allCoursesFlat().forEach(({ course: c, programs: pList }) => {
				const isChecked = $checkedCourses.has(c.id);
				const isMine = c.unit.includes($myDept);
				allData.push([
					boolCell(isChecked),
					c.id.toUpperCase(),
					c.name,
					c.unit,
					c.type === 'required' ? '必修' : '選修',
					c.credits,
					c.term || '全學年',
					isMine ? `本系 (${$myDept})` : '外系/跨系',
					pList.join('、')
				]);
			});
			const allEndRow = allStartRow + allCoursesFlat().length - 1;

			allData.push([]);
			allData.push(['--- 試算表全域加總統計列 ---']);
			allData.push(['已修總學分合計', '', '', '', '', { f: `SUMIF(A${allStartRow}:A${allEndRow}, TRUE, F${allStartRow}:F${allEndRow})` }, '', '大學部畢業門檻: 128 學分']);
			allData.push(['核心必修已修', '', '', '', '', { f: `SUMIFS(F${allStartRow}:F${allEndRow}, A${allStartRow}:A${allEndRow}, TRUE, E${allStartRow}:E${allEndRow}, "必修")` }]);
			allData.push(['專業選修已修', '', '', '', '', { f: `SUMIFS(F${allStartRow}:F${allEndRow}, A${allStartRow}:A${allEndRow}, TRUE, E${allStartRow}:E${allEndRow}, "選修")` }]);
			allData.push(['本系 (資管) 學分', '', '', '', '', { f: `SUMIFS(F${allStartRow}:F${allEndRow}, A${allStartRow}:A${allEndRow}, TRUE, H${allStartRow}:H${allEndRow}, "本系 (${$myDept})")` }]);
			allData.push(['外系 (跨系) 學分', '', '', '', '', { f: `SUMIFS(F${allStartRow}:F${allEndRow}, A${allStartRow}:A${allEndRow}, TRUE, H${allStartRow}:H${allEndRow}, "外系/跨系")` }]);

			const wsAll = XLSX.utils.aoa_to_sheet(allData);
			wsAll['!cols'] = [{ wch: 18 }, { wch: 14 }, { wch: 32 }, { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 16 }, { wch: 35 }];
			XLSX.utils.book_append_sheet(wb, wsAll, '全校課程總表');

			// ==========================================
			// 3. Sheet 3 ~ 11: 9 大學程各獨立工作表分頁
			// ==========================================
			for (const p of programs) {
				const pData: any[][] = [
					[`國立臺北商業大學 — ${p.name} (${p.kind}) 修業學分試算表`],
					[`設置要點與門檻：總學分至少 ${p.requirement.total} 學分${p.requirement.required ? `，必修至少 ${p.requirement.required} 學分` : ''}${p.requirement.elective ? `，選修至少 ${p.requirement.elective} 學分` : ''}${p.requirement.crossDept ? '，需至少跨修一門外系' : ''}`],
					[`規劃設置單位：${p.planningUnit} ｜ 參與教學：${p.participatingUnits.join('、')}`],
					[],
					['修業狀態 (核取方塊)', '課程代碼', '課程名稱', '開課系所', '修別', '學分數', '開課學期', '本系/外系判定', '學程分類與備註']
				];

				const pStartRow = 6;
				p.courses.forEach((c) => {
					const isChecked = $checkedCourses.has(c.id);
					const isMine = c.unit.includes($myDept);
					pData.push([
						boolCell(isChecked),
						c.id.toUpperCase(),
						c.name,
						c.unit,
						c.type === 'required' ? '必修' : '選修',
						c.credits,
						c.term || '依學期開設',
						isMine ? `本系 (${$myDept})` : '外系/跨系',
						c.category === 'core' ? '核心必修' : (c.category === 'advanced' ? '進階專業' : '專業選修')
					]);
				});
				const pEndRow = pStartRow + p.courses.length - 1;

				pData.push([]);
				pData.push(['--- 學程試算統計加總列 ---']);
				pData.push(['已修畢總學分', '', '', '', '', { f: `SUMIF(A${pStartRow}:A${pEndRow}, TRUE, F${pStartRow}:F${pEndRow})` }, '', `門檻標準: ${p.requirement.total} 學分`]);
				pData.push(['核心必修學分', '', '', '', '', { f: `SUMIFS(F${pStartRow}:F${pEndRow}, A${pStartRow}:A${pEndRow}, TRUE, E${pStartRow}:E${pEndRow}, "必修")` }, '', `必修門檻: ${p.requirement.required || 0} 學分`]);
				pData.push(['專業選修學分', '', '', '', '', { f: `SUMIFS(F${pStartRow}:F${pEndRow}, A${pStartRow}:A${pEndRow}, TRUE, E${pStartRow}:E${pEndRow}, "選修")` }, '', `選修門檻: ${p.requirement.elective || 0} 學分`]);
				pData.push(['本系修課學分', '', '', '', '', { f: `SUMIFS(F${pStartRow}:F${pEndRow}, A${pStartRow}:A${pEndRow}, TRUE, H${pStartRow}:H${pEndRow}, "本系 (${$myDept})")` }]);
				pData.push(['跨系修課門數', '', '', '', '', { f: `COUNTIFS(A${pStartRow}:A${pEndRow}, TRUE, H${pStartRow}:H${pEndRow}, "外系/跨系")` }, '', `跨系限制: ${p.requirement.crossDept ? '至少1門' : '無限制'}`]);
				pData.push(['證書取得資格', '', '', '', '', { f: `IF(AND(F${pEndRow + 3}>=${p.requirement.total}, F${pEndRow + 4}>=${p.requirement.required || 0}, IF("${p.requirement.crossDept}"="true", F${pEndRow + 7}>=1, TRUE)), "符合資格 (可申請證書)", "尚未達標 (學分不足或缺跨系)")` }]);

				const wsProg = XLSX.utils.aoa_to_sheet(pData);
				wsProg['!cols'] = [{ wch: 18 }, { wch: 14 }, { wch: 32 }, { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 16 }, { wch: 25 }];
				const sheetTitle = p.name.replace(/學分學程|微學程/g, '').slice(0, 25);
				XLSX.utils.book_append_sheet(wb, wsProg, sheetTitle);
			}

			// ==========================================
			// 4. Sheet 12: 📖簡章設置要點
			// ==========================================
			const brochureRows: any[][] = [
				['國立臺北商業大學 9 大學分學程與微學程簡章設置要點暨修業證明申請流程指引'],
				['資料來源：北商大官方簡章與教務處計畫書公告'],
				[],
				['學程名稱', '學程類別', '規劃設置單位', '參與教學單位', '應修總門檻', '必修門檻', '選修門檻', '跨系修課要求', '設置宗旨與核心目標', '修業證書申請辦法']
			];

			programs.forEach((p) => {
				brochureRows.push([
					p.name,
					p.kind,
					p.planningUnit,
					p.participatingUnits.join('、'),
					`${p.requirement.total} 學分`,
					p.requirement.required ? `${p.requirement.required} 學分` : '依規定',
					p.requirement.elective ? `${p.requirement.elective} 學分` : '依規定',
					p.requirement.crossDept ? '需至少跨修一門外系' : '無跨系限制',
					p.purpose,
					'修滿規定學分後，檢具歷年成績表經主辦單位審查無誤，並經教務長與校長核定後，由教務處發給修業證明書。'
				]);
			});

			const wsBrochure = XLSX.utils.aoa_to_sheet(brochureRows);
			wsBrochure['!cols'] = [{ wch: 25 }, { wch: 10 }, { wch: 16 }, { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 18 }, { wch: 45 }, { wch: 45 }];
			XLSX.utils.book_append_sheet(wb, wsBrochure, '簡章設置要點');

			// ==========================================
			// 5. Sheet 13: ✏️自訂學分表
			// ==========================================
			const customData: any[][] = [
				['個人自訂修課與畢業學分試算表 (可自由新增通識與選修)'],
				['A 欄為核取方塊 (TRUE 已修 / FALSE 未修)'],
				[],
				['修業狀態 (核取方塊)', '課程代碼', '課程名稱', '開課單位/系所', '修別', '學分數', '學期', '備註']
			];

			customCourses.forEach((c) => {
				customData.push([
					boolCell(c.checked),
					c.code,
					c.name,
					c.unit,
					c.type,
					c.credits,
					c.term,
					'自訂修課'
				]);
			});

			const customStart = 5;
			const customEnd = customStart + customCourses.length - 1;
			customData.push([]);
			customData.push(['--- 畢業學分試算統計 ---']);
			customData.push(['已修總學分小計', '', '', '', '', { f: `SUMIF(A${customStart}:A${customEnd}, TRUE, F${customStart}:F${customEnd})` }, '', '畢業門檻: 128 學分']);

			const wsCustom = XLSX.utils.aoa_to_sheet(customData);
			wsCustom['!cols'] = [{ wch: 18 }, { wch: 14 }, { wch: 30 }, { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 20 }];
			XLSX.utils.book_append_sheet(wb, wsCustom, '自訂學分表');

			// 寫入並下載多工作表 .xlsx
			XLSX.writeFile(wb, `NTUB_學分修業與證書資格試算表_${new Date().toISOString().slice(0, 10)}.xlsx`);
		} catch (err) {
			console.error('XLSX multi-sheet export failed', err);
		}
	}
</script>

<NtubLayout>
<div class="sheet-app-container">
	<!-- 頁首說明與科系設定 -->
	<div class="sheet-hero-row">
		<div>
			<h1 class="sheet-main-title">📊 NTUB 學分修業與證書資格大一統試算表</h1>
			<p class="sheet-sub-desc">
				全站所有學程證書判定、簡章規範、全校課程明細與自訂修課<strong>全部整合在同一個試算表中呈現</strong>，修課勾選狀態自動安全暫存於您的瀏覽器中，支援一鍵下載 Excel 試算表隨處離線使用。
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

	<!-- 🧮 試算表全域統計儀表板 (KPI Cards) -->
	<div class="kpi-grid">
		<div class="kpi-card highlight-cert">
			<div class="kpi-label">🎓 證書資格達成總數</div>
			<div class="kpi-val">{qualifiedCount} <small>/ 9 大學程</small></div>
			<div class="kpi-sub-text">
				{#if qualifiedCount > 0}
					<span class="text-green-strong">✓ 已有 {qualifiedCount} 個學程符合申請證書資格！</span>
				{:else}
					<span>修課即時判定，勾選下方課程即可連動</span>
				{/if}
			</div>
		</div>

		<div class="kpi-card">
			<div class="kpi-label">累積已修總學分 (SUM)</div>
			<div class="kpi-val">{globalStats().earnedCreditsSum} <small>/ 畢業 128 學分</small></div>
			<div class="kpi-prog-track">
				<div class="kpi-prog-bar" style="width: {globalStats().gradPct}%;"></div>
			</div>
			<div class="kpi-sub-text">畢業學分進度：<strong>{globalStats().gradPct}%</strong> ｜ 已修 {globalStats().checkedCount} 門課</div>
		</div>

		<div class="kpi-card">
			<div class="kpi-label">必修 / 選修已修</div>
			<div class="kpi-val">{globalStats().requiredCreditsSum} <small class="text-slate">必修</small> ｜ {globalStats().electiveCreditsSum} <small class="text-slate">選修</small></div>
			<div class="kpi-sub-text">核心必修與專業選修學分累積</div>
		</div>

		<div class="kpi-card">
			<div class="kpi-label">本系 / 跨系（外系）修課比重</div>
			<div class="kpi-val">{globalStats().myDeptCreditsSum} <small class="text-slate">本系 ({$myDept})</small> ｜ {globalStats().crossDeptCreditsSum} <small class="text-orange">外系/跨系</small></div>
			<div class="kpi-sub-text">
				基準：<strong>{$myDept}</strong>（其他系自動判定為外系）
			</div>
		</div>
	</div>

	<!-- 📊 大一統試算表視窗主體 (One Unified Master Spreadsheet) -->
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
				<!-- 學程快速篩選下拉 -->
				<select bind:value={selectedFilterProgram} class="filter-prog-select">
					<option value="ALL">📋 顯示全校所有學程課程</option>
					{#each programs as p}
						<option value={p.id}>📑 僅顯示：{p.name} ({p.kind})</option>
					{/each}
					<option value="custom">✏️ 僅顯示：個人自訂修課列</option>
				</select>

				<div class="sheet-search-wrap">
					<input
						type="text"
						placeholder="🔍 搜尋課程 / 系所 / 代碼…"
						bind:value={searchQuery}
						class="sheet-search-input"
					/>
					{#if searchQuery}
						<button class="clear-search-btn" onclick={() => (searchQuery = '')}>✕</button>
					{/if}
				</div>

				<button class="sheet-btn primary" onclick={checkAllVisible} title="將目前篩選顯示的課程全部勾選">
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

				<!-- 📗 一鍵下載單一大一統 XLSX 檔案 -->
				<button class="sheet-btn download-master" onclick={exportMasterXLSX} title="將全站所有證書審查總表、簡章、全校課程與加總公式全部打包匯出為單一 Microsoft Excel (.xlsx) 檔案">
					📥 下載大一統 Excel (.xlsx)
				</button>
				<a href="/downloads/NTUB_學分修業與證書資格試算表.xlsx" download="NTUB_學分修業與證書資格試算表.xlsx" class="sheet-btn template" title="直接下載已預先建置之大一統離線 Excel 檔案 (.xlsx)">
					📂 完整範本檔 (.xlsx)
				</a>
			</div>
		</div>

		<!-- 2. 區塊一：🎓 全校 9 大學程修業證書取得資格審查判定總表 (Scorecard) -->
		<div class="unified-section cert-section">
			<div class="section-banner">
				<div class="sec-title-wrap">
					<span class="sec-badge">PART 1</span>
					<h3 class="sec-title">🎓 全校 9 大學分學程 — 修業證書取得資格即時審查總表</h3>
				</div>
				<span class="sec-hint">※ 勾選下方課程明細，本表各學程總學分、必修、選修與跨系外系門檻即時聯動判定</span>
			</div>

			<div class="sheet-grid-wrapper no-max">
				<table class="sheet-table cert-summary-table">
					<thead>
						<tr class="col-headers-row">
							<th class="row-num-header">#</th>
							<th style="width: 210px;">學程名稱</th>
							<th style="width: 75px; text-align:center;">類別</th>
							<th style="width: 95px; text-align:right;">應修門檻</th>
							<th style="width: 95px; text-align:right;">已修學分</th>
							<th style="width: 90px; text-align:right;">必修進度</th>
							<th style="width: 90px; text-align:right;">選修進度</th>
							<th style="width: 120px; text-align:center;">跨系外系判定</th>
							<th style="width: 220px; text-align:center;">證書取得資格判定 (即時公式)</th>
							<th style="width: 100px; text-align:center;">快速篩選</th>
						</tr>
					</thead>
					<tbody>
						{#each certificateSummaries() as item, idx (item.id)}
							<tr class="sheet-row cert-row" class:is-pass={item.isEligible} onclick={() => handleCellClick(`K${idx + 7}`, `=IF(AND(E${idx+7}>=D${idx+7}, G${idx+7}>=F${idx+7}, K${idx+7}>=1), "符合資格", "未達標")`)}>
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
											🟢 ✓ 符合資格（可申請證書）
										</span>
									{:else}
										<span class="cert-badge-result pending">
											🔴 尚未達標 ({item.reason})
										</span>
									{/if}
								</td>
								<td class="cell cell-center">
									<button class="sheet-btn sm" onclick={(e) => { e.stopPropagation(); selectedFilterProgram = item.id; }}>
										篩選課程 ▾
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- 3. 區塊二：📖 各學程簡章設置要點與修業規範指引 (可自由展開/收合) -->
		<div class="unified-section brochure-toggle-section">
			<div class="section-banner pointer" onclick={() => (showBrochureSection = !showBrochureSection)}>
				<div class="sec-title-wrap">
					<span class="sec-badge orange">PART 2</span>
					<h3 class="sec-title">📖 全校 9 大學程簡章設置要點、修業規範與證書申請流程指引</h3>
				</div>
				<button class="pbc-toggle-btn">
					{showBrochureSection ? '收合簡章規範 ▲' : '展開簡章規範 ▼'}
				</button>
			</div>

			{#if showBrochureSection}
				<div class="brochure-accordion-body">
					<div class="bsv-grid">
						{#each certificateSummaries() as p}
							<div class="bsv-card">
								<div class="bsv-card-top">
									<span class="bsv-badge" class:micro={p.kind === '微學程'}>{p.kind}</span>
									<h4 class="bsv-title">{p.name}</h4>
									<div class="bsv-en">{p.nameEn}</div>
								</div>
								<div class="bsv-row">
									<span class="lbl">門檻規定</span>
									<span class="val">總計 <strong>{p.reqTotal} 學分</strong> (必修 {p.reqMust || '無'} / 選修 {p.eleMust || '無'})</span>
								</div>
								<div class="bsv-row">
									<span class="lbl">跨系要求</span>
									<span class="val">{p.crossDeptReq ? '需至少跨修一門外系課程' : '無跨系限制'}</span>
								</div>
								<div class="bsv-row">
									<span class="lbl">規劃單位</span>
									<span class="val">{p.planningUnit}</span>
								</div>
								<div class="bsv-purpose-box">
									<strong>設置宗旨：</strong>{p.purpose}
								</div>
								<div class="bsv-cert-flow">
									<strong>證書申請：</strong>修畢後檢具歷年成績表，經學程負責單位與教務長、校長核定後由教務處發給修業證明書。
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- 4. 區塊三：📋 全校完整課程明細修業試算表 (Core Interactive Grid) -->
		<div class="unified-section courses-section">
			<div class="section-banner">
				<div class="sec-title-wrap">
					<span class="sec-badge slate">PART 3</span>
					<h3 class="sec-title">
						📋 全校完整課程明細修業試算表
						<small class="text-sub">（共 {displayedRows().length} 門課程，可直接點擊勾選試算）</small>
					</h3>
				</div>
				{#if selectedFilterProgram !== 'ALL'}
					<button class="sheet-btn sm reset-filter" onclick={() => (selectedFilterProgram = 'ALL')}>
						✕ 重置篩選（顯示全部）
					</button>
				{/if}
			</div>

			<div class="sheet-grid-wrapper master-grid-wrap">
				<table class="sheet-table master-table">
					<thead>
						<tr class="col-headers-row">
							<th class="row-num-header">#</th>
							<th class="col-header col-a">A <span class="col-sub">修業狀態</span></th>
							<th class="col-header col-b">B <span class="col-sub">課程代碼</span></th>
							<th class="col-header col-c">C <span class="col-sub">課程名稱</span></th>
							<th class="col-header col-d">D <span class="col-sub">開課系所</span></th>
							<th class="col-header col-e">E <span class="col-sub">修別</span></th>
							<th class="col-header col-f">F <span class="col-sub">學分 (Credits)</span></th>
							<th class="col-header col-g">G <span class="col-sub">開課學期</span></th>
							<th class="col-header col-h">H <span class="col-sub">本系/外系判定</span></th>
							<th class="col-header col-i">I <span class="col-sub">所屬學程與備註</span></th>
						</tr>
					</thead>
					<tbody>
						{#if displayedRows().length === 0}
							<tr>
								<td colspan="10" class="empty-sheet-msg">
									無符合篩選條件的課程資料。
								</td>
							</tr>
						{:else}
							{#each displayedRows() as row, idx (row.id)}
								<tr
									class="sheet-row"
									class:is-checked={row.checked}
									class:is-mine={row.isMine}
									onclick={() => handleCellClick(`C${idx + 24}`, `=COURSE_RECORD("${row.code}", "${row.name}", ${row.credits})`)}
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

									<td class="cell cell-center">
										{#if row.isMine}
											<span class="mine-tag">本系 ({$myDept})</span>
										{:else}
											<span class="ext-tag">外系/跨系</span>
										{/if}
									</td>

									<td class="cell cell-notes">
										{row.programNames}
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
							<td class="cell cell-center font-bold">已選 {globalStats().checkedCount} 門</td>
							<td class="cell font-mono">=COUNTIF(A)</td>
							<td class="cell font-bold">試算表即時加總統計列</td>
							<td class="cell font-mono">本系: {$myDept}</td>
							<td class="cell cell-center font-mono">必:{globalStats().requiredCreditsSum} / 選:{globalStats().electiveCreditsSum}</td>
							<td class="cell cell-credits total font-mono font-bold">
								{globalStats().earnedCreditsSum}
							</td>
							<td class="cell font-mono">/ 畢業 128</td>
							<td class="cell font-mono">本:{globalStats().myDeptCreditsSum} 跨:{globalStats().crossDeptCreditsSum}</td>
							<td class="cell font-bold pass">
								畢業達成率：{globalStats().gradPct}% ｜ 共 {qualifiedCount} 個學程可領證書
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>

		<!-- 5. 區塊四：➕ 自訂修課新增列 (Custom Course Adder) -->
		<div class="custom-course-panel">
			<div class="custom-panel-head">
				<h4>➕ 新增個人自訂修課列 (可試算校內通識、外系專案等任意學分，直接併入上方試算表)</h4>
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
				<button class="sheet-btn primary" onclick={addCustomCourse}>+ 加入大一統試算表</button>
			</div>
		</div>
	</div>
</div>
</NtubLayout>

<style>
	.sheet-app-container {
		max-width: 1420px;
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

	.filter-prog-select {
		padding: 6px 10px;
		border: 1.5px solid #0f172a;
		border-radius: 4px;
		font-size: 12.5px;
		font-weight: 600;
		background: #ffffff;
		color: #0f172a;
		outline: none;
	}

	.sheet-search-wrap {
		position: relative;
	}

	.sheet-search-input {
		padding: 6px 26px 6px 10px;
		border: 1px solid #cbd5e1;
		border-radius: 4px;
		font-size: 13px;
		width: 170px;
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

	.sheet-btn.download-master {
		background: #15803d;
		color: #ffffff;
		border-color: #15803d;
		font-weight: 700;
	}

	.sheet-btn.download-master:hover {
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

	/* 大一統區塊樣式 */
	.unified-section {
		border-bottom: 1.5px solid #cbd5e1;
	}

	.section-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1.2rem;
		background: #f1f5f9;
		border-bottom: 1px solid #e2e8f0;
		flex-wrap: wrap;
		gap: 8px;
	}

	.section-banner.pointer {
		cursor: pointer;
	}

	.sec-title-wrap {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.sec-badge {
		font-size: 11px;
		font-weight: 800;
		padding: 2px 6px;
		background: #0f172a;
		color: #ffffff;
		border-radius: 3px;
		font-family: monospace;
	}

	.sec-badge.orange { background: #ea580c; }
	.sec-badge.slate { background: #334155; }

	.sec-title {
		font-size: 14.5px;
		font-weight: 700;
		color: #0f172a;
		margin: 0;
	}

	.sec-hint {
		font-size: 12px;
		color: #64748b;
	}

	.text-sub {
		font-size: 12px;
		font-weight: 400;
		color: #64748b;
	}

	.reset-filter {
		background: #fff7ed;
		color: #c2410c;
		border-color: #fed7aa;
	}

	/* 2. 表格網格 */
	.sheet-grid-wrapper {
		overflow-x: auto;
	}

	.sheet-grid-wrapper.master-grid-wrap {
		max-height: 560px;
		overflow-y: auto;
	}

	.sheet-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
		table-layout: fixed;
		min-width: 1080px;
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
		background: #f8fafc;
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

	.col-a { width: 95px; }
	.col-b { width: 110px; }
	.col-c { width: 220px; }
	.col-d { width: 130px; }
	.col-e { width: 80px; }
	.col-f { width: 95px; }
	.col-g { width: 100px; }
	.col-h { width: 120px; }
	.col-i { width: 230px; }

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
		padding: 2px 6px;
		border-radius: 3px;
	}

	.ext-tag {
		font-size: 10px;
		font-weight: 600;
		color: #ea580c;
		background: #fff7ed;
		padding: 2px 6px;
		border-radius: 3px;
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

	/* 🎓 證書總表專屬樣式 */
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

	/* 📖 簡章折疊區 */
	.brochure-accordion-body {
		padding: 1.2rem;
		background: #f8fafc;
		max-height: 480px;
		overflow-y: auto;
	}

	.bsv-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 1rem;
	}

	.bsv-card {
		background: #ffffff;
		border: 1.5px solid #cbd5e1;
		border-radius: 6px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.bsv-badge {
		font-size: 10.5px;
		font-weight: 700;
		background: #0f172a;
		color: #ffffff;
		padding: 2px 5px;
		border-radius: 3px;
	}

	.bsv-badge.micro { background: #ff6b00; }

	.bsv-title {
		font-size: 14.5px;
		font-weight: 700;
		color: #0f172a;
		margin: 4px 0 2px;
	}

	.bsv-en {
		font-size: 11px;
		color: #94a3b8;
		margin-bottom: 2px;
	}

	.bsv-row {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		border-bottom: 1px solid #f1f5f9;
		padding-bottom: 3px;
	}

	.bsv-row .lbl { color: #64748b; }
	.bsv-row .val { color: #0f172a; font-weight: 600; }

	.bsv-purpose-box,
	.bsv-cert-flow {
		font-size: 11.5px;
		color: #475569;
		background: #f8fafc;
		padding: 6px 8px;
		border-radius: 4px;
		line-height: 1.5;
	}

	.pbc-toggle-btn {
		font-size: 12px;
		font-weight: 600;
		color: #ff6b00;
		background: #ffffff;
		border: 1px solid #fed7aa;
		padding: 3px 8px;
		border-radius: 4px;
		cursor: pointer;
	}

	/* 4. 自訂修課列面板 */
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

	@media (max-width: 768px) {
		.sheet-main-title { font-size: 1.3rem; }
		.formula-box { min-width: 100%; }
		.sheet-search-input { width: 100%; }
		.filter-prog-select { width: 100%; }
	}
</style>
