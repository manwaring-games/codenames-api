import { v4 } from "uuid";
import { Team, Tile as CommonTile } from "@manwaring-games/codenames-common";

export class Tile implements CommonTile {
  id: string;
  word: string;
  selected: boolean;
  team: Team;

  constructor(team: Team, word: string) {
    this.id = v4();
    this.word = word;
    this.selected = false;
    this.team = team;
  }
}
