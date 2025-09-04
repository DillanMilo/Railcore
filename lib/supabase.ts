// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock Supabase client for development
export const supabase = {
  auth: {
    getUser: () => Promise.resolve({ 
      data: { user: { id: 'demo-user', email: 'demo@railcore.com' } }, 
      error: null 
    }),
    signInWithPassword: () => Promise.resolve({ 
      data: { user: { id: 'demo-user', email: 'demo@railcore.com' } }, 
      error: null 
    }),
    signUp: () => Promise.resolve({ 
      data: { user: { id: 'demo-user', email: 'demo@railcore.com' } }, 
      error: null 
    }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      order: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: { id: 'mock-id' }, error: null })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: 'mock-id' }, error: null })
        })
      })
    })
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ error: null }),
      createSignedUrl: () => Promise.resolve({ 
        data: { signedUrl: 'https://example.com/mock-file.pdf' }, 
        error: null 
      }),
      getPublicUrl: () => ({ 
        data: { publicUrl: 'https://example.com/mock-file.pdf' } 
      })
    })
  }
};

// Server-side client with service role key
export const createServerClient = () => supabase;
// Database helper functions
export const getUser = async () => {
  // Mock user for development
  return { id: 'demo-user', email: 'demo@railcore.com', created_at: new Date().toISOString() };
};

export const signIn = async (email: string, password: string) => {
  // Mock sign in for development
  return { user: { id: 'demo-user', email, created_at: new Date().toISOString() } };
};

export const signUp = async (email: string, password: string) => {
  // Mock sign up for development
  return { user: { id: 'demo-user', email, created_at: new Date().toISOString() } };
};

export const signOut = async () => {
  // Mock sign out for development
  return;
};