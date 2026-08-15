<script lang="ts">
	import { programs } from '$ntub/data';
	import { checkedCourses, myDept, ALL_DEPTS, earnedCredits } from '$ntub/stores/credits';
	import type { Program, Course } from '$ntub/types';
	import NtubLayout from '../NtubLayout.svelte';

	let selectedId = $state(programs[0].id);
	const selected = $derived(programs.find((p) => p.id === selectedId) ?? programs[0]);

	/** 依科系判定某開課單位是否含本系 */
	function courseIsMine(course: Course): boolean {
		const dept = $myDept;
		if (!dept) return false;
		return course.unit.includes(dept);
	}

	/** 本系課程總學分 */
	function deptCredits(program: Program): number {
		return program.courses
			.filter((c) => courseIsMine(c))
			.reduce((sum, c) => sum + c.credits, 0);
	}

	/** 外系課程總學分 */
	function extCredits(program: Program): number {
		return program.courses
			.filter((c) => !courseIsMine(c))
			.reduce((sum, c) => sum + c.credits, 0);
	}

	const earned = $derived(earnedCredits($checkedCourses, selected));

	function isChecked(courseId: string): boolean {
		return $checkedCourses.has(courseId);
	}

	/** 已勾選的外系課程門數 */
	function checkedExtCount(program: Program): number {
		return program.courses.filter((c) => !courseIsMine(c) && isChecked(c.id)).length;
	}

	/** 已勾選的本系課程門數 */
	function checkedMineCount(program: Program): number {
		return program.courses.filter((c) => courseIsMine(c) && isChecked(c.id)).length;
	}
</script>

<NtubLayout>
<div class="page-head">
	<p class="page-kicker">Own Dept · Cross Dept</p>
	<h2>本系・外系</h2>
	<p class="page-desc">設定你的科系，了解各學程課程中哪些是本科系開設、哪些屬跨系修習。</p>
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
		<p class="picker-hint">※ 尚未設定科系。設定後即可判斷課程為本系或外系開設。</p>
	{/if}
</section>

<div class="dept-layout">
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
		{#if $myDept}
			<div class="overview">
				<div class="ov-card mine">
					<span class="ov-label">本系課程（{$myDept}）</span>
					<span class="ov-value">{deptCredits(selected)}</span>
					<span class="ov-sub">學分 · 已勾選 {checkedMineCount(selected)} 門</span>
				</div>
				<div class="ov-card ext">
					<span class="ov-label">外系課程（跨系）</span>
					<span class="ov-value">{extCredits(selected)}</span>
					<span class="ov-sub">學分 · 已勾選 {checkedExtCount(selected)} 門</span>
				</div>
				<div class="ov-card total">
					<span class="ov-label">目前總計</span>
					<span class="ov-value">{earned}</span>
					<span class="ov-sub">/ 應修 {selected.requirement.total} 學分</span>
				</div>
			</div>

			{#if selected.requirement.crossDept}
				<div
					class="cross-status"
					class:met={checkedExtCount(selected) >= 1}
				>
					{#if checkedExtCount(selected) >= 1}
						<span class="cross-mark">✓</span>
						<p>跨系修習需求已滿足（已勾選 {checkedExtCount(selected)} 門外系課程）。</p>
					{:else}
						<span class="cross-mark">!</span>
						<p>本學程要求至少跨系修習一門課程，目前尚未勾選任何外系課程。</p>
					{/if}
				</div>
			{/if}

			<section class="course-block">
				<h4 class="cat-mine">本系開設課程</h4>
				{@render CourseRows({ courses: selected.courses.filter((c) => courseIsMine(c)), mine: true })}
			</section>

			<section class="course-block">
				<h4 class="cat-ext">外系開設課程（跨系）</h4>
				{@render CourseRows({ courses: selected.courses.filter((c) => !courseIsMine(c)), mine: false })}
			</section>
		{:else}
			<div class="empty-state">
				<p class="empty-symbol">◌</p>
				<p>請先在上方選擇你的科系，即可查看本系 / 外系課程分類。</p>
			</div>
		{/if}
	</div>
</div>

{#snippet CourseRows({ courses, mine }: { courses: Course[]; mine: boolean })}
	{#if courses.length === 0}
		<p class="empty-row">此學程無{mine ? '本系' : '外系'}開設課程。</p>
	{:else}
		<ul class="dept-courses">
			{#each courses as course (course.id)}
				<li class="dc-row" class:checked={isChecked(course.id)}>
					<span class="dc-name">
						{course.name}
						{#if course.group}<span class="group-mark">{course.group}</span>{/if}
					</span>
					<span class="dc-meta">
						<span class="type-chip" class:req={course.required}>
							{course.required ? '必修' : '選修'}
						</span>
						<span class="credit-chip">{course.credits} 學分</span>
						<span class="unit-text">{course.unit}</span>
					</span>
				</li>
			{/each}
		</ul>
	{/if}
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
		transition: border-color 0.18s, background 0.18s, color 0.18s;
		color: var(--ink);
	}

	.dept-chip:hover {
		border-color: var(--border-strong);
		background: var(--bg-soft);
	}

	.dept-chip.active {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--white);
	}

	.picker-hint {
		margin-top: 12px;
		font-size: 12px;
		color: var(--ink-3);
	}

	.dept-layout {
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

	.overview {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		margin-bottom: 20px;
	}

	.ov-card {
		display: flex;
		flex-direction: column;
		padding: 18px 20px;
		border: 1px solid var(--border);
		background: var(--surface);
	}

	.ov-card.mine {
		border-color: var(--border-strong);
	}

	.ov-card.ext {
		background: var(--bg-soft);
	}

	.ov-card.total {
		border-color: var(--ink);
	}

	.ov-label {
		font-size: 12px;
		color: var(--ink-2);
		letter-spacing: 0.06em;
	}

	.ov-value {
		font-family: var(--serif);
		font-size: 32px;
		font-weight: 700;
		color: var(--ink);
		line-height: 1.4;
	}

	.ov-sub {
		font-size: 12px;
		color: var(--ink-2);
	}

	.cross-status {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		margin-bottom: 20px;
		font-size: 13px;
		background: var(--bg-soft);
		border: 1px solid var(--border);
		color: var(--ink-2);
	}

	.cross-status.met {
		border-color: var(--border-strong);
	}

	.cross-mark {
		font-family: var(--serif);
		font-weight: 700;
		font-size: 18px;
		flex-shrink: 0;
	}

	.course-block {
		margin-bottom: 24px;
	}

	.course-block h4 {
		font-family: var(--serif);
		font-size: 17px;
		margin-bottom: 12px;
		padding-left: 10px;
	}

	.cat-mine {
		border-left: 3px solid var(--ink);
		color: var(--ink);
	}

	.cat-ext {
		border-left: 3px solid var(--ink);
		color: var(--ink);
	}

	.dept-courses {
		list-style: none;
		background: var(--surface);
		border: 1px solid var(--border);
		overflow: hidden;
	}

	.dc-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 18px;
		border-bottom: 1px solid var(--border);
		flex-wrap: wrap;
	}

	.dc-row:last-child {
		border-bottom: none;
	}

	.dc-row.checked {
		background: var(--bg-soft);
	}

	.dc-name {
		font-family: var(--serif);
		font-size: 14px;
		font-weight: 600;
	}

	.dc-row.checked .dc-name {
		color: var(--ink-2);
	}

	.dc-meta {
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

	.empty-row {
		padding: 16px;
		font-size: 13px;
		color: var(--ink-3);
		background: var(--surface);
		border: 1px dashed var(--border-strong);
	}

	.empty-state {
		text-align: center;
		padding: 60px 20px;
		color: var(--ink-2);
		font-size: 14px;
	}

	.empty-symbol {
		font-size: 40px;
		color: var(--ink-3);
		margin-bottom: 12px;
	}

	@media (max-width: 860px) {
		.dept-layout {
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
		.overview {
			grid-template-columns: 1fr;
		}
	}
</style>
</NtubLayout>
