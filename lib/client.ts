import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Auth0ContextInterface, User } from '@auth0/auth0-react';

export const configured = Boolean(process.env.NEXT_PUBLIC_AUTH0_DOMAIN && process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export async function createUserDatabase(auth: Pick<Auth0ContextInterface<User>, 'getIdTokenClaims'>): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase is not yet configured.');
  return createClient(url, key, {
    accessToken: async () => {
      // Supabase Auth0 third-party integration expects the ID token with role: authenticated.
      const claims = await auth.getIdTokenClaims();
      const token = claims?.__raw;
      if (!token) throw new Error('Please sign in again.');
      return token;
    },
  });
}
