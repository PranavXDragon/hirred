const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log("Testing insert into contact_messages...");
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([
      { name: 'Test User', email: 'test@example.com', message: 'This is a test message' }
    ]);
  
  if (error) {
    console.error("SUPABASE ERROR:", error);
  } else {
    console.log("SUCCESS! Message stored.");
  }
}

testInsert();
