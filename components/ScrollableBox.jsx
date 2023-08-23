import React from 'react';

const ScrollableBox = (props) => {
  return (
    <div className="w-full h-full border border-gray-300 p-4">
      <div className="message-area overflow-hidden">
        <div className="message-container h-full overflow-y-scroll">
          {Array.from({ length: 20 }, (_, index) => (
            <div
              key={index}
              className="flex items-center justify-center border-b border-gray-200 py-2"
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollableBox;
