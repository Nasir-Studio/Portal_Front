<script lang="ts">
	import { programs } from '$ntub/data';
	import type { Program, Course } from '$ntub/types';
	import NtubLayout from '../NtubLayout.svelte';

	let selectedId = $state(programs[0].id);
	const selected = $derived(programs.find((p) => p.id === selectedId) ?? programs[0]);

	function setSelected(id: string) {
		selectedId = id;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function unitBadge(course: Course) {
		const units = course.unit.split('/').map((u) => u.trim());
		return units;
	}
</script>

<NtubLayout>
<div class="page-head">
	<p class="page-kicker">Programs · 設置要點</p>
	<h2>學分學程簡章</h2>
	<p class="page-desc">收錄本校各學分學程及微學程之設置要點暨計畫書內容，依官方 PDF 公告整理。</p>
</div>

<div class="brochure-layout">
	<aside class="program-list">
		{#each programs as p (p.id)}
			<button
				class="program-card"
				class:active={p.id === selectedId}
				onclick={() => setSelected(p.id)}
			>
				<span class="kind-tag" class:micro={p.kind === '微學程'}>{p.kind}</span>
				<span class="program-name">{p.name}</span>
				<span class="program-unit">{p.planningUnit}</span>
			</button>
		{/each}
	</aside>

	<article class="program-detail">
		<header class="detail-head">
			<span class="kind-badge" class:micro={selected.kind === '微學程'}>{selected.kind}</span>
			<h3>{selected.name}</h3>
			<p class="detail-en">{selected.nameEn}</p>
			<div class="meta-line">
				<span>規劃設置：{selected.planningUnit}</span>
				<span>參與教學：{selected.participatingUnits.join('、')}</span>
				<span class="meta-updated">{selected.lastUpdated}</span>
			</div>
		</header>

		<section class="block">
			<h4><span class="block-num">一</span>設置宗旨</h4>
			<p class="purpose">{selected.purpose}</p>
		</section>

		<section class="block">
			<h4><span class="block-num">二</span>修業條件</h4>
			<div class="req-grid">
				<div class="req-item">
					<span class="req-label">應修總學分</span>
					<span class="req-value">{selected.requirement.total}<small> 學分</small></span>
				</div>
				{#if selected.requirement.required !== undefined}
					<div class="req-item">
						<span class="req-label">必修至少</span>
						<span class="req-value">{selected.requirement.required}<small> 學分</small></span>
					</div>
				{/if}
				{#if selected.requirement.elective !== undefined}
					<div class="req-item">
						<span class="req-label">選修至少</span>
						<span class="req-value">{selected.requirement.elective}<small> 學分</small></span>
					</div>
				{/if}
				<div class="req-item" class:done={selected.requirement.crossDept}>
					<span class="req-label">跨系修習</span>
					<span class="req-value small">{selected.requirement.crossDept ? '需至少一門' : '無限制'}</span>
				</div>
			</div>
			<p class="req-detail">{selected.requirement.detail}</p>
			{#if selected.requirement.core}
				<p class="req-core">核心課程：{selected.requirement.core}</p>
			{/if}
		</section>

		<section class="block">
			<h4><span class="block-num">三</span>課程規劃</h4>

			{#if selected.courses.some((c) => c.category)}
				{#if selected.courses.some((c) => c.category === 'core')}
					<h5 class="cat-head">核心課程</h5>
					{@render CourseTable({ courses: selected.courses.filter((c) => c.category === 'core') })}
				{/if}
				{#if selected.courses.some((c) => c.category === 'advanced')}
					<h5 class="cat-head">進階課程</h5>
					{@render CourseTable({ courses: selected.courses.filter((c) => c.category === 'advanced') })}
				{/if}
			{:else}
				{@render CourseTable({ courses: selected.courses })}
			{/if}

			{#if selected.courses.filter((c) => c.group).length > 0}
				<p class="group-tip">
					※ 標示「群組」之課程，於同一群組內擇一修習，學分不重複計算。
				</p>
			{/if}
		</section>

		<section class="block">
			<h4><span class="block-num">四</span>申請資格</h4>
			<p>{selected.eligibility}</p>
		</section>

		<section class="block">
			<h4><span class="block-num">五</span>申請與證明流程</h4>
			<ol class="procedure">
				{#each selected.procedure as step, i (i)}
					<li>{step}</li>
				{/each}
			</ol>
		</section>

		{#if selected.notes.length > 0}
			<section class="block">
				<h4><span class="block-num">六</span>備註</h4>
				<ul class="notes">
					{#each selected.notes as note, i (i)}
						<li>{note}</li>
					{/each}
				</ul>
			</section>
		{/if}
	</article>
</div>

{#snippet CourseTable({ courses }: { courses: Course[] })}
	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th class="col-course">課程名稱</th>
					<th class="col-type">必選修</th>
					<th class="col-credit">學分/時</th>
					<th class="col-unit">開課・支援單位</th>
					<th class="col-note">備註</th>
				</tr>
			</thead>
			<tbody>
				{#each courses as course (course.id)}
					<tr>
						<td>
							{#if course.group}
								<span class="course-name">{course.name}</span>
								<span class="group-mark">{course.group}</span>
							{:else}
								<span class="course-name">{course.name}</span>
							{/if}
						</td>
						<td>
							<span class="type-chip" class:req={course.required}>
								{course.required ? '必修' : '選修'}
							</span>
						</td>
						<td class="credit">{course.credits}/{course.hours}</td>
						<td>
							<div class="unit-list">
								{#each unitBadge(course) as u, i (i)}
									<span class="unit-chip">{u}</span>
								{/each}
							</div>
						</td>
						<td class="note">{course.note ?? ''}{course.semester ? `開課：${course.semester}` : ''}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/snippet}

<style>
	.page-head {
		margin-bottom: 28px;
	}

	.page-kicker {
		font-size: 12px;
		letter-spacing: 0.3em;
		color: var(--ink-2);
		margin-bottom: 8px;
	}

	.page-head h2 {
		font-size: 30px;
		letter-spacing: 0.1em;
	}

	.page-desc {
		margin-top: 8px;
		font-size: 14px;
		color: var(--ink-2);
	}

	.brochure-layout {
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 28px;
		align-items: start;
	}

	.program-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		position: sticky;
		top: 88px;
	}

	.program-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
		padding: 14px 16px;
		background: var(--surface);
		border: 1px solid var(--border);
		cursor: pointer;
		text-align: left;
		font: inherit;
		transition: border-color 0.18s, background 0.18s;
	}

	.program-card:hover {
		border-color: var(--border-strong);
		background: var(--bg-soft);
	}

	.program-card.active {
		border-color: var(--ink);
		background: var(--bg-soft);
	}

	.kind-tag,
	.kind-badge {
		font-size: 11px;
		letter-spacing: 0.15em;
		padding: 2px 10px;
		border: 1px solid var(--border-strong);
		color: var(--ink-2);
	}

	.kind-tag.micro,
	.kind-badge.micro {
		background: var(--bg-soft);
		color: var(--ink);
	}

	.program-name {
		font-family: var(--serif);
		font-size: 15px;
		font-weight: 600;
		line-height: 1.5;
	}

	.program-unit {
		font-size: 12px;
		color: var(--ink-2);
	}

	.program-detail {
		background: var(--surface);
		border: 1px solid var(--border);
		padding: 32px 36px;
	}

	.detail-head {
		border-bottom: 1px solid var(--border);
		padding-bottom: 20px;
		margin-bottom: 24px;
	}

	.detail-head h3 {
		font-size: 26px;
		letter-spacing: 0.08em;
		margin-top: 10px;
	}

	.detail-en {
		font-size: 13px;
		color: var(--ink-2);
		letter-spacing: 0.04em;
		margin-top: 4px;
	}

	.meta-line {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;
		margin-top: 14px;
		font-size: 12px;
		color: var(--ink-2);
	}

	.meta-updated {
		color: var(--ink-3);
	}

	.block {
		margin-bottom: 32px;
	}

	.block h4 {
		font-size: 19px;
		letter-spacing: 0.1em;
		margin-bottom: 14px;
		display: flex;
		align-items: baseline;
		gap: 10px;
	}

	.block-num {
		color: var(--ink);
		font-weight: 700;
	}

	.purpose {
		font-size: 15px;
		text-align: justify;
		letter-spacing: 0.04em;
	}

	.req-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
		gap: 12px;
		margin-bottom: 14px;
	}

	.req-item {
		display: flex;
		flex-direction: column;
		padding: 14px 16px;
		background: var(--surface);
		border: 1px solid var(--border);
	}

	.req-item.done {
		border-color: var(--border-strong);
		background: var(--bg-soft);
	}

	.req-label {
		font-size: 12px;
		color: var(--ink-2);
		letter-spacing: 0.1em;
	}

	.req-value {
		font-family: var(--serif);
		font-size: 30px;
		font-weight: 700;
		color: var(--ink);
		line-height: 1.3;
	}

	.req-value.small {
		font-size: 16px;
		color: var(--ink-2);
	}

	.req-value small {
		font-size: 13px;
		font-family: var(--sans);
	}

	.req-detail {
		font-size: 14px;
		color: var(--ink);
	}

	.req-core {
		margin-top: 8px;
		font-size: 13px;
		color: var(--ink);
	}

	.cat-head {
		font-family: var(--serif);
		font-size: 16px;
		margin: 20px 0 10px;
		color: var(--ink);
		border-left: 3px solid var(--ink);
		padding-left: 10px;
	}

	.table-wrap {
		overflow-x: auto;
		border: 1px solid var(--border);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
		min-width: 620px;
	}

	th {
		background: var(--bg-soft);
		font-family: var(--serif);
		font-weight: 600;
		letter-spacing: 0.08em;
		padding: 10px 12px;
		text-align: left;
		border-bottom: 1px solid var(--border-strong);
		white-space: nowrap;
	}

	td {
		padding: 10px 12px;
		border-bottom: 1px solid var(--border);
		vertical-align: top;
	}

	tr:last-child td {
		border-bottom: none;
	}

	.col-course {
		min-width: 180px;
	}
	.col-credit {
		width: 80px;
	}

	.course-name {
		font-weight: 500;
	}

	.group-mark {
		display: inline-block;
		margin-left: 6px;
		font-size: 10px;
		color: var(--ink-2);
		border: 1px solid var(--border-strong);
		padding: 0 6px;
		white-space: nowrap;
	}

	.type-chip {
		display: inline-block;
		font-size: 11px;
		padding: 1px 8px;
		background: var(--bg-soft);
		color: var(--ink-2);
	}

	.type-chip.req {
		background: var(--ink);
		color: var(--white);
	}

	.credit {
		font-family: var(--serif);
		font-weight: 600;
		white-space: nowrap;
	}

	.unit-list {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.unit-chip {
		font-size: 11px;
		padding: 1px 8px;
		background: var(--bg-soft);
		border: 1px solid var(--border);
		white-space: nowrap;
	}

	.note {
		font-size: 12px;
		color: var(--ink-2);
	}

	.group-tip {
		margin-top: 12px;
		font-size: 12px;
		color: var(--ink-2);
	}

	.procedure {
		padding-left: 22px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-size: 14px;
	}

	.procedure li::marker {
		color: var(--ink);
		font-family: var(--serif);
	}

	.notes {
		padding-left: 22px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 13px;
		color: var(--ink-2);
	}

	.notes li::marker {
		color: var(--ink-3);
	}

	@media (max-width: 860px) {
		.brochure-layout {
			grid-template-columns: minmax(0, 1fr);
		}
		.program-list {
			position: static;
			flex-direction: row;
			overflow-x: auto;
			padding-bottom: 8px;
			max-width: 100%;
		}
		.program-card {
			min-width: 200px;
			flex-shrink: 0;
		}
		.program-detail {
			padding: 24px 20px;
			min-width: 0;
		}
	}

	.program-card {
		background: #ffffff !important;
		border: 1.5px solid #cbd5e1 !important;
		border-radius: 0px !important;
		padding: 14px 16px !important;
		transition: all 0.15s ease;
	}

	.program-card:hover {
		border-color: #0f172a !important;
		background: #f8fafc !important;
	}

	.program-card.active {
		border-color: #ff6b00 !important;
		border-left: 4px solid #ff6b00 !important;
		background: #fff7ed !important;
	}

	.program-name {
		font-size: 15px !important;
		font-weight: 700 !important;
		color: #0f172a !important;
	}

	.program-detail {
		background: #ffffff !important;
		border: 1.5px solid #0f172a !important;
		border-radius: 0px !important;
		padding: 32px 36px !important;
		box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
	}

	.req-item {
		background: #f8fafc !important;
		border: 1.5px solid #cbd5e1 !important;
		padding: 14px 16px !important;
	}

	.table-wrap {
		border: 1.5px solid #0f172a !important;
		background: #ffffff;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		background: #f1f5f9 !important;
		color: #0f172a !important;
		font-weight: 700 !important;
		border-bottom: 1.5px solid #0f172a !important;
		padding: 10px 14px;
	}

	td {
		border-bottom: 1px solid #cbd5e1 !important;
		padding: 10px 14px;
		color: #1e293b !important;
	}

</style>
</NtubLayout>
