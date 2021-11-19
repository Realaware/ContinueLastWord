"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const room_1 = __importDefault(require("../library/room"));
const create_room = {
    name: "create-room",
    run: (client, message) => {
        if (message.channel instanceof discord_js_1.TextChannel) {
            const new_room = new room_1.default(message.channel, message.author);
            console.debug(`NEW ROOM CREATED: ${new_room.id}`);
        }
    },
};
exports.default = create_room;
