'use client'
import { useAuthState } from "react-firebase-hooks/auth";

import Dir from "@/components/Dir";
import PageLayout from "@/components/PageLayout";

import { ui } from "@/util/ui";
import { userAuth } from "@/firebase/base";
import { accountLocalStorage } from "@/util/localStorage";
import CharacterSheet from "@/util/character/CharacterSheet";
import chatWindow from "@/components/ChatWindow";
import createDndCharacter from "@/util/character/templates/dndCharacter";
import toast from "react-hot-toast";

export default function Page() {
  const [ user ] = useAuthState(userAuth);
  let gameId = user ? accountLocalStorage.getCurrentGame(user?.uid) : false;
  let props = {
    disabled: gameId,
    ...(!gameId) && {gameId}
  };
  const test = () =>{
    toast.success('Message Copied');
    // let character = createDndCharacter(
    //     {
    //       strength: 15,
    //     },
    //     {
    //       athletics: {
    //         proficiency: true,
    //         expertise: false,
    //       },
    //       sleightOfHand: {
    //         proficiency: true,
    //         expertise: true,
    //       }
    //     },
    //     4);
    //
    // console.log(character);
    // console.log(character.stats.skills.athletics.modifier());
    // console.log(character.stats.skills.sleightOfHand.modifier());
    // console.log(character.stats.skills.acrobatics.modifier());
  }

  return (
    <PageLayout title="Welcome to PartyUp!">
      { (user) && (
        <>
          <p className="btn" id={ ui.home.userName.id } onClick={test}> Welcome { user.displayName }!</p>
          <Dir.game.current className="btn mt-5" {...props}/>
          <Dir.game.create className="btn mt-5"/>
          <Dir.user.active className="btn mt-5"/>
          {/*<Dir.game.public className="btn mt-5"/>*/ }
        </>)
      }
    </PageLayout>
  )
}