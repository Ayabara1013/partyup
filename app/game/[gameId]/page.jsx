'use client'

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";


import { ui } from "@/util/ui";
import { userAuth } from "@/firebase/base";
import { messaging } from "@/firebase/messaging";
import { fbManagement } from "@/firebase/fbManagement";
import { ApplicationContext } from "@/app/ApplicationContext";

export default function Page({params}) {

    const { push } = useRouter();

    const { activeGames, displayPage } = useContext(ApplicationContext);

    let [ initChat, setInitChat ] = useState(null);
    let [ casualChat, setCasualChat ] = useState(null);
    let [ members, setMembers ] = useState(null);
    let { gameId } = params;

    useEffect(() => {
        if(activeGames){
            for(let gameInfo of activeGames.dmGames){
                let { game } = gameInfo;
                if(game.id === gameId){
                    setItems();
                    return;
                }
            }
            for(let game of activeGames.playerGames){
                if(game.id === gameId){
                    setItems();
                    return;
                }
            }
            push('/home');
        }
    }, [activeGames]);

    useEffect(() => {
        ui.messaging.canon.element().scrollIntoView({ behavior: 'smooth' });
        ui.messaging.casual.element().scrollIntoView({ behavior: 'smooth' });
        displayPage(true);
    }, [initChat, casualChat]);
    const setItems = async () => {
        let game = await fbManagement.get.singleGame(gameId)
        let tempList = {};

        //Add all members to list
        for(let member of game.members){
            tempList[member.id] = (member.id !== userAuth.currentUser.uid)?`${member.uName} (Player)`:'You';
        }

        //Add DM to list
        tempList[game.uid] = (game.uid === userAuth.currentUser.uid)?'You':`${game.uName} (DM)`;

        //Set state with chats and members
        setMembers(tempList);
        setInitChat(await messaging.init.getMessages(gameId))
        setCasualChat(await messaging.casual.getMessages(gameId))
    }

    const generateChat = (messages, keyPrefix) =>{
        let finalChat = [];
        for(let i = 0; i < messages.length; i++){
            let msg = messages[i];
            msg.type = [];
            //check if last consecutive msg by a player to display name, also will do for first msg in the log.
            if(i !== 0){
                let prevMsg = messages[i - 1];
                if(prevMsg.uid !== msg.uid){
                    msg.type.push('header')
                }
            } else {
                msg.type.push('header')
            }
            if(i === messages.length - 1){
                msg.type.push('icon');
                finalChat.push(msg);
                break;
            }
            //check if last consecutive msg by a player to display icon.
            let nextMsg = messages[i + 1];
            if(nextMsg.uid !== msg.uid){
                msg.type.push('icon')
            }
            finalChat.push(msg);
        }
        return finalChat.map(msg => <ChatMessage key={`${keyPrefix}-${msg.id}`} message={msg} members={members}/> )
    }
    const generateCanonChat = () => {
        if(initChat){
            let cannonMessages = [];
            for(let msg of initChat){
                if(msg.canon){
                    cannonMessages.push(msg)
                }
            }
            return generateChat(cannonMessages, 'canon');
        }
        return <></>
    }
    const generateInitChat = () => {
        return (initChat && generateChat(initChat, ('init')))
    }
    const generateCasualChat = () => {
        return (casualChat && generateChat(casualChat, 'casual'))
    }
    const canonTextOnKeyUp = async (e) => {
        if((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey){
            await messaging.init.addMessage(gameId, e.target.value.trim())
            e.target.value = '';
            setItems()
        }
    }
    const casualTextOnKeyUp = async (e) => {
        if((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey){
            await messaging.casual.addMessage(gameId, e.target.value.trim())
            e.target.value = '';
            setItems()
        }
    }

    return (
        <div className="h-full w-full gap-4 routePage hidden">
            <div className="h-3/4 w-full border gap-4 flex">
                <div className="w-1/6 ml-4 border">
                    Some Rolling Stuff
                </div>
                <div className="w-1/3 border">
                    <div className="chat-box h-full ">
                        {generateCanonChat()}
                        <span id={ui.messaging.canon.id}/>
                    </div>
                </div>
                <div className="w-1/3 border flex flex-col">
                    <div className="chat-box ">
                        {generateInitChat()}
                        <span id={ui.messaging.canon.id}/>
                    </div>
                    <textarea className="w-full flex-1" onKeyUp={canonTextOnKeyUp}/>
                </div>
                <div className="w-1/3 border flex flex-col mr-4">
                    <div className="chat-box">
                        {generateCasualChat()}
                        <span id={ui.messaging.casual.id}/>
                    </div>
                    <textarea className="w-full flex-1" onKeyUp={casualTextOnKeyUp}/>
                </div>
            </div>
        </div>
    )
}

function ChatMessage({message, members}) {
    const { text, uid, type } = message;
    const messageClass = (uid === userAuth.currentUser.uid)?'chat-end':'chat-start';
    let name = (members)?members[uid]:uid;

    let avatar = <img src={(type.includes('icon'))?'some image source':''} alt=""/>

    return (
        <div className={`chat ${messageClass}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    {/*<img src={(type.includes('icon'))?'some image source':''} alt=""/>*/}
                    <img alt=""/>
                </div>
            </div>
                <div className="chat-header opacity-50">
                    {(type.includes('header'))?name:''}
                </div>
            <div className="chat-bubble">{text}</div>
        </div>
    )
}