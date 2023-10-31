import { DiscoverCard } from '@/components/discover/DiscoverCard';




export function Discover(props) {
  // const { item } = props;

  
  const content = {
    name: 'game name',
    description: 'dropped standard community butter screen original sing clean low conversation soil getting individual heard sense tune he mail task led only middle prove health\nstock wait paragraph pond wrote victory lamp dark real repeat could automobile expression complex area anyway perfect driver pretty require tool son tried deer\nfish library saved occasionally particles my military prepare job theory mother worried toy sitting giant sister rod bigger kids warm twelve lucky some recognize',
    gm: 123, // this will actually be a proper ref to the gm on the db
    meta: {
      tags: [],
      system: 'that system',
      players: 4, 
      nextGame: '10/13/1992'
    }
  };

  return (
    <div className={`discover-page flex justify-evenly h-full`}>
      <DiscoverCard content={content} />
      {/* <DiscoverCard content={content} /> */}
    </div>
  )
}


