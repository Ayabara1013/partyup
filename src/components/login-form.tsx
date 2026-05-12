'use client'

import {useState} from 'react'

import {cn} from '@/lib/utils'
import {createClient} from '@/lib/client'
import {Button} from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

export function LoginForm({className, ...props}: React.ComponentPropsWithoutRef<'div'>) {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const githubLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createClient()
        setIsLoading(true)
        setError(null)

        try {
            const {error} = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/auth/oauth?next=/`,
                },
            })

            if (error) throw error
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'An error occurred')
            setIsLoading(false)
        }
    }

    const googleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createClient()
        setIsLoading(true)
        setError(null)

        try {
            const {error} = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    // redirectTo: `${window.location.origin}/auth/callback`,
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) throw error
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'An error occurred')
            setIsLoading(false)
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome!</CardTitle>
                    <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={githubLogin}>
                        <div className="flex flex-col gap-6">
                            {error && <p className="text-sm text-destructive-500">{error}</p>}
                            <Button type="submit" className="w-full" disabled={isLoading}>Continue with GitHub</Button>
                        </div>
                    </form>
                    <form onSubmit={googleLogin}>
                        <div className="flex flex-col gap-6 mt-4">
                            {error && <p className="text-sm text-destructive-500">{error}</p>}
                            <Button type="submit" className="w-full" disabled={isLoading}>Continue with Google</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
