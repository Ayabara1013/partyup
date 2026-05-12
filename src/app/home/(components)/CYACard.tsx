import Link from 'next/link'
import {dirHref} from "@/lib/routing/directoy";

export default function CYACard({cardInfo, ...props}: { cardInfo: any }) {
    let {img, header, sub, href} = cardInfo
    return (
        <Link className="card bg-primary text-primary-content w-96 full-element-btn" href={href || dirHref.home}>
            <div className="card-body text-center py-12 px-4 gap-4">

                {/* image */}
                <div className='lg:mx-7 p-8 rounded-full bg-primary-content'>
                    <img src={img || "/images/008-spellbook-1.png"} alt="" className=' w-full h-full object-contain'/>
                </div>

                {/* header */}
                <div className='btn btn-ghost hover:btn-secondary h-auto text-3xl font-extrabold'>
                    {header || '<MISSING HEADER>'}
                </div>

                {/* subheader */}
                <div className='text-lg font-medium'>
                    {sub || '<MISSING CHILD>'}
                </div>

            </div>
        </Link>
    )
}