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

async function testUserFlow() {
  const testEmail = `test_tracker_${Date.now()}@example.com`
  const testPassword = 'Password123!@#'
  
  console.log('1. Signing up user:', testEmail)
  const { data: authData, error: authErr } = await client.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: 'Habit Tester'
      }
    }
  })

  if (authErr) {
    console.error('Sign up error:', authErr)
    return
  }

  const user = authData.user
  console.log('User signed up. ID:', user?.id)

  // Wait 1 second for triggers if any
  await new Promise(r => setTimeout(r, 1000))

  // 2. Check if habits were auto-seeded for this new user
  console.log('2. Querying habits table for user:', user?.id)
  const { data: habits, error: habitsErr } = await client
    .from('habits')
    .select('*')
    .eq('user_id', user.id)

  console.log('Habits found:', habits?.length, 'Error:', habitsErr?.message)
  if (habits && habits.length > 0) {
    console.log('Sample habit from DB:', habits[0].id, habits[0].title)
  }

  // 3. Test upserting habit log for habit[0]
  if (habits && habits.length > 0) {
    const habit = habits[0]
    const today = new Date().toISOString().slice(0, 10)
    console.log(`3. Upserting log for habit ${habit.id} on date ${today}...`)
    
    const { data: upsertData, error: upsertErr } = await client
      .from('daily_habit_logs')
      .upsert({
        user_id: user.id,
        habit_id: habit.id,
        date: today,
        is_completed: true
      }, { onConflict: 'user_id,habit_id,date' })
      .select()

    console.log('Upsert result:', upsertData, 'Error:', upsertErr?.message)

    // 4. Test querying the log back
    console.log('4. Querying daily_habit_logs for user...')
    const { data: logs, error: logsErr } = await client
      .from('daily_habit_logs')
      .select('*')
      .eq('user_id', user.id)

    console.log('Retrieved logs count:', logs?.length, logs)

    // 5. Test toggling to false
    console.log('5. Toggling log to false...')
    const { data: toggleData, error: toggleErr } = await client
      .from('daily_habit_logs')
      .upsert({
        user_id: user.id,
        habit_id: habit.id,
        date: today,
        is_completed: false
      }, { onConflict: 'user_id,habit_id,date' })
      .select()
    console.log('Toggle result:', toggleData, 'Error:', toggleErr?.message)
  }
}

testUserFlow()
