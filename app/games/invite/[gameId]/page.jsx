'use client'
import {use} from "react";
import BaseInvitePage from "@app/games/invite/BasePage/BaseInvitePage";

export default function Page({params}) {
  let {gameId} = use(params);
  return <BaseInvitePage {...{
    gameId,
    errorMessage: `This game is private. You will need a link with an invite code.`
  }}/>
}