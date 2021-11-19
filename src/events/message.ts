import { Message } from "discord.js";
import Event from "../interface/event";

const event: Event = {
  name: "messageCreate",
  run: async (client, message: Message) => {

    if (message.author.bot || !message.content.startsWith(client.config.prefix))
      return;

    const args = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/g);

    const cmd = args.shift()?.toLowerCase();
    if (!cmd) return;
    const command = client.commands.get(cmd);

    command && command.run(client, message, args);
  },
};

export default event;