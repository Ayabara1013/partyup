'use client'
import '@styles/home/home.scss';
import '@styles/cta.scss';

import {allText} from '@/javascript/assets/all_text';

import CYACard from './(components)/CYACard';
import {useRouter} from "next/navigation";
import {useApplication} from "@app/(contexts)/application";

export default function Home() {
  const {user} = useApplication();
  return (
    <div
      className='home-page flex flex-col sm:py-4 md:py-8 lg:pt-8 lg:pb-20 gap-8 lg:gap-28 w-full min-h-full border-2 border-dotted border-red-400'>
      {!user && <CallToAction/>}

      <div className='carousel flex flex-col md:flex-row gap-12 justify-center'>
        {user
          ? <CYACard cardInfo={allText.home.cya_card_5}/>
          : <CYACard cardInfo={allText.home.cya_card_1}/>}

        <CYACard cardInfo={allText.home.cya_card_2}/>
        <CYACard cardInfo={allText.home.cya_card_3}/>
        <CYACard cardInfo={allText.home.cya_card_4}/>
      </div>
    </div>
  )
}

function CallToAction({signup}) {
  const {push} = useRouter();
  return (
    <div className='flex flex-col gap-8'>
      <div className='cta-banner flex flex-col'>
        <div className='cta-header'>welcome to <span className="uppercase">tavern</span></div>
        <div className='cta-subheader'>play <span className="cta-subheader__accent">how</span> you want, <span
          className="text-accent">when</span> you want
        </div>
        <div className='cta-subheader'>no scheduling conflicts, <span
          className="cta-subheader__accent">ever</span> again
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-2'>
        <div className='flex flex-col flex-auto gap-4 m-auto text-center'>
          <div className='m-auto text-[3rem] font-bold max-w-[75%]'>{allText.home.cta_txt_1}</div>
          <button className='btn btn-lg px-12 btn-primary m-auto' onClick={() => {
            push('/user/signup')
          }}>{allText.home.cta_btn_1}</button>
        </div>

        <div className='flex flex-auto h-[500px]'>
          <img src='/images/example-play-screens-mobile-1x.png'
               className='w-full h-full object-scale-down'></img>
        </div>
      </div>
    </div>
  )
}
