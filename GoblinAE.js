const playlist = [];
let currentTrackIndex = 0;
const fileInput = document.getElementById('fileInput');
const audio = document.getElementById('audio')
const playPause = document.getElementById('playPause');
const stop = document.getElementById('stop');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const status = document.getElementById('status');
//The Clickable area for the progress bar
const progressContainer = document.getElementById('progressContainer');
//the inner fill that fills/grows as the song progresses
const progress = document.getElementById('progress');
const nowPlaying = document.getElementById("nowPlaying");
const volume = document.getElementById("volume");
const muteBtn = document.getElementById('mute');
const timeDisplay = document.getElementById("timeDisplay");
let repeatMode = "off"; //value: "off", "all", "one"
let shuffleMode = false;



// Load audio files
fileInput.addEventListener("change", function() {
    const files = Array.from(this.files);

    files.forEach(file => {
        const url = URL.createObjectURL(file);

        playlist.push({
            name: file.name,
            url: url
        });

        //Set current track to the newest entry
        currentTrackIndex = playlist.length -1;

        loadTrack(currentTrackIndex);
    });
    
    renderPlaylist();
    status.textContent = `${playlist.length} song(s) loaded`;

    updateNowPlaying(playlist[currentTrackIndex]);
    
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

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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

    //This event listener updates the progress bar as the audio plays
    audio.addEventListener("timeupdate", function() {
        //audio.duration is the total length of the audio in seconds, and audio.currentTime is the current playback position in seconds. By dividing currentTime by duration, we get a value between 0 and 1 that represents how much of the audio has been played. Multiplying by 100 converts this to a percentage, which we can use to set the width of the progress bar.
        //audio.currentTime is the current playback position in seconds, and audio.duration is the total length of the audio in seconds. By dividing currentTime by duration, we get a value between 0 and 1 that represents how much of the audio has been played. Multiplying by 100 converts this to a percentage, which we can use to set the width of the progress bar.
    
        if(audio.duration) {
            // Calculate the percentage of the audio that has been played
            const progressPercent = (audio.currentTime / audio.duration) * 100;

            // Example:
            //currentTime = 30 seconds, duration = 120 seconds
            //progressPercent = (30 / 120) * 100 = 25%

            //set the width of the progress bar to reflect the current playback position
            progress.style.width = `${progressPercent}%`;

            //Example:
            // "25%" will set the width of the progress bar to 25% of its container, visually indicating that 25% of the audio has been played.
        }
    });

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