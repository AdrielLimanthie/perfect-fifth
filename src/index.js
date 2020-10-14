import * as Tone from "tone";
import getChordProgression from "./get-chord-progression";
import { playChord, playMelody } from "./tone-utils";
import { MELODY_OPTIONS } from "./melodies";

const chordSynth = new Tone.PolySynth().toDestination();
const melodySynth = new Tone.FMSynth().toDestination();

let melodyIndex = 0;
let chordProgression = getChordProgression(MELODY_OPTIONS[melodyIndex].data);

window.onload = () => {
  const playMelodyButton = document.createElement("button");
  playMelodyButton.textContent = "Play Melody Only";
  playMelodyButton.style = "padding: 4px; margin-right: 4px";
  playMelodyButton.onclick = () => {
    playMelody(melodySynth, MELODY_OPTIONS[melodyIndex].data);
  };

  const playButton = document.createElement("button");
  playButton.textContent = "Play";
  playButton.style = "padding: 4px";
  playButton.onclick = () => {
    playChord(chordSynth, chordProgression);
    playMelody(melodySynth, MELODY_OPTIONS[melodyIndex].data);
  };

  const chordDisplay = document.createElement("div");
  chordDisplay.style = "margin-top: 10px; font-size: 24px; font-weight: 600";
  chordDisplay.textContent = chordProgression
    .map((chord) => chord.chord)
    .join("\t");

  const options = MELODY_OPTIONS.map((melody, index) => {
    const option = document.createElement("input");
    option.type = "radio";
    option.id = index;
    option.value = index;
    option.textContent = melody.name;
    option.defaultChecked = index === melodyIndex;
    option.name = "melody";
    option.style = "margin-bottom: 10px";
    option.onclick = () => {
      melodyIndex = index;
      chordProgression = getChordProgression(MELODY_OPTIONS[melodyIndex].data);
      chordDisplay.textContent = chordProgression
        .map((chord) => chord.chord)
        .join("\t");
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
  root.appendChild(chordDisplay);
};
