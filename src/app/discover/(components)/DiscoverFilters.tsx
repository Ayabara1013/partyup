import {gameSystems} from "@/lib/assets/gameSystems";
import {safetyChecks} from "@/lib/assets/safetyChecks";

// Safety tool columns on `game`, in the same order as safetyChecks.array
const SAFETY_COLUMNS = [`sc0`, `sc1`, `sc2`, `sc3`];

export type DiscoverFilterState = {
    search: string;
    sortBy: `time` | `name`;
    systems: string[];
    safetyChecks: string[]; // sc0..sc3 columns that must be on
    hideAgeRestricted: boolean;
};

export const DEFAULT_FILTERS: DiscoverFilterState = {
    search: ``,
    sortBy: `time`,
    systems: gameSystems.array.map((s) => s.value),
    safetyChecks: [],
    hideAgeRestricted: true,
};

type DiscoverFiltersProps = {
    filters: DiscoverFilterState;
    onChange: (filters: DiscoverFilterState) => void;
};

const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

export default function DiscoverFilters({filters, onChange}: DiscoverFiltersProps) {
    const set = (patch: Partial<DiscoverFilterState>) => onChange({...filters, ...patch});

    return (
        <section className="panel discover__filters">
            <header className="panel__bar">
                <div className="panel__title">
                    <span className="panel__name">Filters</span>
                </div>
                <button className="btn btn-xs btn-ghost" onClick={() => onChange(DEFAULT_FILTERS)}>Reset</button>
            </header>

            <div className="panel__body discover-filters">
                <label className="field">
                    <span className="field__label">Search</span>
                    <input className="field__input" type="search" value={filters.search}
                           placeholder="Name, description or tag"
                           onChange={(e) => set({search: e.target.value})}/>
                    <span className="panel__hint">Separate terms with ;</span>
                </label>

                <label className="field">
                    <span className="field__label">Sort by</span>
                    <select className="field__input" value={filters.sortBy}
                            onChange={(e) => set({sortBy: e.target.value as DiscoverFilterState[`sortBy`]})}>
                        <option value="time">Newest</option>
                        <option value="name">Name</option>
                    </select>
                </label>

                <fieldset className="field">
                    <legend className="field__label">Systems</legend>
                    {gameSystems.array.map((system) =>
                        <label key={system.value} className="discover-filters__check">
                            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm"
                                   checked={filters.systems.includes(system.value)}
                                   onChange={() => set({systems: toggle(filters.systems, system.value)})}/>
                            {system.title}
                        </label>
                    )}
                </fieldset>

                <fieldset className="field">
                    <legend className="field__label">Safety tools required</legend>
                    {safetyChecks.array.map((check, i) =>
                        <label key={check.value} className="discover-filters__check">
                            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm"
                                   checked={filters.safetyChecks.includes(SAFETY_COLUMNS[i])}
                                   onChange={() => set({safetyChecks: toggle(filters.safetyChecks, SAFETY_COLUMNS[i])})}/>
                            {check.title}
                        </label>
                    )}
                </fieldset>

                <label className="discover-filters__check">
                    <input type="checkbox" className="toggle toggle-primary toggle-sm"
                           checked={filters.hideAgeRestricted}
                           onChange={(e) => set({hideAgeRestricted: e.target.checked})}/>
                    Hide age-restricted games
                </label>
            </div>
        </section>
    );
}
