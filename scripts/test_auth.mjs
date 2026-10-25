import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('./.env', 'utf8')
const env = {}
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const [k, ...v] = trimmed.split('=')
  env[k.trim()] = v.join('=').trim()
}

const client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

async function testAuthMethods() {
  console.log('Testing Supabase Auth API methods...')

  // Test 1: Sign in with invalid credentials to verify error handling
  const signInRes = await client.auth.signInWithPassword({
    email: 'nonexistent_test_user_xyz@example.com',
    password: 'wrong_password_123'
  })
  console.log('SignIn test (expected failure):', {
    hasError: !!signInRes.error,
    message: signInRes.error?.message,
    status: signInRes.error?.status
  })

  // Test 2: Password reset request
  const resetRes = await client.auth.resetPasswordForEmail('test_reset_user@example.com')
  console.log('Password reset test:', {
    hasError: !!resetRes.error,
    message: resetRes.error?.message
  })

  // Test 3: Check RLS on user_profiles (unauthenticated should be blocked from reading records)
  const { data: unauthProfiles, error: unauthError } = await client
    .from('user_profiles')
    .select('*')
  console.log('RLS unauthenticated query on user_profiles (should return empty array or RLS block):', {
    count: unauthProfiles ? unauthProfiles.length : 0,
    hasError: !!unauthError
  })

  // Test 4: Check RLS on habits
  const { data: unauthHabits, error: habitsError } = await client
    .from('habits')
    .select('*')
  console.log('RLS unauthenticated query on habits (should return empty array due to RLS):', {
    count: unauthHabits ? unauthHabits.length : 0,
    hasError: !!habitsError
  })
}

testAuthMethods()
