import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Read .env file from workspace root
const envPath = './.env'
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const [k, ...v] = trimmed.split('=')
  env[k.trim()] = v.join('=').trim()
}

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY

console.log('Testing Supabase Connection...')
console.log('Project URL:', supabaseUrl)
console.log('Anon Key prefix:', supabaseAnonKey ? supabaseAnonKey.substring(0, 16) + '...' : 'none')

const client = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  const results = {
    authReachable: false,
    authMessage: '',
    tablesStatus: {}
  }

  // 1. Test Auth endpoint
  try {
    const { data, error } = await client.auth.getSession()
    if (error) {
      results.authReachable = false
      results.authMessage = error.message
    } else {
      results.authReachable = true
      results.authMessage = 'Auth service is responsive'
    }
  } catch (err) {
    results.authReachable = false
    results.authMessage = err.message
  }

  // 2. Test Tables required by Daily Tracker
  const tables = [
    'user_profiles',
    'user_settings',
    'habits',
    'daily_habit_logs',
    'study_sessions',
    'problem_solving_records',
    'interview_topics',
    'job_applications',
    'daily_health_logs',
    'water_logs',
    'daily_reflections',
    'tomorrow_plans',
    'temple_visits'
  ]

  for (const table of tables) {
    try {
      const { data, error, status } = await client
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) {
        const notFound = error.message.includes('does not exist') || error.code === '42P01' || status === 404
        results.tablesStatus[table] = {
          exists: !notFound,
          status: status,
          code: error.code,
          message: error.message
        }
      } else {
        results.tablesStatus[table] = {
          exists: true,
          status: status,
          message: 'OK (Table exists with RLS active)'
        }
      }
    } catch (err) {
      results.tablesStatus[table] = {
        exists: false,
        error: err.message
      }
    }
  }

  console.log('\n--- SUPABASE VERIFICATION RESULTS ---')
  console.log('Auth Reachable:', results.authReachable, '-', results.authMessage)
  console.log('\nTables Check:')
  for (const [tbl, st] of Object.entries(results.tablesStatus)) {
    console.log(`- ${tbl}: ${st.exists ? 'EXISTS (' + st.message + ')' : 'MISSING (' + (st.message || st.code) + ')'}`)
  }
}

testConnection()
