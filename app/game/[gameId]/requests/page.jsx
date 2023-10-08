'use client'

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";


import timeAgo from "@/functions/timeAgo";
import LoadingUi from "@/components/LoadinUi";
import PageLayout from "@/components/PageLayout";
import { gameManagement } from "@/firebase/gameManagement";
import { ApplicationContext } from "@/app/ApplicationContext";

export default function Page({params}) {
    const { push } = useRouter();

    const { activeGames, displayPage, updateGames} = useContext(ApplicationContext);
    const [ doc, setDoc ] = useState(null)

    let { gameId } = params;
    const requestActionOnClick = (e) => {
        let value = e.target.value.split('|');
        let gameId = value[0];
        let userId = value[1];
        let type = e.target.innerHTML.toLowerCase();
        gameManagement[`${type}JoinRequest`](gameId, userId)
        updateGames();
    }

    useEffect(() => {
        if(doc)
            displayPage(true)
    }, [doc]);

    useEffect(() => {
        if(activeGames){
            for(let gameInfo of activeGames.dmGames){
                let { game } = gameInfo;
                if(game.id === gameId){
                    setDoc(gameInfo)
                    return;
                }
            }
            push('/home');
        }
    }, [activeGames]);

    const generateRequests = () =>{
        let { game, requestList } = doc;

        return requestList.map((request)=>
            <div key={request.id} className="w-full flex">
                <div className="w-2/3 flex border">
                    <div className="w-1/3 center vertical border">
                        <span className="w-1/3 mx-2">Username:</span>
                        <span className="w-2/3 mx-2">{request.uName}</span>
                    </div>
                    <div className="w-1/3 center vertical border">
                        <span className="w-1/3 mx-2">Status:</span>
                        <span className="w-2/3 mx-2">{request.status}</span>
                    </div>
                    <div className="w-1/3 center vertical border">
                        <span className="w-1/3 mx-2">Date:</span>
                        <span className="w-2/3 mx-2">{timeAgo(request.requestDate)}</span>
                    </div>
                </div>
                <div className="w-1/3 flex button-group">
                    <button className="btn w-1/2" value={`${game.id}|${request.id}`} onClick={requestActionOnClick}>Accept</button>
                    <button className="btn w-1/2" value={`${game.id}|${request.id}`} onClick={requestActionOnClick}>Deny</button>
                </div>
            </div>)

    }

    return (activeGames && doc)?(
        <PageLayout title={`Edit ${doc.game.name} - (${doc.game.members.length}/${doc.game.playerMax} players)`} backHref="/user/activeGames">
            {(doc)?generateRequests():<LoadingUi/>}
        </PageLayout>
    ):<></>
}