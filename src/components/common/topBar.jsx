import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function TopBar({
    brand = 'Neumá',
    links = [
        { text: 'Sign Language', href: '/sign-language' },
        { text: 'About Us', href: '/about-us' },
        { text: 'Sign in', href: '#' },
    ],
    className = '',
    classes = '',
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const customClasses = className || classes;

    return (
        <nav className={`fixed top-6 left-1/2 -translate-x-1/2 flex justify-between items-center text-tertiary px-6 md:px-8 py-3 md:py-4 z-50 w-[calc(100vw-2rem)] md:w-auto md:max-w-[calc(100vw-2rem)] bg-secondary/50 backdrop-blur-md shadow-2xl border border-tertiary/10 rounded-full animate-topbar ${customClasses}`.trim()}>

            {brand && <a href='/' className='font-bold text-xl md:text-2xl mr-auto md:mr-40'>{brand}</a>}

            <div className='hidden md:flex lg:gap-10 md:gap-5 text-sm lg:text-base font-medium whitespace-nowrap'>
                {links.map((link, index) => (
                    <a
                        key={link.id || index}
                        href={link.href || '#'}
                        onClick={(e) => {
                            if (link.onClick) {
                                e.preventDefault();
                                link.onClick();
                            }
                        }}
                        target={link.target}
                        rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                        className={link.className || link.classes || 'hover:opacity-80 transition-opacity cursor-pointer'}
                    >
                        {link.text || link.label}
                    </a>
                ))}
            </div>

            <button
                className="md:hidden ml-4 p-1 rounded-lg transition-colors cursor-pointer hover:bg-black/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-secondary/50 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-4 md:hidden">
                    {links.map((link, index) => (
                        <a
                            key={link.id || index}
                            href={link.href || '#'}
                            onClick={(e) => {
                                setIsMenuOpen(false);
                                if (link.onClick) {
                                    e.preventDefault();
                                    link.onClick();
                                }
                            }}
                            target={link.target}
                            rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                            className={`px-4 py-2 rounded-lg hover:bg-black/5 transition-colors font-medium text-center ${link.className || link.classes || ''}`}
                        >
                            {link.text || link.label}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    )
}