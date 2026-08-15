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
		text-align: center;
		padding: 56px 0 48px;
	}

	.eyebrow {
		font-size: 13px;
		letter-spacing: 0.35em;
		color: var(--accent);
		margin-bottom: 24px;
	}

	.hero-title {
		font-size: clamp(44px, 8vw, 72px);
		line-height: 1.25;
		letter-spacing: 0.18em;
		color: var(--ink);
	}

	.hero-sub {
		margin-top: 28px;
		color: var(--ink-soft);
		font-size: 15px;
		letter-spacing: 0.12em;
	}

	.hero-stats {
		display: flex;
		justify-content: center;
		gap: 56px;
		margin-top: 40px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-num {
		font-family: var(--serif);
		font-size: 40px;
		font-weight: 700;
		color: var(--accent);
		line-height: 1.2;
	}

	.stat-label {
		font-size: 13px;
		letter-spacing: 0.2em;
		color: var(--ink-soft);
	}

	.guide {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
		margin-top: 16px;
	}

	.guide-item {
		display: flex;
		gap: 16px;
		padding: 24px 22px;
		background: var(--paper-2);
		border: 1px solid var(--line);
		border-radius: 10px;
		transition: border-color 0.2s;
	}

	.guide-item:hover {
		border-color: var(--line-strong);
	}

	.guide-num {
		font-family: var(--serif);
		font-size: 26px;
		color: var(--accent);
		line-height: 1.4;
		flex-shrink: 0;
	}

	.guide-item h3 {
		font-size: 18px;
		margin-bottom: 4px;
	}

	.guide-item p {
		font-size: 13px;
		color: var(--ink-soft);
	}

	@media (max-width: 720px) {
		.guide {
			grid-template-columns: 1fr;
		}
		.br-sp {
			display: none;
		}
		.hero-stats {
			gap: 32px;
		}
	}
</style>
</NtubLayout>
