export default function TopBar({
    brand = 'Neumá',
    links = [
        { text: 'Sign Language', href: '#' },
        { text: 'About Us', href: '#' },
        { text: 'Sign in', href: '#' },
    ],
    className = '',
    classes = '',
}) {
    const customClasses = className || classes;

    return (
        <nav className={`fixed top-6 left-1/2 -translate-x-1/2 flex justify-between items-center bg-secondary/50 text-tertiary rounded-full px-8 py-4 z-50 whitespace-nowrap max-w-[calc(100vw-2rem)] ${customClasses}`.trim()}>
            {brand && <h4 className='font-bold text-2xl mr-60'>{brand}</h4>}
            <div className='flex gap-12 font-medium'>
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
        </nav>
    )
}