"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isValidWord_1 = __importDefault(require("../library/isValidWord"));
const use_dict = {
    name: "dict",
    run: async (client, message, args) => {
        const word = args[0];
        const resp = await (0, isValidWord_1.default)(word);
        if (resp) {
            message.channel.send("Valid Word.");
        }
        else {
            message.channel.send("Invalid Word.");
        }
    }
};
exports.default = use_dict;
