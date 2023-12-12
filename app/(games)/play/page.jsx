import { ChatWindow } from '@/app/(games)/play/(components)/ChatWindow'
import './play.scss'



export default function Play(props) {
  // const { item } = props;

  return (
    <div className={`play-page h-full`}>
      <div className='chat-row flex p-2 gap-4'>
          <ChatWindow />
          <ChatWindow />
          <ChatWindow />
      </div>

      <div className='tool-row flex p-2 gap-4'>
        <div className='tool-row__element'>tools</div>
        <div className='tool-row__element '>tracker</div>
      </div>
    </div>
  )
}