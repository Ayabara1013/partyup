
import './FilterGroup.scss';


export default function FilterGroup({ label, options, active }) {
  return (
    <div className='search__filters__filter tb2 grow m-auto tb3'>
      <div className='search__filters__filter__label'>{label}</div>
      <ul className='search__filters__filter__content'>
        {options.map((option, i) => {
          return (
            <li
              key={i}
              className={`search__filters__filter__content__option 
              ${active ? 'badge badge-primary' : 'badge badge-outline badge-primary'}`}
            >
              {option}
            </li>
          )
        })}
      </ul>
    </div>
  )
}