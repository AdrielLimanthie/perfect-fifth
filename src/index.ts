import * as Tone from "tone";
import getChordProgression3 from "./get-chord-progression-3";
import { playTimedChord, playMelody } from "./tone-utils";
import { MELODY_OPTIONS } from "./melodies";
import { displaySong } from "./display-utils";

let melodyIndex = 0;
let chordProgression = getChordProgression3(
  MELODY_OPTIONS[melodyIndex].data,
  "C"
);
Tone.Transport.bpm.value = MELODY_OPTIONS[melodyIndex].bpm;

const chordSynth = new Tone.PolySynth().toDestination();
const melodySynth = new Tone.FMSynth().toDestination();

window.onload = () => {
  const playMelodyButton = document.createElement("button");
  playMelodyButton.textContent = "Play Melody Only";
  playMelodyButton.style.padding = "4px";
  playMelodyButton.style.marginRight = "4px";
  playMelodyButton.onclick = () => {
    playMelody(melodySynth, MELODY_OPTIONS[melodyIndex].data);
  };

  const playButton = document.createElement("button");
  playButton.textContent = "Play";
  playButton.style.padding = "4px";
  playButton.onclick = () => {
    playTimedChord(chordSynth, chordProgression);
    playMelody(melodySynth, MELODY_OPTIONS[melodyIndex].data);
  };

  const recalculateButton = document.createElement("button");
  recalculateButton.textContent = "Recalculate";
  recalculateButton.style.padding = "4px";
  recalculateButton.onclick = () => {
    getChordProgression3(MELODY_OPTIONS[melodyIndex].data, "C");
  };

  const chordDisplay = document.createElement("div");
  chordDisplay.style.marginTop = "10px";
  chordDisplay.appendChild(
    displaySong(MELODY_OPTIONS[melodyIndex].data, chordProgression)
  );

  const options = MELODY_OPTIONS.map((melody, index) => {
    const option = document.createElement("input");
    option.type = "radio";
    option.id = String(index);
    option.value = String(index);
    option.textContent = melody.name;
    option.defaultChecked = index === melodyIndex;
    option.name = "melody";
    option.style.marginBottom = "10px";
    option.onclick = () => {
      melodyIndex = index;
      chordProgression = getChordProgression3(
        MELODY_OPTIONS[melodyIndex].data,
        "C"
      );
      Tone.Transport.bpm.value = MELODY_OPTIONS[melodyIndex].bpm;
      chordDisplay.removeChild(chordDisplay.childNodes[0]);
      chordDisplay.appendChild(
        displaySong(MELODY_OPTIONS[melodyIndex].data, chordProgression)
      );
    };
    return option;
  });

  const root = document.getElementById("root");

  options.forEach((option) => {
    const div = document.createElement("div");
    div.appendChild(option);
    const label = document.createElement("label");
    label.textContent = option.textContent;
    label.htmlFor = option.id;
    div.appendChild(label);
    root.appendChild(div);
  });
  root.appendChild(playMelodyButton);
  root.appendChild(playButton);
  root.appendChild(recalculateButton);
  root.appendChild(chordDisplay);
};
