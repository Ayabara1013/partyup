import '@/styles/auth.scss'
import {LoginForm} from '@/components/login-form'
import {safeNextPath} from '@/lib/routing/nextPath'

export default async function Page({searchParams}: { searchParams: Promise<{ next?: string }> }) {
    const {next} = await searchParams

    return (
        <div className="auth-page">
            <LoginForm next={safeNextPath(next)}/>
        </div>
    )
}
