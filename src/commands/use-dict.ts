import Command from "../interface/command";
import isValidWord from "../library/isValidWord";

const use_dict: Command = {
  name: "dict",
  run: async (client, message, args) => {
    const word = args[0];

    const resp = await isValidWord(word);

    if (resp) {
      message.channel.send("Valid Word.");
    } else {
      message.channel.send("Invalid Word.");
    }
  }
};

export default use_dict;