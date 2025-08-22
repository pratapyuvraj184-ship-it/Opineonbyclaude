'use client'

import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPanel() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-gray-600 text-lg">
            Have questions, suggestions, or just want to say hello? I'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <a
                  href="mailto:pratapyuvraj184@gmail.com"
                  className="text-blue-600 hover:text-blue-800 transition duration-200"
                >
                  pratapyuvraj184@gmail.com
                </a>
                <p className="text-gray-600 text-sm mt-1">
                  I'll get back to you within 24 hours
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                <p className="text-gray-600">
                  Usually within 2-6 hours
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Monday - Friday: 9 AM - 6 PM IST
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600">
                  Patna, Bihar, India
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  UTC +5:30 (Indian Standard Time)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Contact Form</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Tell me more about your inquiry..."
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  alert('This is a demo form. Please use the email address above to contact me directly.')
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">Available for freelance projects and collaborations</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <h3 className="font-semibold text-gray-900 mb-4">About This Platform</h3>
          <p className="text-gray-600 mb-4">
            BlogSpace is a modern blogging platform where users can share their thoughts, 
            connect with others, and engage in meaningful conversations. Built with the latest 
            web technologies for a seamless user experience.
          </p>
          <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
            <span>🚀 Built with Next.js & Supabase</span>
            <span>•</span>
            <span>💙 Made with love by</span>
            <span className="font-semibold text-blue-600">@not_yuvraj1</span>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Features & Support</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Platform Features</h4>
              <ul className="space-y-1">
                <li>• User authentication & profiles</li>
                <li>• Blog posting (up to 300 words)</li>
                <li>• Like, follow & comment system</li>
                <li>• Real-time personal chat</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Get Help With</h4>
              <ul className="space-y-1">
                <li>• Account issues</li>
                <li>• Feature requests</li>
                <li>• Bug reports</li>
                <li>• General feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
