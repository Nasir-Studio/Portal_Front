<script lang="ts">
	import { programs } from '$ntub/data';
	import { checkedCourses, toggleCourse, earnedCredits, breakdown, myDept, ALL_DEPTS } from '$ntub/stores/credits';
	import { currentUser } from '$ntub/stores/auth';
	import type { Program, Course } from '$ntub/types';
	import NtubLayout from '../NtubLayout.svelte';

	const base = '/ntub';

	let selectedId = $state(programs[0].id);
	const selected = $derived(programs.find((p) => p.id === selectedId) ?? programs[0]);

	const earned = $derived(earnedCredits($checkedCourses, selected));
	const bd = $derived(breakdown($checkedCourses, selected));
	const remaining = $derived(Math.max(0, selected.requirement.total - earned));
	const progressPct = $derived(
		Math.min(100, Math.round((earned / selected.requirement.total) * 100))
	);
	const isDone = $derived(earned >= selected.requirement.total);

	function isChecked(courseId: string): boolean {
		return $checkedCourses.has(courseId);
	}

	function courseIsMine(course: Course): boolean {
		const dept = $myDept;
		if (!dept) return false;
		return course.unit.includes(dept);
	}

	function deptCredits(program: Program): number {
		return program.courses.filter((c) => courseIsMine(c)).reduce((sum, c) => sum + c.credits, 0);
	}

	function extCredits(program: Program): number {
		return program.courses.filter((c) => !courseIsMine(c)).reduce((sum, c) => sum + c.credits, 0);
	}

	function groupedCourses(program: Program): Course[] {
		return program.courses;
	}
</script>

<NtubLayout>
<div class="page-head">
	<p class="page-kicker">Credit Checklist · 修業進度</p>
	<h2>學分勾選</h2>
	<p class="page-desc">
		勾選你已修畢的課程，系統自動結算學分進度。
		{#if $currentUser}
			已登入：進度將同步至雲端（{$currentUser.name}）。
		{:else}
			未登入：資料暫存於瀏覽器，<a href="{base}/login" class="desc-link">登入</a>後可雲端同步。
		{/if}
	</p>
</div>

<section class="dept-picker">
	<h3>我的科系</h3>
	<div class="dept-options">
		{#each ALL_DEPTS as dept (dept)}
			<button
				class="dept-chip"
				class:active={dept === $myDept}
				onclick={() => myDept.set($myDept === dept ? '' : dept)}
			>
				{dept}
			</button>
		{/each}
	</div>
	{#if !$myDept}
		<p class="picker-hint">※ 尚未設定科系。設定後可判定課程為本系或外系開設。</p>
	{/if}
</section>

<div class="check-layout">
	<aside class="side">
		<div class="prog-tabs">
			{#each programs as p (p.id)}
				<button
					class="prog-tab"
					class:active={p.id === selectedId}
					onclick={() => (selectedId = p.id)}
				>
					<span class="prog-tab-name">{p.name}</span>
					<span class="prog-tab-kind">{p.kind}</span>
				</button>
			{/each}
		</div>
	</aside>

	<div class="main">
		<div class="summary-card" class:done={isDone}>
			<div class="summary-head">
				<h3>{selected.name}</h3>
				<span class="summary-kind" class:micro={selected.kind === '微學程'}>{selected.kind}</span>
			</div>

			<div class="progress-row">
				<div class="progress-track">
					<div class="progress-fill" style="width: {progressPct}%"></div>
				</div>
				<span class="progress-text">{earned} / {selected.requirement.total} 學分</span>
			</div>

			<div class="summary-stats">
				<div class="s-stat">
					<span class="s-label">必修已達</span>
					<span class="s-value">{bd.required}</span>
					{#if selected.requirement.required !== undefined}
						<span class="s-target">/ 至少 {selected.requirement.required}</span>
					{/if}
				</div>
				<div class="s-stat">
					<span class="s-label">選修已達</span>
					<span class="s-value">{bd.elective}</span>
					{#if selected.requirement.elective !== undefined}
						<span class="s-target">/ 至少 {selected.requirement.elective}</span>
					{/if}
				</div>
				<div class="s-stat">
					<span class="s-label">尚缺</span>
					<span class="s-value">{remaining}</span>
					<span class="s-target">學分</span>
				</div>
			</div>

			{#if $myDept}
				<div class="dept-stats">
					<div class="d-stat">
						<span class="d-label">本系（{$myDept}）</span>
						<span class="d-value">{deptCredits(selected)}<small> 學分</small></span>
					</div>
					<div class="d-stat">
						<span class="d-label">外系（跨系）</span>
						<span class="d-value">{extCredits(selected)}<small> 學分</small></span>
					</div>
				</div>
			{/if}

			{#if isDone}
				<p class="done-banner">✓ 已達修業門檻！記得依簡章流程申請證明。</p>
			{:else if selected.requirement.crossDept}
				<p class="hint-banner">提示：本學程要求至少跨系修習一門課程。</p>
			{/if}
		</div>

	{#if selected.courses.some((c) => c.category)}
			{#if selected.courses.some((c) => c.category === 'core')}
				<section class="course-section">
					<h4>核心課程</h4>
					{@render CourseChecklist({ courses: groupedCourses(selected).filter((c) => c.category === 'core') })}
				</section>
			{/if}
			{#if selected.courses.some((c) => c.category === 'advanced')}
				<section class="course-section">
					<h4>進階課程</h4>
					{@render CourseChecklist({ courses: groupedCourses(selected).filter((c) => c.category === 'advanced') })}
				</section>
			{/if}
		{:else}
			<section class="course-section">
				<h4>全部課程</h4>
				{@render CourseChecklist({ courses: groupedCourses(selected) })}
			</section>
		{/if}

		<p class="save-tip">
			{#if $currentUser}
				✎ 已登入，勾選狀態自動同步至雲端。
			{:else}
				✎ 勾選狀態自動儲存於本機瀏覽器（localStorage）。
			{/if}
		</p>
	</div>
</div>{#snippet CourseChecklist({ courses }: { courses: Course[] })}
	<ul class="course-list">
		{#each courses as course (course.id)}
			<li class="course-row" class:checked={isChecked(course.id)}>
				<label>
					<input
						type="checkbox"
						checked={isChecked(course.id)}
						onchange={() => toggleCourse(course.id)}
					/><span class="checkbox-ui" aria-hidden="true"></span>
					<span class="row-main">
						<span class="row-name">
							{course.name}
							{#if course.group}<span class="group-mark">{course.group}</span>{/if}
						</span>
						<span class="row-meta">
							{#if $myDept}
								<span class="dept-tag" class:mine={courseIsMine(course)}>
									{courseIsMine(course) ? '本系' : '外系'}
								</span>
							{/if}
							<span class="type-chip" class:req={course.required}>
								{course.required ? '必修' : '選修'}
							</span>
							<span class="credit-chip">{course.credits} 學分</span>
							<span class="unit-text">{course.unit}</span>
							{#if course.semester}<span class="sem-text">開課：{course.semester}</span>{/if}
						</span>
					</span>
				</label>
			</li>
		{/each}
	</ul>
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

	.desc-link {
		color: var(--ink);
		text-decoration: underline;
	}

	.dept-picker {
		background: var(--surface);
		border: 1px solid var(--border);
		padding: 20px 24px;
		margin-bottom: 24px;
	}

	.dept-picker h3 {
		font-size: 16px;
		margin-bottom: 12px;
		letter-spacing: 0.08em;
	}

	.dept-options {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.dept-chip {
		padding: 6px 16px;
		font-size: 13px;
		font-family: var(--sans);
		background: var(--surface);
		border: 1px solid var(--border);
		cursor: pointer;
		transition: background 0.18s, border-color 0.18s;
		color: var(--ink);
	}

	.dept-chip:hover {
		background: var(--bg-soft);
		border-color: var(--border-strong);
	}

	.dept-chip.active {
		background: var(--ink);
		border-color: var(--ink);
		color: #fff;
	}

	.picker-hint {
		margin-top: 12px;
		font-size: 12px;
		color: var(--ink-3);
	}

	.dept-stats {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
		margin-top: 18px;
	}

	.d-stat {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 12px 14px;
		background: var(--surface);
		border: 1px solid var(--border);
	}

	.d-label {
		font-size: 12px;
		color: var(--ink-2);
		letter-spacing: 0.08em;
	}

	.d-value {
		font-family: var(--serif);
		font-size: 22px;
		font-weight: 700;
		color: var(--ink);
	}

	.d-value small {
		font-size: 12px;
		font-family: var(--sans);
		color: var(--ink-3);
	}

	.dept-tag {
		font-size: 11px;
		padding: 1px 8px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--ink-3);
	}

	.dept-tag.mine {
		background: var(--bg-soft);
		border-color: var(--border-strong);
		color: var(--ink);
	}

	.check-layout {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 28px;
		align-items: start;
	}

	.side {
		position: sticky;
		top: 88px;
	}

	.prog-tabs {
		display: flex;
		flex-direction: column;
		gap: 6px;
		max-height: calc(100vh - 140px);
		overflow-y: auto;
		padding-right: 4px;
	}

	.prog-tab {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
		padding: 10px 14px;
		background: var(--surface);
		border: 1px solid var(--border);
		cursor: pointer;
		font: inherit;
		text-align: left;
		transition: border-color 0.18s, background 0.18s;
	}

	.prog-tab:hover {
		border-color: var(--border-strong);
		background: var(--bg-soft);
	}

	.prog-tab.active {
		border-color: var(--ink);
		background: var(--bg-soft);
	}

	.prog-tab-name {
		font-family: var(--serif);
		font-size: 14px;
		font-weight: 600;
		line-height: 1.5;
	}

	.prog-tab-kind {
		font-size: 11px;
		color: var(--ink-2);
		flex-shrink: 0;
	}

	.main {
		min-width: 0;
	}

	.summary-card {
		background: var(--surface);
		border: 1px solid var(--border);
		padding: 24px 28px;
		margin-bottom: 24px;
	}

	.summary-card.done {
		border-color: var(--border-strong);
		background: var(--bg-soft);
	}

	.summary-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 16px;
	}

	.summary-head h3 {
		font-size: 22px;
		letter-spacing: 0.06em;
	}

	.summary-kind {
		font-size: 11px;
		padding: 2px 10px;
		border: 1px solid var(--border-strong);
		color: var(--ink-2);
	}

	.summary-kind.micro {
		background: var(--bg-soft);
		color: var(--ink);
	}

	.progress-row {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.progress-track {
		flex: 1;
		height: 10px;
		background: var(--bg-soft);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--ink);
		transition: width 0.4s ease;
	}

	.progress-text {
		font-family: var(--serif);
		font-weight: 700;
		font-size: 18px;
		white-space: nowrap;
	}

	.summary-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		margin-top: 18px;
	}

	.s-stat {
		display: flex;
		align-items: baseline;
		gap: 6px;
		flex-wrap: wrap;
		padding: 12px 14px;
		background: var(--surface);
		border: 1px solid var(--border);
	}

	.s-label {
		font-size: 12px;
		color: var(--ink-2);
		letter-spacing: 0.08em;
	}

	.s-value {
		font-family: var(--serif);
		font-size: 24px;
		font-weight: 700;
		color: var(--ink);
	}

	.s-target {
		font-size: 12px;
		color: var(--ink-2);
	}

	.done-banner {
		margin-top: 14px;
		padding: 10px 14px;
		background: var(--bg-soft);
		border: 1px solid var(--border);
		font-size: 14px;
		color: var(--ink-2);
	}

	.hint-banner {
		margin-top: 14px;
		padding: 10px 14px;
		background: var(--bg-soft);
		border: 1px solid var(--border);
		font-size: 13px;
		color: var(--ink-2);
	}

	.course-section {
		margin-bottom: 24px;
	}

	.course-section h4 {
		font-family: var(--serif);
		font-size: 17px;
		margin-bottom: 12px;
		color: var(--ink);
		border-left: 3px solid var(--ink);
		padding-left: 10px;
	}

	.course-list {
		list-style: none;
		background: var(--surface);
		border: 1px solid var(--border);
		overflow: hidden;
	}

	.course-row {
		border-bottom: 1px solid var(--border);
		transition: background 0.15s;
	}

	.course-row:last-child {
		border-bottom: none;
	}

	.course-row.checked {
		background: var(--bg-soft);
	}

	.course-row label {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		padding: 14px 18px;
		cursor: pointer;
	}

	.course-row input[type='checkbox'] {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.checkbox-ui {
		width: 20px;
		height: 20px;
		border: 1.5px solid var(--border-strong);
		flex-shrink: 0;
		margin-top: 2px;
		position: relative;
		transition: background 0.18s, border-color 0.18s;
		background: var(--surface);
	}

	.course-row input:checked + .checkbox-ui {
		background: var(--ink);
		border-color: var(--ink);
	}

	.course-row input:checked + .checkbox-ui::after {
		content: '';
		position: absolute;
		left: 6px;
		top: 2px;
		width: 6px;
		height: 11px;
		border: solid #fff;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	.row-main {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.row-name {
		font-family: var(--serif);
		font-size: 15px;
		font-weight: 600;
	}

	.course-row.checked .row-name {
		color: var(--ink-2);
	}

	.row-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
		font-size: 12px;
		color: var(--ink-2);
	}

	.type-chip {
		font-size: 11px;
		padding: 1px 8px;
		background: var(--bg-soft);
	}

	.type-chip.req {
		background: var(--ink);
		color: var(--white);
	}

	.credit-chip {
		font-family: var(--serif);
		font-weight: 600;
		color: var(--ink);
	}

	.unit-text {
		color: var(--ink-2);
	}

	.sem-text {
		color: var(--ink-3);
	}

	.group-mark {
		display: inline-block;
		margin-left: 6px;
		font-size: 10px;
		color: var(--ink-2);
		border: 1px solid var(--border-strong);
		padding: 0 6px;
		white-space: nowrap;
		font-family: var(--sans);
	}

	.save-tip {
		margin-top: 20px;
		font-size: 12px;
		color: var(--ink-3);
		text-align: right;
	}

	@media (max-width: 860px) {
		.check-layout {
			grid-template-columns: minmax(0, 1fr);
		}
		.side {
			position: static;
			max-width: 100%;
		}
		.prog-tabs {
			flex-direction: row;
			overflow-x: auto;
			max-height: none;
			max-width: 100%;
		}
		.prog-tab {
			min-width: 200px;
			flex-direction: column;
			flex-shrink: 0;
		}
		.main {
			min-width: 0;
		}
		.summary-stats {
			grid-template-columns: 1fr;
		}
	}
</style>
</NtubLayout>
