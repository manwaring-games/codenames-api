import { v4 } from "uuid";
import { Turn as CommonTurn, Team, Guess, Clue } from "@manwaring-games/codenames-common";

export class Turn implements CommonTurn {
  id: string;
  team: Team;
  active: boolean;
  clue: Clue;
  guesses?: Guess[];

  constructor(team: Team, clue: Clue) {
    this.id = v4();
    this.team = team;
    this.active = true;
    this.clue = clue;
  }
}
