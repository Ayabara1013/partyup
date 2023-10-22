'use client'
import { useAuthState } from "react-firebase-hooks/auth";

import Dir from "@/components/Dir";
import PageLayout from "@/components/PageLayout";

import { ui } from "@/util/ui";
import { userAuth } from "@/firebase/base";
import { accountLocalStorage } from "@/util/localStorage";

export default function Page() {
  const [ user ] = useAuthState(userAuth);
  let gameId = user ? accountLocalStorage.getCurrentGame(user?.uid) : false;
  let props = {
    disabled: gameId,
    ...(!gameId) && {gameId}
  };

  return (
    <PageLayout title="Welcome to PartyUp!">
      { (user) && (
        <>
          <p className="btn" id={ ui.home.userName.id }> Welcome { user.displayName }!</p>
          <Dir.game.current className="btn mt-5" {...props}/>
          <Dir.game.create className="btn mt-5"/>
          <Dir.user.active className="btn mt-5"/>
          {/*<Dir.game.public className="btn mt-5"/>*/ }
        </>)
      }
    </PageLayout>
  )
}