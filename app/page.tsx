'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/AuthModal'
import Header from '../components/Header'
import PostFeed from '../components/PostFeed'
import CreatePost from '../components/CreatePost'
import UserProfile from '../components/UserProfile'
import Chat from '../components/Chat'
import ContactPanel from '../components/ContactPanel'

export default function Home() {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'feed' | 'profile' | 'chat' | 'contact'>('feed')

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true)
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to BlogSpace</h1>
            <p className="text-xl text-gray-600 mb-8">Share your thoughts with the world</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
        <footer className="fixed bottom-4 right-4 text-sm text-gray-500">
          Crafted by @not_yuvraj1
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-8">
        {activeTab === 'feed' && (
          <div>
            <CreatePost />
            <PostFeed />
          </div>
        )}
        
        {activeTab === 'profile' && <UserProfile />}
        
        {activeTab === 'chat' && <Chat />}
        
        {activeTab === 'contact' && <ContactPanel />}
      </main>

      <footer className="fixed bottom-4 right-4 text-sm text-gray-500 z-10">
        Crafted by @not_yuvraj1
      </footer>
    </div>
  )
}
