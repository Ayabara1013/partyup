import {Blocks} from "@components/templates/blocks";

export default function Discover(props) {
  return (
    <div className='page-wrapper'>

      <Blocks.Section>
        <input type="text" placeholder="search" className="input input-bordered input-primary mb-2 w-full "/>

        <ol className='b2 flex flex-wrap gap-6 list-decimal list-inside'>
          <Blocks.SearchFilter>player count</Blocks.SearchFilter>
          <Blocks.SearchFilter>system</Blocks.SearchFilter>
          <Blocks.SearchFilter className='btn-accent'>genre</Blocks.SearchFilter>
          <Blocks.SearchFilter>open</Blocks.SearchFilter>
          <Blocks.SearchFilter>locked</Blocks.SearchFilter>
          <Blocks.SearchFilter>accessibility</Blocks.SearchFilter>
          <Blocks.SearchFilter>tags</Blocks.SearchFilter>
          <Blocks.SearchFilter>things</Blocks.SearchFilter>
        </ol>

        <ol>
          <ol className='b2 flex flex-wrap gap-6 list-decimal list-inside'>
            <Blocks.SearchFilter className=''>5th Edition D&D</Blocks.SearchFilter>
            <Blocks.SearchFilter className='btn-accent'>Fate Core</Blocks.SearchFilter>
            <Blocks.SearchFilter className=''>Pathfinder 1st Edition</Blocks.SearchFilter>
            <Blocks.SearchFilter className='btn-accent'>Savage Worlds (SWADE)</Blocks.SearchFilter>
          </ol>
        </ol>
      </Blocks.Section>

      <Blocks.Section className='gap-2'>
        <div className='tb1 flex gap-2 h-[12rem]'>
          <div className='tb2'>game picture</div>
          <div className='tb2 flex-auto'>game details</div>
          <div className='tb2'>game description</div>
        </div>
        <div className='tb1 flex gap-2 h-[12rem]'>
          <div className='tb2'>game picture</div>
          <div className='tb2 flex-auto'>game details</div>
          <div className='tb2'>game description</div>
        </div>
      </Blocks.Section>
      {/*<Blocks.Section>*/}
      {/*  <input type="text" placeholder="search" className="input input-bordered input-primary w-full"/>*/}

      {/*  <ol className='b2 flex flex-wrap gap-6 list-decimal list-inside'>*/}
      {/*    <Blocks.SearchFilter>player count</Blocks.SearchFilter>*/}
      {/*    <Blocks.SearchFilter>system</Blocks.SearchFilter>*/}
      {/*    <Blocks.SearchFilter className='btn-accent'>genre</Blocks.SearchFilter>*/}
      {/*    <Blocks.SearchFilter>open</Blocks.SearchFilter>*/}
      {/*    <Blocks.SearchFilter>locked</Blocks.SearchFilter>*/}
      {/*    <Blocks.SearchFilter>accessibility</Blocks.SearchFilter>*/}
      {/*    <Blocks.SearchFilter>tags</Blocks.SearchFilter>*/}
      {/*    <Blocks.SearchFilter>things</Blocks.SearchFilter>*/}
      {/*  </ol>*/}

      {/*  <ol>*/}
      {/*    <ol className='b2 flex flex-wrap gap-6 list-decimal list-inside'>*/}
      {/*      <Blocks.SearchFilter className=''>5th Edition D&D</Blocks.SearchFilter>*/}
      {/*      <Blocks.SearchFilter className='btn-accent'>Fate Core</Blocks.SearchFilter>*/}
      {/*      <Blocks.SearchFilter className=''>Pathfinder 1st Edition</Blocks.SearchFilter>*/}
      {/*      <Blocks.SearchFilter className='btn-accent'>Savage Worlds (SWADE)</Blocks.SearchFilter>*/}
      {/*    </ol>*/}
      {/*  </ol>*/}
      {/*</Blocks.Section>*/}

      {/*<Blocks.Section>*/}
      {/*  <div className='tb1 flex gap-2 h-[12rem]'>*/}
      {/*    <div className='tb2'>game picture</div>*/}
      {/*    <div className='tb2 flex-auto'>game details</div>*/}
      {/*    <div className='tb2'>game description</div>*/}
      {/*  </div>*/}
      {/*  <div className='tb1 flex gap-2 h-[12rem]'>*/}
      {/*    <div className='tb2'>game picture</div>*/}
      {/*    <div className='tb2 flex-auto'>game details</div>*/}
      {/*    <div className='tb2'>game description</div>*/}
      {/*  </div>*/}
      {/*</Blocks.Section>*/}
    </div>
  )
}