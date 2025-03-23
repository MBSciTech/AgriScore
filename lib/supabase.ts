import { createClient } from "@supabase/supabase-js"

// Placeholder values - these would be replaced with actual environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

// Create a single supabase client for the browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

