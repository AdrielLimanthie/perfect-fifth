import * as Tone from "tone";

export function getToneDurationFromValue(value) {
  switch (value) {
    case 1:
      return "1n";
    case 0.75:
      return "2n.";
    case 0.5:
      return "2n";
    case 0.375:
      return "4n.";
    case 0.25:
      return "4n";
    case 0.1875:
      return "8n.";
    case 0.125:
      return "8n";
  }
}

export function getTimeFromValue(value) {
  const bar = Math.floor(value / 1);
  const barRemainder = value % 1;
  const quarter = Math.floor(barRemainder / 0.25);
  const quarterRemainder = barRemainder % 0.25;
  const sixteenth = Math.floor(quarterRemainder / 0.0625);
  return `${bar}:${quarter}:${sixteenth}`;
}

export function playChord(chordSynth, chordProgression) {
  chordProgression.forEach((chord, index) => {
    if (!chord) {
      return;
    }

    chordSynth.triggerAttackRelease(
      chord.notes.map((note) => `${note}3`),
      "1n",
      `+${index}:0`,
      0.5
    );
  });

  Tone.start();
}

export function playMelody(synth, melody) {
  let currentTime = 0;
  melody.forEach((note) => {
    const duration = getToneDurationFromValue(note.value);
    const time = getTimeFromValue(currentTime);
    synth.triggerAttackRelease(note.pitch, duration, `+${time}`);
    currentTime += note.value;
  });

  Tone.start();
}
