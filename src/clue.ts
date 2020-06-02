import { Clue as CommonClue } from "@manwaring-games/codenames-common";

export class Clue implements CommonClue {
  id: string;
  word: string;
  tiles: number;

  constructor() {}
}
