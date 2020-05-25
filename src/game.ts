import { v4 } from "uuid";
import { customAlphabet } from "nanoid";
import { Game as CommonGame, Team } from "@manwaring-games/codenames-common";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 5);

export class Game implements CommonGame {
  id: string;
  code: string;
  started: boolean;
  turn: Team.BLUE | Team.RED;

  constructor() {
    this.id = v4();
    this.code = nanoid();
    this.started = false;
    this.turn = Math.random() < 0.5 ? Team.BLUE : Team.RED;
  }
}
