import dir from '@/assets/directory'
import Link from 'next/link'




export default function CYACard({
  img,
  header,
  children,
  href,
  ...props }) {
  
  return (
    <div className="card bg-primary text-primary-content w-96">
      <div className="card-body text-center py-12 px-4 gap-4">

        {/* image */}
        <div className='lg:mx-7 p-8 rounded-full bg-primary-content'>
          <img src={img || "/images/008-spellbook-1.png"} alt="" className=' w-full h-full object-contain' />
        </div>

        {/* header */}
        <div className='btn btn-ghost hover:btn-secondary h-auto text-3xl font-extrabold'>
          <Link href={href || dir.home}>
            {header || '<MISSING HEADER>'}
          </Link>
        </div>

        {/* subheader */}
        <div className='text-lg font-medium'>
          {children || '<MISSING CHILD>'}
        </div>

      </div>
    </div>
  )
}