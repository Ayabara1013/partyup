'use client'

import {useAuthManager} from "@/app/(context)/authContext";

// Bare-bones profile: what the signed-in session already knows, no extra request
export default function ProfilePage() {
    const {user, gmGames, playerGames, gamesLoading} = useAuthManager();
    if (!user) return null; // signed out: the auth context sends you to the login page

    // Same name and picture as the account menu
    const name: string = user.userMetadata?.name ?? `Player`;
    const avatar: string | undefined = user.userMetadata?.avatarUrl ?? user.userMetadata?.picture;
    const since = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ``;

    return (
        <div className="w-full max-w-xl mx-auto p-2">
            <section className="panel">
                <header className="panel__bar">
                    <div className="panel__title">
                        <span className="panel__name">Profile</span>
                    </div>
                </header>
                <div className="panel__body">
                    <div className="flex items-center gap-3">
                        {avatar
                            ? <img className="w-16 h-16 rounded-full object-cover" src={avatar} alt=""
                                   referrerPolicy="no-referrer"/>
                            : <div className="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold">
                                {name.charAt(0).toUpperCase()}
                            </div>}
                        <div className="min-w-0">
                            <div className="text-lg font-semibold truncate">{name}</div>
                            {since && <div className="panel__hint">Member since {since}</div>}
                        </div>
                    </div>
                    {!gamesLoading &&
                      <p className="panel__hint">Running {gmGames.length} · Playing {playerGames.length}</p>}
                </div>
            </section>
        </div>
    );
}
