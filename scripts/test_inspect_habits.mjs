import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('.env', 'utf8')
const env = {}
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const [k, ...v] = trimmed.split('=')
  env[k.trim()] = v.join('=').trim()
}

const client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

async function run() {
  console.log('Testing habits table...')
  const { data: habits, error: habitsErr } = await client.from('habits').select('*')
  console.log('Habits query result:', { count: habits?.length, error: habitsErr?.message })
  
  const { data: logs, error: logsErr } = await client.from('daily_habit_logs').select('*')
  console.log('Logs query result:', { count: logs?.length, error: logsErr?.message })
}

run()
