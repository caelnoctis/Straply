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

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.max(Math.abs(r1 - r2), Math.abs(g1 - g2), Math.abs(b1 - b2));
}

async function processImage(filename) {
  const filepath = path.join(inputDir, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`File not found: ${filepath}`);
    return;
  }
  
  try {
    const image = await Jimp.read(filepath);
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    
    // Create visited mask
    const visited = new Uint8Array(w * h);
    const stack = [];
    
    // Push top border
    for (let x = 0; x < w; x++) { stack.push({x, y: 0}); }
    // Push left and right borders
    for (let y = 0; y < h; y++) {
      stack.push({x: 0, y});
      stack.push({x: w - 1, y});
    }
    // NOT pushing bottom border because the character touches the bottom.
    
    // We assume the background color is white.
    const bgR = 255, bgG = 255, bgB = 255;
    const tolerance = 40; // Allow slight variations and antialiasing
    
    while (stack.length > 0) {
      const {x, y} = stack.pop();
      if (x < 0 || x >= w || y < 0 || y >= h) continue;
      
      const idx = y * w + x;
      if (visited[idx]) continue;
      
      const pixelOffset = idx * 4;
      const r = image.bitmap.data[pixelOffset + 0];
      const g = image.bitmap.data[pixelOffset + 1];
      const b = image.bitmap.data[pixelOffset + 2];
      
      if (colorDistance(r, g, b, bgR, bgG, bgB) <= tolerance) {
        visited[idx] = 1;
        image.bitmap.data[pixelOffset + 3] = 0; // Make transparent
        
        stack.push({x: x + 1, y});
        stack.push({x: x - 1, y});
        stack.push({x, y: y + 1});
        stack.push({x, y: y - 1});
      }
    }
    
    // Extra pass: feathering to remove harsh white edges
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        if (!visited[idx]) {
          const pixelOffset = idx * 4;
          const r = image.bitmap.data[pixelOffset + 0];
          const g = image.bitmap.data[pixelOffset + 1];
          const b = image.bitmap.data[pixelOffset + 2];
          
          if (colorDistance(r, g, b, bgR, bgG, bgB) <= tolerance + 20) {
             let bordersTransparent = false;
             if (x > 0 && visited[y * w + (x-1)]) bordersTransparent = true;
             if (x < w-1 && visited[y * w + (x+1)]) bordersTransparent = true;
             if (y > 0 && visited[(y-1) * w + x]) bordersTransparent = true;
             if (y < h-1 && visited[(y+1) * w + x]) bordersTransparent = true;
             
             if (bordersTransparent) {
                visited[idx] = 1;
                image.bitmap.data[pixelOffset + 3] = 0;
             }
          }
        }
      }
    }
    
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
