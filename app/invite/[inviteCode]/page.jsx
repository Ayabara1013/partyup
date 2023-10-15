'use client'

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { ApplicationContext } from "@/app/ApplicationContext";
import {fbManagement} from "@/firebase/fbManagement";
import {toastUser} from "@/util/functions";
import PageLayout from "@/components/PageLayout";
import LoadingUi from "@/components/LoadinUi";

export default function Page({params}) {
    let { inviteCode } = params;
    const { push } = useRouter();
    const { user, displayPage, updateGames } = useContext(ApplicationContext);

    const [ game, setGame ] = useState(null);


    useEffect(() => {
        getGameFromInvite();
    }, [user]);

    const getGameFromInvite = async () => {
        let gameDoc = await fbManagement.player.findGameFromInviteCode(inviteCode);
        if(!gameDoc){
            toastUser('Invalid invite code.', 'error');
            push('/home');
        }
        setGame(gameDoc);
        displayPage(true);
    }

    const joinGameOnClick = async () => {
        await fbManagement.player.acceptInviteLink(inviteCode, game.id);
        updateGames();
        toastUser(`You have joined the game: ${game.name}`, 'info')
        push('/home');
    }

    return (
        <PageLayout title={(game)?`Join Game: ${game.name}`:'Joining a game!'} backHref="/home">
            {(game)?
                <>
                    <div className="w-full center px-2">
                        <h2 className="w-1/4 flex mt-4 px-2 border">Game Description:</h2>
                        <h2 className="w-3/4 flex mt-4 px-2 border">{game.description}</h2>
                    </div>
                    <div className="w-full center px-2">
                        <h2 className="w-1/4 flex mt-4 px-2 border">DM:</h2>
                        <h2 className="w-3/4 flex mt-4 px-2 border">{game.uName}</h2>
                    </div>
                    <div className="w-full flex flex-col px-2">
                        <h2 className="w-full flex mt-4 px-2 border">Players:</h2>
                        <div className="w-full flex flex-col mt-4 px-2 border">
                            {game.members.map(member =>
                                <div key={member.id} className="w-full flex mt-2">{member.uName}</div>
                            )}
                            {(game.members.length === 0)?<div className="w-full flex mt-2">No players yet!</div>:null}
                        </div>
                        <button className="btn mt-5" onClick={joinGameOnClick}>Join Game!</button>
                    </div>
                </>
                :<LoadingUi/>}
        </PageLayout>
    )
}