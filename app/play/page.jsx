'use client';


import { ChatWindow } from '@app/play/(components)/ChatWindow'
import '@styles/play/play.scss'
import { usePlayContext } from './PlayContext';
import { useEffect, useRef, useState } from 'react';



export default function Play(props) {

  const { windowState, setWindowState } = usePlayContext();

  const windowStateProps = {
    windowState, setWindowState,
  }
  // const { item } = props;

  return (
    <div className={`play-page h-full`}>
      <div className='chat-row flex p-2 gap-2'>
        <ChatWindow {...windowStateProps} index={0} name={'canon'} />
        <ChatWindow {...windowStateProps} index={1} name={'turn'} />
        <ChatWindow {...windowStateProps} index={2} name={'open'} />
      </div>

      <div className='tool-row flex p-2 gap-4'>

        <div className='tool-row__element flex flex-1 gap-2'>
          <PlayerTracker value={25} isturn={true} />
          <PlayerTracker value={35} />
          <PlayerTracker value={45} />
          <PlayerTracker value={70} />
        </div>

        <div className='tool-row__element flex flex-shrink'>
          <div className='border border-primary rounded min-w-[100px]'>
            [tools]
          </div>
        </div>
      </div>

    </div>
  )
}

const PlayerTracker = ({ value = 50, isturn = false }) => {
  const [isTurn, setIsTurn] = useState(0);

  const handleClick = () => {
    // setIsTurn(!isTurn);
    if (isTurn < 2) setIsTurn(isTurn + 1);
    else setIsTurn(0);
  }

  return (
    <div className='border border-primary flex flex-col flex-1 p-2 h-full rounded'>
      <div className="flex flex-1 gap-2" onClick={handleClick}>
        <div className='flex-1 m-auto text-xl text-primary font-bold'>{isTurn.toString()}</div>

        <div className={`aspect-square ${isTurn == 0 ? `bg-error` : isTurn == 1 ? `border-2 border-success` : `bg-success`} rounded`}></div>
      </div>

      <div className="player-tracker__hp-bar flex flex-1 gap-2 items-center">
        <div className='m-auto text-2xl text-primary font-semibold uppercase'>hp</div>
        {/* <ProgressBar value={value} max={100} /> */}
        <ProgressBar value={value} max={100} />

        {/* <progress className={`progress w-full h-6`} value={50} max='100'></progress> */}
      </div>

      <div className='border border-accent flex-1'>is turn</div>


    </div>
  )
}

const ProgressBar = ({ value, max }) => {
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);

  const tpb = 40; // text placement breakpoint

  useEffect(() => {
    const progressBar = progressBarRef.current;
    const progressText = progressTextRef.current;

    const percentage = (value / max) * 100;

    progressText.textContent = `${value}`;
    
    if (percentage > tpb) {
      progressText.style.left = `calc(${percentage}% - 1.25rem)`;
      progressText.style.right = `auto`;
    }
    else {
      progressText.style.left = `auto`;
      progressText.style.right = `calc(${100 - percentage}% - 1.25rem)`;
    }

  }, [value, max]);

  const progressClass = value > 66
    ? 'progress-success'
    : value < 33
      ? 'progress-error'
      : 'progress-warning';

  const textClass = (() => {
    switch (true) {
      case value > 66:
        return `text-success-content`;
      case value > tpb:
        return `text-warning-content`;
      case value > 33:
        return `text-warning`;
      default:
        return `text-error`;
    }
  })();

  return (
    <div className='flex relative w-full'>
      <progress ref={progressBarRef} className={`progress ${progressClass} h-6`} value={value} max={max}></progress>
      <div ref={progressTextRef} className={`absolute top-0 ${textClass} font-bold`}></div>
      <div className='absolute top-0 right-1 font-bold'>100</div>
    </div>
  );
};