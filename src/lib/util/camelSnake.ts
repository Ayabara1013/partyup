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

type CamelToSnake<S extends string> =
    S extends `${infer C}${infer R}`
        ? `${C extends Lowercase<C> ? C : `_${Lowercase<C>}`}${CamelToSnake<R>}`
        : S;

export type SnakeCase<T> =
    T extends readonly (infer U)[] ? SnakeCase<U>[]
        : T extends Date ? T
            : T extends object ? { [K in keyof T as CamelToSnake<K & string>]: SnakeCase<T[K]> }
                : T;

const camelCache = new Map<string, string>();
const snakeCache = new Map<string, string>();

function toCamelCase(str: string): string {
    let out = camelCache.get(str);
    if (out === undefined) {
        out = str.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
        camelCache.set(str, out);
    }
    return out;
}

function toSnakeCase(str: string): string {
    let out = snakeCache.get(str);
    if (out === undefined) {
        out = str.replace(/[A-Z]/g, (c, i) => (i === 0 ? c.toLowerCase() : `_${c.toLowerCase()}`));
        snakeCache.set(str, out);
    }
    return out;
}
function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (value === null || typeof value !== `object`) return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}

function convertKeys(input: unknown, convert: (key: string) => string): unknown {
    if (Array.isArray(input)) return input.map((item) => convertKeys(item, convert));
    if (!isPlainObject(input)) return input;

    const out: Record<string, unknown> = {};
    for (const key in input) {
        out[convert(key)] = convertKeys(input[key], convert);
    }
    return out;
}

function objectToCamel<T>(input: T): CamelCase<T> {
    return convertKeys(input, toCamelCase) as CamelCase<T>;
}

function objectToSnake<T>(input: T): SnakeCase<T> {
    return convertKeys(input, toSnakeCase) as SnakeCase<T>;
}

export {objectToCamel, objectToSnake};