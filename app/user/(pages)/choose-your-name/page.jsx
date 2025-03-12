'use client'
import {Blocks} from "@components/templates/blocks";
import {Forms} from "@components/templates/forms";
import {useEffect, useRef} from "react";
import {fbAccountManagement} from "@/javascript/firebase/fbAccountManagement";
import {useApplication} from "@app/(contexts)/application";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

export default function () {
  const {push} = useRouter();
  const {user, checkUser} = useApplication();
  useEffect(() => {
    if (user) {
      checkUser()
    }
  }, []);
  const displayNameRef = useRef(null);

  function submitOnClick() {
    checkDisplayNameAvailability(null, true)
  }

  function displayTextOnKeyUp(e) {
    if (e.key === "Enter") {
      checkDisplayNameAvailability()
    }
  }

  function checkDisplayNameAvailability(e, submit) {
    let dName = displayNameRef.current.value.trim();

    if (dName.length > 3) {
      fbAccountManagement.checkAvailability.displayName(dName).then(available => {
        if (available) {
          toast.success(`'${dName}' is available as a display name!`)
          if (submit) {
            fbAccountManagement.update.displayName(user, dName)
              .then(success => {
                console.log(success)
                toast(`Updating display name to: '${dName}'...`);
                if (success) {
                  setTimeout(() => {
                    toast.success(`Updated display name with: '${dName}!'`);
                    push('/user/subscription')

                  }, 2000)
                } else {
                  toast.error(`Something went wrong updating display name, please try again.`)
                }
              })
          }
        } else {
          toast.error(`'${dName}' is not available as a display name!`);
        }
      })
    } else {
      toast.error(`Display name is too short!`);
    }
  }

  return (
    <div>
      <Blocks.Section>
        <Blocks.Header>Choose your Display name!</Blocks.Header>
        <Forms.DefaultInputField label="Enter a display name (4 Letter Minimum)" forwardRef={displayNameRef}
                                 buttonText='Check Availability'
                                 onKeyUp={displayTextOnKeyUp} onClick={checkDisplayNameAvailability}/>
        <button className="btn btn-primary mt-4 px-8"
                onClick={() => {
                  checkDisplayNameAvailability(null, true)
                }}>
          Submit
        </button>
      </Blocks.Section>
    </div>
  )
}