import AdmZip from 'adm-zip';
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();

// find a package that unzips files
// use ai to find eps
// move to media drive
function main()
{
    let folderPath = process.env.DOWNLOADLOCATION
    const allFolders = fs.readdirSync(folderPath);
    console.log(allFolders)
    for (let i = 0; i < allFolders.length; i++) {
        const zip = new AdmZip(allFolders[i]);
        // Extract all files
        let test = allFolders[i].split(".")
        console.log(test) 
        //zip.extractAllTo(`${process.env.DOWNLOADLOCATION}/${allFolders}`, true);
        
    }

}


function searchFolder()
{

}


function unzip()
{

}

main()