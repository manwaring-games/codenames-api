import { v4 } from "uuid";
import { customAlphabet } from "nanoid";
import { Game as CommonGame, Turn, Tile } from "@manwaring-games/codenames-common";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 5);

export class Game implements CommonGame {
  id: string;
  code: string;
  started: boolean;
  tiles?: Tile[];
  turns?: {
    active?: Turn;
    past?: Turn[];
  };

  constructor(id?: string, started?: boolean) {
    this.id = id ? id : v4();
    this.code = nanoid();
    this.started = started ? started : false;
  }
}
