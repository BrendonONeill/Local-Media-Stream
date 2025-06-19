// This creates a json file that will find all folders list them out 
// find all images for each folder and link ythe images with their folders
// find all eps and their links

import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();


let data = {}

const folderPath = process.env.FOLDERLOCATION ;
const allFolders = fs.readdirSync(folderPath);
data.folders = allFolders
for (let i = 0; i < allFolders.length; i++) {
    data[allFolders[i]] = {}
}
for (let i = 0; i < allFolders.length; i++) {
    let image = `${process.env.FOLDERLOCATION}/${allFolders[i]}/${allFolders[i]}.jpg`;
    if(fs.existsSync(image))
    {
        data[allFolders[i]].image = `${process.env.FOLDERLOCATION}${allFolders[i]}/${allFolders[i]}.jpg`;
    }
    else
    {
        data[allFolders[i]].image = null
    }
}
for (let i = 0; i < allFolders.length; i++) {
    let amount = getFoldersContentAmount(allFolders[i])
    data[allFolders[i]].episodesAmount = amount
    if(amount == 1)
    {
        data[allFolders[i]].movie = true 
    }
    else
    {
        data[allFolders[i]].movie = false
    }

    for (let j = 0; j < amount; j++) {
        data[allFolders[i]][j+1] = {path : "", videoType: ""}
        getVideos(allFolders[i], j+1)
    }
}



function getFoldersContentAmount(name)
{
  const folder = `${process.env.FOLDERLOCATION}/${name}`;
  const content = fs.readdirSync(folder);
  let videos = content.filter((text) => (!text.endsWith("jpg") && !text.endsWith("png")))
  return videos.length
}

// rewrite
// file name will be like this name of series/movie type then number lego-m-1 = lego-movie-ep1
// look in folder see all files and check their numbers  
async function getVideos(name,number)
{
    const videoPath =  `${process.env.FOLDERLOCATION}${name}/${number}`
    if(fs.existsSync(videoPath+".mp4"))
    {
          data[name][number].path = videoPath+".mp4"
          data[name][number].videoType = "mp4"
          return  
    }
    else if(fs.existsSync(videoPath+".mkv"))
    {
        data[name][number].path = videoPath+".mkv"
        data[name][number].videoType = "mkv"
        return
    }
}

console.log(data)
data = JSON.stringify(data)
fs.writeFileSync("data.json",data)