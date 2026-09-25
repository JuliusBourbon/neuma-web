import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from './components/common/topBar'
import Footer from './components/layout/footer'
import FillRoundedButton from './components/common/fillRoundedButton'
import LoginPage from './features/auth/pages/loginPage'
import RegisterPage from './features/auth/pages/registerPage'
import preview from './assets/landingpage/preview.png'
import muscle from './assets/onboarding/firefly-5.png'
import mascot_1 from './assets/onboarding/mascot_1.png'
import mascot_2 from './assets/onboarding/mascot_2.png'
import mascot_3 from './assets/onboarding/mascot_3.png'
import mascot_4 from './assets/onboarding/mascot_4.png'
import mascot_5 from './assets/onboarding/mascot_5.png'
import mascot_6 from './assets/onboarding/mascot_6.png'
import mascot_7 from './assets/onboarding/mascot_7.png'
import mascot_8 from './assets/onboarding/mascot_8.png'
import mascot_9 from './assets/onboarding/mascot_9.png'
import mascot_10 from './assets/onboarding/mascot_10.png'

function App() {
  const [authModal, setAuthModal] = useState(null) // 'login' | 'register' | null
  const [isClosing, setIsClosing] = useState(false)

  const navigate = useNavigate()

  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem('neuma_lang');
    return (savedLang === 'en' || savedLang === 'id') ? savedLang : 'id';
  });

  const toggleLanguage = () => {
    const newLang = lang === 'id' ? 'en' : 'id'
    setLang(newLang)
    localStorage.setItem('neuma_lang', newLang)
  }

  const handleCloseModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setAuthModal(null)
      setIsClosing(false)
    }, 300) // matches the fade-out duration
  }

  const handleAuthClick = (modalType) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/home');
    } else {
      setAuthModal(modalType);
    }
  };

  const sectionRef = useRef(null)
  const [scrollYProgress, setScrollYProgress] = useState(0)

  const bottomSectionRef = useRef(null)
  const [isBottomVisible, setIsBottomVisible] = useState(false)
  const [bottomImgProgress, setBottomImgProgress] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsBottomVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (bottomSectionRef.current) {
      observer.observe(bottomSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let animationFrameId;

    const handleScroll = () => {
      if (!sectionRef.current) return;

      animationFrameId = requestAnimationFrame(() => {
        const { top, height } = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const maxScroll = height - windowHeight;

        let progress = 0;
        if (top <= 0) {
          progress = Math.min(1, Math.max(0, -top / maxScroll));
        }
        setScrollYProgress(progress);

        if (bottomSectionRef.current) {
          const bottomRect = bottomSectionRef.current.getBoundingClientRect();
          const startTop = windowHeight * 0.7;
          const endTop = windowHeight * 0.2;

          let imgProgress = 0;
          if (bottomRect.top <= startTop && bottomRect.top >= endTop) {
            imgProgress = (startTop - bottomRect.top) / (startTop - endTop);
          } else if (bottomRect.top < endTop) {
            imgProgress = 1;
          }
          setBottomImgProgress(imgProgress);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const getSpanStyle = (index) => {
    const start = index * 0.3;
    const end = start + 0.5;

    let opacity = 0;
    let translateY = 50;

    if (scrollYProgress > start && scrollYProgress < end) {
      const progress = (scrollYProgress - start) / (end - start);
      opacity = progress;
      translateY = 50 * (1 - progress);
    } else if (scrollYProgress >= end) {
      opacity = 1;
      translateY = 0;
    }

    return {
      opacity,
      transform: `translateY(${translateY}px)`,
      transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
      willChange: 'opacity, transform'
    };
  };

  const getBottomImgStyle = () => {
    return {
      opacity: bottomImgProgress,
      transform: `translateY(${50 * (1 - bottomImgProgress)}px)`,
      transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
      willChange: 'opacity, transform'
    };
  };

  // List for TopBar
  const navLinks = [
    { text: 'Sign Language', onClick: () => navigate('/sign-language') },
    { text: 'About Us', onClick: () => navigate('/about-us') },
    { text: 'Sign in', onClick: () => handleAuthClick('login') },
  ]

  return (
    <div>
      {/* Floating Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="fixed z-60 bottom-6 right-6 md:top-8 md:bottom-auto md:right-8 bg-tertiary text-primary font-bold py-2 px-4 rounded-full shadow-lg border border-primary/20 hover:scale-105 active:scale-95 transition-transform"
        title={lang === 'id' ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      >
        {lang === 'id' ? 'EN' : 'ID'}
      </button>

      <div className='bg-primary h-screen flex flex-col justify-center items-center relative overflow-hidden scroll-smooth'>
        <TopBar brand='Neumá' links={navLinks} />
        <div className='flex flex-col items-center animate-fade-in-up'>
          <div className=''>
            <h1 className='text-tertiary text-5xl text-center p-6'>Neumá</h1>
            <h3 className='text-secondary text-2xl text-center font-medium mb-6'>Break the Silence, Bridge the World.</h3>
          </div>
          <div className='flex flex-col md:flex-row gap-2 md:gap-6'>
            <FillRoundedButton
              text={lang === 'id' ? "Mulai Sekarang" : "Get Started"}
              classes="bg-tertiary text-primary"
              onClick={() => handleAuthClick('register')}
            />
            <FillRoundedButton
              text={lang === 'id' ? "Sudah punya akun" : "Already have an account"}
              classes="bg-secondary text-white"
              onClick={() => handleAuthClick('login')}
            />
          </div>
        </div>

        {/* Full-Screen Modal for Login & Register */}
        {authModal && (
          <div className={`fixed inset-0 z-50 overflow-y-auto ${isClosing ? 'fade-out' : 'animate-in fade-in duration-300'}`}>
            {authModal === 'login' ? (
              <LoginPage
                lang={lang}
                onClose={handleCloseModal}
                onSwitchToRegister={() => setAuthModal('register')}
              />
            ) : (
              <RegisterPage
                lang={lang}
                onClose={handleCloseModal}
                onSwitchToLogin={() => setAuthModal('login')}
              />
            )}
          </div>
        )}
      </div>

      <div className='bg-primary h-[40vh] lg:h-screen md:px-8 lg:px-16'>
        <div className='h-full w-full bg-tertiary md:rounded-t-4xl flex flex-col md:justify-between'>
          <div className='text-lg md:text-3xl lg:text-4xl py-10 font-bold  text-primary flex flex-col items-center justify-center'>
            <span className='text-center'>
              {lang === 'id' ? "Rasakan pengalaman baru dalam belajar bahasa isyarat" : "Experience a new experience in learning sign language"}
            </span>
          </div>
          <div className='md:px-16'>
            <img src={preview} alt="Preview" className='md:rounded-t-3xl' />
          </div>
        </div>

      </div>

      <div ref={sectionRef} className='bg-primary h-[400vh] relative'>
        <div className='sticky top-0 h-screen px-16 flex flex-col justify-center items-center text-6xl font-bold gap-8 overflow-hidden'>

          {/* Mascots Background */}
          <img src={mascot_1} alt="Mascot 1" className='absolute top-[10%] left-[10%] float-1 w-20 md:w-32 object-contain' />
          <img src={mascot_2} alt="Mascot 2" className='absolute top-[15%] right-[12%] float-2 w-24 md:w-36 object-contain' />
          <img src={mascot_3} alt="Mascot 3" className='absolute bottom-[15%] left-[8%] float-3 w-16 md:w-28 object-contain' />
          <img src={mascot_4} alt="Mascot 4" className='absolute bottom-[10%] right-[10%] float-4 w-20 md:w-32 object-contain' />
          <img src={mascot_5} alt="Mascot 5" className='absolute top-[40%] left-[5%] float-4 w-16 md:w-28 object-contain' />
          <img src={mascot_6} alt="Mascot 6" className='absolute top-[45%] right-[5%] float-3 w-20 md:w-32 object-contain' />
          <img src={mascot_7} alt="Mascot 7" className='absolute top-[5%] left-[45%] float-1 w-12 md:w-24 object-contain' />
          <img src={mascot_8} alt="Mascot 8" className='absolute bottom-[5%] left-[45%] float-2 w-16 md:w-28 object-contain' />
          <img src={mascot_9} alt="Mascot 9" className='absolute top-[30%] left-[25%] float-2 w-12 md:w-20 object-contain' />
          <img src={mascot_10} alt="Mascot 10" className='absolute bottom-[30%] right-[25%] float-1 w-16 md:w-24 object-contain' />

          {/* Texts */}
          <span style={getSpanStyle(0)} className='relative z-10 text-center'>
            {lang === 'id' ? "Pelajari 35+ level" : "Learn all 35+ levels"}
          </span>
          <span style={getSpanStyle(1)} className='relative z-10 text-center'>
            {lang === 'id' ? "Selesaikan Tantangan" : "Complete Challenge"}
          </span>
          <span style={getSpanStyle(2)} className='relative z-10 text-center'>
            {lang === 'id' ? "Kumpulkan Avatar" : "Collect Avatars"}
          </span>
        </div>
      </div>

      <div className='bg-tertiary lg:h-screen'>
        <div className='bg-primary h-[50vh] rounded-b-4xl relative z-10'>
          <div
            ref={bottomSectionRef}
            className={`flex flex-col h-full gap-4 justify-center items-center ${isBottomVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
          >
            <span className='text-center text-2xl md:text-3xl font-bold '>
              {lang === 'id' ? (
                <>Bahasa Baru di Genggaman Anda <br /> Dunia Baru dalam Jangkauan Anda</>
              ) : (
                <>A New Language in Your Hands <br /> A Whole New World in Your Reach</>
              )}
            </span>
            <span className='text-center text-base'>
              {lang === 'id' ? "Mulai belajar Bahasa Isyarat bersama Neumá hari ini!" : "Start learning Sign Language with Neumá today!"}
            </span>
            <div className='flex flex-col items-center'>
              <img src={muscle} alt="mascot muscle" className='h-24 md:h-30' style={getBottomImgStyle()} />
              <FillRoundedButton
                text={lang === 'id' ? "Mulai Sekarang" : "Get Started"}
                classes="bg-tertiary text-primary z-10"
                onClick={() => handleAuthClick('register')}
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>

    </div >
  )
}

export default App
