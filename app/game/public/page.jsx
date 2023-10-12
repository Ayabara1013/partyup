'use client'

import { useAuthState } from "react-firebase-hooks/auth";
import { useContext, useEffect, useState } from "react";

import LoadingUi from "@/components/LoadinUi";
import PageLayout from "@/components/PageLayout";
import { userAuth } from "@/firebase/base";
import { fbManagement } from "@/firebase/fbManagement";
import { ApplicationContext } from "@/app/ApplicationContext";
import {useRouter} from "next/navigation";

export default function Page() {
    const [ user ] = useAuthState(userAuth);

    const [ render, reRender ] = useState(false);
    const [ publicGames, setPublicGames ] = useState(null);

    const { displayPage } = useContext(ApplicationContext);
    const { push } = useRouter();

    useEffect(() => {
        push('/home')
        // displayPage(true)
    }, []);
    useEffect(() => {
        setGames();
    }, [user]);

    const setGames = async () => {
        if(user){
            setPublicGames(await fbManagement.get.publicGames());
        }
    }

    const joinGameOnClick = async (e) => {
        let gameId = e.target.value;
        await fbManagement.player.joinPublicGame(e.target.value);
        for(let game of publicGames){
            if(game.id === gameId){
                game.userRequest = 'pending'
                reRender(!render)
            }
        }
    }

    const pendingOnClick = async (e) => {
        let gameId = e.target.value;
        await fbManagement.player.cancelJoinRequest(gameId);
        for(let game of publicGames){
            if(game.id === gameId){
                game.userRequest = 'none'
                reRender(!render)
            }
        }
    }
    const generateGameList = () => {
        return (publicGames.length > 0)?
            publicGames.map((game) =>
                <div key={game.id} className="w-full h-14 center border">
                    <div className="w-3/4 center">
                        <div className="w-1/3 center vertical border">
                            <span className="w-1/3 mx-2">Name:</span>
                            <span className="w-2/3 mx-2">{game.name}</span>
                        </div>
                        <div className="w-1/3 center vertical border">
                            <span className="w-1/3 mx-2">DM:</span>
                            <span className="w-2/3 mx-2">{game.uName}</span>
                        </div>
                        <div className="w-1/3 center vertical border">
                            <span className="w-2/3 mx-2">Player Count:</span>
                            <span className="w-1/3 mx-2">{game.members.length}/{game.playerMax}</span>
                        </div>
                    </div>
                    <>
                        {(game.userRequest === 'none')?<button className="btn w-1/4" onClick={joinGameOnClick} value={game.id}>Join</button>:<></>}
                        {(game.userRequest === 'pending')?<button className="btn w-1/4 publicPending" onClick={pendingOnClick} value={game.id}></button>:<></>}
                        {(game.userRequest === 'denied')?<button className="btn w-1/4 btn-error" value={game.id}>Denied</button>:<></>}
                    </>
                </div>
            )
            :<div className="flex flex-col">
                <span className="text-center mt-5">No public games available</span>
            </div>;
    }
console.log(publicGames)
    return (
        <PageLayout title="Public Games" backHref="/home">
            {(publicGames) ?generateGameList() :<LoadingUi/>}
        </PageLayout>
    )
}