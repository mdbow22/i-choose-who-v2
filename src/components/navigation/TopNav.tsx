import Link from 'next/link'
import React from 'react'

const TopNav: React.FC = () => {
  return (
    <nav className='h-12 w-full bg-teal-400 flex flex-row flex-nowrap items-center justify-between px-5'>
        {/*eslint-disable-next-line @next/next/no-img-element*/}
        <img src='/logo.png' className='h-8' alt='I Choose Who? Logo' />
        <ul className='flex flex-row flex-nowrap gap-2'>
            <li className='btn btn-secondary'>Battle Planner</li>
            <li className='btn btn-secondary'><Link href='/profile'>My Pokédex</Link></li>
        </ul>
    </nav>
  )
}

export default TopNav