'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import Shell from '@/components/Shell';
import { getSupabase } from '@/lib/supabase';
export default function Account(){const [user,setUser]=useState<User|null>(null);const [loading,setLoading]=useState(true);const supabase=getSupabase();
useEffect(()=>{if(!supabase){setLoading(false);return;}void supabase.auth.getUser().then(({data})=>{setUser(data.user);setLoading(false);});const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,session)=>{setUser(session?.user??null);});return()=>subscription.unsubscribe();},[supabase]);
async function signOut(){if(!supabase)return;await supabase.auth.signOut();setUser(null);}
return <Shell><div className="eyebrow">Account workspace</div><h1>{loading?'Checking your session…':user?'Welcome to Greenlight':'Sign in to continue'}</h1>{!user?<div className="card"><p>Your secure account is needed to save visa progress or manage documents.</p><Link className="btn" href="/sign-in">Sign in / register</Link></div>:<><div className="card"><span className="tag">Signed in</span><h2 className="spaced">{user.email}</h2><p>Your Supabase account is connected. Case data and document uploads will require isolated backend permissions before activation.</p><button className="btn alt" onClick={signOut}>Sign out</button></div><div className="grid spaced"><div className="card"><h3>Visa planner</h3><p>Prepare your VFS checklist.</p><Link className="btn alt" href="/application">Open planner</Link></div><div className="card"><h3>Documents</h3><p>Private upload workflow is being configured.</p><Link className="btn alt" href="/documents">Document hub</Link></div><div className="card"><h3>Onboarding</h3><p>Choose applicant, lawyer or partner.</p><Link className="btn alt" href="/onboarding">Start onboarding</Link></div></div></>}</Shell>}
