import { CHORDS } from "./chords";
import { BaseNote, ChordName, Note, PitchLabel, TimedChord } from "./types";

const MEASURE_SIZE = 1; // 4/4
const MAX_BARS = 200; // 100 Bars

export default function getChordProgression(
  melody: Note[],
  baseKey: BaseNote
): TimedChord[] {
  const bars = getMelodyByBars(melody);
  let chordProgressions: TimedChord[] = [];

  bars.forEach((bar) => {
    const predictedChords = getChordsInBar(bar);
    chordProgressions = chordProgressions.concat(
      combineSameChords(predictedChords)
    );
  });

  return chordProgressions;
}

function getMelodyByBars(melody: Note[], barLength: number = 1): Note[][] {
  let beat = 0,
    bar: Note[] = [],
    bars: Note[][] = [];

  melody.forEach((note) => {
    const newTime = beat + note.value;
    bar.push(
      newTime <= barLength
        ? note
        : {
            ...note,
            value: note.value - newTime + barLength,
          }
    );
    beat += note.value;

    while (beat >= barLength) {
      beat -= barLength;
      bars.push(bar);
      bar =
        beat === 0
          ? []
          : [
              {
                pitch: note.pitch,
                value: Math.min(beat, barLength),
                isTiedNote: true,
              },
            ];
    }
  });
  if (bar.length > 0) {
    bars.push(bar);
  }
  return bars;
}

function getChordsInBar(melody: Note[]): TimedChord[] {
  const [fullBarChord, fullBarWeight] = getChordAndWeight(melody);
  const halfBars = getMelodyByBars(melody, 0.5);
  const halfBarChordsAndWeights = halfBars.map((bar, index) => {
    return getChordAndWeight(bar, {
      startingBeat: index / 2,
      valueDivider: 2,
    });
  });
  const totalHalfBarWeights = halfBarChordsAndWeights.reduce(
    (total, chordAndWeight) => {
      return total + chordAndWeight[1];
    },
    0
  );
  if (fullBarWeight >= totalHalfBarWeights) {
    return [fullBarChord];
  }

  return halfBarChordsAndWeights.map((chordAndWeight) => chordAndWeight[0]);
}

function getChordAndWeight(
  melody: Note[],
  options: {
    startingBeat: number;
    valueDivider: number;
  } = {
    startingBeat: 0,
    valueDivider: 1,
  }
): [TimedChord, number] {
  const chordWeights: Record<ChordName, number> = CHORDS.reduce(
    (weightTable, chord) => {
      weightTable[chord.chord] = 0;
      return weightTable;
    },
    {} as Record<ChordName, number>
  );
  let beat = options.startingBeat;
  melody.forEach((note) => {
    const weight = getBeatStrength(beat);
    const baseNote = getBaseNote(note.pitch);
    if (baseNote !== "rest") {
      CHORDS.forEach((chord) => {
        if (chord.notes.includes(baseNote)) {
          chordWeights[chord.chord] += weight;
        }
      });
    }
    beat += note.value;
  });
  return getChordWithHighestWeight(chordWeights, 1 / options.valueDivider);
}

function getBeatStrength(beat: number) {
  let divisor = 1,
    remainder = beat % divisor;
  while (remainder !== 0) {
    divisor /= 2;
    remainder %= divisor;
  }
  return divisor;
}

function getChordWithHighestWeight(
  chordWeights: Record<ChordName, number>,
  value: number
): [TimedChord, number] {
  let selectedChord: ChordName,
    highestWeight = 0;
  Object.keys(chordWeights).forEach((chordName: ChordName) => {
    if (chordWeights[chordName] > highestWeight) {
      selectedChord = chordName;
      highestWeight = chordWeights[chordName];
    }
  });
  const chord = CHORDS.find((c) => c.chord === selectedChord);
  return [
    {
      ...chord,
      value,
    },
    highestWeight,
  ];
}

function combineSameChords(chords: TimedChord[]): TimedChord[] {
  let modifiedChords: TimedChord[] = [];
  chords.forEach((chord, index) => {
    if (index === 0 || chord.chord !== chords[index - 1].chord) {
      modifiedChords.push(chord);
    } else {
      const lastIndex = modifiedChords.length - 1;
      modifiedChords[lastIndex] = {
        ...modifiedChords[lastIndex],
        value: modifiedChords[lastIndex].value + chord.value,
      };
    }
  });
  return modifiedChords;
}

function getBaseNote(pitch: PitchLabel | "rest"): BaseNote | "rest" {
  if (pitch === "rest") {
    return pitch;
  }
  return pitch.slice(0, pitch.length - 1) as BaseNote;
}
