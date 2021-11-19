import RandomString from "./random-string";
import {
  TextChannel,
  User,
  MessageEmbed,
  Message,
  MessageCollector,
  MessageButton,
  MessageActionRow,
} from "discord.js";
import getError from "./error-code";
import isValidWord from "./isValidWord";

class Collection<KEY, VALUE> extends Map<KEY, VALUE> {}

const Rooms: Collection<string, Room> = new Collection();
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

function getExisitingRoom(id: string): Room | undefined {
  return Rooms.get(id);
}

function isPlayerInGame(user: User): boolean {
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

const Instruction = new MessageEmbed({
  title: "Announcement",
  description:
    "If you don't know how to play this game, Please read instruction using [help",
  timestamp: new Date(),
});

interface NextTurnParameter {
  twoSoundRule?: boolean;
}

class Room {
  id: string = RandomString(10);
  participant: Array<User> = [];
  organizer: User | null = null;
  private typingUser: User | null = null;
  private intervalEachTime: number = 5;
  private words: Array<{ author: User; word: string }> = [];
  private channel: TextChannel | null = null;
  private isGathering: boolean = true;
  private timeout: NodeJS.Timeout | null = null;
  private collector: MessageCollector | null = null;

  public getLastWord() {
    return this.words[this.words.length - 1];
  }

  public enterRoom(user: User) {
    if (this.channel && this.isGathering) {
      this.participant.push(user);

      this.channel.send(`${user.username} has entered.`);
    } else {
      this.channel?.send(getError(1));
    }
  }

  public fetchGameData() {
    const organizer = this.organizer;
    const words = this.words;
    const participant = this.participant;

    const word_log = words.map(
      (word) => `${word.author.username}: ${word.word}`
    );

    const embed = new MessageEmbed({
      title: `Game made by ${organizer?.username}`,
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

    this.channel?.send({ embeds: [embed] });
  }

  private getRandomUser() {
    return this.participant[
      Math.floor(Math.random() * this.participant.length)
    ];
  }

  private isWordUsed(str: string) {
    return this.words.some((word) => word.word === str);
  }

  private removeRoom() {
    this.timeout && clearTimeout(this.timeout);
    this.collector && this.collector.stop();
    Rooms.delete(this.id);
    console.info(`GAME HAS BEEN ENDED: ${this.id}`);
    this.fetchGameData();
  }

  private doNextTurn(msg: Message, parameter?: NextTurnParameter) {
    const typingUser = this.typingUser;
    const channel = this.channel;

    if (typingUser && channel) {
      this.words.push({
        author: msg.author,
        word: msg.content,
      });

      const idx = this.participant.findIndex(
        (_user) => _user.id === typingUser.id
      );
      const targetUser =
        idx + 1 >= this.participant.length
          ? this.participant[0]
          : this.participant[idx + 1];

      this.typingUser = targetUser;
      channel.send(
        `\`${this.getLastWord().word}\`\nNext Turn: ${targetUser.username}\n${
          parameter?.twoSoundRule ? "(Two Sound Rule has applied)" : ""
        }`
      );

      // update timeout
      const timeout_callback = () => {
        this.removeRoom();
        channel.send(
          `${targetUser.username} did not write proper answer on time.`
        );
      };

      this.timeout && clearTimeout(this.timeout);
      this.timeout = setTimeout(timeout_callback, this.intervalEachTime * 1000);
    }
  }

  private getLastCharacter(str: string): string | undefined {
    return str.split("").pop();
  }

  constructor(channel: TextChannel, organizer: User) {
    if (isPlayerInGame(organizer)) {
      channel.send(getError(2));
      return;
    }

    this.channel = channel;
    this.organizer = organizer;
    Rooms.set(this.id, this);

    const GatheringMembers = new MessageEmbed({
      title: "Continuing Last Word",
      description: `${organizer.username} has held an new game.\n10 seconds left to join.`,
      timestamp: new Date(),
    });

    const actionRows = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("PRIMARY")
        .setLabel("Join")
        .setCustomId("join")
    );

    channel
      .send({ embeds: [GatheringMembers], components: [actionRows] })
      .then((msg) => {
        const collector = msg.createMessageComponentCollector({
          filter: (interaction) =>
            !isPlayerInGame(interaction.user) &&
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
            channel.send(getError(3));
            return;
          }

          this.isGathering = false;
          channel.send(
            `Game Started. Member Count:  ${this.participant.length}`
          );
          this.gameInit();
        });
      });
    this.participant.push(organizer);
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
        filter: (msg) =>
          this.typingUser !== null &&
          msg.author.id === this.typingUser.id &&
          this.participant.some((_user) => _user.id === msg.author.id),
      });
      this.collector = collector;

      collector.on("collect", async (msg) => {
        const resp = await isValidWord(msg.content);

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
            channel.send(getError(4));
            return;
          }

          if (msg.content.startsWith(lastChar)) {
            return this.doNextTurn(msg);
          } else if (
            lastChar in twoSoundRule &&
            msg.content.startsWith(
              twoSoundRule[lastChar as keyof typeof twoSoundRule]
            )
          ) {
            return this.doNextTurn(msg, { twoSoundRule: true });
          }

          msg.channel.send(
            `Game has been ended. (Word must be initialized with ${lastChar})`
          );
          return this.removeRoom();
        }

        this.doNextTurn(msg);
      });
    }
  }
}

export default Room;
export { Rooms, getExisitingRoom, isPlayerInGame };
