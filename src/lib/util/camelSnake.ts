type SnakeToCamel<S extends string> =
    S extends `${infer A}_${infer B}`
        ? `${A}${Capitalize<SnakeToCamel<B>>}`
        : S;

export type CamelCase<T> =
    T extends readonly (infer U)[]
        ? CamelCase<U>[]
        : T extends object
            ? {
                [K in keyof T as SnakeToCamel<K & string>]: CamelCase<T[K]>;
            }
            : T;


function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function toSnakeCase(str: string): string {
    return str
        .replace(/([A-Z])/g, "_$1") // add underscore before capitals
        .toLowerCase()
        .replace(/^_/, ""); // remove leading underscore if any
}

function objectToCamel<T>(input: T): CamelCase<T> {
    if (Array.isArray(input)) {
        return input.map((item) => objectToCamel(item)) as CamelCase<T>;
    }

    if (input !== null && typeof input === "object") {
        return Object.fromEntries(
            Object.entries(input).map(([key, value]) => [
                toCamelCase(key),
                objectToCamel(value),
            ])
        ) as CamelCase<T>;
    }

    return input as CamelCase<T>;
}

function objectToSnake<T = any>(input: any): T {
    if (Array.isArray(input)) {
        return input.map((item) => objectToSnake(item)) as T;
    }

    if (input !== null && typeof input === "object") {
        return Object.fromEntries(
            Object.entries(input).map(([key, value]) => [
                toSnakeCase(key),
                objectToSnake(value),
            ])
        ) as T;
    }

    return input;
}

export {objectToCamel, objectToSnake};