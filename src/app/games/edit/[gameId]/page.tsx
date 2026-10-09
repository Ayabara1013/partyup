"use client"

import toast from "react-hot-toast";
import React, {use, useEffect} from 'react'
import {useRouter} from "next/navigation";
import {Forms} from "@/components/ui/forms";
import {dirHref} from "@/lib/routing/directoy";
import {useGameManager} from "@/app/(context)/gameCreationEditorContext";
import {gameSystems} from "@/lib/assets/gameSystems";
import {firefoxNumberInputOnKeyDown} from "@/lib/util/browserFixes/firefox";
import {useAuthManager} from "@/app/(context)/authContext";
import {supabaseGame} from "@/lib/supabase/db/game";

type PageProps = {
    className?: string,
    params: Promise<{
        gameId: string;
    }>;
};

export default ({className, params}: PageProps) => {
    const {push} = useRouter();
    const {user, userLoading, gmGames, gamesLoading} = useAuthManager();
    const {gameInfoRefs, safetyChecksList, getFormData} = useGameManager();
    const {gameNameRef, systemRef, maxPlayersRef, tagsRef, publicGameRef, descRef, ageResRef} = gameInfoRefs;
    const {gameId} = use(params);

    useEffect(() => {
        ownerCheck()
    }, [user, gmGames]);

    const ownerCheck = () => {
        if (userLoading || gamesLoading) return;

        const game = user && gmGames.find((game) => game.id === gameId);
        if (game) {
            let tagTemp = ''
            for (let i = 0; i < game.tags.length; i++) {
                tagTemp += i > 0 ? ',' : ''
                tagTemp += game.tags[i];
            }
            tagsRef.current.value = tagTemp;
            for (let i = 0; i < safetyChecksList.length; i++) {
                safetyChecksList[i].ref.current.checked = game[`sc` + i];
            }
            gameNameRef.current.value = game.name;
            descRef.current.value = game.description;
            maxPlayersRef.current.value = game.maxPlayers;
            systemRef.current.value = game.system;
            ageResRef.current.value = game.ageRestriction;

        } else {
            toast.error('You are not the owner of this game.');
            push(dirHref.games.root);
        }
    }

    const submitOnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.disabled = true;
        e.currentTarget.classList.toggle('btn-disabled')
        let data = getFormData();
        toast(`Game info. has been sent.`)
        if (user) {
            console.log(data)
            const result = await supabaseGame.set.edit.game(data, gameId)
            if (result.id === gameId) {
                push(dirHref.games.root)
            } else {
                toast(`Some error occurred!`)
            }
        }
    }

    return (
        <div className={`${className} game-create-page tb1 flex h-full m-auto justify-center`}>
            <div className='flex-col-4 my-auto p-8 bg-neutral w-[60vw] rounded-xl'>
                <h1 className={`font-medium text-2xl`}>Edit your game</h1>

                {/* enter game name */}

                <Forms.InputField forwardRef={gameNameRef}// @ts-expect-error
                                  labelText="What is the name of your game?" defaultValue={'Test Game'}/>
                {/* enter game description */}
                <Forms.InputField forwardRef={descRef} type={'textarea'}// @ts-expect-error
                                  rows={`3`} defaultValue={``} labelText="What is the description of your game?"/>
                {/* select system */}
                <Forms.InputField type='select' forwardRef={systemRef}// @ts-expect-error
                                  defaultValue={'dnd5e'} labelText="What system will you be using?">
                    <option value={''} disabled>what system do you want to use?</option>
                    {gameSystems.array.map((gameSystem, index) => {
                        return <option value={gameSystem.value} key={index}>{gameSystem.title}</option>
                    })}
                </Forms.InputField>

                {/* enter max players */}
                <Forms.InputField type="number" forwardRef={maxPlayersRef} // @ts-expect-error
                                  min={1} max={4} defaultValue={2}
                                  onKeyDown={firefoxNumberInputOnKeyDown}
                                  labelText="Enter your preferred number of players (Max: 4)"
                                  labelSubText="(not including yourself)"/>

                {/* enter age restriction */}
                <Forms.InputField type="number" forwardRef={ageResRef}// @ts-expect-error
                                  min={10} defaultValue={10}
                                  onKeyDown={firefoxNumberInputOnKeyDown}
                                  labelText="Enter age restriction."
                                  labelSubText="(leave at 10 for site default)"/>
                {/* select safety checks */}
                <Forms.InputField type={'checkList'} list={safetyChecksList}
                                  labelText="Select your safety checks: (optional)"
                                  labelSubText="You can change these in the future!"/>

                <Forms.InputField forwardRef={tagsRef} placeholder={'Input tags'}// @ts-expect-error
                                  defaultValue={`dnd,ocean,world`}
                                  labelText="Add tags to your game (optional):"
                                  labelSubText="Seperate tags with commas with no spaces (,)"/>
                <Forms.InputField forwardRef={publicGameRef} type={'checkbox'}// @ts-expect-error
                                  checked={true} readOnly={true}
                                  labelText="Is this a public game?"
                                  labelSubText="(Will be static public for testing)"/>
                {/*  the confirm button needs to check if all the fields are valid! */}
                <button className='px-4 btn btn-primary m-auto' onClick={submitOnClick}>Save!</button>
            </div>
        </div>
    )
}