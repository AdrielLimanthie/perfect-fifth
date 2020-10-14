import getChordProgression from "./get-chord-progression";
import { playChord, playMelody } from "./tone-utils";
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
    // Dm Chord
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

const chordSynth = new Tone.PolySynth().toDestination();
const melodySynth = new Tone.FMSynth().toDestination();

playChord(chordSynth, chordProgression);
playMelody(melodySynth, INITIAL_MELODY);
