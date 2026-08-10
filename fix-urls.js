const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'app');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir(directoryPath);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Pattern to look for: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyankateshengg.com'
    // OR process.env.NEXT_PUBLIC_SITE_URL || 'https://vyankatesh.com'
    // And its regex replace addition: .replace(/^https?:\/\/vyankateshengg\.com/, 'https://www.vyankateshengg.com')
    
    // We will replace all of these occurrences with a safe evaluation.
    // Basically, we just want to replace:
    // .replace(/^https?:\/\/vyankateshengg\.com/, 'https://www.vyankateshengg.com')
    // with:
    // ; if(siteUrl.includes('vyankateshengg.com')) { ... }
    
    // Since doing string replace on arbitrary AST is brittle, let's just use regex to swap out the `.replace(...)` part.
    // The previous commit added: .replace(/^https?:\/\/vyankateshengg\.com/, 'https://www.vyankateshengg.com')
    
    const target = /\.replace\(\/\^https\?:\\\\\/\\\\\/vyankateshengg\\\.com\/, 'https:\/\/www\.vyankateshengg\.com'\)/g;
    
    // Let's replace:
    // const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyankateshengg.com';
    // const siteUrl = rawUrl.replace(/^https?:\/\/vyankateshengg\.com/, 'https://www.vyankateshengg.com');
    // with a helper logic.
    
    // Let's just find exactly what we need to replace in layout.tsx, robots.ts, sitemap.ts
    // In layout.tsx, it's lines 27-28
    // In robots.ts, it's lines 4-5
    // In sitemap.ts, it's lines 5-6
    
    if (content.includes('.replace(/^https?:\\/\\/vyankateshengg\\.com/, \'https://www.vyankateshengg.com\')')) {
        let newContent = content.replace(/\.replace\(\/\^https\?:\\\/\\\/vyankateshengg\\\.com\/, 'https:\/\/www\.vyankateshengg\.com'\)/g, 
            ".includes('vyankateshengg.com') ? 'https://www.vyankateshengg.com' : (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`)");
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated: ${file}`);
    }
});
