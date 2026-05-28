const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Avatar URLs - using professional business avatars from UI Faces
const avatarUrls = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/54.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/76.jpg'
];

// Download each avatar
avatarUrls.forEach((url, index) => {
  const fileName = `avatar-${index + 1}.jpg`;
  const filePath = path.join(imagesDir, fileName);
  
  console.log(`Downloading ${fileName}...`);
  
  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      console.error(`Failed to download ${url}: ${response.statusCode}`);
      return;
    }
    
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Downloaded ${fileName}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${url}: ${err.message}`);
  });
});

console.log('Avatar download script completed. Check the public/images directory for the downloaded avatars.');
