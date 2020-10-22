export type Note = {
  pitch: PitchLabel | "rest";
  value: number;
};

export type WeightedNote = {
  pitch: BaseNote;
  weight: number;
};

export type Chord = {
  chord: ChordName;
  notes: BaseNote[];
};

export type BaseNote =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab"
  | "A"
  | "A#"
  | "B";

export type PitchLabel =
  | "C1"
  | "C#1"
  | "Db1"
  | "D1"
  | "D#1"
  | "Eb1"
  | "E1"
  | "F1"
  | "F#1"
  | "Gb1"
  | "G1"
  | "G#1"
  | "Ab1"
  | "A1"
  | "A#1"
  | "B1"
  | "C2"
  | "C#2"
  | "Db2"
  | "D2"
  | "D#2"
  | "Eb2"
  | "E2"
  | "F2"
  | "F#2"
  | "Gb2"
  | "G2"
  | "G#2"
  | "Ab2"
  | "A2"
  | "A#2"
  | "B2"
  | "C3"
  | "C#3"
  | "Db3"
  | "D3"
  | "D#3"
  | "Eb3"
  | "E3"
  | "F3"
  | "F#3"
  | "Gb3"
  | "G3"
  | "G#3"
  | "Ab3"
  | "A3"
  | "A#3"
  | "B3"
  | "C4"
  | "C#4"
  | "Db4"
  | "D4"
  | "D#4"
  | "Eb4"
  | "E4"
  | "F4"
  | "F#4"
  | "Gb4"
  | "G4"
  | "G#4"
  | "Ab4"
  | "A4"
  | "A#4"
  | "B4"
  | "C5"
  | "C#5"
  | "Db5"
  | "D5"
  | "D#5"
  | "Eb5"
  | "E5"
  | "F5"
  | "F#5"
  | "Gb5"
  | "G5"
  | "G#5"
  | "Ab5"
  | "A5"
  | "A#5"
  | "B5"
  | "C6"
  | "C#6"
  | "Db6"
  | "D6"
  | "D#6"
  | "Eb6"
  | "E6"
  | "F6"
  | "F#6"
  | "Gb6"
  | "G6"
  | "G#6"
  | "Ab6"
  | "A6"
  | "A#6"
  | "B6";

export type ChordName = "C" | "Dm" | "Em" | "F" | "G" | "Am" | "Bdim";
