import { Env } from '@env';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Validate environment variables
const validateEnvironmentVars = () => {
  const missing = [];

  if (!Env.NEXT_PUBLIC_SUPABASE_URL) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!Env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }

  // Validate URL format
  try {
    new URL(Env.NEXT_PUBLIC_SUPABASE_URL);
  } catch (e) {
    throw new Error(
      `Invalid SUPABASE_URL format: ${Env.NEXT_PUBLIC_SUPABASE_URL}`,
    );
  }
};

// Initialize Supabase client with validation
const initializeSupabase = (): SupabaseClient => {
  // First validate environment variables
  validateEnvironmentVars();

  // Create client with proper typing
  const client = createClient(
    Env.NEXT_PUBLIC_SUPABASE_URL,
    Env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );

  // Verify client was created successfully
  if (!client || !client.auth) {
    throw new Error('Failed to initialize Supabase client');
  }

  return client;
};

// Create and export the client
export const supabase = initializeSupabase();

// Export a verification function
export const verifySupabaseConnection = async () => {
  try {
    // Try to make a simple auth call to verify the connection
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: 'Supabase client initialized successfully',
      sessionPresent: !!data.session,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
      error,
    };
  }
};
