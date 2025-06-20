const grid = document.querySelector(".folder-grid")
const filterInput = document.querySelector(".name-filter")

const series = document.querySelector(".series")
const movie = document.querySelector(".movie")
const youtube = document.querySelector(".youtube")

let seriesActive = false
let movieActive = false
let youtubeActive = false

async function fetchFolder()
{
    const res = await fetch("/folder")
    const data = await res.json()
    grid.innerHTML = ""
    generateFolder(data)
}

async function generateFolder(data)
{
    let folders = data.folders
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
        <h3>${folders[i].replace(/_/g, " ")}</h3>
        </div>
        `
        card.innerHTML = cardContent
        card.appendChild(typesContainer)
        grid.append(card)
    }
}

function arrayOfTypes(data)
{
    console.log(data)
    let arr = []
    if(data["series"])
    { 
        arr.push(`<p class="types">Series</p>`)
    }
    if(data.movie)
    { 
        arr.push(`<p class="types">Movie</p>`)
    }
    if(data.anime)
    { 
        arr.push(`<p class="types">Anime</p>`)
    }
    if(data.kids)
    { 
        arr.push(`<p class="types">Kids</p>`)
    }
    if(data.youtube)
    { 
        arr.push(`<p class="types">YouTube</p>`)
    }
    return arr
}

fetchFolder()


filterInput.addEventListener("input", (e) => {
    if(e.target.value != "")
    {
        filterFetch(e.target.value)
    }
    else
    {
        fetchFolder()
    }
})


async function filterFetch(text)
{
    const res = await fetch(`/folder/filter/${text}`, {method: "POST",body: JSON.stringify({series: seriesActive, movie: movieActive, youtube: youtubeActive}), headers: {
        "content-type" : "application/json"
    }})
    const data = await res.json()
    grid.innerHTML = ""
    generateFolder(data)
}