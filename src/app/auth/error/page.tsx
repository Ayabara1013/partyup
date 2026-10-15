import '@/styles/auth.scss'
import Link from 'next/link'

export default async function Page({searchParams}: { searchParams: Promise<{ error?: string }> }) {
    const {error} = await searchParams

    return (
        <div className="auth-page">
            <section className="panel auth-card">
                <header className="panel__bar">
                    <div className="panel__title">
                        <span className="panel__name">Sign-in didn&apos;t work</span>
                    </div>
                </header>

                <div className="panel__body auth-card__body">
                    <p className="auth-card__lead">
                        Something went wrong while signing you in. Please try again; if it keeps happening, try the other sign-in option.
                    </p>
                    {error && <p className="panel__hint">Error code: {error}</p>}
                </div>

                <footer className="auth-card__footer">
                    <Link href="/home" className="btn btn-sm btn-ghost border border-neutral-content/20">Home</Link>
                    <Link href="/auth/login" className="btn btn-sm btn-primary">Try again</Link>
                </footer>
            </section>
        </div>
    )
}
