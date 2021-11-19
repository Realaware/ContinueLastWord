"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const config_json_1 = __importDefault(require("../../config.json"));
class BotClient extends discord_js_1.Client {
    constructor() {
        super(...arguments);
        this.commands = new discord_js_1.Collection();
        this.groups = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.config = config_json_1.default;
    }
    async init() {
        const token = config_json_1.default.token;
        if (token) {
            this.login(token);
            const commandPath = path.join(__dirname, "../commands");
            const eventPath = path.join(__dirname, "../events");
            fs.readdirSync(commandPath).forEach(async (file) => {
                var _a, _b;
                const command_default = await Promise.resolve().then(() => __importStar(require(`${commandPath}/${file}`)));
                const command = command_default.default;
                if (command.deprecated) {
                    return;
                }
                this.commands.set(command.name, command);
                this.on(command.name, command.run.bind(null, this));
                if (((_a = command.group) === null || _a === void 0 ? void 0 : _a.length) !== 0) {
                    (_b = command.group) === null || _b === void 0 ? void 0 : _b.forEach((child) => {
                        this.groups.set(child, command);
                    });
                }
            });
            fs.readdirSync(eventPath).forEach(async (file) => {
                const event_default = await Promise.resolve().then(() => __importStar(require(`${eventPath}/${file}`)));
                const event = event_default.default;
                this.events.set(event.name, event);
                this.on(event.name, event.run.bind(null, this));
            });
        }
    }
}
exports.default = BotClient;
