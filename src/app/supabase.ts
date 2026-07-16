import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://egsvwegfanydbxvhetzl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnc3Z3ZWdmYW55ZGJ4dmhldHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTk2ODUsImV4cCI6MjA5OTUzNTY4NX0.yhhpZAFqCdHVXwUfacSpsLTGH04K7KrlN-ma3gg3KXg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
