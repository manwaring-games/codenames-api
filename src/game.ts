import { v4 } from "uuid";
import { customAlphabet } from "nanoid";
import { Game as CommonGame, Turn, Tile, Team } from "@manwaring-games/codenames-common";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 5);

export class Game implements CommonGame {
  id: string;
  code: string;
  started: boolean;
  startTeam: Team;
  tiles?: Tile[];
  turns?: {
    active?: Turn;
    past?: Turn[];
  };

  constructor() {
    this.id = v4();
    this.code = nanoid();
    this.started = false;
  }
}
