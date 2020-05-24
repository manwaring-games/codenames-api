import { v4 } from "uuid";
import { characters, generate } from "shortid";
import { Tile } from "./tile";
import { Person } from "./person";
import { Team } from "./team";

characters("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

export interface Game {
  id: string;
  code: string;
  started: boolean;
  turn: Team.BLUE | Team.RED;
  tiles?: Tile[];
  people?: Person[];
}

export class Game {
  id: string;
  code: string;
  started: boolean;
  turn: Team.BLUE | Team.RED;

  constructor() {
    this.id = v4();
    this.code = generate();
    this.started = false;
    this.turn = Math.random() < 0.5 ? Team.BLUE : Team.RED;
  }
}
