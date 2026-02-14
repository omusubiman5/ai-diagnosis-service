const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/img/yoshiko-avatar.webp');
const publicDir = path.join(__dirname, '../public');
const appDir = path.join(__dirname, '../src/app');

async function generateFavicons() {
    try {
        console.log(`Processing: ${inputPath}`);
        if (!fs.existsSync(inputPath)) {
            throw new Error('Input file not found');
        }

        const image = sharp(inputPath);

        // 1. favicon.ico (32x32) - Modern browsers support PNG, but ICO is safe fallback
        // Ideally ICO contains multiple sizes, but for simplicity here we use 32x32 PNG renamed or basic ICO if library supports
        // sharp doesn't natively output .ico depending on version/platform, so we'll output png and user can use it or we generate raw buffer
        // For now, let's generate standard icons

        // favicon.ico (often 32x32)
        // We will save it to public/favicon.ico and src/app/favicon.ico (Next.js App Router specific)
        await image.resize(32, 32).toFile(path.join(appDir, 'favicon.ico'));
        console.log('Generated: src/app/favicon.ico');

        // icon.png (32x32) for App Router
        await image.resize(32, 32).toFile(path.join(appDir, 'icon.png'));
        console.log('Generated: src/app/icon.png');

        // apple-icon.png (180x180)
        await image.resize(180, 180).toFile(path.join(appDir, 'apple-icon.png'));
        console.log('Generated: src/app/apple-icon.png');

        console.log('Favicon generation complete!');
    } catch (error) {
        console.error('Error generating favicons:', error);
    }
}

generateFavicons();
