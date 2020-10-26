import { CHORDS } from "./chords";
import { BaseNote, Chord, Note, PitchLabel, TimedChord } from "./types";

const MEASURE_SIZE = 1; // 4/4
const MAX_BARS = 100; // 100 Bars

export default function getChordProgression(melody: Note[]): TimedChord[] {
  let i = 0,
    currentBeat = 0,
    currentChord = CHORDS.find((chord) => chord.chord === "C"), // Set to base key chord
    chordProgression: TimedChord[] = [];

  for (i = 0; i < melody.length; i++) {
    const note = melody[i];
    const baseNote = getBaseNote(note.pitch);
    if (
      baseNote === "rest" ||
      currentChord.notes.includes(baseNote) ||
      !isStrongBeat(currentBeat) ||
      isPassingOrNeighborNote(melody.slice(i), currentChord, currentBeat)
    ) {
      // Keep the same chord
    } else {
      const possibleNextChords = getPossibleNextChords(baseNote);
      currentChord = predictChordFromPossibleChords(
        possibleNextChords,
        melody.slice(i + 1)
      );
    }
    chordProgression = addChordToProgression(
      chordProgression,
      currentChord,
      note.value
    );
    currentBeat += note.value;
  }

  return chordProgression;
}

function getBaseNote(pitch: PitchLabel | "rest"): BaseNote | "rest" {
  if (pitch === "rest") {
    return pitch;
  }
  return pitch.slice(0, pitch.length - 1) as BaseNote;
}

function addChordToProgression(
  chordProgression: TimedChord[],
  chord: Chord,
  value: number
) {
  const lastChord =
    chordProgression.length > 0
      ? chordProgression[chordProgression.length - 1]
      : null;
  if (lastChord && lastChord.chord === chord.chord) {
    return [
      ...chordProgression.slice(0, chordProgression.length - 1),
      { ...chord, value: lastChord.value + value },
    ];
  }
  return [...chordProgression, { ...chord, value }];
}

const STRONG_BEATS = [1, 0.5];
const BEAT_STRENGTHS = [1, 0.5, 0.25, 0.125, 0.0625];

function getBeatStrength(beat: number) {
  return BEAT_STRENGTHS.find((strength) => beat % strength === 0);
}

function isStrongBeat(beat: number) {
  return STRONG_BEATS.find((strength) => beat % strength === 0);
}

function isWeakerBeat(firstBeat: number, secondBeat: number) {
  return getBeatStrength(firstBeat) < getBeatStrength(secondBeat);
}

function getPossibleNextChords(baseNote: BaseNote) {
  return CHORDS.filter((chord) => chord.notes.includes(baseNote));
}

function predictChordFromPossibleChords(
  possibleChords: Chord[],
  melody: Note[]
) {
  let currentPossibleChords = [...possibleChords],
    i = 0,
    found = false,
    predictedChord = possibleChords[0];
  while (!found && i < melody.length) {
    const note = melody[i];
    const baseNote = getBaseNote(note.pitch);
    if (baseNote === "rest") {
      i++;
      return;
    }

    // TODO: Consider passing note & neighbor note
    currentPossibleChords = currentPossibleChords.filter((chord) =>
      chord.notes.includes(baseNote)
    );
    if (currentPossibleChords.length === 1) {
      predictedChord = currentPossibleChords[0];
      found = true;
    } else if (currentPossibleChords.length === 0) {
      found = true;
    }

    i++;
  }
  return predictedChord;
}

/**
 * Assuming first note of melody is a non-chord note, decide if the note is a passing/neighbor note
 */
function isPassingOrNeighborNote(
  melody: Note[],
  chord: Chord,
  startingBeat: number
) {
  if (melody.length === 1) {
    // If it's the last note in the melody, it can't be passing/neighbor note
    return false;
  }

  const nextChordNoteIndex = melody.findIndex((note) => {
    const baseNote = getBaseNote(note.pitch);
    return baseNote !== "rest" && chord.notes.includes(baseNote);
  });
  if (nextChordNoteIndex === -1) {
    // If there is no chord note after, it's probably not passing/neighbor note
    return false;
  }
  const notesInBetween = melody.slice(0, nextChordNoteIndex);
  const chordNoteBeat =
    startingBeat +
    notesInBetween.reduce((total, note) => total + note.value, 0);
  let currentBeat = startingBeat;
  return notesInBetween.every((note) => {
    const baseNote = getBaseNote(note.pitch);
    const isNoteAtWeakerBeat =
      baseNote === "rest" || isWeakerBeat(currentBeat, chordNoteBeat);
    currentBeat += note.value;
    return isNoteAtWeakerBeat;
  });
}
