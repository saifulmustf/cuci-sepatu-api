import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Ambil variabel lingkungan
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Buat dan ekspor klien Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);