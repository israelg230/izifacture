import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rdqajrhakhhdowrljics.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcWFqcmhha2hoZG93cmxqaWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2OTc5NzAsImV4cCI6MjEwODI3Mzk3MH0.leldh3lCWQydt-7NTOqtWXmAzGP6QzKTI-jqK5He-DU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
