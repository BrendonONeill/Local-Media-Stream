 "use strict"

const grid = document.querySelector(".folder-grid")
const filterInput = document.querySelector(".name-filter")

const series = document.querySelector(".series")
const movies = document.querySelector(".movies")
const youtube = document.querySelector(".youtube")
const anime = document.querySelector(".anime")
const kids = document.querySelector(".kids")
let text = ""


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
        card.href = `/media/${folders[i]}`
        card.classList.add("folder-card")
        const types = arrayOfTypes(data[folders[i]].types)
        const typesContainer = document.createElement('div')
        typesContainer.classList.add("types-container")
        typesContainer.innerHTML = types.map((type) => (type)).join("");
        const cardContent = 
        `
        <img src="/folder/image/${folders[i]}" alt="My Image" width="400">
        <div class="name-container"> 
        <p>${folders[i].replace(/_/g, " ")}</p>
        </div>
        `
        card.innerHTML = cardContent
        card.appendChild(typesContainer)
        grid.append(card)
    }
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