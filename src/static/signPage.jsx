import { useState, useEffect } from "react";
import TopBar from "../components/common/topBar";
import Footer from "../components/layout/footer";

export default function SignPage() {
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
                            {lang === 'id' ? "Tentang Bahasa Isyarat Kami" : "About Our Sign Language"}
                        </h1>
                        <h3 className='text-base opacity-80'>
                            {lang === 'id' ? "Memahami kurikulum dan teknologi di balik Neumá" : "Understanding the curriculum and technology behind Neumá"}
                        </h3>
                    </div>

                    <div className="w-full h-px bg-tertiary/20"></div>

                    <div className="flex flex-col gap-8 text-lg">
                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "1. Bahasa Isyarat Apa yang Kami Gunakan?" : "1. Which Sign Language Do We Use?"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    <>Saat ini, Neumá berfokus utama pada <strong>BISINDO</strong>. Aplikasi ini memilih BISINDO karena merupakan bahasa isyarat yang lahir dan berkembang secara organik di kalangan komunitas Tuli Indonesia, menjadikannya sarana komunikasi harian yang paling autentik dan mudah dipahami. Selain itu, sistem alfabet visual dua tangan yang menyerupai huruf latin cetak sangat intuitif sehingga memudahkan pemula untuk cepat menghafal serta mempraktikannya dalam interaksi langsung.</>
                                ) : (
                                    <>Currently, Neumá primarily focuses on <strong>BISINDO</strong>. The app chooses BISINDO because it is a sign language that was born and developed organically among the Indonesian Deaf community, making it the most authentic and easily understood means of daily communication. Additionally, its two-handed visual alphabet system, resembling printed Latin letters, is very intuitive, helping beginners quickly memorize and practice it in direct interaction.</>
                                )}
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "2. Bagaimana AI Kami Bekerja" : "2. How Our AI Works"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    <>Untuk memberikan feedback secara langsung, kami menggunakan teknologi <strong>On-Device Machine Learning</strong>. Sistem kami mendeteksi 21 titik (landmarks) pada tangan Anda melalui kamera secara <em>real-time</em>. Proses ini berjalan sepenuhnya di perangkat Anda, sehingga kami tidak pernah merekam atau menyimpan video Anda di server kami.</>
                                ) : (
                                    <>To provide real-time feedback, we use <strong>On-Device Machine Learning</strong> technology. Our system detects 21 landmarks on your hands via camera in <em>real-time</em>. This process runs entirely on your device, meaning we never record or store your videos on our servers.</>
                                )}
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "3. Apa yang Akan Anda Pelajari" : "3. What You Will Learn"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    "Kurikulum kami dirancang interaktif yang terbagi ke dalam 35+ level. Anda akan belajar secara bertahap mulai dari materi dasar:"
                                ) : (
                                    "Our interactive curriculum is divided into 35+ levels. You will learn step-by-step starting from the basics:"
                                )}
                            </p>
                            <ul className="list-disc pl-6 flex flex-col gap-2">
                                <li>
                                    {lang === 'id' ? (
                                        <><strong>The Alphabet:</strong> Mempelajari huruf abjad mulai dari A-Z melalui text dan visual.</>
                                    ) : (
                                        <><strong>The Alphabet:</strong> Learn the alphabet from A-Z through text and visual.</>
                                    )}
                                </li>
                                <li>
                                    {lang === 'id' ? (
                                        <><strong>The Quiz:</strong> Setelah mempelajari huruf, akan ada beberapa quiz interaktif untuk membantu anda mengingat bentuk huruf.</>
                                    ) : (
                                        <><strong>The Quiz:</strong> After learning the alphabet, there will be several interactive quizzes to help you remember the letter shapes.</>
                                    )}
                                </li>
                                <li>
                                    {lang === 'id' ? (
                                        <><strong>Practical Test:</strong> Dengan menggunakan webcam anda, AI akan mendeteksi bentuk tangan anda.</>
                                    ) : (
                                        <><strong>Practical Test:</strong> Using your webcam, AI will detect the shape of your hands.</>
                                    )}
                                </li>
                                <li>
                                    {lang === 'id' ? (
                                        <><strong>Spelling:</strong> Selain <strong>Practical Test</strong>, anda juga akan ditantang untuk membentuk sebuah kata dengan menggunakan isyarat yang sudah anda pelajari.</>
                                    ) : (
                                        <><strong>Spelling:</strong> Besides <strong>Practical Test</strong>, you will also be challenged to form a word using the signs you have learned.</>
                                    )}
                                </li>
                            </ul>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "4. Tips & Best Practices" : "4. Tips & Best Practices"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    "Karena AI kami mendeteksi pergerakan tangan melalui kamera, berikut adalah beberapa tips agar proses deteksi berjalan akurat dan lancar:"
                                ) : (
                                    "Since our AI detects hand movements through the camera, here are some tips to ensure accurate and smooth detection:"
                                )}
                            </p>
                            <ul className="list-disc pl-6 flex flex-col gap-2">
                                <li>
                                    {lang === 'id' ? (
                                        <><strong>Pencahayaan (Lighting):</strong> Pastikan ruangan Anda cukup terang agar kamera dapat menangkap bentuk tangan dengan jelas.</>
                                    ) : (
                                        <><strong>Lighting:</strong> Ensure your room is bright enough so the camera can clearly capture the shape of your hands.</>
                                    )}
                                </li>
                                <li>
                                    {lang === 'id' ? (
                                        <><strong>Latar Belakang (Background):</strong> Latar belakang yang polos dan tidak terlalu ramai akan sangat membantu AI fokus pada tangan Anda.</>
                                    ) : (
                                        <><strong>Background:</strong> A plain, uncluttered background will greatly help the AI focus on your hands.</>
                                    )}
                                </li>
                                <li>
                                    {lang === 'id' ? (
                                        <><strong>Posisi:</strong> Jaga agar tangan Anda tetap berada di dalam *frame* kamera dan hindari gerakan yang terlalu cepat saat AI sedang membaca isyarat.</>
                                    ) : (
                                        <><strong>Positioning:</strong> Keep your hands within the camera frame and avoid moving too fast while the AI is reading your signs.</>
                                    )}
                                </li>
                            </ul>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "5. Ekspansi Masa Depan" : "5. Future Expansions"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    "Kami percaya bahwa bahasa isyarat harus dapat diakses oleh semua orang. Ke depannya, Neumá berencana untuk memperluas kurikulum dengan menambahkan lebih banyak bahasa isyarat lokal dan internasional untuk mendukung komunitas tuli di seluruh dunia."
                                ) : (
                                    "We believe that sign language should be accessible to everyone. In the future, Neumá plans to expand the curriculum by adding more local and international sign languages to support the deaf community worldwide."
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