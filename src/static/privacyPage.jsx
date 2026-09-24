import { useState, useEffect } from "react";
import TopBar from "../components/common/topBar";
import Footer from "../components/layout/footer";

export default function PrivacyPage() {
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

                <div className='pt-32 pb-20 px-6 md:px-0 flex flex-col w-full max-w-3xl text-tertiary gap-8'>
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-4xl md:text-5xl font-bold'>
                            {lang === 'id' ? "Kebijakan Privasi" : "Privacy Policy"}
                        </h1>
                        <h3 className='text-base opacity-80'>
                            {lang === 'id' ? "Terakhir diperbarui: 24 September 2026" : "Last updated: September 24, 2026"}
                        </h3>
                    </div>

                    <div className="w-full h-px bg-tertiary/20"></div>

                    <div className="flex flex-col gap-8 text-lg">
                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "1. Pengantar" : "1. Introduction"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    'Selamat datang di Neumá ("kami"). Kami berkomitmen untuk melindungi privasi Anda dan memastikan Anda memiliki pengalaman positif saat menggunakan platform pembelajaran bahasa isyarat kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda menggunakan situs web dan layanan kami.'
                                ) : (
                                    'Welcome to Neumá ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience while using our sign language learning platform. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.'
                                )}
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "2. Informasi yang Kami Kumpulkan" : "2. Information We Collect"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    "Kami mengumpulkan beberapa jenis informasi berbeda untuk berbagai tujuan guna menyediakan dan meningkatkan layanan kami kepada Anda:"
                                ) : (
                                    "We collect several different types of information for various purposes to provide and improve our service to you:"
                                )}
                            </p>
                            <ul className="list-disc pl-6 flex flex-col gap-2 mt-2">
                                <li>
                                    {lang === 'id' ? (
                                        <><strong>Informasi Akun:</strong> Saat Anda mendaftar akun, termasuk melalui layanan autentikasi pihak ketiga seperti Google, kami mengumpulkan nama, alamat email, dan informasi profil dasar Anda.</>
                                    ) : (
                                        <><strong>Account Information:</strong> When you register an account, including through third-party authentication services like Google, we collect your name, email address, and basic profile information.</>
                                    )}
                                </li>
                                <li>
                                    {lang === 'id' ? (
                                        <><strong>Data Kamera & Video:</strong> Untuk mengaktifkan fitur utama pengenalan bahasa isyarat interaktif kami, aplikasi kami memerlukan akses ke kamera perangkat Anda. <strong>Kami memproses feed kamera Anda secara lokal di perangkat Anda secara real-time</strong> menggunakan model machine learning di dalam perangkat. Kami tidak merekam, menyimpan, atau mengirim data video Anda ke server kami.</>
                                    ) : (
                                        <><strong>Camera & Video Data:</strong> To enable our core feature of interactive sign language recognition, our application requires access to your device's camera. <strong>We process your camera feed locally on your device in real-time</strong> using on-device machine learning models. We do not record, store, or transmit your video data to our servers.</>
                                    )}
                                </li>
                                <li>
                                    {lang === 'id' ? (
                                        <><strong>Data Penggunaan & Progres:</strong> Kami mengumpulkan data tentang bagaimana Anda berinteraksi dengan aplikasi, seperti progres pembelajaran Anda di lebih dari 35 level, tantangan yang diselesaikan, dan avatar yang dikumpulkan untuk melacak perjalanan Anda.</>
                                    ) : (
                                        <><strong>Usage & Progress Data:</strong> We collect data about how you interact with the app, such as your learning progress across the 35+ levels, completed challenges, and collected avatars to track your journey.</>
                                    )}
                                </li>
                            </ul>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "3. Bagaimana Kami Menggunakan Informasi Anda" : "3. How We Use Your Information"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    "Neumá menggunakan data yang dikumpulkan untuk tujuan berikut:"
                                ) : (
                                    "Neumá uses the collected data for the following purposes:"
                                )}
                            </p>
                            <ul className="list-disc pl-6 flex flex-col gap-2 mt-2">
                                <li>
                                    {lang === 'id' ? "Untuk menyediakan, mengoperasikan, dan memelihara platform edukasi kami." : "To provide, operate, and maintain our educational platform."}
                                </li>
                                <li>
                                    {lang === 'id' ? "Untuk mengelola akun pengguna Anda dan menyimpan progres Anda secara aman." : "To manage your user account and securely save your progress."}
                                </li>
                                <li>
                                    {lang === 'id' ? "Untuk mempersonalisasi perjalanan belajar Anda dan merekomendasikan tantangan yang sesuai." : "To personalize your learning journey and recommend suitable challenges."}
                                </li>
                                <li>
                                    {lang === 'id' ? "Untuk menganalisis pola penggunaan guna meningkatkan fungsionalitas dan pengalaman pengguna aplikasi kami." : "To analyze usage patterns in order to improve our app's functionality and user experience."}
                                </li>
                            </ul>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "4. Layanan Pihak Ketiga" : "4. Third-Party Services"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    "Kami menggunakan layanan pihak ketiga untuk memfasilitasi aplikasi kami, seperti Google OAuth untuk autentikasi yang mulus dan aman. Pihak ketiga ini memiliki akses ke informasi pribadi Anda hanya untuk melakukan tugas-tugas tertentu atas nama kami dan berkewajiban untuk tidak mengungkapkan atau menggunakannya untuk tujuan lain apa pun."
                                ) : (
                                    "We employ third-party services to facilitate our application, such as Google OAuth for seamless and secure authentication. These third parties have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose."
                                )}
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "5. Keamanan Data" : "5. Data Security"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    "Keamanan data Anda sangat penting bagi kami. Kami menerapkan langkah-langkah keamanan standar untuk melindungi informasi pribadi Anda. Namun, harap diingat bahwa tidak ada metode transmisi melalui Internet atau metode penyimpanan elektronik yang 100% aman."
                                ) : (
                                    "The security of your data is critically important to us. We implement standard security measures to protect your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure."
                                )}
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "6. Perubahan pada Kebijakan Privasi Ini" : "6. Changes to This Privacy Policy"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    'Kami dapat memperbarui Kebijakan Privasi kami secara berkala. Kami akan memberi tahu Anda tentang segala perubahan dengan memposting Kebijakan Privasi baru di halaman ini dan memperbarui tanggal "Terakhir diperbarui" di bagian atas dokumen ini. Anda disarankan untuk meninjau Kebijakan Privasi ini secara berkala untuk melihat adanya perubahan.'
                                ) : (
                                    'We may update our Privacy Policy periodically. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this document. You are advised to review this Privacy Policy periodically for any changes.'
                                )}
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "7. Hubungi Kami" : "7. Contact Us"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    <>Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan mengenai Kebijakan Privasi ini, jangan ragu untuk menghubungi kami di <strong>bjourbonn@gmail.com</strong>.</>
                                ) : (
                                    <>If you have any questions, concerns, or requests regarding this Privacy Policy, please don't hesitate to contact us at <strong>bjourbonn@gmail.com</strong>.</>
                                )}
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}