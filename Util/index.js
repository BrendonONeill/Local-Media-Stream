// This creates a json file that will find all folders list them out 
// find all images for each folder and link the images with their folders
// find all eps and their links

import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();


let data = {};
const folderPath = process.env.FOLDERLOCATION ;

async function main()
{
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
    }

    const promises = allFolders.map(folder => getVideosAndTypes(folder,data[folder].episodesAmount,folderPath+folder))
    await Promise.all(promises);
}

function getFoldersContentAmount(name)
{
  const folder = `${process.env.FOLDERLOCATION}/${name}`;
  const content = fs.readdirSync(folder);
  let videos = content.filter((text) => (!text.endsWith("jpg") && !text.endsWith("png")))
  return videos.length
}

async function getVideosAndTypes(folder,amount,folderPath)
{
    for (let j = 0; j < amount; j++) {
        data[folder][j+1] = {path : "", videoType: ""}
    }

    const files = fs.readdirSync(folderPath);
    let checked = false
    for (let i = 0; i < files.length; i++) {
        let fileSplit = files[i].split("__")
        if(fileSplit.length == 3)
        {
            if(!checked)
            {
                let type = fileSplit[fileSplit.length - 2];
                data[folder].types = typeChecker(type);
                checked = true;
            }
            let splitNum = fileSplit[fileSplit.length - 1].split(".");
            data[folder][splitNum[0]].path = `${folderPath}/${files[i]}`;
            data[folder][splitNum[0]].videoType = splitNum[1]
        }
    }

}

function typeChecker(type)
{
    let types = {movie: false, series: false, anime:false, kids: false, youtube: false}
    if(type == "as")
    {types.series = types.anime = true}
    else if(type == "am")
    {types.movie = types.anime = true}
    if(type == "km")
    {types.movie = types.kids = true}
    if(type == "ks")
    {types.series = types.kids = true}
    if(type == "m")
    {types.movie = true}
    if(type == "s")
    {types.series = true}
    if(type == "y")
    {types.youtube = true}

    return types
}


main()
//console.log(data)
data = JSON.stringify(data)
fs.writeFileSync("data.json",data)