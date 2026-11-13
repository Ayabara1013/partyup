// A user's picture, or the first letter of their name when there's no picture. Every call site keeps its own
// class names (so sizes don't change here); this only makes the <img> attributes consistent. Google's avatar host
// is known to refuse some requests that send a referrer, hence referrerPolicy.
export default function Avatar({src, name, imageClassName, fallbackClassName}: {
    src?: string | null;
    name?: string;
    imageClassName?: string;
    fallbackClassName?: string;
}) {
    if (src) {
        return <img className={imageClassName} src={src} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer"/>;
    }
    return <span className={`avatar-fallback ${fallbackClassName ?? ``}`}>{(name ?? `?`).charAt(0).toUpperCase()}</span>;
}
