'use client'

import {DaisyTextInputLabelled} from '@/components/daisyUI/text-inputs';
import {Blocks} from '@components/templates/blocks';
import '@styles/settings/settings-page.scss'
import {useApplication} from "@app/(contexts)/application";


export default function Settings(props) {
  let {user} = useApplication();
  const openModal = (element) => {
    document.getElementById(element).showModal();
  }

  return (
    <div className="settings-page page-wrapper flex flex-col p-6 gap-6">
      <Blocks.Section>
        <Blocks.Header>user details</Blocks.Header>
        <ChangeField field={'UserName'} item={user?.uName || 'temp'}/>
        <DisplayField field={'Email'} item={user?.email || 'temp'}/>
      </Blocks.Section>

      {/*<SettingsGroup title={`stuff name`}>*/}
      {/*  <div>put some stuff on here</div>*/}
      {/*  <div>maybe change whatever around</div>*/}

      {/*  <DaisyTextInputLabelled*/}
      {/*    label={`stuff name`} placeholder={`stuff name`}*/}
      {/*    button={'done'} buttonClass={`btn-primary`}*/}
      {/*    preLabel={'typing element'} preLabelClass='title-semi-large'*/}
      {/*  />*/}

      {/*  <div>*/}
      {/*    <div className='title-semi-large'>select some option here</div>*/}
      {/*    <select className="select select-primary w-full max-w-xs">*/}
      {/*      <option disabled defaultValue>What is the best TV show?</option>*/}
      {/*      <option>Game of Thrones</option>*/}
      {/*      <option>Lost</option>*/}
      {/*      <option>Breaking Bad</option>*/}
      {/*      <option>Walking Dead</option>*/}
      {/*    </select>*/}
      {/*  </div>*/}

      {/*  <button className="btn btn-primary hover:btn-accent m-auto w-3/5"*/}
      {/*          onClick={() => openModal('change_password_modal')}>change password?*/}
      {/*  </button>*/}
      {/*</SettingsGroup>*/}

      {/*<Blocks.Section className='gap-2'>*/}
      {/*  <Blocks.Header>account security</Blocks.Header>*/}

      {/*  <button className="btn" onClick={() => openModal('change_password_modal')}>*/}
      {/*    change password?*/}
      {/*  </button>*/}

      {/*  <button className='btn btn-primary hover:btn-accent' onClick={() => openModal('change_password_modal')}>*/}
      {/*    two-factor authentication*/}
      {/*  </button>*/}

      {/*</Blocks.Section>*/}

      {/*<Blocks.Section>*/}
      {/*  <div className="just-some-big-ass-text">I dunno, some stuff?</div>*/}
      {/*</Blocks.Section>*/}

      {/* added straight from daisyUI */}
      {/*<dialog id="change_password_modal" className="modal modal-bottom sm:modal-middle">*/}
      {/*  <div className="modal-box">*/}
      {/*    <h3 className="font-bold text-lg">Change Password</h3>*/}


      {/*    <div className='flex-col-4'>*/}
      {/*      <div className='flex-col-2'>*/}
      {/*        <div className='text-primary font-semibold'>Current Password</div>*/}
      {/*        <DaisyTextInputLabelled className={'input-primary'} placeholder={`enter current password`}/>*/}
      {/*      </div>*/}

      {/*      <div className='flex-col-2'>*/}
      {/*        <div className='text-primary font-semibold'>New Password</div>*/}
      {/*        <DaisyTextInputLabelled className={'input-primary'} placeholder={`enter new password`}/>*/}
      {/*        <DaisyTextInputLabelled className={'input-primary'} placeholder={`re-enter new password`}/>*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*    <div className="modal-action justify-between items-center">*/}
      {/*      <div className="text-neutral">(Press ESC key or click the button below to close)</div>*/}
      {/*      <form method="dialog">*/}
      {/*        /!* if there is a button in form, it will close the modal *!/*/}
      {/*        <button className="btn">Close</button>*/}
      {/*      </form>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</dialog>*/}

    </div>
  )
}

const ChangeField = ({field, item}) => {
  return (
    <div className='flex b2 gap-2 h-fit'>
      <div className='text-lg whitespace-nowrap p-2 flex justify-center items-center'>
        Change {field ? field : 'field'}
      </div>

      <input type="text" placeholder={item} className="input input-bordered input-primary w-full"/>

      <button className='btn btn-primary'>change</button>
    </div>
  )
}

const DisplayField = ({field, item}) => {
  return (
    <div className='flex b2 gap-2 h-fit'>
      <div className='text-lg whitespace-nowrap p-2 flex justify-center items-center'>
        {field ? field : 'field'}
      </div>
      <input type="text" placeholder={item} className="input input-bordered input-primary w-full" disabled/>
    </div>
  )
}

function SettingsGroup({title, children}) {
  return (
    <div className='settings-group flex-col-4 bg-neutral p-4 rounded-xl'>
      {title && <Blocks.Header>{title}</Blocks.Header>}
      {children}
    </div>
  )
}