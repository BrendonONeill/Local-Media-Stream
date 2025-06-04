import fs from 'fs'
let data = fs.readFileSync('data.json',"utf8")
export let content = JSON.parse(data)

export async function getFolders(req,res) {
  
  res.json(content.folders)
}



export function getImages(req,res){
  const image = content[req.params.name].image
  if(fs.existsSync(image))
  {
    res.sendFile(image,(err) => {
      
    })
  }
  else
  {
    res.json(null);
  }
}

export function getFoldersContentAmount(req,res)
{
  let videosAmount = content[req.params.name].episodesAmount
  res.json(videosAmount)
}

export async function getFilterFolders(req,res) {
  console.log(req.body)
  // add filter system for series movie and youtube
  let data = content.folders.filter((folder) => (folder.toLowerCase().includes(req.params.text)))

  // I want to try compare names to text in box 
  res.json(data)
}
