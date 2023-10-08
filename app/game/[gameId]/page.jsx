'use client'

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";


import { ui } from "@/util/ui";
import { userAuth } from "@/firebase/base";
import { messaging } from "@/firebase/messaging";
import { gameManagement } from "@/firebase/gameManagement";
import { ApplicationContext } from "@/app/ApplicationContext";

export default function Page({params}) {

    const { push } = useRouter();

    const { activeGames, displayPage } = useContext(ApplicationContext);

    let [ initChat, setInitChat ] = useState(null);
    let [ casualChat, setCasualChat ] = useState(null);
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
        console.log(initChat, casualChat)
    }, [initChat, casualChat]);
    const setItems = async () => {
        setInitChat(await messaging.init.getMessages(gameId))
        setCasualChat(await messaging.casual.getMessages(gameId))
    }
    const generateCanonChat = () => {
        return (initChat && initChat.map(msg => (msg.canon)?<ChatMessage key={msg.id} message={msg}></ChatMessage>:<></>))
    }
    const generateInitChat = () => {
        return (initChat && initChat.map(msg => <ChatMessage key={msg.id} message={msg}></ChatMessage>))
    }
    const generateCasualChat = () => {
        return (casualChat && casualChat.map(msg => <ChatMessage key={msg.id} message={msg}></ChatMessage>))
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
                    <div className="chat-box h-full">
                        {generateCanonChat()}
                        <span id={ui.messaging.canon.id}/>
                    </div>
                </div>
                <div className="w-1/3 border flex flex-col">
                    <div className="chat-box">
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

function ChatMessage(props) {
    const { text, uid } = props.message;
    const messageClass = uid === userAuth.currentUser.uid ? 'sent' : 'received';

    return (
        <div className={`message ${messageClass}`}>
            <p>{text}</p>
        </div>)
}