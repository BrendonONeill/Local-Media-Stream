import fs from "fs"
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';


export function videoPage(req, res){
    
    const __dirname = dirname(fileURLToPath(import.meta.url));
    res.sendFile(join(__dirname, 'public/index.html'));
};


export function getVideo(req,res)
{
    const videoPath =  `${process.env.FOLDERLOCATION}/${req.params.name}/${req.params.number}`
    let videoType = ""
    fs.stat(videoPath+".mp4", (err, stat) => {
        if (stat) {
          console.log(stat)
          videoType = "mp4"
          sendVideo(videoPath+".mp4", stat, videoType, req, res)
        }
    })
      
    fs.stat(videoPath+".mkv", (err, stat) => {
        if (stat) {
          videoType = "mkv"
          sendVideo(videoPath+".mkv", stat, videoType, req, res)
        }
    })
}


function sendVideo(videoPath,stat,type, req, res)
{
  
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
            'Content-Type': `video/${type}`
          });
          
          // Create stream with specific byte range
          const stream = fs.createReadStream(videoPath, { start, end });
          stream.pipe(res);
        } 
        else 
        {
          // Serve the entire file
          console.log(`Serving entire file (${fileSize} bytes)`);
          
          res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': `video/${type}`
          });  
          fs.createReadStream(videoPath).pipe(res);
        }
}