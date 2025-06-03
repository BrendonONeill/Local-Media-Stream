const grid = document.querySelector(".folder-grid")

async function fetchFolder()
{
    const res = await fetch("/folder")
    const data = await res.json()
    console.log(data)
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

