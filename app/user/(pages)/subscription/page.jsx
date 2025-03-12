'use client'
import {usersCollection} from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';
import '@styles/settings/signup.scss';
import {useApplication} from "@app/(contexts)/application";
import {subscriptionInfo} from "@/javascript/assets/subscriptionInfo";
import {fbAccountManagement} from "@/javascript/firebase/fbAccountManagement";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {use, useEffect} from "react";

export default function Signup({className}) {
  const {push} = useRouter();
  const {user, userDetails, checkUser} = useApplication();

  useEffect(() => {
    checkUser();
  }, []);

  let promptText = `Hi ${userDetails?.displayName}!${userDetails?.planConfirmation
    ? ` You are already subscribed, do you wish to change your plan?`
    : ` You have yet to confirm your plan. Please choose your desired plan.`}`

  const joinOnClick = (e, tier) => {
    fbAccountManagement.update.subscription(user, tier).then(success => {
      if (success) {
        toast.success(`Successfully updated your plan to : ${subscriptionInfo[`tier${tier}`].title}`)
        setTimeout(() => {
          push('/home')
        }, 1500)
      }
    })
  }

  return (
    userDetails ?
      <div className={`${className} signup-page flex p-8 justify-center h-full`}>
        <SubscriptionDetails/>

        <div className='signup-wrapper flex flex-col m-auto gap-8'>
          <div className={`m-auto px-8 py-2 rounded-xl bg-info text-lg text-accent-content font-semibold md:w-2/3`}>
            {promptText}
          </div>

          <div className='subscription-options flex flex-1 gap-8'>
            <SubscriptionOption option={subscriptionInfo.tier1} userDetails={userDetails} joinOnClick={joinOnClick}/>
            <SubscriptionOption option={subscriptionInfo.tier2} userDetails={userDetails} joinOnClick={joinOnClick}/>
            <SubscriptionOption option={subscriptionInfo.tier3} userDetails={userDetails} joinOnClick={joinOnClick}/>
          </div>

          <div>{subscriptionInfo.standardSmallScript}</div>
        </div>

      </div>
      : <></>
  )
}

export function SubscriptionOption({option, userDetails, joinOnClick}) {
  let {className, title = '<ERROR>', price = '<ERROR>', features, smallScript, tier} = option

  let buttonType = (userDetails.planTier === tier && userDetails.planConfirmation) ? 'btn-disabled' : 'btn-primary';
  let buttonText = 'join';

  return (
    <div className={`${className} --option flex flex-col flex-1 px-4 py-12 bg-neutral rounded-xl`}>
      <div className="option-wrapper flex-col-4  min-h-[60%]">
        <div className='--title m-auto text-4xl font-bold text-primary'>
          {title}
        </div>

        <div className='--price flex items-start m-auto text-6xl font-normal'>
          <div className='__currency text-xl'>$</div>
          <div className='__value'>{price}</div>
        </div>

        <div className='flex flex-col p-4 gap-2'>
          <div className='--subtitle text-lg font-bold'>Features:</div>
          <ul className='list-disc'>
            {features.map((element, index) => (
              <li key={index}>{element}</li>
            ))}
          </ul>
        </div>
      </div>
      <button className={`btn ${buttonType} mt-auto`}
              onClick={(e) => {
                joinOnClick(e, tier)
              }}
      >{buttonText}</button>
    </div>
  )
}

function SubscriptionDetails() {
  return (
    <div className="modal" role="dialog" id="my_modal_8">
      <div className="modal-box flex flex-col gap-4">
        <h3 className="text-lg font-bold">Additional Details:</h3>
        {/* <p className="py-4">This modal works with anchor links</p> */}
        <p><sup>1.1</sup> upon joining a game, you will be locked out of joining another game for (1) week. This is
          tracked on a per-game basis. you may still join a second game if you have not used your second alloted game
          or your second allotted game is not currently locked</p>

        <p><sup>1.2</sup> the provided world on the free tier is only a demo world to allow you to experience the paid
          features of Tavern, and is not usable with other players. Some features are also locked until you upgrade
          to a membership tier with access to running your own world. you will have the choice of activating your demo
          world as a playable world, or keeping it as a demo space.</p>

        <p><sup>2.1</sup>lite tier users are allowed 1 active game world by default. Additional worlds are available
          on an à la carte basis.</p>

        <p><sup>3.1</sup> GM tier users are allowed 5 active game worlds by default. Additional worlds are available
          on an à la carte basis</p>

        <p><sup>3.2, 3.3</sup> in addition to the pro-tier gm tools, Gm tier uses have the option to access
          experimental and early preview features before the rest of the userbase</p>

        <div className="modal-action">
          <a href="#" className="btn">close</a>
        </div>
      </div>
    </div>)
}