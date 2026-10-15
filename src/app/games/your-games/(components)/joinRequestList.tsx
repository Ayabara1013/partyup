import {useState} from "react";
import {supabaseGame} from "@/lib/supabase/db/game";
import {usePopupModal} from "@/app/(context)/popupModalContext";

type JoinRequestListProps = {
    game: any;
    onAccepted: () => void;
};

// Pending join requests for one game, shown in the popup modal. Accepting adds the player.
export default function JoinRequestList({game, onAccepted}: JoinRequestListProps) {
    const [requests, setRequests] = useState<any[]>(game.joinRequests ?? []);
    const [busyId, setBusyId] = useState<string | null>(null);
    const {hideModal} = usePopupModal();

    const accept = async (userId: string) => {
        setBusyId(userId);
        const added = await supabaseGame.set.acceptRequest(game.id, userId);
        setBusyId(null);
        if (!added) return;

        const remaining = requests.filter((r) => r.id !== userId);
        setRequests(remaining);
        onAccepted();
        if (remaining.length === 0) hideModal();
    };

    if (requests.length === 0) return <p className="panel__hint mt-4">No pending requests.</p>;

    return (
        <ul className="join-requests">
            {requests.map((request) =>
                <li key={request.id} className="join-requests__item">
                    <span className="join-requests__name">{request.name}</span>
                    <button className="btn btn-sm btn-primary" onClick={() => accept(request.id)}
                            disabled={busyId !== null}>
                        {busyId === request.id ? <span className="loading loading-spinner loading-xs"/> : `Accept`}
                    </button>
                </li>
            )}
        </ul>
    )
}
