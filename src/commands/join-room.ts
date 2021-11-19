import Command from "../interface/command";
import getError from "../library/error-code";
import { getExisitingRoom, isPlayerInGame } from "../library/room";

const join_room: Command = {
  name: "join",
  run: (client, message, args) => {
    const roomId = args[0];
    const room = getExisitingRoom(roomId);
    const user = message.author;

    if (isPlayerInGame(message.author)) {
      message.channel.send(getError(2));
      return;
    }

    if (room) {
      room.enterRoom(user);
    } else {
      message.channel.send(getError(5));
    }
  },
  deprecated: true,
}

export default join_room;