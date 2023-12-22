import { Blocks } from '@/components/templates/Blocks';
import Link from 'next/link';


export default function Create() {
  return (
    <div className='create-page page-wrapper flex flex-col gap-6'>
      <Blocks.Section>
        <Blocks.Header>What do you want to create?</Blocks.Header>

        <div className='m-auto'>
          <div className='text-xl text-center font-semibold' >I want to create...</div>
          <ul className='flex gap-2'>
            <li><button className='btn btn-primary'>a character to play</button></li>
            <li><button className='btn btn-primary'>a game for me and my friends</button></li>
            <li><button className='btn btn-primary'>a world to play in</button></li>
            <li><button className='btn btn-primary'>a community to share</button></li>
          </ul>
        </div>
      </Blocks.Section>

      <Blocks.Section className=''>
        <Blocks.Header>Create a Character</Blocks.Header>
        <div className='flex text-center justify-center items-center gap-4'>
          <div className=''>
            <div>create a character</div>
            <button className='btn btn-primary px-8'>start</button>
          </div>

          <div className='w-1/3 '>
            <div>or get a quick start here</div>
            <input type="text" placeholder="tell me something about your character!" className="input input-bordered input-primary w-full" />
          </div>

          <Link href='/create/character' passhref className=''>
            <div>or get a quick start here</div>
            <button className='btn btn-primary whitespace-nowrap'>
              {'goto /create/character'}
            </button>
          </Link>
        </div>
      </Blocks.Section>

      <Blocks.Section>
        <Blocks.Header>Create a Game</Blocks.Header>

        <div className='flex gap-2 m-auto items-center'>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">What is the game called?</span>
            </div>
            <input type="text" placeholder="Type here" className="input input-bordered input-primary w-full max-w-xs" />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">pick your system</span>
            </div>
            <select className="select select-bordered select-primary">
              <option disabled selected>Pick one</option>
              <option>Star Wars</option>
              <option>Harry Potter</option>
              <option>Lord of the Rings</option>
              <option>Planet of the Apes</option>
              <option>Star Trek</option>
            </select>
          </label>

          <div className='text-2xl text-warning whitespace-nowrap'>
            and some other stuff
          </div>
          
          <Link  href='/create/game' passhref>
            <button className='btn btn-primary whitespace-nowrap'>
              {'goto /create/game'}
            </button>
          </Link>
        </div>
      </Blocks.Section>

      <Blocks.Section>
        <Blocks.Header>Create a World</Blocks.Header>

        <div className='flex gap-2 m-auto items-center'>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">What is the world called?</span>
            </div>
            <input type="text" placeholder="Type here" className="input input-bordered input-primary w-full max-w-xs" />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">pick your genre</span>
            </div>
            <select className="select select-bordered select-primary">
              <option disabled selected>Pick one</option>
              <option>Star Wars</option>
              <option>Harry Potter</option>
              <option>Lord of the Rings</option>
              <option>Planet of the Apes</option>
              <option>Star Trek</option>
            </select>
          </label>

          <div className='text-2xl text-warning whitespace-nowrap'>and some other stuff</div>

          <Link  href='/create/world' passhref>
            <button className='btn btn-primary whitespace-nowrap'>
              {'goto /create/world'}
            </button>
          </Link>
        </div>

      </Blocks.Section>

      <Blocks.Section>
        <Blocks.Header>Create a Community</Blocks.Header>

        <div className='flex gap-2 m-auto items-center'>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">What is the community called?</span>
            </div>
            <input type="text" placeholder="Type here" className="input input-bordered input-primary w-full max-w-xs" />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">pick your category</span>
            </div>
            <select className="select select-bordered select-primary">
              <option disabled selected>Pick one</option>
              <option>Star Wars</option>
              <option>Harry Potter</option>
              <option>Lord of the Rings</option>
              <option>Planet of the Apes</option>
              <option>Star Trek</option>
            </select>
          </label>

          <div className='text-2xl text-warning whitespace-nowrap'>and some other stuff</div>

          <Link  href='/create/community' passhref>
            <button className='btn btn-primary whitespace-nowrap'>
              {'goto /create/community'}
            </button>
          </Link>
        </div>
      </Blocks.Section>

      

      
    </div>
  )
}