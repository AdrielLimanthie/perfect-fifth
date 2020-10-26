import * as Tone from "tone";
import { PolySynth } from "tone";
import { Monophonic } from "tone/build/esm/instrument/Monophonic";
import { Chord, Note, TimedChord } from "./types";

export function getTimeFromValue(value: number) {
  const bar = Math.floor(value);
  const barRemainder = value % 1;
  const quarter = Math.floor(barRemainder / 0.25);
  const quarterRemainder = barRemainder % 0.25;
  const sixteenth = Math.floor(quarterRemainder / 0.0625);
  return `${bar}:${quarter}:${sixteenth}`;
}

export function playChord(chordSynth: PolySynth, chordProgression: Chord[]) {
  chordProgression.forEach((chord, index) => {
    if (!chord) {
      return;
    }

    chordSynth.triggerAttackRelease(
      chord.notes.map((note) => `${note}3`),
      "1n",
      `+${index}:0`,
      0.1
    );
  });

  Tone.start();
}

export function playTimedChord(
  chordSynth: PolySynth,
  chordProgression: TimedChord[]
) {
  let currentTime = 0;
  chordProgression.forEach((chord) => {
    if (!chord) {
      return;
    }

    const duration = getTimeFromValue(chord.value);
    const time = getTimeFromValue(currentTime);
    chordSynth.triggerAttackRelease(
      chord.notes.map((note) => `${note}3`),
      duration,
      `+${time}`,
      0.2
    );
    currentTime += chord.value;
  });

  Tone.start();
}

export function playMelody(synth: Monophonic<any>, melody: Note[]) {
  let currentTime = 0;
  melody.forEach((note) => {
    const duration = getTimeFromValue(note.value - 0.0625);
    const time = getTimeFromValue(currentTime);
    synth.triggerAttackRelease(note.pitch, duration, `+${time}`, 0.4);
    currentTime += note.value;
  });

  Tone.start();
}
