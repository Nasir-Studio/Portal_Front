<script lang="ts">
	import { programs } from '$ntub/data';
	import NtubLayout from '../NtubLayout.svelte';

	const counts = {
		programs: programs.filter((p) => p.kind === '學分學程').length,
		micro: programs.filter((p) => p.kind === '微學程').length
	};
</script>

<NtubLayout>
<section class="hero">
	<p class="eyebrow">國立臺北商業大學 · 學分學程系統</p>
	<h1 class="hero-title">學分學程<br />學分戰士</h1>
	<p class="hero-sub">
		翻閱每一份簡章，勾選每一門課程，<br class="br-sp" />
		清楚掌握屬於你的修業進度。
	</p>
	<div class="hero-stats">
		<div class="stat">
			<span class="stat-num">{counts.programs}</span>
			<span class="stat-label">學分學程</span>
		</div>
		<div class="stat">
			<span class="stat-num">{counts.micro}</span>
			<span class="stat-label">微學程</span>
		</div>
		<div class="stat">
			<span class="stat-num">{programs.length}</span>
			<span class="stat-label">全部學程</span>
		</div>
	</div>
</section>

<section class="guide">
	<div class="guide-item">
		<span class="guide-num">一</span>
		<div>
			<h3>簡章</h3>
			<p>各學程設置要點與課程規劃，原汁原味收錄。</p>
		</div>
	</div>
	<div class="guide-item">
		<span class="guide-num">二</span>
		<div>
			<h3>學分勾選</h3>
			<p>勾選已修課程，即時計算學分進度。</p>
		</div>
	</div>
	<div class="guide-item">
		<span class="guide-num">三</span>
		<div>
			<h3>本系・外系</h3>
			<p>設定你的科系，判斷課程是否為跨系修習。</p>
		</div>
	</div>
</section>

<style>
	.hero {
		text-align: left;
		padding: 8px 0 40px;
		border-bottom: 1px solid var(--border);
		margin-bottom: 28px;
	}

	.eyebrow {
		font-size: 12px;
		letter-spacing: 0.3em;
		color: var(--ink-2);
		margin-bottom: 8px;
	}

	.hero-title {
		font-size: 30px;
		line-height: 1.3;
		letter-spacing: 0.1em;
		color: var(--ink);
	}

	.hero-sub {
		margin-top: 8px;
		color: var(--ink-2);
		font-size: 14px;
		letter-spacing: 0.08em;
	}

	.hero-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		margin-top: 24px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
		padding: 18px 20px;
		background: var(--surface);
		border: 1px solid var(--border);
	}

	.stat-num {
		font-family: var(--serif);
		font-size: 32px;
		font-weight: 700;
		color: var(--ink);
		line-height: 1.2;
	}

	.stat-label {
		font-size: 13px;
		letter-spacing: 0.2em;
		color: var(--ink-2);
	}

	.guide {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}

	.guide-item {
		display: flex;
		gap: 16px;
		padding: 20px 22px;
		background: var(--surface);
		border: 1px solid var(--border);
		transition: border-color 0.2s;
	}

	.guide-item:hover {
		border-color: var(--border-strong);
	}

	.guide-num {
		font-family: var(--serif);
		font-size: 24px;
		color: var(--ink);
		line-height: 1.4;
		flex-shrink: 0;
	}

	.guide-item h3 {
		font-size: 18px;
		margin-bottom: 4px;
	}

	.guide-item p {
		font-size: 13px;
		color: var(--ink-2);
	}

	@media (max-width: 720px) {
		.guide {
			grid-template-columns: 1fr;
		}
		.hero-stats {
			grid-template-columns: 1fr;
		}
		.br-sp {
			display: none;
		}
	}
</style>
</NtubLayout>
