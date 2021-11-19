"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event = {
    name: "messageCreate",
    run: async (client, message) => {
        var _a;
        if (message.author.bot || !message.content.startsWith(client.config.prefix))
            return;
        const args = message.content
            .slice(client.config.prefix.length)
            .trim()
            .split(/ +/g);
        const cmd = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (!cmd)
            return;
        const command = client.commands.get(cmd);
        command && command.run(client, message, args);
    },
};
exports.default = event;
