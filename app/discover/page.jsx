'use client'

import {DiscoverCard} from '@app/discover/(components)/DiscoverCard';
import FilterTabs from '@app/discover/(components)/FilterTabs';
import {Blocks} from '@components/templates/blocks';
import '@styles/blocks.scss';
import {useState} from "react";
import {gameSystems} from "@/javascript/assets/gameSystems";
import {useAccountManager} from "@app/(contexts)/accountManager";

export default function Discover() {
  const [sysCurrentTab, setSysCurrentTab] = useState(-1);
  const {gmGames} = useAccountManager();
  return (
    <div className={`discover-page page-wrapper`}>

      <Blocks.Section>
        <div className='search border-b w-full p-4'>
          <div className='search__bar mb-4 px-4'>
            <input type="text" placeholder="Type here..." className="input input-bordered input-primary w-full"/>
          </div>
          <FilterTabs {...{
            filter: 'systems', list: gameSystems.array,
            currentTab: sysCurrentTab, setCurrentTab: setSysCurrentTab
          }}/>
        </div>
      </Blocks.Section>

      <Blocks.Section>
        {gmGames &&
          <DiscoverCard game={gmGames[0]}/>
        }
        {/*<DiscoverCard/>*/}
      </Blocks.Section>
    </div>
  )
}

