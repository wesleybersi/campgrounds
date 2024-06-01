import { Client } from "../../Client";

export class Inventory {
  client: Client;
  materials: {
    wood: number;
    stone: number;
  } = {
    wood: 0,
    stone: 0,
  };
  constructor(client: Client) {
    this.client = client;
  }
}
