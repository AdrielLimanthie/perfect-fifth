import { Note, TimedChord } from "./types";

type EmptyChord = {
  chord: "-";
  value: number;
};

export function displaySong(melody: Note[], chordProgression: TimedChord[]) {
  const chordsByBar: (TimedChord | EmptyChord)[][] = [];
  let time = 0,
    bar: (TimedChord | EmptyChord)[] = [];
  chordProgression.forEach((chord) => {
    const newTime = time + chord.value;
    bar.push(
      newTime <= 1
        ? chord
        : {
            ...chord,
            value: chord.value - newTime + 1,
          }
    );
    time += chord.value;

    while (time >= 1) {
      time -= 1;
      chordsByBar.push(bar);
      bar = time === 0 ? [] : [createEmptyChord(Math.min(time, 1))];
    }
  });
  if (bar.length > 0) {
    chordsByBar.push(bar);
  }

  const notesByBar: Note[][] = [];
  let noteBar: Note[] = [];
  time = 0;
  melody.forEach((note) => {
    const newTime = time + note.value;
    noteBar.push(
      newTime <= 1
        ? note
        : {
            ...note,
            value: note.value - newTime + 1,
          }
    );
    time += note.value;

    while (time >= 1) {
      time -= 1;
      notesByBar.push(noteBar);
      noteBar = time === 0 ? [] : [createEmptyNote(Math.min(time, 1))];
    }
  });
  if (noteBar.length > 0) {
    notesByBar.push(noteBar);
  }

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexWrap = "wrap";

  let i = 0;
  while (i < chordsByBar.length) {
    const chordBar = chordsByBar[i];
    const noteBar = notesByBar[i];

    const chordBarElement = document.createElement("div");
    chordBarElement.style.display = "flex";

    chordBar.forEach((chord) => {
      const chordElement = document.createElement("div");
      chordElement.style.boxSizing = "border-box";
      chordElement.style.padding = "2px 4px 4px";
      chordElement.style.fontSize = "24px";
      chordElement.style.fontWeight = "600";
      chordElement.style.width = `${40 * 8 * chord.value}px`;
      chordElement.textContent = chord.chord;
      chordBarElement.appendChild(chordElement);
    });

    const noteBarElement = document.createElement("div");
    noteBarElement.style.display = "flex";

    noteBar.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.style.boxSizing = "border-box";
      noteElement.style.padding = "2px 4px 4px";
      noteElement.style.fontSize = "24px";
      noteElement.style.width = `${40 * 8 * note.value}px`;
      noteElement.textContent = note.pitch;
      noteBarElement.appendChild(noteElement);
    });

    const barElement = document.createElement("div");
    barElement.style.marginBottom = "20px";
    barElement.style.padding = "4px 10px";
    barElement.style.borderRight = "1px solid #222";
    barElement.appendChild(chordBarElement);
    barElement.appendChild(noteBarElement);

    container.appendChild(barElement);

    i++;
  }

  return container;
}

function createEmptyChord(value: number): EmptyChord {
  return {
    chord: "-",
    value,
  };
}

function createEmptyNote(value: number): Note {
  return {
    pitch: "rest",
    value,
  };
}
