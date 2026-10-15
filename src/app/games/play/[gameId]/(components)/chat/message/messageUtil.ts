// Mentions are stored in message_text as <@userId> (Discord's format), so names can
// contain spaces and renames don't break old messages.
export const MENTION_RE = /<@([0-9a-fA-F-]{36})>/g;

export const mentionToken = (userId: string) => `<@${userId}>`;

// The GM and every player
export function gameMembers(game: any): any[] {
    if (!game) return [];
    return [game.gm, ...(game.players ?? [])].filter(Boolean);
}

export function findAuthor(game: any, playerId: string | null | undefined) {
    if (!game || !playerId) return undefined;
    return gameMembers(game).find((p: any) => p?.id === playerId);
}

export function authorName(message: any, game: any) {
    if (message.system) return `System`;
    return findAuthor(game, message.playerId)?.name ?? `Unknown player`;
}

// <@id> -> @Name
export function mentionsToNames(text: string, game: any) {
    return text.replace(MENTION_RE, (_, id) => `@${findAuthor(game, id)?.name ?? `Unknown`}`);
}

// @Name -> <@id>, longest names first so "@Ann Lee" wins over "@Ann"
export function namesToMentions(text: string, game: any) {
    const members = [...gameMembers(game)].sort((a, b) => (b.name ?? ``).length - (a.name ?? ``).length);
    let out = text;
    for (const member of members) {
        if (!member.name) continue;
        const escaped = member.name.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
        out = out.replace(new RegExp(`@${escaped}(?![\\w])`, `g`), mentionToken(member.id));
    }
    return out;
}

// Single-line plain text for previews; CSS truncates the overflow.
export function previewText(message: any, game: any) {
    return mentionsToNames(message.messageText ?? ``, game).replace(/\s+/g, ` `).trim();
}

// "Today at 3:42 PM", "Yesterday at …", or the date
export function formatDiscordTime(date: Date) {
    const time = date.toLocaleTimeString([], {hour: `numeric`, minute: `2-digit`});
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return `Today at ${time}`;
    if (date.toDateString() === yesterday.toDateString()) return `Yesterday at ${time}`;
    return `${date.toLocaleDateString()} ${time}`;
}
