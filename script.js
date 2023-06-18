const noteMap = [
  ["E4 ", "F4 ", "Gb4", "G4 ", "Ab4", "A4 ", "Bb4", "B4 ", "C5 "],
  ["B3 ", "C4 ", "Db4", "D4 ", "Eb4", "E4 ", "F4 ", "Gb4", "G4 "],
  ["G3 ", "Ab3", "A3 ", "Bb3", "B3 ", "C4 ", "Db4", "D4 ", "Eb4"],
  ["D3 ", "Eb3", "E3 ", "F3 ", "Gb3", "G3 ", "Ab3", "A3 ", "Bb3"],
  ["A2 ", "Bb2", "B2 ", "C3 ", "Db3", "D3 ", "Eb3", "E3 ", "F3 "],
  ["E2 ", "F2 ", "Gb2", "G2 ", "Ab2", "A2 ", "Bb2", "B2 ", "C3 "]
];

let soundFontUrl = "./sound/";
let currentChords = [];
let interval;
const bpmSlider = document.querySelector('#bpm-slider');
const bpmLabel = document.querySelector('#bpm-label');

bpmSlider.addEventListener('input', () => {
  bpmLabel.textContent = `BPM: ${bpmSlider.value}`;
});

function playChord(chord, rowIndex, noteIndex) {
  if (chord === "None") return;

  const currentChord = currentChords[rowIndex];
  if (currentChord) {
    currentChord.audio.pause();
    currentChord.audio.currentTime = 0;
    currentChord.button.classList.remove("playing");
    clearTimeout(currentChord.timeout);
    currentChord.button.offsetWidth; // Trigger reflow to restart animation
  }

  const audio = new Audio(soundFontUrl + chord.trim() + ".mp3");
  audio.play();

  const noteButton = document.querySelector(`#note-${rowIndex}-${noteIndex}`);
  noteButton.classList.add("playing");

  const uniqueId = `${rowIndex}-${noteIndex}`;
  const timeout = setTimeout(() => {
    noteButton.classList.remove("playing");
  }, 1000);

  currentChords[rowIndex] = { audio, button: noteButton, id: uniqueId, timeout };
}

function playSongChords(chords) {
  const songChords = chords.split(",").map(chord => chord.trim());
  let chordIndex = 0;

  interval = setInterval(() => {
    const chord = songChords[chordIndex];
    if (chord === "None") {
      chordIndex = (chordIndex + 1) % songChords.length;
      return;
    }

    let chordNotes = chord.split('').reverse();

    for (let i = 0; i < chordNotes.length; i++) {
      if (chordNotes[i] !== "X") {
        let noteIndex = parseInt(chordNotes[i]);
        playChord(noteMap[i][noteIndex], i, noteIndex);
      }
    }

    chordIndex = (chordIndex + 1) % songChords.length;

  }, 60000 / bpmSlider.value);
}

function createNoteButtons() {
  const grid = document.querySelector("#grid");
  noteMap.forEach((row, rowIndex) => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    row.forEach((note, noteIndex) => {
      const button = document.createElement("button");
      button.id = `note-${rowIndex}-${noteIndex}`;
      button.textContent = note.trim();
      button.addEventListener("click", () => playChord(note, rowIndex, noteIndex));
      rowDiv.appendChild(button);
    });
    grid.appendChild(rowDiv);
  });
}

function createColumnLabels() {
  const columnLabels = document.querySelector("#column-labels");
  for (let i = 0; i < 9; i++) {
    const label = document.createElement("div");
    label.textContent = i;
    columnLabels.appendChild(label);
  }
}

const playButton = document.querySelector("#play-button");
const songDropdown = document.querySelector("#song-dropdown");

fetch("songs.json")
  .then((response) => response.json())
  .then((data) => {
    const songs = data.songs;

    songs.forEach((song, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.text = song.name;
      songDropdown.appendChild(option);
    });

    createColumnLabels();
    createNoteButtons();

    playButton.addEventListener("click", () => {
      if (interval) {
        clearInterval(interval);
      }

      const selectedIndex = songDropdown.value;
      const selectedSong = songs[selectedIndex];
      playSongChords(selectedSong.chords);
      highlightSongNotes(selectedSong.chords);
    });
  });

function highlightSongNotes(chords) {
  const songChords = chords.split(",").map(chord => chord.trim());
  const noteButtons = document.querySelectorAll("button");

  noteButtons.forEach(button => {
    button.style.outline = "none"; // Remove outline from all buttons
  });

  songChords.forEach(chord => {
    if (chord !== "None") {
      const chordNotes = chord.split('').reverse();

      for (let i = 0; i < chordNotes.length; i++) {
        if (chordNotes[i] !== "X") {
          let noteIndex = parseInt(chordNotes[i]);
          const noteButton = document.querySelector(`#note-${i}-${noteIndex}`);
          noteButton.style.outline = "2px solid black"; // Add outline to buttons played in the song
        }
      }
    }
  });
}
