import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

// Function to recursively find all .tsx and .ts files
function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
            callback(path.join(dir, f));
        }
    });
}

const colorReplacements = {
    'bg-green-': 'bg-primary-',
    'text-green-': 'text-primary-',
    'border-green-': 'border-primary-',
    'ring-green-': 'ring-primary-',
    'from-green-': 'from-primary-',
    'to-green-': 'to-primary-',
    'via-green-': 'via-primary-',
    'fill-green-': 'fill-primary-',
    'shadow-green-': 'shadow-primary-',
    'decoration-green-': 'decoration-primary-',
    'outline-green-': 'outline-primary-',
    'caret-green-': 'caret-primary-',
    'accent-green-': 'accent-primary-',
};

const regexPatterns = Object.keys(colorReplacements).map(key => {
    return {
        regex: new RegExp(`(${key}\\d{2,3}\\b(?![A-Za-z]))`, 'g'),
        replacement: colorReplacements[key]
    };
});

let modifiedFiles = 0;

walkDir(SRC_DIR, function(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    regexPatterns.forEach(pattern => {
        // pattern.regex matches "bg-green-500", etc.
        // We capture the whole thing and replace "green" with "primary"
        content = content.replace(pattern.regex, (match) => {
            return match.replace('green', 'primary');
        });
    });

    // Also replace hover/focus states like hover:text-green-500 -> hover:text-primary-500
    // The regex above handles these since they end with bg-green-500 boundary
    
    // Explicitly handle some edge cases if needed:
    // glow-green CSS variable is defined in index.css, leave it alone.
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedFiles++;
    }
});

console.log(`Refactored ${modifiedFiles} files.`);
