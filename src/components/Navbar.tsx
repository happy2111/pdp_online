"use client"

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LanguageToggle } from './LanguageToggle'
import { ModeToggle } from './ModeToggle'
import { NavbarAuth } from '@/components/ui/NavbarAuth'
import { Button } from '@/components/ui/button'

const Navbar = () => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('asosiy');
    const [animDirection, setAnimDirection] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (dropdown: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setOpenDropdown(dropdown);
        setActiveTab('asosiy');
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpenDropdown(null);
        }, 200);
    };

    const handleTabChange = (tab: string) => {
        const tabs = ['asosiy', 'mutaxasislik', 'foundation'];
        const currentIndex = tabs.indexOf(activeTab);
        const newIndex = tabs.indexOf(tab);

        if (newIndex > currentIndex) {
            setAnimDirection('right');
        } else if (newIndex < currentIndex) {
            setAnimDirection('left');
        }

        setTimeout(() => {
            setActiveTab(tab);
        }, 10);

        setTimeout(() => {
            setAnimDirection('');
        }, 300);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Content for each tab
    const tabContent = {
        asosiy: (
            <div className="space-y-3">
                <Link
                    href="/courses/telegram-bot"
                    className="block py-2 px-4 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all transform hover:scale-105"
                    onClick={() => setOpenDropdown(null)}
                >
                    <div className="font-medium">Telegram Bot yaratish</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Learn to create Telegram bots</div>
                </Link>
                <Link
                    href="/courses/pdp-start"
                    className="block py-2 px-4 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all transform hover:scale-105"
                    onClick={() => setOpenDropdown(null)}
                >
                    <div className="font-medium">PDP START</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Beginner programming course</div>
                </Link>
            </div>
        ),
        mutaxasislik: (
            <div className="grid grid-cols-2 gap-3">
                <Link
                    href="/courses/free"
                    className="block p-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all transform hover:scale-105"
                    onClick={() => setOpenDropdown(null)}
                >
                    <div className="font-medium">Bepul</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Free courses</div>
                </Link>
                <Link
                    href="/courses/frontend"
                    className="block p-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all transform hover:scale-105"
                    onClick={() => setOpenDropdown(null)}
                >
                    <div className="font-medium">Frontend</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">HTML, CSS, JavaScript, React</div>
                </Link>
                <Link
                    href="/courses/backend"
                    className="block p-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all transform hover:scale-105"
                    onClick={() => setOpenDropdown(null)}
                >
                    <div className="font-medium">Backend</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Node.js, Python, Java</div>
                </Link>
                <Link
                    href="/courses/mobile"
                    className="block p-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all transform hover:scale-105"
                    onClick={() => setOpenDropdown(null)}
                >
                    <div className="font-medium">Mobil</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">iOS, Android, React Native</div>
                </Link>
                <Link
                    href="/courses/others"
                    className="block p-3 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all transform hover:scale-105 col-span-2"
                    onClick={() => setOpenDropdown(null)}
                >
                    <div className="font-medium">Boshqalar</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Other programming courses</div>
                </Link>
            </div>
        ),
        foundation: (
            <div className="space-y-3">
                <Link
                    href="/courses/foundation-2024"
                    className="block py-2 px-4 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all transform hover:scale-105"
                    onClick={() => setOpenDropdown(null)}
                >
                    <div className="font-medium">Foundation 2024</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Fundamental programming concepts</div>
                </Link>
            </div>
        )
    };

    const getAnimationClass = () => {
        if (animDirection === 'right') return 'animate-slideInFromRight';
        if (animDirection === 'left') return 'animate-slideInFromLeft';
        return '';
    };

    return (
        <div className="fixed top-[30px] left-0 w-full flex justify-center z-50">
            {/* Glass morphism navbar with 70% width */}
            <nav className={`
                relative w-[70%] px-6 py-4 
                flex justify-between items-center 
                rounded-[30px] transition-colors duration-200 
                overflow-visible
                bg-white/5 dark:bg-gray-900/50
                backdrop-blur-md
                border border-white/30 dark:border-gray-700/50
                shadow-[0_8px_32px_rgba(0,0,0,0.1)] 
                before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px] 
                before:bg-gradient-to-r before:from-transparent before:via-white/80 dark:before:via-white/40 before:to-transparent
                after:absolute after:top-0 after:left-0 after:w-[1px] after:h-full 
                after:bg-gradient-to-b after:from-white/80 dark:after:from-white/40 after:via-transparent after:to-white/30 dark:after:to-white/10
            `}>
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={100}
                        height={100}
                        className="hover:opacity-80 transition-opacity dark:brightness-90"
                    />
                </Link>

                {/* Search Bar */}
                <div className="flex-1 max-w-xl mx-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 backdrop-blur-sm transition-colors"
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Courses Dropdown with Animation */}
                    <div
                        className="relative"
                        ref={dropdownRef}
                        onMouseEnter={() => handleMouseEnter('courses')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            Courses
                            <svg
                                className={`w-4 h-4 transition-transform duration-300 ${openDropdown === 'courses' ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </Button>

                        {/* Animated Dropdown Menu - 70% width, appears from bottom with 5px gap */}
                        <div
                            className={`
                                fixed left-1/2 transform -translate-x-1/2 w-[70%] mt-2
                                transition-all duration-300 ease-out origin-top
                                ${openDropdown === 'courses'
                                ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
                                : 'opacity-0 scale-y-0 -translate-y-4 pointer-events-none'
                            }
                            `}
                            style={{ top: 'calc(80px + 5px)' }}
                        >
                            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                                {/* Tab Headers with Sliding Indicator */}
                                <div className="flex border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 relative">
                                    <button
                                        className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors duration-300 relative z-10 ${
                                            activeTab === 'asosiy'
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                        onClick={() => handleTabChange('asosiy')}
                                    >
                                        ASOSIY
                                    </button>
                                    <button
                                        className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors duration-300 relative z-10 ${
                                            activeTab === 'mutaxasislik'
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                        onClick={() => handleTabChange('mutaxasislik')}
                                    >
                                        MUTAXASISLIK
                                    </button>
                                    <button
                                        className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors duration-300 relative z-10 ${
                                            activeTab === 'foundation'
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                        onClick={() => handleTabChange('foundation')}
                                    >
                                        FOUNDATION
                                    </button>

                                    {/* Sliding indicator */}
                                    <div
                                        className="absolute bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 ease-out"
                                        style={{
                                            width: '33.333%',
                                            transform: `translateX(${
                                                activeTab === 'asosiy' ? '0%' : activeTab === 'mutaxasislik' ? '100%' : '200%'
                                            })`
                                        }}
                                    />
                                </div>

                                {/* Tab Content with Slide Animation */}
                                <div className="p-6 overflow-hidden">
                                    <div
                                        key={activeTab}
                                        className={`transition-all duration-300 ease-out ${getAnimationClass()}`}
                                    >
                                        {tabContent[activeTab as keyof typeof tabContent]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <Link href="/instruction">Instruction</Link>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <Link href="/contact">Contact</Link>
                    </Button>

                    {/* Auth buttons */}
                    <div className="flex items-center gap-2 border-l border-gray-300/50 dark:border-gray-700/50 pl-4">
                        <LanguageToggle />
                        <ModeToggle />
                        <NavbarAuth />
                    </div>
                </div>
            </nav>

            {/* Animation styles */}
            <style jsx global>{`
                @keyframes slideInFromRight {
                    0% {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideInFromLeft {
                    0% {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .animate-slideInFromRight {
                    animation: slideInFromRight 0.3s ease-out;
                }

                .animate-slideInFromLeft {
                    animation: slideInFromLeft 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}

export default Navbar