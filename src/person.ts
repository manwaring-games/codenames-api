import { v4 } from "uuid";
import { Team } from "./team";

export class Person {
  id: string;
  name: string;
  team?: Team.BLUE | Team.RED;
  role: Role;

  constructor(name: string) {
    this.id = v4();
    this.name = name;
    this.team = Math.random() < 0.5 ? Team.BLUE : Team.RED;
    this.role = Role.GUESSER;
  }
}

export enum Role {
  GUESSER = "GUESSER",
  CLUE_GIVER = "CLUE_GIVER",
}
