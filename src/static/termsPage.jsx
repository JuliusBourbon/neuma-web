import TopBar from "../components/common/topBar";
import Footer from "../components/layout/footer";

export default function TermsPage() {
    return (
        <div className="font-sans bg-tertiary">
            <div className="bg-primary flex flex-col items-center relative z-10 scroll-smooth min-h-screen rounded-b-4xl pb-10">
                <TopBar />
                <div className='pt-32 pb-20 px-6 md:px-0 flex flex-col w-full max-w-3xl text-tertiary gap-8'>
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-4xl md:text-5xl font-bold'>Terms of Service</h1>
                        <h3 className='text-base opacity-80'>Last updated: September 24, 2026</h3>
                    </div>

                    <div className="w-full h-px bg-tertiary/20"></div>

                    <div className="flex flex-col gap-8 text-lg">
                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using the Neumá application and website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">2. Description of Service</h2>
                            <p>
                                Neumá provides an interactive platform for learning sign language. Our service includes educational levels, challenges, and real-time gesture recognition using your device's camera. We reserve the right to modify or discontinue the service at any time without notice.
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">3. User Accounts</h2>
                            <p>
                                To access certain features, you must create an account (e.g., using Google OAuth). You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">4. Hardware & Camera Usage</h2>
                            <p>
                                Our core functionality requires access to your device's camera to process sign language gestures. By using our service, you grant Neumá permission to access your camera. <strong>All video processing is done locally on your device</strong>, and we do not transmit or store your video feed. Please refer to our Privacy Policy for more details.
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">5. Intellectual Property</h2>
                            <p>
                                The service and its original content (including text, graphics, images, mascots/avatars, and software) are the exclusive property of Neumá and its licensors. You may not copy, modify, distribute, or reproduce any part of our service without prior written consent.
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">6. User Conduct</h2>
                            <p>
                                You agree not to use the service in any way that causes, or may cause, damage to the service or impairment of the availability or accessibility of the service. You must not use our service for any unlawful, illegal, fraudulent, or harmful purpose or activity.
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>
                            <p>
                                In no event shall Neumá, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of, or inability to access or use, the service. The service is provided on an "AS IS" and "AS AVAILABLE" basis.
                            </p>
                        </section>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">8. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms, please contact us at <strong>bjourbonn@gmail.com</strong>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}