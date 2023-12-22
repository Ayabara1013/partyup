import { Blocks } from '@/components/templates/Blocks';



const ChangeItem = ({ item }) => {
  return (
    <div className='flex b2 gap-2 h-fit'>
      <div className='text-lg whitespace-nowrap p-2 flex justify-center items-center'>
        change {item ? item : 'item'}
      </div>

      <input type="text" placeholder="that item" className="input input-bordered input-primary w-full" />

      <button className='btn btn-primary'>change</button>
    </div>
  )
}

export default function Settings(props) {
  return (
    <div className="settings-page page-wrapper flex flex-col gap-6">
      <Blocks.Section>
        <Blocks.Header>user details</Blocks.Header>
        <ChangeItem />
        <ChangeItem item={'pizza'}/>
        <ChangeItem item={`burrito`}/>
        <ChangeItem item={`email`}/>
      </Blocks.Section>

      <Blocks.Section className='gap-2'>
        <Blocks.Header>account security</Blocks.Header>
        <button className='btn btn-neutral hover:btn-accent'>change password</button>
        <button className='btn btn-neutral hover:btn-accent'>two-factor authentication</button>
      </Blocks.Section>

      <Blocks.Section>
        <div className="just-some-big-ass-text">I dunno, some stuff?</div>
      </Blocks.Section>
    </div>


  )
}