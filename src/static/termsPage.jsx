import { useState, useEffect } from "react";
import TopBar from "../components/common/topBar";
import Footer from "../components/layout/footer";

export default function TermsPage() {
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
                            {lang === 'id' ? "Syarat dan Ketentuan Layanan" : "Terms of Service"}
                        </h1>
                        <h3 className='text-base opacity-80'>
                            {lang === 'id' ? "Terakhir diperbarui: 24 September 2026" : "Last updated: September 24, 2026"}
                        </h3>
                    </div>

                    <div className="w-full h-px bg-tertiary/20"></div>

                    <div className="flex flex-col gap-8 text-lg">
                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "1. Penerimaan Syarat" : "1. Acceptance of Terms"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    "Dengan mengakses atau menggunakan aplikasi dan situs web Neumá, Anda setuju untuk terikat oleh Syarat dan Ketentuan Layanan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak diperkenankan untuk mengakses layanan kami."
                                ) : (
                                    "By accessing or using the Neumá application and website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services."
                                )}
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "2. Deskripsi Layanan" : "2. Description of Service"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    "Neumá menyediakan platform interaktif untuk belajar bahasa isyarat. Layanan kami mencakup level edukasi, tantangan, dan pengenalan gerakan secara real-time menggunakan kamera perangkat Anda. Kami berhak mengubah atau menghentikan layanan kapan saja tanpa pemberitahuan."
                                ) : (
                                    "Neumá provides an interactive platform for learning sign language. Our service includes educational levels, challenges, and real-time gesture recognition using your device's camera. We reserve the right to modify or discontinue the service at any time without notice."
                                )}
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "3. Akun Pengguna" : "3. User Accounts"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    "Untuk mengakses fitur tertentu, Anda harus membuat akun (misalnya, menggunakan Google OAuth). Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda dan untuk semua aktivitas yang terjadi di bawah akun Anda. Anda setuju untuk segera memberi tahu kami tentang penggunaan akun Anda yang tidak sah."
                                ) : (
                                    "To access certain features, you must create an account (e.g., using Google OAuth). You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account."
                                )}
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "4. Penggunaan Perangkat Keras & Kamera" : "4. Hardware & Camera Usage"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    <>Fungsi utama kami memerlukan akses ke kamera perangkat Anda untuk memproses gerakan bahasa isyarat. Dengan menggunakan layanan kami, Anda memberikan izin kepada Neumá untuk mengakses kamera Anda. <strong>Semua pemrosesan video dilakukan secara lokal di perangkat Anda</strong>, dan kami tidak mengirim atau menyimpan feed video Anda. Silakan merujuk ke Kebijakan Privasi kami untuk detail lebih lanjut.</>
                                ) : (
                                    <>Our core functionality requires access to your device's camera to process sign language gestures. By using our service, you grant Neumá permission to access your camera. <strong>All video processing is done locally on your device</strong>, and we do not transmit or store your video feed. Please refer to our Privacy Policy for more details.</>
                                )}
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "5. Hak Kekayaan Intelektual" : "5. Intellectual Property"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    "Layanan dan konten aslinya (termasuk teks, grafik, gambar, maskot/avatar, dan perangkat lunak) adalah milik eksklusif Neumá. Anda tidak diperkenankan menyalin, memodifikasi, mendistribusikan, atau mereproduksi bagian mana pun dari layanan kami tanpa persetujuan tertulis sebelumnya."
                                ) : (
                                    "The service and its original content (including text, graphics, images, mascots/avatars, and software) are the exclusive property of Neumá. You may not copy, modify, distribute, or reproduce any part of our service without prior written consent."
                                )}
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "6. Perilaku Pengguna" : "6. User Conduct"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    "Anda setuju untuk tidak menggunakan layanan dengan cara apa pun yang menyebabkan, atau mungkin menyebabkan, kerusakan pada layanan atau gangguan ketersediaan atau aksesibilitas layanan. Anda tidak boleh menggunakan layanan kami untuk tujuan atau aktivitas apa pun yang melanggar hukum, ilegal, curang, atau berbahaya."
                                ) : (
                                    "You agree not to use the service in any way that causes, or may cause, damage to the service or impairment of the availability or accessibility of the service. You must not use our service for any unlawful, illegal, fraudulent, or harmful purpose or activity."
                                )}
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">
                                {lang === 'id' ? "7. Hubungi Kami" : "7. Contact Us"}
                            </h2>
                            <p>
                                {lang === 'id' ? (
                                    <>Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami di <strong>bjourbonn@gmail.com</strong>.</>
                                ) : (
                                    <>If you have any questions about these Terms, please contact us at <strong>bjourbonn@gmail.com</strong>.</>
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