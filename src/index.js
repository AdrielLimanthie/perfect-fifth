import getChordProgression from "./get-chord-progression";
import * as Tone from "tone";

const INITIAL_MELODY = [
  {
    // C Chord
    pitch: "C4",
    value: 0.125,
  },
  {
    pitch: "E4",
    value: 0.125,
  },
  {
    pitch: "F4",
    value: 0.125,
  },
  {
    pitch: "E4",
    value: 0.125,
  },
  {
    pitch: "G4",
    value: 0.5,
  },
  {
    // F Chord
    pitch: "F4",
    value: 0.125,
  },
  {
    pitch: "E4",
    value: 0.125,
  },
  {
    pitch: "F4",
    value: 0.125,
  },
  {
    pitch: "E4",
    value: 0.125,
  },
  {
    pitch: "D4",
    value: 0.5,
  },
];

const chordProgression = getChordProgression(INITIAL_MELODY);

console.log("Chords", chordProgression);

const chordSynth1 = new Tone.Synth().toDestination();
const chordSynth2 = new Tone.Synth().toDestination();
const chordSynth3 = new Tone.Synth().toDestination();

chordProgression.forEach((chord, index) => {
  if (!chord) {
    return;
  }
  chordSynth1.triggerAttackRelease(
    chord.notes[0] + "3",
    "1n",
    `${index}:0`,
    0.5
  );
  chordSynth2.triggerAttackRelease(
    chord.notes[1] + "3",
    "1n",
    `${index}:0`,
    0.5
  );
  chordSynth3.triggerAttackRelease(
    chord.notes[2] + "3",
    "1n",
    `${index}:0`,
    0.5
  );
});
