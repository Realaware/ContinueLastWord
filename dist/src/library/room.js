"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlayerInGame = exports.getExisitingRoom = exports.Rooms = void 0;
const random_string_1 = __importDefault(require("./random-string"));
const discord_js_1 = require("discord.js");
const error_code_1 = __importDefault(require("./error-code"));
const isValidWord_1 = __importDefault(require("./isValidWord"));
class Collection extends Map {
}
const Rooms = new Collection();
exports.Rooms = Rooms;
const twoSoundRule = {
    라: "나",
    락: "낙",
    란: "난",
    랄: "날",
    람: "남",
    랍: "납",
    랑: "낭",
    래: "내",
    랭: "냉",
    냑: "약",
    략: "약",
    냥: "양",
    량: "양",
    녀: "여",
    려: "여",
    녁: "역",
    력: "역",
    년: "연",
    련: "연",
    녈: "열",
    렬: "열",
    념: "염",
    렴: "염",
    렵: "엽",
    녕: "영",
    령: "영",
    녜: "예",
    례: "예",
    로: "노",
    록: "녹",
    론: "논",
    롱: "농",
    뢰: "뇌",
    뇨: "요",
    료: "요",
    룡: "용",
    루: "누",
    뉴: "유",
    류: "유",
    뉵: "육",
    륙: "육",
    륜: "윤",
    률: "율",
    륭: "융",
    륵: "늑",
    름: "늠",
    릉: "능",
    니: "이",
    리: "이",
    린: "인",
    림: "임",
    립: "입",
};
function getExisitingRoom(id) {
    return Rooms.get(id);
}
exports.getExisitingRoom = getExisitingRoom;
function isPlayerInGame(user) {
    let result = false;
    if (Rooms.size > 0) {
        for (const [_, room] of Rooms) {
            if (room.participant.some((_user) => _user.id === user.id)) {
                result = true;
                break;
            }
        }
    }
    return result;
}
exports.isPlayerInGame = isPlayerInGame;
const Instruction = new discord_js_1.MessageEmbed({
    title: "Announcement",
    description: "If you don't know how to play this game, Please read instruction using [help",
    timestamp: new Date(),
});
class Room {
    constructor(channel, organizer) {
        this.id = (0, random_string_1.default)(10);
        this.participant = [];
        this.organizer = null;
        this.typingUser = null;
        this.intervalEachTime = 5;
        this.words = [];
        this.channel = null;
        this.isGathering = true;
        this.timeout = null;
        this.collector = null;
        if (isPlayerInGame(organizer)) {
            channel.send((0, error_code_1.default)(2));
            return;
        }
        this.channel = channel;
        this.organizer = organizer;
        Rooms.set(this.id, this);
        const GatheringMembers = new discord_js_1.MessageEmbed({
            title: "Continuing Last Word",
            description: `${organizer.username} has held an new game.\n10 seconds left to join.`,
            timestamp: new Date(),
        });
        const actionRows = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
            .setStyle("PRIMARY")
            .setLabel("Join")
            .setCustomId("join"));
        channel
            .send({ embeds: [GatheringMembers], components: [actionRows] })
            .then((msg) => {
            const collector = msg.createMessageComponentCollector({
                filter: (interaction) => !isPlayerInGame(interaction.user) &&
                    interaction.customId === "join",
                time: 10000,
                componentType: "BUTTON",
            });
            collector.on("collect", (interaction) => {
                this.enterRoom(interaction.user);
            });
            collector.on("end", () => {
                if (this.participant.length === 1) {
                    this.removeRoom();
                    channel.send((0, error_code_1.default)(3));
                    return;
                }
                this.isGathering = false;
                channel.send(`Game Started. Member Count:  ${this.participant.length}`);
                this.gameInit();
            });
        });
        this.participant.push(organizer);
    }
    getLastWord() {
        return this.words[this.words.length - 1];
    }
    enterRoom(user) {
        var _a;
        if (this.channel && this.isGathering) {
            this.participant.push(user);
            this.channel.send(`${user.username} has entered.`);
        }
        else {
            (_a = this.channel) === null || _a === void 0 ? void 0 : _a.send((0, error_code_1.default)(1));
        }
    }
    fetchGameData() {
        var _a;
        const organizer = this.organizer;
        const words = this.words;
        const participant = this.participant;
        const word_log = words.map((word) => `${word.author.username}: ${word.word}`);
        const embed = new discord_js_1.MessageEmbed({
            title: `Game made by ${organizer === null || organizer === void 0 ? void 0 : organizer.username}`,
            description: "details about this game.",
            fields: [
                {
                    name: "participant",
                    value: participant.join("\n"),
                },
                {
                    name: "Logs",
                    value: `
          \`\`\`${word_log.join("\n")}\`\`\`
          `,
                },
            ],
            timestamp: new Date(),
        }).setFooter(`game id: ${this.id}`);
        (_a = this.channel) === null || _a === void 0 ? void 0 : _a.send({ embeds: [embed] });
    }
    getRandomUser() {
        return this.participant[Math.floor(Math.random() * this.participant.length)];
    }
    isWordUsed(str) {
        return this.words.some((word) => word.word === str);
    }
    removeRoom() {
        this.timeout && clearTimeout(this.timeout);
        this.collector && this.collector.stop();
        Rooms.delete(this.id);
        console.info(`GAME HAS BEEN ENDED: ${this.id}`);
        this.fetchGameData();
    }
    doNextTurn(msg, parameter) {
        const typingUser = this.typingUser;
        const channel = this.channel;
        if (typingUser && channel) {
            this.words.push({
                author: msg.author,
                word: msg.content,
            });
            const idx = this.participant.findIndex((_user) => _user.id === typingUser.id);
            const targetUser = idx + 1 >= this.participant.length
                ? this.participant[0]
                : this.participant[idx + 1];
            this.typingUser = targetUser;
            channel.send(`\`${this.getLastWord().word}\`\nNext Turn: ${targetUser.username}\n${(parameter === null || parameter === void 0 ? void 0 : parameter.twoSoundRule) ? "(Two Sound Rule has applied)" : ""}`);
            // update timeout
            const timeout_callback = () => {
                this.removeRoom();
                channel.send(`${targetUser.username} did not write proper answer on time.`);
            };
            this.timeout && clearTimeout(this.timeout);
            this.timeout = setTimeout(timeout_callback, this.intervalEachTime * 1000);
        }
    }
    getLastCharacter(str) {
        return str.split("").pop();
    }
    async gameInit() {
        const channel = this.channel;
        if (channel) {
            await channel.send({ embeds: [Instruction] });
            const selectedUser = this.getRandomUser();
            this.typingUser = selectedUser;
            channel.send(`${selectedUser.username} is first.`);
            const collector = channel.createMessageCollector({
                time: 6000 * 6000,
                max: 1000 * 100,
                filter: (msg) => this.typingUser !== null &&
                    msg.author.id === this.typingUser.id &&
                    this.participant.some((_user) => _user.id === msg.author.id),
            });
            this.collector = collector;
            collector.on("collect", async (msg) => {
                const resp = await (0, isValidWord_1.default)(msg.content);
                if (!resp) {
                    channel.send("Game has been ended. (Wrong Word)");
                    return this.removeRoom();
                }
                if (this.isWordUsed(msg.content)) {
                    channel.send("Game has beend ended. (Duplicated Word)");
                    return this.removeRoom();
                }
                const lastWord = this.getLastWord();
                if (lastWord) {
                    const lastChar = this.getLastCharacter(lastWord.word);
                    if (!lastChar) {
                        this.removeRoom();
                        channel.send((0, error_code_1.default)(4));
                        return;
                    }
                    if (msg.content.startsWith(lastChar)) {
                        return this.doNextTurn(msg);
                    }
                    else if (lastChar in twoSoundRule &&
                        msg.content.startsWith(twoSoundRule[lastChar])) {
                        return this.doNextTurn(msg, { twoSoundRule: true });
                    }
                    msg.channel.send(`Game has been ended. (Word must be initialized with ${lastChar})`);
                    return this.removeRoom();
                }
                this.doNextTurn(msg);
            });
        }
    }
}
exports.default = Room;
