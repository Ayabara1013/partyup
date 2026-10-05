'use client'

import '@/styles/blocks.scss';
import {useEffect, useRef, useState} from "react";
import {gameSystems} from "@/lib/assets/gameSystems";
import JoinGameCardWide from "@/app/discover/(components)/JoinGameCardWide";
import {Forms} from "@/components/templates/forms";
import {Blocks} from '@/components/templates/blocks';
import {safetyChecks} from "@/lib/assets/safetyChecks";
import {supabaseGame} from "@/lib/supabase/db/game";

export default function Discover() {

    //Search Filters
    const systemsList = gameSystems.checkListArray([
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ])

    const safetyChecksList = safetyChecks.checkListArray([
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ])
    const ageCheckRef = useRef<HTMLInputElement>(null);
    const termsRef = useRef<HTMLInputElement>(null);
    const sortRef = useRef<HTMLInputElement>(null);

    const [gameList, setGameList] = useState<any[]>([]);


    useEffect(() => {
        getList();
    }, [])

    useEffect(() => {
    }, [gameList])

    async function getList() {
        let systems = []
        let safetyChecks = []
        let ageCheck = ageCheckRef.current?.checked || false
        let sortBy = sortRef.current?.value || 'Time Created'
        let searchTerm = termsRef.current?.value.trim().toLowerCase()
        for (let i = 0; i < systemsList.length; i++) {
            if (systemsList[i].ref.current?.checked)
                systems.push(systemsList[i].value)
        }
        for (let i = 0; i < safetyChecksList.length; i++) {
            if (safetyChecksList[i].ref?.current?.checked)
                safetyChecks.push(safetyChecksList[i].dbValue)
        }

        let games = await supabaseGame.get.game.publicGameList(systems, safetyChecks, ageCheck, sortBy);
        console.log(games)
        setGameList(games)
    }

    return (
        <div className={`discover-page page-wrapper`}>
            <Blocks.Section>
                <Forms.Group.Horizontal columns={3}>
                    <Forms.InputField defaultValue={``} forwardRef={termsRef} formClassName={`col-span-2`}
                                      placeholder={`Search name and tags....`}
                                      labelText={`Search:`}
                                      labelPosition={`front`}/>

                    <Forms.InputField type='select' forwardRef={sortRef} defaultValue={'time'}
                                      labelText="Sort by:" labelPosition={`front`}>
                        <option value={'time'}>Time Created</option>
                        <option value={'name'}>Name</option>
                    </Forms.InputField>
                </Forms.Group.Horizontal>
                <Forms.Group.Horizontal columns={5}>
                    <Forms.InputField type={'checkList'} list={systemsList} formClassName={`col-span-2`}
                                      labelText="Prefered Systems:"/>
                    <Forms.InputField type={'checkList'} list={safetyChecksList}
                                      labelText="Safety checks:"/>
                    <Forms.InputField type={'checkbox'} forwardRef={ageCheckRef} defaultChecked={true}
                                      labelText="Hide Age Restricted: "
                                      labelPosition={`top-left`}/>
                </Forms.Group.Horizontal>

                <button className={`btn`} onClick={getList}>Apply</button>
            </Blocks.Section>

            <Blocks.Section>
                {gameList.map((game, index) => {
                    return <JoinGameCardWide game={game} key={index}/>
                })}
            </Blocks.Section>
        </div>
    )
}