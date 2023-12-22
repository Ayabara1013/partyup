import { DaisyTextInputLabelled } from '@/components/daisyUI/text-inputs';
import { Blocks } from '@/components/templates/Blocks';

import '@styles/fonts.scss'

export default function CreateGame() {
  return (
    <div className='create-game-page page-wrapper'>
      <Blocks.Header>Create a game</Blocks.Header>

      <div className='flex flex-col gap-4 m-auto border w-2/3'>
        <DaisyTextInputLabelled
          className='input-primary'
          labelClass='text-2xl font-bold'
          labelAltClass='text-xl'
          topLeft={'what is the game called?'}
          topRight={'thing here'}
          bottomLeft={'also also thing here'}
          bottomRight={'also thing here'}
        />
        
        <DaisyTextInputLabelled
          className='input-primary'
          labelClass='text-2xl font-bold'
          labelAltClass='text-xl'
          topLeft={'what system does it use?'}
        />
        <DaisyTextInputLabelled
          className='input-primary'
          labelClass='text-2xl font-bold'
          labelAltClass='text-xl'
          topLeft={'how many players will you have?'}
        />
        <DaisyTextInputLabelled
          className='input-primary'
          labelClass='text-2xl font-bold'
          labelAltClass='text-xl'
          topLeft={'what special rules will you use?'}
        >
          note; this will  be a different element most likely
        </DaisyTextInputLabelled>
      </div>


      


    </div>
  )
}

