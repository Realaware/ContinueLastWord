import BotClient from "../client";
import { Message } from "discord.js";

type Run = (client: BotClient, message: Message, args: string[]) => void;

export default interface Command {
  name: string;
  description?: string;
  run: Run;
  group?: string[];
  deprecated?: boolean;
}
