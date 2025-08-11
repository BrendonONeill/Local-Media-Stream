import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();


let FilesInformationObject = {};
const folderPath = process.env.FOLDERLOCATION;

async function main()
{
    FilesInformationObject.folders = fs.readdirSync(folderPath);

    for (let i = 0; i < FilesInformationObject.folders.length; i++) {
        FilesInformationObject[FilesInformationObject.folders[i]] = {}
    }
    // update to look for png as well
    for (let i = 0; i < FilesInformationObject.folders.length; i++) {
            let image = `${process.env.FOLDERLOCATION}/${FilesInformationObject.folders[i]}/${FilesInformationObject.folders[i]}.jpg`;
            if(fs.existsSync(image))
            {
                FilesInformationObject[FilesInformationObject.folders[i]].image = `${process.env.FOLDERLOCATION}${FilesInformationObject.folders[i]}/${FilesInformationObject.folders[i]}.jpg`;
            }
            else
            {
                FilesInformationObject[FilesInformationObject.folders[i]].image = null
            }
    }

    for (let i = 0; i < FilesInformationObject.folders.length; i++) {
        FilesInformationObject[FilesInformationObject.folders[i]].episodesAmount = getFoldersContentAmount(FilesInformationObject.folders[i])
    }

    const videosPathsForFolders = FilesInformationObject.folders.map(folderName => getVideosAndTypes(folderName,FilesInformationObject[folderName].episodesAmount,folderPath+folderName))
    await Promise.all(videosPathsForFolders);
}


function getFoldersContentAmount(folderName)
{
  const folderPath = `${process.env.FOLDERLOCATION}/${folderName}`;
  const content = fs.readdirSync(folderPath);
  let videos = content.filter((text) => (!text.endsWith("jpg") && !text.endsWith("png") && !text.endsWith("vtt")))
  return videos.length
}


async function getVideosAndTypes(folderName,amount,folderPath)
{
    for (let j = 0; j < amount; j++) {
        FilesInformationObject[folderName][j+1] = {path : "", videoType: "", subtitles: ""}
    }
    const files = fs.readdirSync(folderPath);
    const videos = files.filter((text) => (!text.endsWith("jpg") && !text.endsWith("png") && !text.endsWith("vtt")))
    const subtitles = files.filter((text) => (text.endsWith("vtt")))
    let checked = false
    for (let i = 0; i < videos.length; i++) {
        let fileSplit = videos[i].split("__")
        if(fileSplit.length == 3)
        {
            if(!checked)
            {
                let type = fileSplit[fileSplit.length - 2];
                FilesInformationObject[folderName].types = typeChecker(type);
                checked = true;
            }
            let splitNum = fileSplit[fileSplit.length - 1].split(".");
            FilesInformationObject[folderName][splitNum[0]].path = `${folderPath}/${videos[i]}`;
            FilesInformationObject[folderName][splitNum[0]].videoType = splitNum[1]
        }
    }
    for (let i = 0; i < subtitles.length; i++) {
        let fileSplit = subtitles[i].split("__")
        if(fileSplit.length == 3)
        {
            let splitNum = fileSplit[fileSplit.length - 1].split(".");
            FilesInformationObject[folderName][splitNum[0]].subtitles = `${folderPath}/${subtitles[i]}`;
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
FilesInformationObject = JSON.stringify(FilesInformationObject)
fs.writeFileSync("data.json",FilesInformationObject)