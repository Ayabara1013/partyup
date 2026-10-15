import Link from 'next/link'
import Image from "next/image";
import type {HomeAction} from "@/lib/assets/homeText";

// A quick-action tile on the home page: icon, title and one line of explanation
export default function HomeActionCard({action}: { action: HomeAction }) {
    return (
        <Link className="home-action" href={action.href}>
            <span className="home-action__icon">
                <Image src={action.img} alt="" width={40} height={40}/>
            </span>
            <span className="home-action__text">
                <span className="home-action__title">{action.title}</span>
                <span className="home-action__sub">{action.sub}</span>
            </span>
        </Link>
    )
}
