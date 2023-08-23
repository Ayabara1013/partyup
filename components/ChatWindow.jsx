// components/ScrollableBox.js
import React, { useState } from 'react';

const ScrollableBox = () => {
  const [count, setCount] = useState(1);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div className="w-full h-64 border rounded-lg overflow-hidden">
      <div className="h-full overflow-y-scroll p-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="border-b p-2">
            Item {index + 1}
          </div>
        ))}
      </div>
      <button
        className="w-full p-2 bg-blue-500 text-white"
        onClick={handleIncrement}
      >
        Add Item
      </button>
    </div>
  );
};

export default ScrollableBox;
