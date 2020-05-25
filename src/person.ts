import { v4 } from "uuid";
import {
  Person as CommonPerson,
  Team,
  Role,
} from "@manwaring-games/codenames-common";

export class Person implements CommonPerson {
  id: string;
  name: string;
  team: Team.BLUE | Team.RED;
  role: Role;

  constructor(name: string) {
    this.id = v4();
    this.name = name;
    this.team = Math.random() < 0.5 ? Team.BLUE : Team.RED;
    this.role = Role.SPY;
  }
}
