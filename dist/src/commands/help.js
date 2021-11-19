"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command_help = {
    name: "help",
    run: (client, message) => {
        const help = new discord_js_1.MessageEmbed()
            .setTitle("Instruction")
            .setDescription("Welcome to Continuing Last Word.")
            .addFields([
            {
                name: "Basic Rules",
                value: "CLW is simple game.\nAll you have to do is check last character of words and write an new word that starts with that character.",
                inline: true,
            },
            {
                name: "Creating Room",
                inline: true,
                value: `${client.config.prefix}create-room will make you room to play with your friends.\nYou can join/create room only one.`,
            },
            {
                name: "Two Sound Rule(두음법칙)",
                inline: false,
                value: `
          This is an unique rule that exist in korean language structure.
          If you want to know more information, Please search in google.
          Example
          \`\`\`남녀 -> 남여\n닉명 -> 익명\n년세 -> 연세\`\`\`
          `,
            },
        ]);
        message.channel.send({ embeds: [help] });
    },
};
exports.default = command_help;
