import { TextChannel } from "discord.js";
import Command from "../interface/command";
import Room from "../library/room";

const create_room: Command = {
  name: "create-room",
  run: (client, message) => {
    if (message.channel instanceof TextChannel) {
      const new_room = new Room(message.channel, message.author);

      console.debug(`NEW ROOM CREATED: ${new_room.id}`);
    }
  },
};

export default create_room;
