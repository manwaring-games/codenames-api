import { v4 } from "uuid";
import { Clue as CommonClue } from "@manwaring-games/codenames-common";

export class Clue implements CommonClue {
  id: string;
  word: string;
  tiles: number;

  constructor(word: string, tiles: number) {
    this.id = v4();
    this.word = word;
    this.tiles = tiles;
  }
}
