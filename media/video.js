import fs from "fs"
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';


export function videoPage(req, res){
    
    const __dirname = dirname(fileURLToPath(import.meta.url));
    res.sendFile(join(__dirname, 'public/index.html'));
};


export function getVideo(req,res)
{
    const videoPath =  `${process.env.FOLDERLOCATION}/${req.params.name}/1.mp4` 
      
      // Check if file exists
      fs.stat(videoPath, (err, stat) => {
        if (err) {
          console.error('File not found:', err);
          return res.status(404).send('Video not found');
        }
        
        const fileSize = stat.size;
        const range = req.headers.range;
        
        // Handle range requests (important for seeking and resuming)
        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunkSize = end - start + 1;
          
          console.log(`Serving bytes ${start}-${end}/${fileSize}`);
          
          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
          });
          
          // Create stream with specific byte range
          const stream = fs.createReadStream(videoPath, { start, end });
          stream.pipe(res);
        } else {
          // Serve the entire file
          console.log(`Serving entire file (${fileSize} bytes)`);
          
          res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
          });
          
          fs.createReadStream(videoPath).pipe(res);
        }
      });
}