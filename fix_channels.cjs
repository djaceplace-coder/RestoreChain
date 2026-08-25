const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('supabase.channel(')) {
    // We want to replace supabase.channel('some_string') with supabase.channel(`some_string_${Math.random()}`)
    // Actually, safest is to replace: supabase.channel('xxx') -> supabase.channel(`xxx-${Date.now()}`)
    
    // Using regex to replace simple string channel names
    content = content.replace(/supabase\.channel\('([^']+)'\)/g, "supabase.channel('$1-' + Date.now())");
    
    fs.writeFileSync(file, content);
    console.log('Fixed channels in', file);
  }
});
