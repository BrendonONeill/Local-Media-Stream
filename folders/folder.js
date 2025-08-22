import fs from 'fs'
import cron from 'node-cron'
import { spawn } from 'child_process';

let data = fs.readFileSync('data.json',"utf8")
export let content = JSON.parse(data)


cron.schedule('*/30 * * * *', () => {
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

function typeFilter(data, arrTypes)
{
  let filterData = data.filter((folderName) => {
        let item = content[folderName]
        return arrTypes.some((type) => item.types[type]);
  })
  return filterData
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
  let larger = Math.max(m,n)
  let smaller = Math.min(m,n)
  let space = larger - smaller

  // need to clean up
  if(n <= 4 || m <= 4 && n <= 5 && m <= 5 && space <= 1)
  {
    if(number <= 1)
    {
      return [true,number]
    }
    else
    {
      return [false,null]
    }
  }
  else if(n >= 5 && n <= 8 && space <= 3)
  {
    if(number <= 4)
    {
      return [true,number]
    }
    else
    {
      return [false,null]
    }
  }
  else if(n >= 9 && n <= 16 && space <= 4)
  {
    if(number <= 6)
    {
      return [true,number]
    }
    else
    {
      return [false,null]
    }
  }
  else
  {
    if(number < 5)
    {
      return [true,number]
    }
    else
    {
      return [false,null]
    }
  }
}

export function getTest(req,res)
{
  let text = req.params.text ?? ""
  if(text != "")
  {
    text = text.toLowerCase()
  }
  let filters = req.body.types
  let arrTypes = null
  arrTypes  = activetypes(filters)
  let data = content.folders
  if(arrTypes != null)
  {
    data = typeFilter(data,arrTypes)
  }
  if(text.length < 3)
  {
    data = data.filter((folder) => (folder.toLowerCase().includes(text)))
    res.json({"folders":data,"content":content})
  }
  else
  {
    data = advancedFiltering(text,data)
    res.json({"folders":data,"content":content})
  }
}

function advancedFiltering(text, listOfFolders)
{
    let splitText = text.split(" ")
    let inform = []
    for (let i = 0; i < splitText.length; i++) {
      for (let j = 0; j < listOfFolders.length; j++)
      {
        let word = splitText[i]
        let folderNameSplit = listOfFolders[j].split(" ")
        for (let k = 0; k < folderNameSplit.length; k++) {
          let matchCheck =  levenshteinDistance(word.toLowerCase(),folderNameSplit[k].toLowerCase())
          if(matchCheck[0])
          {
            inform.push([listOfFolders[j],matchCheck[1]])
            break
          }
        }
      } 
    }
    let sortedData = inform.sort((a, b) => (a[1] - b[1]))
    let others = listOfFolders.filter((folder) => (folder.toLowerCase().includes(text)))
    let returnArr = []
    for(let i = 0; i < sortedData.length; i++)
    {
      if(!returnArr.includes(sortedData[i][0]))
      {
        returnArr.push(sortedData[i][0])
      }
    }
    for(let i = 0; i < others.length; i++)
    {
      if(!returnArr.includes(others[i]))
      {
        returnArr.push(others[i])
      }
    }
    return returnArr
}

