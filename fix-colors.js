const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix the 9000 bug everywhere
    content = content.replace(/text-slate-9000/g, 'text-slate-500');

    // Fix aeo landing page specifically
    if (filePath.includes('aeo\\page.tsx') || filePath.includes('aeo/page.tsx')) {
        content = content.replace(/text-slate-400/g, 'text-slate-600');
        
        // Turn white text to slate-900 for light background
        content = content.replace(/text-white/g, 'text-slate-900');
        
        // Fix the primary buttons/badges that should remain white
        content = content.replace(/bg-indigo-600 hover:bg-indigo-500 text-slate-900/g, 'bg-indigo-600 hover:bg-indigo-500 text-white');
        content = content.replace(/bg-indigo-600 text-slate-900/g, 'bg-indigo-600 text-white');
        
        // Fix the specific Start Free button which doesn't have text-slate-900 explicitly in its class list
        content = content.replace(/bg-indigo-600 hover:bg-indigo-500 px-4/g, 'bg-indigo-600 hover:bg-indigo-500 text-white px-4');
        
        // Change auth links to dashboard
        content = content.replace(/\/api\/auth\/login/g, '/dashboard');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
}

replaceInFile(path.join(__dirname, 'app', 'aeo', 'page.tsx'));
replaceInFile(path.join(__dirname, 'app', 'page.tsx'));
replaceInFile(path.join(__dirname, 'components', 'social', 'SocialDashboard.tsx'));
