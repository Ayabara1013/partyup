import { DaisyTextInputLabelled } from '@/components/daisyUI/text-inputs';
import { Blocks } from '@/components/templates/Blocks';
import Link from 'next/link';



export default function CreateCommunity() {
  return (
    <div className='create-community-page page-wrapper'>
      <div>Create a Community </div>

      <Blocks.Section className='flex-col-4'>
        <DaisyTextInputLabelled className='input-primary' label='Community Name' topLeft={'Community Name'} placeholder='what is the name of your community?' />

        <DaisyTextInputLabelled className='input-primary' label='Community Purpose' topLeft={'Community Purpose'} bottomLeft={'<<placeholder>>'} placeholder='what is the PURPOSE of your community?' />

        <DaisyTextInputLabelled className='input-primary' label='Community Tags' topLeft={'Community Tags'} bottomLeft={'<<placeholder>>'} placeholder='<<XHANGETHIS TO A TAGS SELECT OR SOMETHING>>' />
      
        <Link href={`/home`} className='btn btn-primary'>done</Link>
      </Blocks.Section>
      
    </div>
  )
}