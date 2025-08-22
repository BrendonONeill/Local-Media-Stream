 "use strict"

const grid = document.querySelector(".folder-grid")
const filterInput = document.querySelector(".name-filter")
const cardFilters = document.querySelectorAll(".button-filter")

const series = document.querySelector(".series")
const movies = document.querySelector(".movies")
const youtube = document.querySelector(".youtube")
const anime = document.querySelector(".anime")
const kids = document.querySelector(".kids")
let text = ""
let cards = ""
const columns = 6;

document.body.addEventListener("keydown", (e) => { 
    if(e.key == "ArrowDown" || e.key == "ArrowUp" || e.key == "ArrowRight" || e.key == "ArrowLeft")
    {
      
        if (document.activeElement === document.body || document.activeElement === null) 
        {
            e.preventDefault()
            cards[0].focus()
        }
    }
})


const typeFilter = 
{
    series: false,
    movies: false,
    youtube: false,
    kids: false,
    anime: false
}

async function fetchFolder()
{
    const res = await fetch("/folder")
    const data = await res.json()
    grid.innerHTML = ""
    generateFolder(data.folders,data)
}

async function generateFolder(folders, data)
{
    
    for (let i = 0; i < folders.length; i++) {
        const card = document.createElement("a")
        card.href = `/v/${folders[i]}`
        card.classList.add("folder-card")
        const types = arrayOfTypes(data[folders[i]].types)
        const typesContainer = document.createElement('div')
        typesContainer.classList.add("types-container")
        typesContainer.innerHTML = types.map((type) => (type)).join("");
        const langContainer = document.createElement('div');
        langContainer.classList.add("lang-container");
        langContainer.innerHTML = `<p class="types"><img src="images/ENG.svg" alt="My Image" width="20" height="20"></p>`;
        const cardContent = 
        `
        <img src="/folder/image/${folders[i]}" alt="My Image" width="400">
        <div class="name-container"> 
        <p>${folders[i].replace(/_/g, " ")}</p>
        </div>
        `
        card.innerHTML = cardContent
        card.appendChild(typesContainer)
        card.appendChild(langContainer)
        grid.append(card)
    }
    cards = grid.querySelectorAll(".folder-card")
    tabSelect([filterInput,...cardFilters,...cards])
}

function tabSelect(tabOptions)
{
    tabOptions.forEach((tab, index) => {
    tab.addEventListener("keydown", (e) => {
      let ArrowKeys = ["ArrowUp","ArrowRight","ArrowDown", "ArrowLeft"]
      if(!ArrowKeys.includes(e.key))
      {
        return
      }
      let newIndex = index;
      if(newIndex == 0)
      {
        switch (e.key) {
        case "ArrowDown":
          newIndex = (index + 1) % tabOptions.length;
          break;
        case "ArrowUp":
          newIndex = (tabOptions.length - 1) % tabOptions.length;
          break;
        default:
          return; // Ignore other keys
      }
      }
      else if(newIndex > 0 && newIndex < 6)
      {
        switch (e.key) {
        case "ArrowRight":
          newIndex = (index + 1) % tabOptions.length;
          break;
        case "ArrowLeft":
          newIndex = (index - 1 + tabOptions.length) % tabOptions.length;
          break;
        case "ArrowDown":
          newIndex = (6) % tabOptions.length;
          break;
        case "ArrowUp":
          newIndex = (0) % tabOptions.length;
          break;
        default:
          return; // Ignore other keys
      }
      }
      else if(newIndex > 5 && newIndex < 12)
      {
        switch (e.key) {
        case "ArrowRight":
          newIndex = (index + 1) % tabOptions.length;
          break;
        case "ArrowLeft":
          newIndex = (index - 1 + tabOptions.length) % tabOptions.length;
          break;
        case "ArrowDown":
          newIndex = (index + columns) % tabOptions.length;
          break;
        case "ArrowUp":
          newIndex = (1) % tabOptions.length;
          break;
        case "Enter":
          document.activeElement.click();
          break;
        default:
          return; // Ignore other keys
      }
      }
      else
      {
        switch (e.key) {
        case "ArrowRight":
          newIndex = (index + 1) % tabOptions.length;
          break;
        case "ArrowLeft":
          newIndex = (index - 1 + tabOptions.length) % tabOptions.length;
          break;
        case "ArrowDown":
          newIndex = (index + columns) % tabOptions.length;
          break;
        case "ArrowUp":
          newIndex = (index - columns + tabOptions.length) % tabOptions.length;
          break;
        case "Enter":
          document.activeElement.click();
          break;
        default:
          return; // Ignore other keys
      }
      } 
      tabOptions[newIndex].focus();
      e.preventDefault(); // Prevent page scroll
    });
  });
}

function arrayOfTypes(data)
{
    let arr = []
    if(data["series"])
    { 
        arr.push(`<p class="types"><img src="images/series-d.svg" alt="My Image" width="20" height="20"></p>`)
    }
    if(data.movie)
    { 
        arr.push(`<p class="types"><img src="images/movie-d.svg" alt="My Image" width="20" height="20"></p>`)
    }
    if(data.anime)
    { 
        arr.push(`<p class="types"><img src="images/anime-d.svg" alt="My Image" width="20" height="20"></p>`)
    }
    if(data.kids)
    { 
        arr.push(`<p class="types"><img src="images/kid-d.svg" alt="My Image" width="20" height="20"></p>`)
    }
    if(data.youtube)
    { 
        arr.push(`<p class="types"><img src="images/youtube-d.svg" alt="My Image" width="20" height="20"></p>`)
    }
    return arr
}

fetchFolder()





async function filterFetch(text)
{
    const res = await fetch(`/folder/filter/${text}`, {method: "POST",body: JSON.stringify({types:typeFilter}), headers: {
        "content-type" : "application/json"
    }})
    const data = await res.json()
    grid.innerHTML = ""
    generateFolder(data.folders, data.content)
}


filterInput.addEventListener("input", (e) => {
    if(e.target.value != "")
    {
        text = e.target.value
        filterFetch(e.target.value)
    }
    else
    {
        fetchFolder()
    }
})

series.addEventListener("click", async ()=>{
    if(typeFilter.series)
    {typeFilter.series = false; series.classList.remove("active"); await filterFetch(text);}
    else
    { typeFilter.series = true;series.classList.add("active"); await filterFetch(text);}
})

movies.addEventListener("click", async ()=>{
    if(typeFilter.movies)
    {typeFilter.movies = false; movies.classList.remove("active"); await filterFetch(text);}
    else
    { typeFilter.movies = true; movies.classList.add("active"); await filterFetch(text);}
})

youtube.addEventListener("click", async ()=>{
    if(typeFilter.youtube)
    {typeFilter.youtube = false; youtube.classList.remove("active"); await filterFetch(text);}
    else
    { typeFilter.youtube = true; youtube.classList.add("active"); await filterFetch(text);}
})

anime.addEventListener("click", async () =>{
    if(typeFilter.anime)
    {typeFilter.anime = false; anime.classList.remove("active"); await filterFetch(text);}
    else
    { typeFilter.anime = true; anime.classList.add("active"); await filterFetch(text);}
})

kids.addEventListener("click", async ()=>{
    if(typeFilter.kids)
    {typeFilter.kids = false; kids.classList.remove("active"); await filterFetch(text);}
    else
    { typeFilter.kids = true; kids.classList.add("active"); await filterFetch(text);}
})

