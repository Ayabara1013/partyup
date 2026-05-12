'use client'

import {Button} from '@/components/ui/button'
import {useAuthManager} from "@/app/(context)/authContext";

export function LogoutButton() {
    const {signOut} = useAuthManager()
    return <Button onClick={signOut}>Logout</Button>
}
