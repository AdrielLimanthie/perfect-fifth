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

const MEASURE_SIZE = 1; // 4/4
const MAX_MEASURES = 2; // 2 Bars

function getChordProgression(melody) {
  const measures = divideMelodyByMeasures(melody);

  const chords = measures.map((measure) => {
    console.log("measure", measure);
    const weightedNotes = weighNotesFromMeasure(measure);
    return getChordFromNotes(weightedNotes);
  });

  return chords;
}

function divideMelodyByMeasures(melody) {
  let beat = 0,
    i = 0,
    measure = [],
    measures = [];
  while (beat < MAX_MEASURES && i < melody.length) {
    beat += melody[i].value;
    measure.push(melody[i]);
    if (beat % MEASURE_SIZE === 0) {
      measures.push(measure);
      measure = [];
    }
    i++;
  }
  return measures;
}

function weighNotesFromMeasure(measure) {
  const weightMap = {};
  for (const note of measure) {
    const pitch = getPitchWithoutOctave(note.pitch);
    if (weightMap[pitch]) {
      weightMap[pitch] = weightMap[pitch] + note.value;
    } else {
      weightMap[pitch] = note.value;
    }
  }
  return Object.keys(weightMap)
    .map((pitch) => ({
      pitch,
      weight: weightMap[pitch],
    }))
    .sort((a, b) => b.weight - a.weight);
}

function getPitchWithoutOctave(pitch) {
  return pitch.slice(0, pitch.length - 1);
}

const CHORDS = [
  {
    chord: "C",
    notes: ["C", "E", "G"],
  },
  {
    chord: "G",
    notes: ["G", "B", "D"],
  },
  {
    chord: "F",
    notes: ["F", "A", "C"],
  },
  {
    chord: "Am",
    notes: ["A", "C", "E"],
  },
  {
    chord: "Em",
    notes: ["E", "G", "B"],
  },
  {
    chord: "Dm",
    notes: ["D", "F", "A"],
  },
  {
    chord: "Bdim",
    notes: ["B", "D", "F"],
  },
];

// const TRIAD_INDEX_PRIORITY = [[0, 1, 2]];

function getChordFromNotes(weightedNotes) {
  // console.log("weightedNotes", weightedNotes);
  if (weightedNotes.length === 1) {
    for (const chord of CHORDS) {
      // When there is only 1 note, pick the chord with the same base note
      const firstNote = chord.notes[0];
      if (weightedNotes[0].pitch === firstNote) {
        return chord;
      }
    }
  } else if (weightedNotes.length === 2) {
    for (const chord of CHORDS) {
      // Simplified detection of 2 notes, more likely to choose major over minor chords
      if (
        chord.notes.includes(weightedNotes[0].pitch) &&
        chord.notes.includes(weightedNotes[1].pitch)
      ) {
        return chord;
      }
    }
  } else {
    const triadIndex = [0, 1, 2];
    const triad = triadIndex.map((index) => weightedNotes[index].pitch);
    let found = false;
    for (const chord of CHORDS) {
      if (
        chord.notes.includes(triad[0]) &&
        chord.notes.includes(triad[1]) &&
        chord.notes.includes(triad[2])
      ) {
        found = true;
        return chord;
      }
    }

    if (!found) {
      console.log("recursion");
      return getChordFromNotes(
        weightedNotes.slice(0, Math.min(2, weightedNotes.length - 1))
      );
    }

    // Failed logic to match 3 chords
    // let i = 0,
    //   found = false;
    // while (!found && i < TRIAD_INDEX_PRIORITY.length) {
    //   const triadIndex = TRIAD_INDEX_PRIORITY[i];
    //   if (Math.max(...triadIndex) >= weightedNotes.length) {
    //     found = true;
    //   } else {
    //     const triad = triadIndex.map((index) => weightedNotes[index].pitch);
    //     for (const chord of CHORDS) {
    //       if (
    //         chord.notes.includes(triad[0]) &&
    //         chord.notes.includes(triad[1]) &&
    //         chord.notes.includes(triad[2])
    //       ) {
    //         found = true;
    //         return chord;
    //       }
    //     }
    //   }

    //   i++;
    // }
  }

  return;
}

console.log("Chords", getChordProgression(INITIAL_MELODY));
