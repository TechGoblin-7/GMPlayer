const playlist = [];
const currentTrackIndex = 0;
const fileInput = document.getElementById('fileInput');
const audio = document.getElementById('audio')
const playPause = document.getElementById('playPause');
const stop = document.getElementById('stop');
const status = document.getElementById('status');



// Load audio files
fileInput.addEventListener("change", function() {
    const files = Array.from(this.files);

    files.forEach(file => {
        const url = URL.createObjectURL(file);

        playlist.push({
            name: file.name,
            url: url
        });
    });
    
    renderPlaylist();
    status.textContent = `${playlist.length} song(s) loaded`;
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

function playTrack(index) {
    const track = playlist[index]

    audio.src = track.url;
    audio.play();

    currentTrackIndex = index;
    status.textContent = `Playing: ${track.name}`;

    highlightActive();
}

function highlightActive() {
    const items = document.querySelectorAll("playlist li");

    items.forEach((item, i) => {
        item.classList.toggle("active-track", i === currentTrackIndex);
    });

}

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