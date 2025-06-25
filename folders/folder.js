import fs from 'fs'
import cron from 'node-cron'
import { spawn } from 'child_process';

let data = fs.readFileSync('data.json',"utf8")
export let content = JSON.parse(data)


cron.schedule('*/1 * * * *', () => {
  console.log('running a task every minute');
  let objectUpdateSpawn = spawn("node",["Util/index.js"])

  objectUpdateSpawn.on("close",  async () => {
    fs.readFile('data.json',"utf8",(err,data) => {
      if(err)
      {
        return null
      }
      content = JSON.parse(data)
      console.log("Object Updated successfully!")
      // set up a ws to update selection
    })
  })
});

export async function getFolders(req,res) {
  
  res.json(content)
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


// Kinda working needs fine tuning
// doesn't filter with no text
// In Levenshtein Distance sort by closest target
export async function getFilterFolders(req,res) {
  
  let text = req.params.text ?? ""
  let filters = req.body.types
  let arrTypes = null
  arrTypes  = activetypes(filters)
  let data = content.folders
  
    
  if(text.length >= 1)
  {
    data = content.folders.filter((folder) => (folder.toLowerCase().includes(req.params.text)))
    data = data.filter((folder) => {
        if(!arrTypes)
        {
          return true
        }
        for(let i = 0; i < arrTypes.length; i++)
        {
          if(content[folder].types[arrTypes[i]])
          {
            return true
          }
        }
        return false
    })
    if(text.length > 3)
    {
      data.push(test(text,content))
      let removedDups = []
      data = data.flat(2)
      for (let i = 0; i < data.length; i++) {
      if(!removedDups.includes(data[i]))
      {
        removedDups.push(data[i])
      }
      }
      data = removedDups
    }
  }
  console.log("client",data)
  data = data.flat(2)
  res.json({"folders":data,"content":content})
}

function activetypes(types)
{
  let typesArr = []
  if(types.series)
  {typesArr.push("series")}
  if(types.movies)
  {typesArr.push("movie")} 
  if(types.anime)
  {typesArr.push("anime")} 
  if(types.youtube)
  {typesArr.push("youtube")} 
  if(types.kids)
  {typesArr.push("kids")} 

  if(typesArr.length < 1)
  {
    return null
  }
  return typesArr 
}

/**
 * Uses the Levenshtein Distance algo to check two words 
 * @param {string} s1 user input text
 * @param {string} s2 name or word compared to users string
 * @returns {boolean} returns if there is a match
 */
function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;

  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;

      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // Deletion
        dp[i][j - 1] + 1, // Insertion
        dp[i - 1][j - 1] + cost // Substitution or Match
      );
    }
  }
  let number = dp[m][n];
  if(n <= 3 || n <= 3)
  {
    if(number <= 1)
    {
      return true
    }
    else
    {
      return false
    }
  }
  else if(n <= 6)
  {
    if(number < 3)
    {
      return true
    }
    else
    {
      return false
    }
  }
  else
  {
    if(number < 6)
    {
      return true
    }
    else
    {
      return false
    }
  }
}

// need to redo with type filtering
// clean up filtering try to place closes filter near start (Think about it)
function test(text, content)
{
  let split = text.split(" ")
    let inform = []
    for (let i = 0; i < split.length; i++) {
      let a = content.folders.filter((folder) => {
        let b = folder.split(" ")
        let match = false
        for (let j = 0; j < b.length; j++) {
          let k =  levenshteinDistance(split[i].toLowerCase(),b[j].toLowerCase())
          if(k)
          {
            match = true
            break
          }
        }
        if(match)
        {
          inform.push(folder)
        }
      })
    }
    let g = inform.flat(2)
    console.log(g)
    return g
}

