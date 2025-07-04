
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://njrzsivjqlfpuimajboh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qcnpzaXZqcWxmcHVpbWFqYm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODg3NzUsImV4cCI6MjA2NjM2NDc3NX0.eLD5YmhPot4ier6WtnfG9oBZXjaqWduli9hOAYAOM8c'

export const supabase = createClient(supabaseUrl, supabaseKey)
