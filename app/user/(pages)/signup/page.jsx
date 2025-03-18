'use client'
import {Blocks} from "@components/templates/blocks";
import {Forms} from "@components/templates/forms";
import {useRef} from "react";
import {fbAccountManager} from "@/javascript/firebase/fbAccountManager";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {googleSignInPopUp} from "@/javascript/firebase/base";

export default function () {
  const {push} = useRouter();
  const password1Ref = useRef(null);
  const password2Ref = useRef(null);
  const emailRef = useRef(null);

  function devTest() {
    fbAccountManager.create.withEP('test@gmail.com', 'password11')
      .then((success) => {
        if (success) {
          console.log(`Account created: ${success}. 5 Seconds till redirect.`)
          setTimeout(() => {
            toast(`Account created with: test@gmail.com`);
            push('/user/choose-your-name');
          }, 5000)
        }
      })
  }

  function submitOnClick() {
    console.log({
      password1: password1Ref.current.value,
      password2: password2Ref.current.value,
      email: emailRef.current.value,
    });
    fbAccountManager.create.withEP(emailRef.current.value.trim(), password1Ref.current.value)
      .then((success) => {
        if (success) {
          console.log(`Account created. 5 Seconds till redirect.`)
          setTimeout(() => {
            toast(`Account created with: ${emailRef.current.value}`);
            push('/user/choose-your-name');
          }, 5000)
        }
      })
  }

  function googleOnClick() {
    googleSignInPopUp((user) => {
      if(user){
        console.log(`Account created. 5 Seconds till redirect.`)
        setTimeout(() => {
          toast(`Account created with: ${user.email}`);
          push('/user/choose-your-name');
        }, 5000)
      }
    })
  }

  return (
    <div>
      <Blocks.Section>
        <Blocks.Header>Account Creation</Blocks.Header>
        <Forms.DefaultInputField labelText="Enter an email" forwardRef={emailRef}/>
        <Forms.DefaultInputField labelText="Enter a Password" forwardRef={password1Ref} type="password"/>
        <Forms.DefaultInputField labelText="Confirm Password" forwardRef={password2Ref} type="password"/>

        <button className="btn btn-primary mt-4 px-8" onClick={submitOnClick}>Submit</button>
        <button className="btn btn-primary mt-4 px-8" onClick={googleOnClick}>Sign up via Google (Popup)</button>
        <button className="btn btn-primary mt-4 px-8" onClick={devTest}>devTest</button>
      </Blocks.Section>
    </div>
  )
}