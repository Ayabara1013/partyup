'use client'
import {use} from "react";
import BaseInvitePage from "@app/games/invite/BasePage/BaseInvitePage";

export default function Page({params}) {
  let {gameId, inviteCode} = use(params);
  return <BaseInvitePage {...{
    gameId, inviteCode,
    errorMessage: `At least one of either the game id or invite code, are wrong.`
  }}/>
}