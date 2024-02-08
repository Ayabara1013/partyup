'use client';


import { ChatWindow } from '@app/play/(components)/ChatWindow'
import '@styles/play/play.scss'
import { usePlayContext } from './PlayContext';



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
        <div className='tool-row__element'>
          tools
        </div>

        <div className='tool-row__element '>
          tracker
        </div>
      </div>

    </div>
  )
}