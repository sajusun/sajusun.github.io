const sharp = require('sharp');
const fs = require('fs');

async function run() {
  const input = 'assets/images/sakhawat-enhanced.jpg';
  
  // 1. WebP version 400x400 (displayed at max 389x389)
  const webpRes = await sharp(input)
    .resize(400, 400, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile('assets/images/sakhawat-enhanced.webp');
  console.log('WebP 400x400:', webpRes.size, 'bytes');

  // 2. High-res WebP 512x512
  const webp512 = await sharp(input)
    .webp({ quality: 82 })
    .toFile('assets/images/sakhawat-enhanced-512.webp');
  console.log('WebP 512x512:', webp512.size, 'bytes');

  // 3. Fallback optimized JPEG 400x400 (replaces existing if smaller and sharp)
  const jpgRes = await sharp(input)
    .resize(400, 400, { fit: 'cover' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile('assets/images/sakhawat-enhanced-opt.jpg');
  console.log('JPEG 400x400:', jpgRes.size, 'bytes');

  // Also check original size
  console.log('Original size:', fs.statSync(input).size, 'bytes');
}

run().catch(console.error);
