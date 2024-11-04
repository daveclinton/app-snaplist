/* eslint-disable max-lines-per-function */
import { type SupabaseClient } from '@supabase/supabase-js';

import { getToken, setToken } from './utils';

export const debugSignInFlow = async (
  supabase: SupabaseClient,
  email: string,
  password: string,
) => {
  const logs: string[] = [];
  const addLog = (message: string) => {
    console.log(`[Auth Debug] ${message}`);
    logs.push(message);
  };

  try {
    addLog('Starting sign in process...');
    addLog(`Attempting to sign in user: ${email}`);

    // Check if email and password are provided
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Verify Supabase client
    if (!supabase || !supabase.auth) {
      throw new Error('Supabase client is not properly initialized');
    }

    addLog('Calling Supabase auth.signInWithPassword...');

    // Attempt sign in with detailed error capturing
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      addLog(`Supabase auth error: ${error.message}`);
      addLog(`Error details: ${JSON.stringify(error)}`);
      throw error;
    }

    addLog('Sign in response received');
    addLog(`Session data present: ${!!data.session}`);

    if (!data.session) {
      addLog('No session data in response');
      throw new Error('No session data received');
    }

    // Log token information (safely)
    addLog(`Access token received: ${!!data.session.access_token}`);
    addLog(`Access token length: ${data.session.access_token.length}`);
    addLog(`Refresh token received: ${!!data.session.refresh_token}`);

    const token = {
      access: data.session.access_token,
      refresh: data.session.refresh_token,
    };

    addLog('Attempting to store token...');
    await setToken(token);
    addLog('Token stored successfully');

    return {
      success: true,
      logs,
      token,
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    addLog(
      `Sign in failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    if (error instanceof Error && error.stack) {
      addLog(`Error stack: ${error.stack}`);
    }
    return {
      success: false,
      logs,
      error,
    };
  }
};

export const testTokenStorage = async () => {
  try {
    const testToken = { access: 'test', refresh: 'test' };
    await setToken(testToken);
    const retrievedToken = await getToken();
    return {
      success: true,
      stored: !!retrievedToken,
      matching: JSON.stringify(testToken) === JSON.stringify(retrievedToken),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
