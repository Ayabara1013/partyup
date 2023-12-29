import { Blocks } from '@/components/templates/Blocks';
import Link from 'next/link';


export default function CreateWorld() {
  return (
    <div className='create-world-page page-wrapper'>
      <div>Create a World</div>

      <Blocks.Section className='flex-col-4'>
        <input type="text" placeholder='what is the name of your world?' className='input input-primary' />
        
        <Link href={`/home`} className='btn btn-primary'>done</Link>
      </Blocks.Section>
      
    </div>
  )
}