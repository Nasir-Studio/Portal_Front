<script lang="ts">
	import { loginWithEmail, registerWithEmail, loginWithGoogle, currentUser, authReady } from '$ntub/stores/auth';
	import NtubLayout from '../NtubLayout.svelte';

	const base = '/ntub';

	let mode = $state<'login' | 'register'>('login');
	let email = $state('');
	let password = $state('');
	let error = $state('');
	let busy = $state(false);

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		if (!email || !password) {
			error = '請填寫電子信箱與密碼。';
			return;
		}
		busy = true;
		try {
			if (mode === 'login') {
				await loginWithEmail(email, password);
			} else {
				await registerWithEmail(email, password);
			}
			window.location.href = `${base}/credits`;
		} catch (err) {
			const code = (err as { code?: string }).code;
			if (code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials') {
				error = '電子信箱或密碼錯誤。';
			} else if (code === 'auth/email-already-in-use') {
				error = '此電子信箱已被註冊，請直接登入。';
			} else if (code === 'auth/weak-password') {
				error = '密碼至少需要 6 個字元。';
			} else if (code === 'auth/operation-not-allowed') {
				error = '目前未開放 Email 密碼登入，請改用 Google 登入。';
			} else if (code === 'auth/popup-closed-by-user') {
				error = '已取消 Google 登入。';
			} else {
				error = `登入失敗：${(err as Error).message}`;
			}
		} finally {
			busy = false;
		}
	}

	async function google() {
		error = '';
		busy = true;
		try {
			await loginWithGoogle();
			window.location.href = `${base}/credits`;
		} catch (err) {
			const code = (err as { code?: string }).code;
			if (code === 'auth/popup-closed-by-user') {
				error = '已取消 Google 登入。';
			} else {
				error = `Google 登入失敗：${(err as Error).message}`;
			}
		} finally {
			busy = false;
		}
	}

	function switchMode() {
		mode = mode === 'login' ? 'register' : 'login';
		error = '';
	}
</script>

<NtubLayout>
<div class="login-wrap">
	<div class="login-card">
		<p class="kicker">Sign in · 學分進度雲端同步</p>
		<h2>{mode === 'login' ? '登入' : '註冊帳號'}</h2>
		<p class="desc">
			{mode === 'login'
				? '登入後勾選的學分進度會同步到雲端，多裝置一致。'
				: '註冊後即可開始記錄你的學分進度。'}
		</p>

		<form onsubmit={submit}>
			<label class="field">
				<span>電子信箱</span>
				<input type="email" bind:value={email} placeholder="you@example.com" autocomplete="email" />
			</label>
			<label class="field">
				<span>密碼</span>
				<input type="password" bind:value={password} placeholder="••••••••" autocomplete={mode === 'login' ? 'current-password' : 'new-password'} />
			</label>

			{#if error}
				<p class="error">{error}</p>
			{/if}

			<button class="submit" type="submit" disabled={busy}>
				{busy ? '處理中…' : mode === 'login' ? '登入' : '註冊並登入'}
			</button>
		</form>

		<div class="divider"><span>或</span></div>

		<button class="google" type="button" onclick={google} disabled={busy}>
			<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
				<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
				<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
				<path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z"/>
				<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
			</svg>
			使用 Google 登入
		</button>

		<p class="switch">
			{mode === 'login' ? '還沒有帳號？' : '已經有帳號？'}
			<button class="link-btn" type="button" onclick={switchMode} disabled={busy}>
				{mode === 'login' ? '註冊一個' : '直接登入'}
			</button>
		</p>
	</div>
</div>

<style>
	.login-wrap {
		max-width: 420px;
		margin: 40px auto 0;
		padding: 0 8px;
	}

	.login-card {
		background: var(--surface);
		border: 1px solid var(--border);
		padding: 40px 36px;
	}

	.kicker {
		font-size: 12px;
		letter-spacing: 0.3em;
		color: var(--ink-2);
		margin-bottom: 8px;
	}

	.login-card h2 {
		font-size: 26px;
		letter-spacing: 0.1em;
	}

	.desc {
		margin-top: 6px;
		margin-bottom: 24px;
		font-size: 13px;
		color: var(--ink-soft);
		line-height: 1.7;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 16px;
	}

	.field span {
		font-size: 13px;
		color: var(--ink-soft);
		letter-spacing: 0.08em;
	}

	.field input {
		font: inherit;
		font-size: 15px;
		padding: 10px 14px;
		border: 1px solid var(--border-strong);
		background: #fff;
		color: var(--ink);
		outline: none;
		transition: border-color 0.18s;
	}

	.field input:focus {
		border-color: var(--ink);
	}

	.error {
		margin: 4px 0 14px;
		padding: 10px 14px;
		background: var(--bg-soft);
		border: 1px solid var(--border-strong);
		font-size: 13px;
		color: var(--ink-2);
	}

	.submit {
		width: 100%;
		font: inherit;
		font-size: 15px;
		font-weight: 600;
		letter-spacing: 0.12em;
		padding: 12px;
		background: var(--ink);
		color: #fff;
		border: 1px solid var(--ink);
		cursor: pointer;
		transition: background 0.2s;
	}

	.submit:hover {
		background: #000;
		border-color: #000;
	}

	.submit:disabled {
		opacity: 0.6;
		cursor: default;
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 20px 0;
		color: var(--ink-3);
		font-size: 12px;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--border);
	}

	.google {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font: inherit;
		font-size: 15px;
		padding: 12px;
		background: #fff;
		border: 1px solid var(--border-strong);
		cursor: pointer;
		transition: background 0.2s;
	}

	.google:hover {
		background: var(--bg-soft);
	}

	.google:disabled {
		opacity: 0.6;
		cursor: default;
	}

	.switch {
		margin-top: 20px;
		text-align: center;
		font-size: 13px;
		color: var(--ink-soft);
	}

	.link-btn {
		background: none;
		border: none;
		font: inherit;
		color: var(--ink);
		cursor: pointer;
		text-decoration: underline;
		padding: 0;
	}
</style>
</NtubLayout>
