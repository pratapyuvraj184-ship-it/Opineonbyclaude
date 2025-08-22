'use client'

import { useAuth } from '../contexts/AuthContext'
import { LogOut, Home, User, MessageCircle, Mail } from 'lucide-react'

interface HeaderProps {
  activeTab: 'feed' | 'profile' | 'chat' | 'contact'
  setActiveTab: (tab: 'feed' | 'profile' | 'chat' | 'contact') => void
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { profile, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">BlogSpace</h1>
            
            <nav className="flex space-x-6">
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition duration-200 ${
                  activeTab === 'feed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home size={18} />
                <span>Feed</span>
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <User size={18} />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition duration-200 ${
                  activeTab === 'chat'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <MessageCircle size={18} />
                <span>Chat</span>
              </button>
              
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition duration-200 ${
                  activeTab === 'contact'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Mail size={18} />
                <span>Contact</span>
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Welcome, {profile?.nickname || profile?.username}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition duration-200"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
