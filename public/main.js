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

async function generateFolder(folders)
{
    for (let i = 0; i < folders.length; i++) {
        const card = document.createElement("a")
        card.href = `/media/${folders[i]}`
        card.classList.add("folder-card")
        const cardContent = 
        `
        <img src="/folder/image/${folders[i]}" alt="My Image" width="400">
        <div class="name-container"> 
        <h3>${folders[i].replace(/_/g, " ")}</h3>
        </div>
        `
        card.innerHTML = cardContent
        grid.append(card)
    }
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