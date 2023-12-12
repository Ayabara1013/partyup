'use client'

import { useState } from 'react';

import '@styles/discover/FilterItem.scss';


export default function FilterItem({ label, isActive = false, colour = 'secondary' }) {
  const [active, setActive] = useState(isActive);
  
  const handleClick = () => {
    setActive(!active);
  }

  return (
    <div className={`badge badge-${colour} ${active ? '' : 'badge-outline'}`} onClick={handleClick} >
      {label}
    </div>
  )
}