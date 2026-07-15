import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = fs.readFileSync(path.resolve(__dirname, '.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let val = match[2] || '';
    val = val.replace(/^['"]|['"]$/g, '');
    env[match[1]] = val;
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  console.log("Creating admin user...");
  const { data, error } = await supabase.auth.signUp({
    email: 'support@hirrd.tech',
    password: 'Soulix@2027@',
    options: {
      data: {
        role: 'employer',
        name: 'Admin'
      }
    }
  });

  if (error) {
    console.error("Error creating user:", error.message);
  } else {
    console.log("User created successfully! ID:", data.user.id);
  }
}

main();
