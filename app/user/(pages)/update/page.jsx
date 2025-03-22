'use client'
import {Blocks} from "@components/templates/blocks";
import {Forms} from "@components/templates/forms";
import {useRef} from "react";
import {fbAccountManager} from "@/javascript/firebase/managers/fbAccountManager";
import {useAccountManager} from "@app/(contexts)/accountManager";

export default function () {
  let {user} = useAccountManager();
  const password1Ref = useRef(null);
  const password2Ref = useRef(null);
  const emailRef = useRef(null);
  const displayNameRef = useRef(null);

  function update() {
    fbAccountManager.update.uName(user, displayNameRef.current.value).then()
  }

  function submitOnClick() {
    console.log({
      password1: password1Ref.current.value,
      password2: password2Ref.current.value,
      email: emailRef.current.value,
    });
  }

  function checkEmailAvail() {
    let value = emailRef.current.value;
    console.log(value);
    if (value.length > 3) {
      emailRef.current.classList.add('inputSuccess');
      emailRef.current.classList.remove('inputError');
    } else {
      emailRef.current.classList.add('inputError');
      emailRef.current.classList.remove('inputSuccess');
    }
  }


  return (
    <div>
      <Blocks.Section>
        <Blocks.Header>Account Creation</Blocks.Header>
        <Forms.DefaultInputField label="Enter an email" forwardRef={emailRef} buttonText='Check Availability'
                         onChange={checkEmailAvail} onClick={checkEmailAvail}/>
        <Forms.DefaultInputField label="Enter a Password" forwardRef={password1Ref} type="password"/>
        <Forms.DefaultInputField label="Confirm Password" forwardRef={password2Ref} type="password"/>

        <button className="btn btn-primary mt-4 px-8" onClick={submitOnClick}>Submit</button>
        <button className="btn btn-primary mt-4 px-8" onClick={update}>Update</button>
      </Blocks.Section>
    </div>
  )
}