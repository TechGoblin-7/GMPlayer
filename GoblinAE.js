//State
const playlist = [];
let currentTrackIndex = 0;

let repeatMode = "all"; //value: "off", "all", "one"
let shuffleMode = false;

let sleepTimer = null;
let sleepTimeRemaining = 0;
let sleepActive = false;

let playlistVisible = true;

//DOM Elements
const audio = document.getElementById('audio')
const fileInput = document.getElementById('fileInput');

const playPause = document.getElementById('playPause');
const stop = document.getElementById('stop');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const status = document.getElementById('status');
//The Clickable area for the progress bar
const nowPlaying = document.getElementById("nowPlaying");
const timeDisplay = document.getElementById("timeDisplay");

const progressContainer = document.getElementById('progressContainer');
//the inner fill that fills/grows as the song progresses
const progress = document.getElementById('progress');

const volume = document.getElementById("volume");
const muteBtn = document.getElementById('mute');

const playlistToggleBtn = document.getElementById("playlistToggle");
const playlistContainer = document.getElementById("playlistContainer");

const sleepSelect = document.getElementById("sleepSelect");
const sleepStatus = document.getElementById("sleepStatus");



//INIT(startup Logic)
function init() {
    loadPlaylistVisibility();
    updatePlaylistUI();
}

init();

function loadPlaylistVisibility() {
    //local storage save state 
    const saveState = localStorage.getItem("playlistVisible");

    if (saveState !== null) {
    playlistVisible = saveState === "true";
    }

}

//UI Helper
function updatePlaylistUI() {

    playlistContainer.classList.toggle("hidden", !playlistVisible);

    playlistToggleBtn.textContent = playlistVisible
        ?"Hide Playlist"
        :"Show Playlist";
}

//CORE PLAYER FUNCTIONS

function loadTrack(index) {

    const track = playlist[index];

    if(track) {
        audio.src = track.url;
        status.textContent = `Loaded: ${track.name}`;
        updateNowPlaying(track);
        highlightActive();
    }
}

function playTrack(index) {
    const track = playlist[index]

    audio.src = track.url;
    audio.play();

    currentTrackIndex = index;
    status.textContent = `Playing: ${track.name}`;

    updateNowPlaying(track);

    highlightActive();
}

audio.addEventListener("timeupdate", function () {

    if (audio.duration) {

        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${progressPercent}%`;

        //Time Display Update
        timeDisplay.textContent = 
            `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
});


// Load audio files
fileInput.addEventListener("change", function() {
    const files = Array.from(this.files);

    files.forEach(file => {
        const url = URL.createObjectURL(file);

        playlist.push({
            name: file.name,
            url: url
        });

        //Set current track 
        if (playlist.length === files.length) {
            currentTrackIndex = 0;
            loadTrack(currentTrackIndex);
        }

        
    });


    
    renderPlaylist();
    status.textContent = `${playlist.length} song(s) loaded`;

    updateNowPlaying(playlist[currentTrackIndex]);
    
});

function savePlaylistVisibility() {
    localStorage.setItem("playlistVisible", playlistVisible);
}

playlistToggleBtn.addEventListener("click", () => {
    playlistVisible = !playlistVisible;

    savePlaylistVisibility();
    updatePlaylistUI();

});






function renderPlaylist() {
    const list = document.getElementById("playlist");
    list.innerHTML = "";

    playlist.forEach((track, index) => {
        const li = document.createElement("li");
        li.textContent = track.name;

        li.addEventListener("click", () => {
            playTrack(index);
        
        });

        list.appendChild(li);
    });
}



function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}



function updateNowPlaying(track) {

    if(track) {
        nowPlaying.textContent = `Now Playing: ${track.name}`;
    } else {
        nowPlaying.textContent = "No Song Playing";
    }
}


function highlightActive() {

    const items = document.querySelectorAll("#playlist li");

    items.forEach((item, index) => {

        const isActive = index === currentTrackIndex;

        item.classList.toggle("active-track", isActive);

        if (isActive) {
            item.scrollIntoView({ block: "nearest", behavior: "smooth"});
        }
    });

}

//volume function

volume.addEventListener("input", function () {
    audio.volume = this.value / 100;

    //unmute when slider is Ajusted
    if (audio.muted && audio.volume > 0) {
        audio.muted = false;
        muteBtn.textContent = "🔊";
    }
});

//playPause button functionality
playPause.addEventListener("click", function() {
    if(audio.src) {

        if(audio.paused) {
            audio.play();
            playPause.textContent = "Pause";
            status.textContent = "Playing";
        } else {
            audio.pause();
            playPause.textContent = "Play";
            status.textContent = "Paused";
        }
    }
});

//mute button functions

muteBtn.addEventListener("click", function() {

    //Toggle mute active state
    audio.muted = !audio.muted;

    //update icon
    if (audio.muted) {
        muteBtn.textContent = '🔇';
    } else {
        muteBtn.textContent = '🔊';
    }
});
    


//stop button functionality

stop.addEventListener("click", function() {
    audio.pause();
    audio.currentTime = 0;
    status.textContent = "Stopped";
});
    // The stop button pauses the audio and resets the current time to 0, effectively stopping the playback and allowing it to be played again from the beginning. It also updates the status to "Stopped".

   


    //Previous Button Functions

    prevBtn.addEventListener("click", function () {

        // If song is more then 3 Sec in restart song
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }
        // otherwise go to prev track
        currentTrackIndex--;

        if (currentTrackIndex < 0) {
            currentTrackIndex = playlist.length -1;//loop to end
        }

        loadTrack(currentTrackIndex);
        audio.play();

        highlightActive();
        
    });

    //Next Button functions

    nextBtn.addEventListener("click", function() {

        if (shuffleMode) {
            currentTrackIndex = getRandomTrackIndex();
        } else {

            currentTrackIndex++;

            //loop back to start if at end
            if (currentTrackIndex >= playlist.length) {
                currentTrackIndex = 0;
            }
        }

        loadTrack(currentTrackIndex);
        audio.play()

        highlightActive();

    });

    const repeatBtn = document.getElementById("repeat");


//loop settings


    repeatBtn.addEventListener("click", function () {

        if (repeatMode === "off") {
            repeatMode = "all";
            repeatBtn.textContent = "🔁 All"
        }
        else if (repeatMode === "all") {
            repeatMode = "one";
            repeatBtn.textContent = "🔁 One"
        }

        else {
            repeatMode = "off";
            repeatBtn.textContent = "🔁 Off"
        }
    });

    audio.addEventListener("ended", function() {

        if (sleepActive) {
            sleepActive = false;
            return;
        }

        if (repeatMode === "one") {
            audio.currentTime = 0;
            audio.play();
            return;
        }

        if (shuffleMode) {
            currentTrackIndex = getRandomTrackIndex();
        }

        else if (repeatMode === "all") {
             currentTrackIndex++;
             
             if (currentTrackIndex >= playlist.length) {
                currentTrackIndex = 0;
             }
        }

        else {
            
            playPause.textContent = "Play";
            status.textContent = "Finished";
            return;
        }

        loadTrack(currentTrackIndex);
             audio.play();
    });

    //shuffle settings
    const shuffleBtn = document.getElementById("shuffle");

    shuffleBtn.addEventListener("click", function () {

        shuffleMode = !shuffleMode;

        if (shuffleMode) {
            shuffleBtn.textContent = "🔀 On";
        } else {
            shuffleBtn.textContent = "🔀 Off";
        }
    });

    function getRandomTrackIndex() {

        if (playlist.length <= 1) return 0;

        let newIndex;

        do {
            newIndex = Math.floor(Math.random() * playlist.length);
        } while (newIndex === currentTrackIndex);

        return newIndex;
    };

    progressContainer.addEventListener("click", function(e) {
        // Total width of the progress container
        const width = this.clientWidth;
        //Where the user clicked within the container
        const clickX = e.offsetX;
        // Total duration of the audio
        const duration = audio.duration;
        //Convert the click position to a time in the audio
        audio.currentTime = (clickX / width) * duration;
    });

    //This event listener allows the user to click on the progress bar to seek to a different part of the audio. It calculates where the user clicked relative to the width of the progress container and sets the currentTime of the audio accordingly, allowing for interactive seeking through the track.

    sleepSelect.addEventListener("change", function () {

        //clear any existing timer
        if (sleepTimer) {
            clearInterval(sleepTimer);
        }

        const minutes = parseInt(this.value);

        if (minutes === 0) {
            sleepStatus.textContent = "";
            return;
        }

        sleepTimeRemaining = minutes * 60;

        sleepStatus.textContent = `Sleep in ${minutes}:00`;

        sleepTimer = setInterval(() => {

            sleepTimeRemaining--;

            const mins = Math.floor(sleepTimeRemaining / 60);
            const secs = sleepTimeRemaining % 60;

            sleepStatus.textContent =
               `Sleep in ${mins}:${secs < 10 ? "0" : ""}${secs}`;

            if (sleepTimeRemaining <= 0) {
                clearInterval(sleepTimer);

                sleepActive = true;

                audio.pause();
                audio.currentTime = 0;

                playPause.textContent = "Play";
                status.textContent = "Sleep Timer Activated"

                sleepStatus.textContent = "😴 Playback StzzzZZZZzzz...";
            }
        }, 1000);
    });

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () =>{
            navigation.serviceWorker.register("sw.js")
            .then(() => console.log("SW registered"))
            .catch(err => console.log("SW error", err));
    });
    }