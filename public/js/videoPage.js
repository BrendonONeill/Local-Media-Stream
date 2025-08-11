    "use strict"
    let vid = document.querySelector("video")
    let track = document.querySelector("track")

    let test = window.location.pathname.split("/")
    track.src = `/v/sub/${test[2]}/1`
    vid.src = `/v/video/${test[2]}/1`
    vid.load()

    console.log(vid.textTracks)

    async function getButtonsAmount()
    {
        let res = await fetch(`/folder/content/${test[2]}`);
        let data = await res.json();
        createButtons(data)
    }

    function createButtons(data){
        let grid = document.querySelector(".button-grid")
        for (let i = 0; i < data; i++) {
            let button = document.createElement("button")
            button.classList.add("video-button")
            button.textContent = i + 1
            grid.append(button)
        }

        let buttons = document.querySelectorAll("button")
        buttons.forEach((button) => {
            button.addEventListener("click", (e) => {
                e.preventDefault()
                fetchVideo(e.target.textContent)
            })
        })
    }

    function fetchVideo(number)
    {
        track.src = `/v/sub/${test[2]}/${number}`
        vid.src = `/v/video/${test[2]}/${number}`
        vid.load()
    }

    getButtonsAmount()
