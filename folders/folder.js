import fs from 'fs'

export function getFolders(req,res) {
  const folderPath = process.env.FOLDERLOCATION ;
  const folder = fs.readdirSync(folderPath);
  res.json(folder)
}



export function getImages(req,res){

  const image = `${process.env.FOLDERLOCATION}/${req.params.name}/${req.params.name}.jpg`;
  if(fs.existsSync(image))
  {
    res.sendFile(image,(err) => {
      console.log(err)
    })
  }
  else
  {
    res.json(null);
  }
}
