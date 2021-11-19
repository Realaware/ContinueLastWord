"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_code_1 = __importDefault(require("../library/error-code"));
const room_1 = require("../library/room");
const join_room = {
    name: "join",
    run: (client, message, args) => {
        const roomId = args[0];
        const room = (0, room_1.getExisitingRoom)(roomId);
        const user = message.author;
        if ((0, room_1.isPlayerInGame)(message.author)) {
            message.channel.send((0, error_code_1.default)(2));
            return;
        }
        if (room) {
            room.enterRoom(user);
        }
        else {
            message.channel.send((0, error_code_1.default)(5));
        }
    },
    deprecated: true,
};
exports.default = join_room;
