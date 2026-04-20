const fileInput = document.getElementById('fileInput');
const audio = document.getElementById('audio');
const playPause = document.getElementById('playPause');
const stop = document.getElementById('stop');
const status = document.getElementById('status');

// Load audio file
fileInput.addEventListener("change", function() {
    const file = this.files[0];

// this.files[0] means this = file input element, files = list of selected files,
// [0] = first file (since we only allow one file to be selected)
    if(file) {
        const url = URL.createObjectURL(file);

        //This creates a temporary URL for the selected file, allowing us to play it without uploading it anywhere.

        audio.src = url;
        // sets audio to that url, so it can be played

        status.textContent = `Loaded: ${file.name}`;
        // updates status to show the name of the loaded file
    console.log(`Loaded file: ${file.name}`);
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
    


//stop button functionality

    stop.addEventListener("click", function() {
    audio.pause();
    audio.currentTime = 0;
    status.textContent = "Stopped";
    });
    // The stop button pauses the audio and resets the current time to 0, effectively stopping the playback and allowing it to be played again from the beginning. It also updates the status to "Stopped".