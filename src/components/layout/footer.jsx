import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className='bg-tertiary sticky bottom-0 z-0 h-[60vh] md:h-[30vh] lg:h-[50vh] flex flex-col items-center justify-between py-10 px-6 text-center'>
            <div className='flex flex-col items-center gap-2'>
                <span className='text-3xl md:text-4xl font-bold text-neon'>Neumá</span>
                <span className='text-neon font-medium max-w-md'>
                    Break the Silence, Bridge the World.
                </span>
            </div>
            <div className='flex flex-col md:flex-row gap-2 md:gap-6 text-neon font-medium text-lg underline'>
                <Link to="/" className='hover:text-neon/70 transition-colors'>Home</Link>
                <Link to="/sign-language" className='hover:text-neon/70 transition-colors'>Sign Language</Link>
                <Link to="/about-us" className='hover:text-neon/70 transition-colors'>About Us</Link>
                <Link to="/privacy" className='hover:text-neon/70 transition-colors'>Privacy Policy</Link>
                <Link to="/terms" className='hover:text-neon/70 transition-colors'>Terms of Service</Link>
            </div>
            <span className='text-xs text-neon font-medium'>© 2026 Neumá. All rights reserved.</span>
        </footer>
    );
}
