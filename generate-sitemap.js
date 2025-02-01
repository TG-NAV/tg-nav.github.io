const fs = require('fs');
const path = require('path');

// Function to recursively get all files in a directory, excluding .git and .github
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (['.git', '.github', 'assets', 'go', 'link','static','.nojekyll','manifest.json','sw.js','ads.txt'].includes(file)) {
            return;
        }
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, '/', file));
        }
    });

    return arrayOfFiles;
}

// Generate sitemap.xml content with lastmod and priority
function generateSitemap(files) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    files.forEach(function(file) {
        const url = 'https://tg-nav.github.io/' + file.replace('./', ''); // Update URL as needed
        const lastmod = new Date().toISOString().split('T')[0]; // Current date as lastmod
        const priority = 0.5; // Set priority as needed

        xml += `\t<url>\n\t\t<loc>${url}</loc>\n\t\t<lastmod>${lastmod}</lastmod>\n\t\t<priority>${priority}</priority>\n\t</url>\n`;
    });

    xml += '</urlset>';

    return xml;
}

// Main script
const files = getAllFiles('./'); // Start from the root directory, you can change this path as needed
const sitemapContent = generateSitemap(files);

// Write sitemap.xml file
fs.writeFileSync('sitemap.xml', sitemapContent);

console.log('sitemap.xml generated successfully!');
