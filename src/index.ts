import * as Tone from "tone";
import getChordProgression2 from "./get-chord-progression-2";
import { playTimedChord, playMelody } from "./tone-utils";
import { MELODY_OPTIONS } from "./melodies";
import { displaySong } from "./display-utils";

const chordSynth = new Tone.PolySynth().toDestination();
const melodySynth = new Tone.FMSynth().toDestination();

let melodyIndex = 0;
let chordProgression = getChordProgression2(MELODY_OPTIONS[melodyIndex].data);

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
      chordProgression = getChordProgression2(MELODY_OPTIONS[melodyIndex].data);
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
  root.appendChild(chordDisplay);
};
