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
import { validateCommand } from "@/util/functions";
import { roll } from "@/app/test-page/rolls";

export default function Page() {
  const [ user ] = useAuthState(userAuth);
  let gameId = user ? accountLocalStorage.getCurrentGame(user?.uid) : false;
  let props = {
    disabled: gameId,
    ...(!gameId) && { gameId }
  };
  const test = () => {
    let character = createDndCharacter(
        {
          strength: 15,
        },
        {
          athletics: {
            proficiency: true,
            expertise: false,
          },
          sleightOfHand: {
            proficiency: true,
            expertise: true,
          }
        },
        4);
    let commands =[
      '!r 1d20 fire - 2d12 acid + strength + 2',
      '!r 3d6 psychic + 3d20 - 4d4 - athletics + 2',
      '!r 6d4 lightning - 2d12 + intelligence - 2'
    ]
    let outputDice = [];
    let rollResults = [];
    for (const command of commands) {
      outputDice.push(validateCommand(command, 'dnd', character).dice);
    }
    for (const dice of outputDice) {
      rollResults.push(roll(dice));
    }

    for(let i = 0; i < outputDice.length; i++){
      console.log(commands[i]);
      console.log(outputDice[i]);
      console.log(rollResults[i]);
    }
  }

  return (
    <PageLayout title="Welcome to PartyUp!">
      {(user) && (
        <>
          <p className="btn" id={ui.home.userName.id} onClick={test}> Welcome {user.displayName}!</p>
          <Dir.game.current className="btn mt-5" {...props}/>
          <Dir.game.create className="btn mt-5"/>
          <Dir.user.active className="btn mt-5"/>
          {/*<Dir.game.public className="btn mt-5"/>*/}
        </>)
      }
    </PageLayout>
  )
}