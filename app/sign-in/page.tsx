'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Shell from '@/components/Shell';
import { getSupabase } from '@/lib/supabase';

type Mode = 'sign-in' | 'register' | 'reset';
export default function SignIn() {
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = getSupabase();
  useEffect(() => { if (!supabase) return; void supabase.auth.getUser().then(({ data }) => {
    if (data.user) router.replace('/account');
  }); }, [router, supabase]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); setMessage('');
    if (!supabase) { setError('Sign-in is not configured yet. Connect the isolated Greenlight Supabase project first.'); return; }
    setBusy(true);
    try {
      if (mode === 'reset') {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' });
        if (authError) throw authError;
        setMessage('If this address has an account, a password-reset email will arrive shortly.');
      } else if (mode === 'register') {
        const { data, error: authError } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + '/account' } });
        if (authError) throw authError;
        if (data.session) router.replace('/account');
        else setMessage('Check your email to confirm your account before signing in.');
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        router.replace('/account'); router.refresh();
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.'); }
    finally { setBusy(false); }
  }
  return <Shell><section className="auth-layout"><div className="auth-intro"><div className="eyebrow">Welcome to Greenlight Next</div><h1>Your journey, beautifully organized.</h1><p>Keep visa milestones, documents and reminders together in one secure place.</p><div className="auth-points"><span>✓ Guided visa checklists</span><span>✓ Personal document hub</span><span>✓ Lawyer and partner collaboration</span></div></div><div className="card auth-card"><div className="eyebrow">Your account</div><h2>{mode === 'register' ? 'Create your account' : mode === 'reset' ? 'Reset your password' : 'Welcome back'}</h2><p>{mode === 'reset' ? 'We will email you a password-reset link.' : 'Sign in securely using your email address.'}</p>{!supabase && <div className="notice" role="status">Account login will become available once the new Greenlight Supabase credentials are configured in Vercel. The original Greenlight database is not used.</div>}<form onSubmit={submit} className="auth-form"><label><span className="label">Email address</span><input className="field" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/></label>{mode !== 'reset' && <label><span className="label">Password</span><input className="field" type="password" minLength={mode === 'register' ? 8 : undefined} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"/></label>}{error && <p className="error" role="alert">{error}</p>}{message && <div className="notice" role="status">{message}</div>}<button className="btn" type="submit" disabled={busy || !supabase}>{busy ? 'Please wait…' : mode === 'register' ? 'Create account' : mode === 'reset' ? 'Send reset link' : 'Sign in'}</button></form><div className="auth-actions">{mode !== 'sign-in' ? <button type="button" className="text-button" onClick={() => {setMode('sign-in');setError('');setMessage('');}}>Back to sign in</button> : <><button type="button" className="text-button" onClick={() => {setMode('register');setError('');setMessage('');}}>Create an account</button><button type="button" className="text-button" onClick={() => {setMode('reset');setError('');setMessage('');}}>Forgot password?</button></>}</div><p className="muted">By continuing, you agree to use this early access application for non-sensitive testing until its secure document storage and permissions are fully enabled.</p></div></section><div className="spaced"><Link href="/">← Back to Greenlight Next</Link></div></Shell>;
}
