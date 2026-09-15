import { useState } from 'react'
import TopBar from './components/common/topBar'
import FillRoundedButton from './components/common/fillRoundedButton'
import LoginPage from './features/auth/pages/loginPage'
import RegisterPage from './features/auth/pages/registerPage'

function App() {
  const [authModal, setAuthModal] = useState(null) // 'login' | 'register' | null

  // List for TopBar
  const navLinks = [
    { text: 'Sign Language', href: '#sign-language' },
    { text: 'About Us', href: '#about-us' },
    { text: 'Sign in', onClick: () => setAuthModal('login') },
  ]

  return (
    <div className='bg-primary h-screen flex flex-col justify-center items-center relative overflow-hidden'>
      <TopBar brand='Neumá' links={navLinks} />
      <div className=''>
        <h1 className='text-tertiary text-5xl text-center p-6'>Neumá</h1>
        <h3 className='text-secondary text-2xl text-center font-medium mb-6'>Open your world with Sign Language, Today!</h3>
      </div>
      <div className='flex gap-6'>
        <FillRoundedButton
          text="Get Started"
          classes="bg-tertiary text-primary"
          onClick={() => setAuthModal('register')}
        />
        <FillRoundedButton
          text="Already have an account"
          classes="bg-secondary text-white"
          onClick={() => setAuthModal('login')}
        />
      </div>

      {/* Full-Screen Modal untuk Login & Register */}
      {authModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
          {authModal === 'login' ? (
            <LoginPage
              onClose={() => setAuthModal(null)}
              onSwitchToRegister={() => setAuthModal('register')}
            />
          ) : (
            <RegisterPage
              onClose={() => setAuthModal(null)}
              onSwitchToLogin={() => setAuthModal('login')}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default App
