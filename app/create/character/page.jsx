import {DaisyTextInputLabelled} from '@/components/daisyUI/text-inputs';
import {Blocks} from '@components/templates/blocks';
import Link from 'next/link';
import {dirHref} from "@/javascript/assets/directoryHref";


export default function CreateCharacter() {
    return (
        <div className='create-character-page page-wrapper'>
            <Blocks.Section>
                <Blocks.Header className='text-5xl text-accent'>Create a Character</Blocks.Header>
            </Blocks.Section>

            <Blocks.Section>
                <DaisyTextInputLabelled
                    className='input-primary'
                    labelClass='text-xl'
                    topLeft={`What is the character's name?`}>
                    sir dude of placeholder
                </DaisyTextInputLabelled>

                <DaisyTextInputLabelled
                    className='input-primary'
                    labelClass='text-xl'
                    topLeft={`What is your quest?`}>
                    To find the holy grail
                </DaisyTextInputLabelled>

                <DaisyTextInputLabelled
                    className='input-primary'
                    labelClass='text-xl'
                    topLeft={`What is your favourite colour?`}>
                    yellow, no! blue!
                </DaisyTextInputLabelled>

                <DaisyTextInputLabelled
                    className='input-primary'
                    labelClass='text-xl'
                    topLeft={`What is the airspeed velocity of an unlaiden swallow`}>
                    African or European?
                </DaisyTextInputLabelled>
            </Blocks.Section>

            <Blocks.Section>
                <Link className='btn btn-primary' href={dirHref.home}>done</Link>
            </Blocks.Section>
        </div>
    )
}