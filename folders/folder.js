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
  
  let text = req.params.text
  let data = []
  
    data.push(content.folders.filter((folder) => (folder.toLowerCase().includes(req.params.text))))
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
  console.log("client",data)
  data = data.flat(2)
  res.json(data)
}



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