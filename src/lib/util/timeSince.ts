type TimeSinceType = 'conversational' | 'condensed';

export default function timeSince(date: Date | string | 'random', type?: TimeSinceType): string {
    if (date === 'random') {
        // Pick a random date in the last 60 days
        const sixtyDaysAgo = Date.now() - 60 * 24 * 60 * 60 * 1000;

        date = new Date(sixtyDaysAgo + Math.random() * 60 * 24 * 60 * 60 * 1000);
    }

    const parsedDate =
        date instanceof Date ? date : new Date(date);

    let seconds = Math.floor((Date.now() - parsedDate.getTime()) / 1000);

    const years = Math.floor(seconds / 31_536_000);
    seconds %= 31_536_000;

    const months = Math.floor(seconds / 2_592_000);
    seconds %= 2_592_000;

    const days = Math.floor(seconds / 86_400);

    switch (type) {
        case 'conversational': {
            const parts: string[] = [];

            if (years) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);

            if (months) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);

            if (days) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);

            return parts.length ? parts.join(', ') : 'today';
        }

        case 'condensed':
            return `${years}y ${months}m ${days}d`;

        default:
            return `${years}y, ${months}m, ${days}d`;
    }
}