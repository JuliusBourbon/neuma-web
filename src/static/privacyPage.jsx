import TopBar from "../components/common/topBar";
import Footer from "../components/layout/footer";

export default function PrivacyPage() {
    return (
        <div className="font-sans bg-tertiary">
            <div className="bg-primary flex flex-col items-center relative z-10 scroll-smooth min-h-screen rounded-b-4xl pb-10">
                <TopBar />
                <div className='pt-32 pb-20 px-6 md:px-0 flex flex-col w-full max-w-3xl text-tertiary gap-8'>
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-4xl md:text-5xl font-bold'>Privacy Policy</h1>
                        <h3 className='text-base opacity-80'>Last updated: September 24, 2026</h3>
                    </div>

                    <div className="w-full h-px bg-tertiary/20"></div>

                    <div className="flex flex-col gap-8 text-lg">
                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">1. Introduction</h2>
                            <p>
                                Welcome to Neumá ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience while using our sign language learning platform. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
                            <p>We collect several different types of information for various purposes to provide and improve our service to you:</p>
                            <ul className="list-disc pl-6 flex flex-col gap-2">
                                <li><strong>Account Information:</strong> When you register an account, including through third-party authentication services like Google, we collect your name, email address, and basic profile information.</li>
                                <li><strong>Camera & Video Data:</strong> To enable our core feature of interactive sign language recognition, our application requires access to your device's camera. <strong>We process your camera feed locally on your device in real-time</strong> using on-device machine learning models. We do not record, store, or transmit your video data to our servers.</li>
                                <li><strong>Usage & Progress Data:</strong> We collect data about how you interact with the app, such as your learning progress across the 35+ levels, completed challenges, and collected avatars to track your journey.</li>
                            </ul>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
                            <p>Neumá uses the collected data for the following purposes:</p>
                            <ul className="list-disc pl-6 flex flex-col gap-2">
                                <li>To provide, operate, and maintain our educational platform.</li>
                                <li>To manage your user account and securely save your progress.</li>
                                <li>To personalize your learning journey and recommend suitable challenges.</li>
                                <li>To analyze usage patterns in order to improve our app's functionality and user experience.</li>
                            </ul>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">4. Third-Party Services</h2>
                            <p>
                                We employ third-party services to facilitate our application, such as Google OAuth for seamless and secure authentication. These third parties have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">5. Data Security</h2>
                            <p>
                                The security of your data is critically important to us. We implement standard security measures to protect your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">6. Changes to This Privacy Policy</h2>
                            <p>
                                We may update our Privacy Policy periodically. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this document. You are advised to review this Privacy Policy periodically for any changes.
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">7. Contact Us</h2>
                            <p>
                                If you have any questions, concerns, or requests regarding this Privacy Policy, please don't hesitate to contact us at <strong>bjourbonn@gmail.com</strong>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}