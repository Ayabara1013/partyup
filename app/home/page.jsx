'use client'

import { useCookies } from "react-cookie";
import { useAuthState } from "react-firebase-hooks/auth";
import { useContext, useEffect } from "react";

import Dir from "@/components/Dir";
import PageLayout from "@/components/PageLayout";

import { ui } from "@/util/ui";
import { userAuth } from "@/firebase/base";
import { cookieSettings } from "@/cookies/cookieSettings";
import { ApplicationContext } from "@/app/ApplicationContext";

export default function Page() {
    const [ user ] = useAuthState(userAuth);
    const [ cookie, setCookie, removeCookie ] = useCookies(cookieSettings.dependencies);

    const {  displayPage } = useContext(ApplicationContext);

    useEffect(() => {
        displayPage(true)
    }, []);

    const test = async () => {
    }
    return (
        <PageLayout title="Welcome to PartyUp!">
            {(user)
                ?(<>
                    <p className="btn" id={ui.home.userName.id} onClick={test}>Welcome {user.displayName}!</p>
                    <Dir.game.current className="btn mt-5" disabled={!cookie.currentGame} gameId={cookie.currentGame}/>
                    <Dir.game.create className="btn mt-5"/>
                    <Dir.user.active className="btn mt-5"/>
                    {/*<Dir.game.public className="btn mt-5"/>*/}
                </>)
                :<></>
            }
        </PageLayout>
    )
}