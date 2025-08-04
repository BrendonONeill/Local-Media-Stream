import fs from "fs"
import {join } from 'path';
import { __dirname } from "../index.js";
import { content } from "../folders/folder.js";



export function videoPage(req, res){
    
    res.sendFile(join(__dirname, 'public', 'video.html'));
};


export function getVideo(req,res)
{
    const videoPath = content[req.params.name][req.params.number].path
    let videoType = ""
    if(content[req.params.name][req.params.number].videoType == "mp4")
    {
      fs.stat(videoPath, (err, stat) => {
        if (stat) {
          videoType = "mp4"
          sendVideo(videoPath, stat, videoType, req, res)
        }
    })
    }
    else if(content[req.params.name][req.params.number].videoType == "mkv")
    {
      fs.stat(videoPath, (err, stat) => {
        if (stat) {
          videoType = "mkv"
          sendVideo(videoPath, stat, videoType, req, res)
        }
    })
    }
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