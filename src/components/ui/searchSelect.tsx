'use client'

import {Fragment, KeyboardEvent, useEffect, useMemo, useRef, useState} from "react";

export type SearchSelectGroup = { label?: string; options: string[] };

type SearchSelectProps = {
    id: string; // for the <label htmlFor>
    groups: SearchSelectGroup[]; // a group's label shows above its options
    value: string | null;
    onChange: (value: string | null) => void;
    noneLabel: string; // the first entry; choosing it sets null ("None", "Any")
};

type Entry = { value: string | null; text: string; group?: string };

// Searchable dropdown: a text field that filters the list below it. Arrow keys move, Enter picks, Escape closes;
// leaving the field (a click outside, Tab) closes it too.
export default function SearchSelect({id, groups, value, onChange, noneLabel}: SearchSelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(``);
    const [active, setActive] = useState(0);
    const listRef = useRef<HTMLUListElement>(null);
    const listId = `${id}-list`;

    // What matches the typed text, the "none" entry first
    const entries = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list: Entry[] = [];
        if (!q || noneLabel.toLowerCase().includes(q)) list.push({value: null, text: noneLabel});
        for (const group of groups) {
            for (const option of group.options) {
                if (!q || option.toLowerCase().includes(q)) list.push({value: option, text: option, group: group.label});
            }
        }
        return list;
    }, [groups, noneLabel, query]);

    // Keep the highlighted entry in view while moving with the arrow keys
    useEffect(() => {
        if (open) listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({block: `nearest`});
    }, [open, active]);

    const openList = () => {
        setQuery(``);
        setActive(0);
        setOpen(true);
    };

    const pick = (entry: Entry) => {
        onChange(entry.value);
        setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === `ArrowDown` || e.key === `ArrowUp`) {
            e.preventDefault();
            if (!open) return openList();
            const step = e.key === `ArrowDown` ? 1 : -1;
            setActive((i) => entries.length === 0 ? 0 : (i + step + entries.length) % entries.length);
        } else if (e.key === `Enter` && open) {
            e.preventDefault(); // in a form, Enter would submit it
            if (entries[active]) pick(entries[active]);
        } else if (e.key === `Escape` && open) {
            e.preventDefault();
            setOpen(false);
        }
    };

    return (
        <div className="search-select">
            <input id={id} className="field__input" role="combobox" autoComplete="off"
                   aria-expanded={open} aria-controls={listId} aria-autocomplete="list"
                   aria-activedescendant={open && entries[active] ? `${listId}-${active}` : undefined}
                   value={open ? query : value ?? ``} placeholder={open ? value ?? noneLabel : noneLabel}
                   onFocus={openList} onClick={() => !open && openList()} onBlur={() => setOpen(false)}
                   onChange={(e) => {
                       setQuery(e.target.value);
                       setActive(0);
                       setOpen(true);
                   }}
                   onKeyDown={onKeyDown}/>
            {open &&
              // mousedown would move the focus out of the field and close the list before the click lands
              <ul id={listId} ref={listRef} role="listbox" className="search-select__list popup-surface thin-scrollbar"
                  onMouseDown={(e) => e.preventDefault()}>
                  {entries.length === 0 && <li className="search-select__empty">No matches</li>}
                  {entries.map((entry, i) =>
                      <Fragment key={`${entry.group ?? ``}/${entry.text}`}>
                          {entry.group && entry.group !== entries[i - 1]?.group &&
                            <li role="presentation" className="search-select__group">{entry.group}</li>}
                          <li id={`${listId}-${i}`} role="option" data-index={i} aria-selected={entry.value === value}
                              className={`search-select__option ${i === active ? `search-select__option--active` : ``} ${entry.value === value ? `search-select__option--chosen` : ``}`}
                              onMouseEnter={() => setActive(i)} onClick={() => pick(entry)}>
                              {entry.text}
                          </li>
                      </Fragment>
                  )}
              </ul>}
        </div>
    );
}
