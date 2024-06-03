import { Client } from "../../Client";

export class Command {
  client: Client;
  category: "areas" | "foresting" | "construction" | null = null;
  current = "";
  index?: number;
  constructor(client: Client) {
    this.client = client;
  }
  setCategory(category: "areas" | "foresting" | "construction" | null) {
    this.category = category;
  }
  setCommand(value: string, index?: number) {
    this.current = value;
    this.index = index;
  }
}
