import { useState, useEffect, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Language, t } from '../translations'
import { useLogin, useVerifyLoginOTP } from '../../hooks/userLoginQuery'
import { useAuth } from '@myorg/auth'


const Login = ({ language = 'en' }: { language?: Language }) => {

  const { mutate: sendOtp } = useLogin();
  const { mutate: verifyOtp } = useVerifyLoginOTP();
  const { login, setUser } = useAuth()  
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [stage, setStage] = useState<'phone' | 'otp' | 'done'>('phone')
  const [error, setError] = useState<string | null>(null)
  const [sentOtp, setSentOtp] = useState<string | null>(null)
  const [timer, setTimer] = useState<number>(0)

  useEffect(() => {
    let id: NodeJS.Timeout | null = null
    if (timer > 0) {
      id = setTimeout(() => setTimer(timer - 1), 1000)
    }
    return () => { if (id) clearTimeout(id) }
  }, [timer])

  const validatePhone = (p: string) => {
    const digits = p.replace(/\D/g, '')
    return digits.length === 10
  }

  // const handleSendOtp = () => {
  //   setError(null)
  //   if (!validatePhone(phone)) {
  //     setError(t(language, 'invalid_phone'))
  //     return
  //   }
  //   const code = Math.floor(100000 + Math.random() * 900000).toString()
  //   setSentOtp(code)
  //   setStage('otp')
  //   setTimer(60)
  //   // eslint-disable-next-line no-alert
  //   alert(`${t(language, 'otp_sent')}: ${code}`)
  // }

  
  const handleSendOtp = () => {
    setError(null)
    if (!validatePhone(phone)) {
      setError(t(language, 'invalid_phone'))
      return
    }
    // mutate is used to call the sendOtp function from the userLoginQuery hook
    // It will send the OTP to the provided phone number
    // and handle success and error cases
    // The onSuccess callback will navigate to the OtpVerification screen
    // The onError callback will log the error to the console
    // await sendOtp(phoneNumber); // Call the sendOtp function from the userLoginQuery
    // This will send the OTP to the provided phone number
    // and handle success and error cases
    // The onSuccess callback will navigate to the OtpVerification screen
    // The onError callback will log the error to the console
    (async () => {
      sendOtp(
        phone, // Payload
        {
          onSuccess: data => {
            console.log('OTP sent successfully!', data)
          },
          onError: error => {
            // Handle error, e.g., show an alert
            console.error('Error sending OTP:', error)
          },
        },
      )
    })()
    setStage('otp')
    setTimer(60)
  };

  const handleVerifyOtp = () => {
    setError(null)
    if (otp.trim() === '' || otp !== sentOtp) {
      setError(t(language, 'invalid_otp'))
      return
    }
    (async () => {
      verifyOtp(
        { phone, otp }, // Payload
        {
          onSuccess: data => {
            console.log('OTP verified successfully!', data)
          },
          onError: error => {
            // Handle error, e.g., show an alert
            console.error('Error verifying OTP:', error)
          },
        },
      )
    })()
    setStage('done')
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('voiceAI_authToken', token)
    setTimeout(() => navigate('/home'), 600)
  }

  const handleResend = () => {
    if (timer > 0) return
    handleSendOtp()
  }

  return (
    <>
      {stage === 'phone' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/90">{t(language, 'phone_number')}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              placeholder={t(language, 'enter_phone')}
              inputMode="tel"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            {error && <span className="text-sm text-red-400">{error}</span>}
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSendOtp}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              {t(language, 'send_otp')}
            </button>
          </div>
        </div>
      )}

      {stage === 'otp' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/90">{t(language, 'enter_otp')}</label>
            <input
              type="text"
              value={otp}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
              placeholder={t(language, 'enter_otp_placeholder')}
              inputMode="numeric"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            {error && <span className="text-sm text-red-400">{error}</span>}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="text-white/80 text-sm">{t(language, 'didnt_receive')}</div>
            <div className="flex gap-2 items-center">
              <button
                onClick={handleResend}
                disabled={timer > 0}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {timer>0 ? `${t(language,'resend_in')} ${timer}s` : t(language,'resend_otp')}
              </button>
              <button
                onClick={handleVerifyOtp}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
              >
                {t(language, 'verify')}
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === 'done' && (
        <div className="text-center py-8">
          <div className="text-white font-semibold">{t(language, 'welcome')}</div>
          <div className="text-blue-200 mt-2 text-sm">{t(language, 'login_success')}</div>
        </div>
      )}
    </>
  )
}

export default Login