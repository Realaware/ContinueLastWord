import { Client, Collection } from "discord.js";
import * as path from "path";
import * as fs from "fs";
import BotConfig from "../../config.json";
import Command from "../interface/command";
import Event from "../interface/event";

class BotClient extends Client {
  public commands: Collection<string, Command> = new Collection();
  public groups: Collection<string, Command> = new Collection();
  public events: Collection<string, Event> = new Collection();
  public config: typeof BotConfig = BotConfig;

  public async init() {
    const token = BotConfig.token;

    if (token) {
      this.login(token);

      const commandPath = path.join(__dirname, "../commands");
      const eventPath = path.join(__dirname, "../events");

      fs.readdirSync(commandPath).forEach(async (file) => {
        const command_default: { default: Command } = await import(
          `${commandPath}/${file}`
        );
        const command = command_default.default;

        if (command.deprecated) {
          return;
        }

        this.commands.set(command.name, command);
        this.on(command.name, command.run.bind(null, this));

        if (command.group?.length !== 0) {
          command.group?.forEach((child) => {
            this.groups.set(child, command);
          });
        }
      });

      fs.readdirSync(eventPath).forEach(async (file) => {
        const event_default: { default: Event } = await import(
          `${eventPath}/${file}`
        );
        const event = event_default.default;

        this.events.set(event.name, event);
        this.on(event.name, event.run.bind(null, this));
      });
    }
  }
}

export default BotClient;
