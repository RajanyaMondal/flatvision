import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance = null;

/**
 * Creates and returns a Supabase client that dynamically injects the Clerk token.
 * 
 * @param {Function} getToken - The getToken function from Clerk's useAuth hook.
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export const getSupabaseClient = (getToken) => {
  if (supabaseInstance) return supabaseInstance;

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options = {}) => {
        const headers = new Headers(options.headers || {});
        try {
          // Fetch the Clerk token formatted for Supabase
          const token = await getToken({ template: 'supabase' });
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
        } catch (e) {
          console.error('Error fetching Clerk token for Supabase', e);
        }
        return fetch(url, { ...options, headers });
      },
    },
  });

  return supabaseInstance;
};
