'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, Post } from '../lib/supabase'
import { Edit, Save, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function UserProfile() {
  const { profile, updateProfile } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    nickname: profile?.nickname || '',
    bio: profile?.bio || ''
  })

  useEffect(() => {
    if (profile) {
      fetchUserData()
      setEditForm({
        nickname: profile.nickname || '',
        bio: profile.bio || ''
      })
    }
  }, [profile])

  const fetchUserData = async () => {
    if (!profile) return

    try {
      // Fetch user's posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          likes (id),
          comments (id)
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

      if (postsError) throw postsError
      setPosts(postsData || [])

      // Fetch followers count
      const { count: followersCount, error: followersError } = await supabase
        .from('follows')
        .select('*', { count: 'exact' })
        .eq('following_id', profile.id)

      if (followersError) throw followersError
      setFollowers(followersCount || 0)

      // Fetch following count
      const { count: followingCount, error: followingError } = await supabase
        .from('follows')
        .select('*', { count: 'exact' })
        .eq('follower_id', profile.id)

      if (followingError) throw followingError
      setFollowing(followingCount || 0)

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm)
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error
      fetchUserData()
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="w-32 h-6 bg-gray-300 rounded"></div>
              <div className="w-24 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {(profile.nickname || profile.username)[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.nickname || profile.username}
              </h1>
              <p className="text-gray-600">@{profile.username}</p>
              {profile.bio && (
                <p className="text-gray-700 mt-2">{profile.bio}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition duration-200"
          >
            <Edit size={18} />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="flex space-x-8 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
            <div className="text-gray-600">Posts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{followers}</div>
            <div className="text-gray-600">Followers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{following}</div>
            <div className="text-gray-600">Following</div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Edit Profile</h2>
            <button
              onClick={() => setEditing(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={editForm.nickname}
                onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="flex items-center justify-center space-x-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              <Save size={18} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* User's Posts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Posts</h2>
        
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500">Start sharing your thoughts with the world!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(post.created_at))} ago
                  </p>
                </div>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-red-500 hover:text-red-700 transition duration-200"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{post.likes?.length || 0} likes</span>
                <span>{post.comments?.length || 0} comments</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
