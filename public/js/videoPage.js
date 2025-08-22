    "use strict"

    let vid = document.querySelector("video")
    let track = document.querySelector("track")
    let tabOptions = []
    const columns = 8;
    let videoLength = 0;

    // video controls
    let videoPlay = document.querySelector("#play")
    let currentTimeRange = document.querySelector(".currentTime")
    let videoLengthRange = document.querySelector(".VideoTimeLength")
    let videoRange = document.querySelector("#range")
    let videoFullScreen = document.querySelector("#full")
    let videoSub = document.querySelector("#sub")
    let videoSpeed = document.querySelector("#speed")


    let videoName = window.location.pathname.split("/")
    let episodes = 1
    let timestamp = 0

    async function getButtonsAmount()
    {
        let res = await fetch(`/folder/content/${videoName[2]}`);
        let data = await res.json();
        createButtons(data)
    }

    function setUpTabs()
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
          newIndex = (1) % tabOptions.length;
          break;
        case "ArrowUp":
          newIndex = (6) % tabOptions.length;
          break;
        default:
          return; // Ignore other keys
      }
      }
      if(newIndex == 1)
      {
        switch (e.key) {
        case "ArrowRight":
          vid.currentTime = vid.currentTime + 10
          break;
        case "ArrowLeft":
          vid.currentTime = vid.currentTime - 10
          break;
        case "ArrowDown":
          newIndex = (2) % tabOptions.length;
          break;
        case "ArrowUp":
          newIndex = (0) % tabOptions.length;
          break;
        default:
          return; // Ignore other keys
      }
      }
      else if(newIndex > 1 && newIndex < 6)
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
          newIndex = (1) % tabOptions.length;
          break;
        default:
          return; // Ignore other keys
      }
      }
      else if(newIndex > 5 && newIndex < 14)
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
          newIndex = (2) % tabOptions.length;
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
      e.preventDefault();
    })
})
    }

    function createButtons(data){
        let grid = document.querySelector(".button-grid")
        for (let i = 0; i < data; i++) {
            let button = document.createElement("button")
            button.classList.add("video-ep")
            button.classList.add("video-button")
            button.textContent = i + 1
            grid.append(button)
        }

        let buttons = document.querySelectorAll(".video-ep")
        tabOptions.push(...buttons)
        buttons.forEach((button) => {
            button.addEventListener("click", (e) => {
                e.preventDefault()
                episodes = e.target.textContent
                fetchVideo(e.target.textContent)
            })
        })
        setUpTabs()
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
        const savedData = JSON.parse(localStorage.getItem(showName));
        if(savedData)
        {
            fetchVideo(savedData.eps)
            vid.currentTime = savedData.timestamp
            videoRange.value =  savedData.timestamp
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
    tabOptions.push(document.querySelector(".back-button"),videoRange,videoPlay,videoFullScreen,videoSub,videoSpeed)
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


videoPlay.addEventListener("click", (e) => {
    e.preventDefault()
    
    if(videoPlay.classList.contains("playing"))
    {
        videoPlay.classList.remove("playing")
        vid.pause()
        videoPlay.innerHTML = `<img src="/images/video_pause.svg" width="50" height="50" alt=""></img>`
    }
    else
    {
        videoPlay.classList.add("playing")
        videoPlay.innerHTML = `<img src="/images/video_play.svg" width="50" height="50" alt=""></img>`
        vid.play()
    }
    
})

videoFullScreen.addEventListener("click", (e) => {
    e.preventDefault()
    if (vid.requestFullscreen) {
        vid.requestFullscreen();
    }
})

vid.addEventListener("play", () => {
    videoPlay.classList.add("playing")
    videoPlay.innerHTML = `<img src="/images/video_pause.svg" width="50" height="50" alt=""></img>`
  });

vid.addEventListener("pause", () => {
    videoPlay.classList.remove("playing")
    videoPlay.innerHTML = `<img src="/images/video_play.svg" width="50" height="50" alt=""></img>`
  });

  
document.body.addEventListener("keydown", (e) => {
    if(e.key == "ArrowDown" || e.key == "ArrowUp" || e.key == "ArrowRight" || e.key == "ArrowLeft")
    {
      
        if (document.activeElement === document.body || document.activeElement === null) 
        {
            e.preventDefault()
            tabOptions[2].focus()
        }
    }

    if (document.fullscreenElement === vid) {
        switch (e.key) {
        case "ArrowRight":
          vid.currentTime = vid.currentTime + 10
          break;
        case "ArrowLeft":
          vid.currentTime = vid.currentTime - 10
          break;
        case "Enter":
          if(vid.paused)
          {
            vid.play()
          }
          else
          {
            vid.pause()
          }
          break;
        case "Escape":
          
          break;
        default:
          return; // Ignore other keys
      }
    }
})

function timeToString(time)
{
    let timeInSeconds = time
    let hour = Math.floor(timeInSeconds / 3600)
    timeInSeconds = timeInSeconds % 3600
    let min = Math.floor(timeInSeconds / 60)
    timeInSeconds = timeInSeconds % 60
    let seconds = Math.floor(timeInSeconds / 1)
    return `${hour < 10 ? "0"+hour : hour}:${min < 10 ? "0"+min : min}:${seconds < 10 ? "0"+seconds : seconds}`
}

vid.addEventListener("timeupdate", (e) => {
    
    currentTimeRange.textContent = timeToString(e.target.currentTime)
    videoRange.value =  e.target.currentTime
})

vid.addEventListener("loadedmetadata", (e) => {
    let value  = Math.floor(e.target.duration)
    let string = timeToString(value)
    videoLengthRange.textContent = string
    videoRange.setAttribute("max", value);
})


videoRange.addEventListener("change", (e) => {
    
    vid.currentTime = e.target.value
})
