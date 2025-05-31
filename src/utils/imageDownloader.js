const fs = require('fs');
const path = require('path');
const https = require('https');


// AI GENERATED 

/**
 * Downloads an image from a URL to a specified directory
 * 
 * @param {string} url - The URL of the image to download
 * @param {string} outputDir - The directory where the image should be saved
 * @param {string} [filename='temp_image.png'] - The filename to use for the downloaded image
 * @returns {Promise<string>} - A promise that resolves with the path to the downloaded image
 */
async function downloadImage(url, outputDir, filename = 'temp_image.png') {

  const tmpImagePath = path.resolve(outputDir, filename);
  
  console.log(`[INFO] Downloading image from: ${url}`);
  
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(tmpImagePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image, status code: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(tmpImagePath);
      });
      
      file.on('error', (err) => {
        fs.unlink(tmpImagePath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(tmpImagePath, () => {});
      reject(err);
    });
  });
}

module.exports = { downloadImage };
