import BotClient from '../Client';
import { ClientEvents } from 'discord.js';

type Run = (client: BotClient, ...args: any[]) => void;

export default interface Event {
    name: keyof ClientEvents;
    run: Run;
}