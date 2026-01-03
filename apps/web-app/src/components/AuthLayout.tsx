import React, { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title = 'Voice AI Assistant',
  subtitle = 'Speak or type to interact' 
}) => {
  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-blue-500">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {title}
          </h1>
          <p className="text-blue-200">{subtitle}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
