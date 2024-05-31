import { Client } from "../../Client";

export class Inventory {
  client: Client;
  materials: {
    wood: number;
  } = {
    wood: 0,
  };
  constructor(client: Client) {
    this.client = client;
  }
}
