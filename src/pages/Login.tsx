import React, { useState } from 'react'
import { Lock, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    await login(email, password)
    navigate('/draft')
  } catch (error) {
    console.error("Login failed:", error)
    // optionally show an error message to the user
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-eucalyptus-pale to-sage-beige flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-eucalyptus-dark mb-2">Welcome back</h1>
          <p className="text-eucalyptus-dark/70">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-eucalyptus-dark mb-2">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-eucalyptus-dark/50" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-eucalyptus-light rounded-lg focus:ring-2 focus:ring-eucalyptus-light focus:border-eucalyptus-light bg-eucalyptus-pale/20"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-eucalyptus-dark mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-eucalyptus-dark/50" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-eucalyptus-light rounded-lg focus:ring-2 focus:ring-eucalyptus-light focus:border-eucalyptus-light bg-eucalyptus-pale/20"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-eucalyptus-dark focus:ring-eucalyptus-light border-eucalyptus-light rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-eucalyptus-dark">
                Remember me
              </label>
            </div>
            <button type="button" className="text-sm font-medium text-eucalyptus-dark hover:text-eucalyptus-dark/80">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-eucalyptus-dark hover:bg-eucalyptus-dark/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eucalyptus-light transition duration-150"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}