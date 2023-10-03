import { navIcons } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <header className="w-full">
            <nav className="nav">
                <Link href="/" className="flex items-center gap-1">
                    <Image
                        src="/assets/icons/logo.svg"
                        alt="logo"
                        width={27}
                        height={27}
                        draggable={false}
                        className="object-contain"
                    />
                    <p className="nav-logo">
                        Scrapio
                    </p>
                </Link>

                <div className="flex items-center gap-5">
                    {navIcons.map((icon) => (
                        <button
                            key={icon.name}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 focus:outline-none focus:bg-gray-300 p-2 hover:bg-gray-200 transition-all"
                        >
                            <icon.icon className="w-5 h-5 text-gray-700" />
                        </button>
                    ))}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
