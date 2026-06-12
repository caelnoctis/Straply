const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const inputDir = path.join(__dirname, "../assets/game");
const outputDir = path.join(__dirname, "../assets/game");

const filesToProcess = [
  "char_player_male.png",
  "char_player_female.png",
  "char_rama.png",
  "char_kheren.png",
  "char_farrel.png"
];

async function processImage(filename) {
  const filepath = path.join(inputDir, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`File not found: ${filepath}`);
    return;
  }
  
  try {
    const image = await Jimp.read(filepath);
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // Make near-white pixels transparent
      if (red > 230 && green > 230 && blue > 230) {
        this.bitmap.data[idx + 3] = 0; // alpha to 0
      }
    });
    
    // Save over the original file
    await image.writeAsync(path.join(outputDir, filename));
    console.log(`Processed: ${filename}`);
  } catch (err) {
    console.error(`Error processing ${filename}:`, err);
  }
}

async function main() {
  for (const file of filesToProcess) {
    await processImage(file);
  }
  console.log("All done!");
}

main();
