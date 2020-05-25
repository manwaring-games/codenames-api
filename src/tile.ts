import { Team } from "@manwaring-games/codenames-common";

export class Tile {
  id: string;
  word: string;
  selected: boolean;
  team: Team;

  constructor() {}
}
