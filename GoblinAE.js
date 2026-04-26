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
        currentTrack = playlist.length -1;

        loadTrack(currentTrack);
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

function updateNowPlaying(track) {

    if(track) {
        nowPlaying.textContent = `Now Playing: ${track.name}`;
    } else {
        nowPlaying.textContent = "No Song Playing";
    }
}


function highlightActive() {
    const items = document.querySelectorAll("#playlist li");

    items.forEach((item, i) => {
        item.classList.toggle("active-track", i === currentTrackIndex);
    });

}

//volume function

volume.addEventListener("input", function () {
    audio.volume = this.value / 100;
})

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
        
    });

    //Next Button functions

    nextBtn.addEventListener("click", function() {

        console.log("Next clicked");
        console.log("Before:", currentTrackIndex, playlist.length);

        currentTrackIndex++;

        //loop back to start if at end
        if (currentTrackIndex >= playlist.length) {
            currentTrackIndex = 0;
        }

        console.log("After:", currentTrackIndex)

        loadTrack(currentTrackIndex);
        audio.play()

    });

     audio.addEventListener("ended", function() {
            nextBtn.click();
        });

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