// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jfvpebuqcwzinxceupxa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdnBlYnVxY3d6aW54Y2V1cHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyODA0MzgsImV4cCI6MjA0OTg1NjQzOH0.13BRdZMdhW82ToG3_2WoR0rjdFMHsVMjq2KwmCSBt80";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);