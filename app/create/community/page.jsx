import Link from 'next/link';



export default function CreateCommunity() {
  return (
    <div className='create-community-page page-wrapper'>
      <div>create community</div>

      <input type="text" placeholder='what is the name of your world?' className='input input-primary' />
      
      <Link href={`/home`}>dopne</Link>
      
    </div>
  )
}