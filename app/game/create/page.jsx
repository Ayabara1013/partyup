'use client'

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

import PageLayout from "@/components/PageLayout";
import { ui } from "@/util/ui";
import { fbManagement } from "@/firebase/fbManagement";
import { ApplicationContext } from "@/app/ApplicationContext";

export default function Page() {
    const { push } = useRouter();
    const { displayPage, updateGames } = useContext(ApplicationContext);

    useEffect(() => {
        displayPage(true)
    }, []);

    const createGameOnClick = async (e) => {
        e.target.setAttribute('disabled', true)
        let name = ui.createGame.name.element().value;
        let description = ui.createGame.description.element().value;
        // let isPublic = ui.createGame.isPublic.element().checked;
        let isPublic = false;
        let playerCount = parseInt(ui.createGame.playerCount.element().value);
        console.log({
            name, description, isPublic, playerCount
        })
        await fbManagement.dm.createGame(name, description, isPublic, playerCount);
        e.target.removeAttribute('disabled');
        updateGames();
        push('/user/activeGames');
    }

    return (
        <PageLayout title="Create a Game!" backHref="/home">
            <div className="w-full flex mt-4">
                <label className="w-1/4 mx-2">Game Name: </label>
                <input className="w-3/4 mx-2" type="text" placeholder="Enter a name" id={ui.createGame.name.id}/>
            </div>
            <div className="w-full flex mt-4">
                <label className="w-1/4 mx-2">Game Description (optional): </label>
                <input className="w-3/4 mx-2" type="text" placeholder="Enter a description" id={ui.createGame.description.id}/>
            </div>
            <div className="w-full flex mt-4">
                {/*<div className="w-1/2 flex mx-2">*/}
                {/*    <label className="w-1/2">Public Game?: </label>*/}
                {/*    <input className="" type="checkbox" id={ui.createGame.isPublic.id}/>*/}
                {/*</div>*/}
                <div className="w-1/2 flex mx-2">
                    <label className="w-1/2">Max Player Count: </label>
                    <select className="w-1/2" defaultValue="4" id={ui.createGame.playerCount.id}>
                        <option value="1">1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                        <option value='6'>6</option>
                    </select>
                </div>
            </div>
            <button className="btn mt-5" onClick={createGameOnClick}>Create Game!</button>
        </PageLayout>
    )
}