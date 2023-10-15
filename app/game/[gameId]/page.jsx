'use client'

import moment from "moment";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";


import ContextMenuBase from "@/components/ContextMenu/ContextMenuBase";
import DmMessageOptions from "@/components/ContextMenu/DmMessageOptions";
import PlayerMessageOptions from "@/components/ContextMenu/PlayerMessageOptions";
import {addArraytoArray, sortByKey} from "@/util/functions";

import { ui } from "@/util/ui";
import { userAuth } from "@/firebase/base";
import { messaging } from "@/firebase/messaging";
import { fbManagement } from "@/firebase/fbManagement";
import { ApplicationContext } from "@/app/ApplicationContext";
import { messageLocalStorage } from "@/util/localStorage";
export default function Page({params}) {

    const { push } = useRouter();

    const { activeGames, displayPage } = useContext(ApplicationContext);

    const [ isDm, setIsDm ] = useState(false);
    const [ members, setMembers ] = useState(null);
    const [ clicked, setClicked ] = useState(false);
    const [ initChat, setInitChat ] = useState(null);
    const [ casualChat, setCasualChat ] = useState(null);
    const [ contextMenu, setContextMenu ] = useState(null);


    useEffect(() => {
        const handleClick = ()=>{setClicked(false)}
        window.addEventListener('click', handleClick)
        return () => {
            window.removeEventListener('click', handleClick)
        }
    },[])

    let { gameId } = params;

    useEffect(() => {
        if(activeGames){
            for(let gameInfo of activeGames.dmGames){
                let { game } = gameInfo;
                if(game.id === gameId){
                    setIsDm(true);
                    setItems();
                    messaging.init.liveMessages(gameId, liveInitUpdate).then();
                    messaging.casual.liveMessages(gameId, liveCasualUpdate).then();
                    return;
                }
            }
            for(let game of activeGames.playerGames){
                if(game.id === gameId){
                    setItems();
                    messaging.init.liveMessages(gameId, liveInitUpdate).then();
                    messaging.casual.liveMessages(gameId, liveCasualUpdate).then();
                    return;
                }
            }
            push('/home');
        }
    }, [activeGames]);

    useEffect(() => {
        ui.messaging.canon.element().scrollIntoView({ behavior: 'smooth' });
        ui.messaging.casual.element().scrollIntoView({ behavior: 'smooth' });
        ui.messaging.init.element().scrollIntoView({ behavior: 'smooth' });
        displayPage(true);
    }, [initChat, casualChat]);
    const setItems = async () => {
        //Get game info
        let game = await fbManagement.get.singleGame(gameId)
        let tempList = {};

        //Add all members to list for quick message lookup
        for(let member of game.members){
            tempList[member.id] = (member.id !== userAuth.currentUser.uid)?`${member.uName} (Player)`:'You';
        }
        //Add DM to list
        tempList[game.uid] = (game.uid === userAuth.currentUser.uid)?'You':`${game.uName} (DM)`;

        //Get messages from local storage
        let initMessages = messageLocalStorage.getInit(gameId);
        let casualMessages = messageLocalStorage.getCasual(gameId);

        //Get messages from server if local storage is empty or if there are new messages (saves on reads)
        if(initMessages.length > 0){
            let lastTime = messageLocalStorage.getInitAccessTime(gameId);
            let tempMessages = await messaging.init.getUpdateMessage(gameId, lastTime);
            addArraytoArray(initMessages, tempMessages, 'id');
        }
        else {
            initMessages = await messaging.init.getMessages(gameId);
        }
        if(casualMessages.length > 0){
            let lastTime = messageLocalStorage.getCasualAccessTime(gameId);
            let tempMessages = await messaging.casual.getUpdateMessage(gameId, lastTime);
            addArraytoArray(casualMessages, tempMessages, 'id');
        }
        else {
            casualMessages = await messaging.casual.getMessages(gameId);
        }
        //Sort messages by time
        sortByKey(initMessages, 'createdAt');
        sortByKey(casualMessages, 'createdAt');

        //Save messages to local storage and state
        messageLocalStorage.setInit(gameId, initMessages);
        messageLocalStorage.setCasual(gameId, casualMessages);
        setMembers(tempList);
        setInitChat(initMessages)
        setCasualChat(casualMessages)
    }

    //Live update of new init messages
    const liveInitUpdate = async (tempInitMessages) => {
        let initMessages = messageLocalStorage.getInit(gameId);
        addArraytoArray(initMessages, tempInitMessages, 'id');
        sortByKey(initMessages, 'createdAt');
        messageLocalStorage.setInit(gameId, initMessages);
        setInitChat(initMessages)
    }
    //Live update of new casual messages
    const liveCasualUpdate = async (tempCasualMessages) => {
        let casualMessages = messageLocalStorage.getCasual(gameId);
        addArraytoArray(casualMessages, tempCasualMessages, 'id');
        sortByKey(casualMessages, 'createdAt');
        messageLocalStorage.setCasual(gameId, casualMessages);
        setCasualChat(casualMessages)
    }
    //Generate chat messages
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
        let setFunc = {context: setContextMenu, clicked: setClicked}
        return finalChat.map(msg => <ChatMessage key={`${keyPrefix}-${msg.id}`} message={msg} members={members} setFunc={setFunc}/> )
    }
    const generateCanonChat = () => {
        if(initChat){
            let canonMessages = [];
            for(let msg of initChat){
                if(msg.canon){
                    canonMessages.push(structuredClone(msg))
                }
            }
            sortByKey(canonMessages, 'createdAt');
            return generateChat(canonMessages, 'canon');
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
            await messaging.init.addMessage(gameId, e.target.value.trim());
            e.target.value = '';
        }
    }
    const casualTextOnKeyUp = async (e) => {
        if((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey){
            await messaging.casual.addMessage(gameId, e.target.value.trim());
            e.target.value = '';
        }
    }

    return (
        <div className="h-full w-full gap-4 routePage hidden">
            <div className="h-3/4 w-full border gap-4 flex px-4">
                <div className="w-1/6 border">
                    Some Rolling Stuff
                </div>
                <div className="w-1/3 border">
                    <div className="chat-box h-full">
                        {generateCanonChat()}
                        <span id={ui.messaging.canon.id}/>
                    </div>
                </div>
                <div className="w-1/3 border flex flex-col">
                    <div className="chat-box">
                        {generateInitChat()}
                        <span id={ui.messaging.init.id}/>
                    </div>
                    <textarea className="w-full flex-1" onKeyUp={canonTextOnKeyUp}/>
                </div>
                <div className="w-1/3 border flex flex-col">
                    <div className="chat-box">
                        {generateCasualChat()}
                        <span id={ui.messaging.casual.id}/>
                    </div>
                    <textarea className="w-full flex-1" onKeyUp={casualTextOnKeyUp}/>
                </div>
            </div>
            {clicked && (
                <ContextMenuBase style={contextMenu.style}>
                    <PlayerMessageOptions message={contextMenu.message}/>
                    {isDm && <DmMessageOptions message={contextMenu.message} gameId={gameId}/>}
                </ContextMenuBase>
            )}
        </div>
    )
}

function ChatMessage({message, members, setFunc}) {
    const { text, uid, type, canon } = message;

    const baseChatClass = (uid === userAuth.currentUser.uid)?'chat-end':'chat-start';

    let name = (members)?members[uid]:uid;
    let avatar = <img src={(type.includes('icon'))?'some image source':''} alt=""/>
    let messageTimeText = moment(message.createdAt).calendar();
    let messageClass = (canon)?`chat-bubble-info`:''


    const disableContextMenu = (e) => {
        e.preventDefault();
        let x= e.clientX, y= e.clientY, right= (e.clientX + 200 > window.innerWidth);
        right && (x = window.innerWidth - x);
        let style = {
            top: `${y}px`,
            ...right && {right: `${x}px`},
            ...!right && {left: `${x}px`}
        }

        setFunc.context({style, message});
        setFunc.clicked(true);
    }

    return (
        <div className={`chat ${baseChatClass}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    {/*<img src={(type.includes('icon'))?'some image source':''} alt=""/>*/}
                    <img alt=""/>
                </div>
            </div>
                <div className="chat-header opacity-50">
                    {type.includes('header') && name}
                </div>
            <div className={`chat-bubble ${messageClass}`} onContextMenu={disableContextMenu}>
                <div className="tooltip tooltip-bottom text-left" data-tip={messageTimeText}>
                    {text}
                </div>
            </div>
        </div>

    )
}