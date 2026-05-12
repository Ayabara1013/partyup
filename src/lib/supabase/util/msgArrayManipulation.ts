import {getMillisec} from "@/lib/supabase/util/dateConversion";

type TimestampLike = {
    seconds: number;
};

type MessageLike = {
    createdAt: TimestampLike;
    updatedAt: TimestampLike;
    [key: string]: any;
};

const msgArrayManipulation = {
    sortByCreated(array: any[] = []) {
        array.sort((a, b) => {
            return getMillisec.createdAt(a) - getMillisec.createdAt(b);
        });
    },

    sortByUpdated(array: any[]) {
        array.sort((a, b) => {
            return getMillisec.updatedAt(a) - getMillisec.updatedAt(b);
        });
    },

    sortByKey<T extends Record<string, any>>(array: T[], key: keyof T) {
        array.sort((a, b) => {
            const x = a[key];
            const y = b[key];

            return x < y ? -1 : x > y ? 1 : 0;
        });
    },

    combineReplaceOnKey<T extends Record<string, any>>(
        array: T[],
        arrayToAdd: T[],
        key: keyof T
    ) {
        for (const newMsg of arrayToAdd) {
            const index = array.findIndex((msg) => msg[key] === newMsg[key]);

            if (index === -1) {
                array.push(newMsg);
            } else {
                array[index] = newMsg;
            }
        }
    },
};

export default msgArrayManipulation;