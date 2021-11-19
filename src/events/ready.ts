import Event from "../interface/event";

const event: Event = {
  name: "ready",
  run: (client) => {
    console.log(`logged in ${client.user?.tag}`);
  },
};

export default event;