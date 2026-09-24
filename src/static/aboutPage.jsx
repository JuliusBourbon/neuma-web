import { useState, useEffect } from "react";
import TopBar from "../components/common/topBar";
import Footer from "../components/layout/footer";
import mascot_10 from "../assets/onboarding/mascot_10.png";
import GitHubIcon from "../components/icons/githubIcon";

export default function AboutPage() {
    const [lang, setLang] = useState('id');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load preference from local storage
        const savedLang = localStorage.getItem('neuma_lang');
        if (savedLang === 'en' || savedLang === 'id') {
            setLang(savedLang);
        }
        setMounted(true);
    }, []);

    const toggleLanguage = () => {
        const newLang = lang === 'id' ? 'en' : 'id';
        setLang(newLang);
        localStorage.setItem('neuma_lang', newLang);
    };

    if (!mounted) return null;

    return (
        <div className="font-sans bg-tertiary">
            <div className="bg-primary flex flex-col items-center relative z-10 scroll-smooth min-h-screen rounded-b-4xl pb-10">
                <TopBar />

                {/* Floating Language Toggle */}
                <button
                    onClick={toggleLanguage}
                    className="fixed z-60 bottom-6 right-6 md:top-8 md:bottom-auto md:right-8 bg-tertiary text-primary font-bold py-2 px-4 rounded-full shadow-lg border border-primary/20 hover:scale-105 active:scale-95 transition-transform"
                    title={lang === 'id' ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
                >
                    {lang === 'id' ? 'EN' : 'ID'}
                </button>

                <div className='pt-32 pb-20 px-6 md:px-0 flex flex-col w-full max-w-4xl text-tertiary gap-8'>
                    <div className="flex flex-col gap-6 text-justify items-center">
                        <h1 className='text-4xl md:text-5xl font-bold'>
                            {lang === 'id' ? "Cerita Kami" : "Our Story"}
                        </h1>
                        <p className="text-lg md:text-xl leading-relaxed max-w-3xl opacity-90">
                            {lang === 'id' ? (
                                <>
                                    Neumá bermula dari sebuah visi sederhana: menjembatani komunikasi yang menghubungkan Teman Dengar dan Teman Tuli melalui pembelajaran BISINDO yang mudah, interaktif, dan dapat diakses oleh siapa saja. Neumá menjadi sebuah platform pembelajaran interaktif yang memanfaatkan AI secara <em>real-time</em> langsung dari perangkat Anda untuk memberikan umpan balik seketika.
                                    <br /><br />
                                    Misi kami adalah membuat proses belajar bahasa isyarat menjadi menarik, sangat mudah diakses, dan menyenangkan bagi siapa saja, langsung dari <em>browser</em> web mereka sendiri.
                                </>
                            ) : (
                                <>
                                    Neumá was born from a simple vision: to bridge the communication gap that connects Hearing Friends and Deaf Friends through easy, interactive, and accessible BISINDO learning for everyone. Neumá becomes an interactive learning platform that utilizes AI in real-time directly from your device to provide instant feedback.
                                    <br /><br />
                                    Our mission is to make the process of learning sign language engaging, highly accessible, and fun for everyone, right from their own web browsers.
                                </>
                            )}
                        </p>
                    </div>

                    <div className="w-full h-px bg-tertiary/50"></div>

                    <div className="flex flex-col gap-6 items-center bg-tertiary rounded-lg py-16">
                        <div className="flex flex-col gap-2 items-center text-center text-primary">
                            <h2 className='text-3xl md:text-4xl font-bold'>
                                {lang === 'id' ? "Tim Kami" : "Meet The Team"}
                            </h2>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-center w-full">
                            <div className="flex flex-col h-[45vh] w-[35vh] lg:h-[40vh] lg:w-[20vw] bg-neon rounded-lg">
                                <div className="h-[60%] flex items-center justify-center overflow-hidden bg-primary rounded-t-lg">
                                    <img src={mascot_10} alt="mascot_10" className="w-3/4 h-full object-cover" />
                                </div>
                                <div className="h-[40%] flex flex-col items-center justify-center rounded-b-lg">
                                    <span className="text-xl font-semibold">Raihan Fathir Muhammad</span>
                                    <span className="">Mind Master</span>
                                    <a className="pt-4" href="https://github.com/juliusbourbon"><GitHubIcon size={32} color="currentColor" className="" /></a>
                                </div>
                            </div>
                            <div className="flex flex-col h-[45vh] w-[35vh] lg:h-[40vh] lg:w-[20vw] bg-neon rounded-lg">
                                <div className="h-[60%] flex items-center justify-center overflow-hidden bg-primary rounded-t-lg">
                                    <img src={mascot_10} alt="mascot_10" className="w-3/4 h-full object-cover" />
                                </div>
                                <div className="h-[40%] flex flex-col items-center justify-center rounded-b-lg">
                                    <span className="text-xl font-semibold">Rifqy Fakhry Zain</span>
                                    <span className="">Burglar</span>
                                    <a className="pt-4" href="https://github.com/rifqyfakhryzain"><GitHubIcon size={32} color="currentColor" className="" /></a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}