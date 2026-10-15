'use client'

import {useState} from 'react'
import {createClient} from '@/lib/client'

type Provider = `github` | `google`;

const PROVIDERS: { id: Provider, label: string }[] = [
    {id: `github`, label: `Continue with GitHub`},
    {id: `google`, label: `Continue with Google`},
];

// `next`: where to go after signing in (already checked by safeNextPath on the page)
export function LoginForm({next}: { next: string }) {
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState<Provider | null>(null)

    const signIn = async (provider: Provider) => {
        setPending(provider)
        setError(null)

        // Both providers return through /auth/oauth, which finishes sign-in and redirects to `next`
        const {error} = await createClient().auth.signInWithOAuth({
            provider,
            options: {redirectTo: `${window.location.origin}/auth/oauth?next=${encodeURIComponent(next)}`},
        })

        if (error) {
            setError(error.message)
            setPending(null)
        }
        // on success the browser is already on its way to the provider
    }

    return (
        <section className="panel auth-card">
            <header className="panel__bar">
                <div className="panel__title">
                    <span className="panel__name">Sign in</span>
                    <span className="panel__desc">to continue to PartyUp</span>
                </div>
            </header>

            <div className="panel__body auth-card__body">
                <p className="auth-card__lead">Play tabletop RPGs with your group, at your own pace.</p>

                {next.startsWith(`/games/invite/`) &&
                  <p className="auth-card__note">Sign in to see the game you were invited to.</p>}

                <div className="auth-card__actions">
                    {PROVIDERS.map(({id, label}) =>
                        <button key={id} className="btn btn-primary w-full" onClick={() => signIn(id)}
                                disabled={pending !== null}>
                            {pending === id ? <span className="loading loading-spinner loading-sm"/> : label}
                        </button>
                    )}
                </div>

                {error && <p className="field__error" role="alert">{error}</p>}
            </div>
        </section>
    )
}
