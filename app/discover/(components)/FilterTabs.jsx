'use client'


import { useState } from 'react';
import '@styles/discover/FilterTabs.scss';


/**
 * 
 * @param {*} props 
 * @returns 
 */
export default function FilterTabs({tabList = ['you', 'did', 'something', 'wrong', 'dude', 'lol', 'fix', 'it']}) {
	// const { item } = props;

	const [currentTab, setCurrentTab] = useState(1);

	const handleClick = (index) => {
		setCurrentTab(index);
	}

	return (
		<div className='mb-4'>
			<div className="tabs flex">
				{tabList.map((tab, index) => {
					console.log(tab, index);
					return (
						<div
							key={index}
							className={`tab tab-bordered ${index === currentTab ? 'tab-active' : ''} grow`}
							onClick={() => handleClick(index)}
						>
							{tabList[index]}
						</div>
					)
				})}
			</div>
		</div>
	)
}