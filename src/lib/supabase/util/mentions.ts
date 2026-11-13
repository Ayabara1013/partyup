// Mentions are stored in message_text as <@userId> (Discord's format), so names can
// contain spaces and renames don't break old messages.
export const MENTION_RE = /<@([0-9a-fA-F-]{36})>/g;

// "<@userId>" -> "userId", or undefined when the string isn't exactly one mention
const MENTION_ONLY_RE = /^<@([0-9a-fA-F-]{36})>$/;

export function mentionUserId(value: string): string | undefined {
    return MENTION_ONLY_RE.exec(value)?.[1];
}
