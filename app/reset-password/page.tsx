'use client';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '@/components/Shell';
import { getSupabase } from '@/lib/supabase';
export default function ResetPassword() {
  const router = useRouter(); const [password,setPassword]=useState(''); const [busy,setBusy]=useState(false); const [message,setMessage]=useState(''); const [ready,setReady]=useState(false);
  const supabase=getSupabase();
  useEffect(()=>{if(!supabase)return; const {data:{subscription}}=supabase.auth.onAuthStateChange((event)=>{if(event==='PASSWORD_RECOVERY')setReady(true);}); void supabase.auth.getSession().then(({data})=>{if(data.session)setReady(true);}); return ()=>subscription.unsubscribe();},[supabase]);
  async function submit(e:FormEvent){e.preventDefault();if(!supabase)return;setBusy(true);const {error}=await supabase.auth.updateUser({password});setBusy(false);if(error)setMessage(error.message);else {setMessage('Password updated. Redirecting…');router.replace('/account');}}
  return <Shell><div className="card auth-card"><div className="eyebrow">Account security</div><h1>Choose a new password</h1><p>Use the secure password-reset link emailed to you.</p>{!ready?<div className="notice">Open this page using the link from your password-reset email.</div>:<form className="auth-form" onSubmit={submit}><label><span className="label">New password</span><input className="field" type="password" minLength={8} required autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="btn" disabled={busy}>{busy?'Saving…':'Update password'}</button></form>}{message&&<p role="status">{message}</p>}</div></Shell>;
}
