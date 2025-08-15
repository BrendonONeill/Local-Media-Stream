    "use strict"

    let vid = document.querySelector("video")
    let track = document.querySelector("track")

    let videoName = window.location.pathname.split("/")
    let episodes = 1
    let timestamp = 0

    async function getButtonsAmount()
    {
        let res = await fetch(`/folder/content/${videoName[2]}`);
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
                episodes = e.target.textContent
                fetchVideo(e.target.textContent)
            })
        })
    }

    function fetchVideo(number)
    {
        track.src = `/v/sub/${videoName[2]}/${number}`
        vid.src = `/v/video/${videoName[2]}/${number}`
        vid.load()
    }

    function setUp()
    {
        const showName = window.location.pathname.split("/")[2];
        
        console.log(showName)
        const savedData = JSON.parse(localStorage.getItem(showName));
        if(savedData)
        {
            fetchVideo(savedData.eps)
            vid.currentTime = savedData.timestamp
        }
        else
        {
            track.src = `/v/sub/${videoName[2]}/1`
            vid.src = `/v/video/${videoName[2]}/1`
            vid.load()
        }
    }

    vid.addEventListener("timeupdate", () => {
    timestamp = vid.currentTime
    });
    getButtonsAmount()
    setUp()


window.addEventListener("beforeunload", function () {
    const showName = window.location.pathname.split("/")[2];
    const videoData = {
    name: showName,
    eps: episodes,
    timestamp: timestamp
  };

  localStorage.setItem(showName, JSON.stringify(videoData));
});

