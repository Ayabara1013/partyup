'use client'

import '@styles/discover/FilterTabs.scss';

/**
 *
 * @param {*} props
 * @returns
 */
export default function FilterTabs({filter, list, currentTab, setCurrentTab}) {
  // const { item } = props;
  const handleClick = (index) => {
    setCurrentTab(index);
  }

  return (
    <div className='mb-4'>
      <div className="tabs flex">
        <div onClick={() => handleClick(-1)}
             className={`tab tab-bordered ${-1 === currentTab ? 'tab-active' : ''} grow`}>
          All
        </div>
        {list.map((item, index) => {
          // console.log(tab, index);
          return (
            <div key={index} onClick={() => handleClick(index)}
                 className={`tab tab-bordered ${index === currentTab ? 'tab-active' : ''} grow`}>
              {item.title}
            </div>
          )
        })}
      </div>
    </div>
  )
}