'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, Post } from '../lib/supabase'
import { Heart, MessageCircle, UserPlus, UserMinus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function PostFeed() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({})
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({})
  const [following, setFollowing] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchPosts()
    fetchFollowing()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            nickname,
            avatar_url
          ),
          likes (
            id,
            user_id
          ),
          comments (
            id,
            content,
            created_at,
            profiles:user_id (
              id,
              username,
              nickname
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFollowing = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id)

      if (error) throw error

      const followingMap: { [key: string]: boolean } = {}
      data?.forEach(follow => {
        followingMap[follow.following_id] = true
      })
      setFollowing(followingMap)
    } catch (error) {
      console.error('Error fetching following:', error)
    }
  }

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!user) return

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)
      } else {
        await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id })
      }
      
      fetchPosts()
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleComment = async (postId: string) => {
    if (!user || !commentContent[postId]?.trim()) return

    try {
      await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: commentContent[postId]
        })

      setCommentContent({ ...commentContent, [postId]: '' })
      fetchPosts()
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleFollow = async (userId: string, isFollowing: boolean) => {
    if (!user) return

    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId)
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          })
      }

      fetchFollowing()
    } catch (error) {
      console.error('Error toggling follow:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-300 rounded"></div>
                <div className="w-16 h-3 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-4 bg-gray-300 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const isLiked = post.likes?.some(like => like.user_id === user?.id) || false
        const likesCount = post.likes?.length || 0
        const commentsCount = post.comments?.length || 0
        const isFollowing = following[post.user_id] || false
        const isOwnPost = post.user_id === user?.id

        return (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {(post.profiles?.nickname || post.profiles?.username || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {post.profiles?.nickname || post.profiles?.username}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(post.created_at))} ago
                  </p>
                </div>
              </div>
              
              {!isOwnPost && (
                <button
                  onClick={() => handleFollow(post.user_id, isFollowing)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition duration-200 ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFollowing ? <UserMinus size={14} /> : <UserPlus size={14} />}
                  <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                </button>
              )}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

            <div className="flex items-center space-x-6 pb-4 border-b border-gray-200">
              <button
                onClick={() => handleLike(post.id, isLiked)}
                className={`flex items-center space-x-2 transition duration-200 ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{likesCount}</span>
              </button>

              <button
                onClick={() => setShowComments({
                  ...showComments,
                  [post.id]: !showComments[post.id]
                })}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition duration-200"
              >
                <MessageCircle size={18} />
                <span>{commentsCount}</span>
              </button>
            </div>

            {showComments[post.id] && (
              <div className="mt-4">
                <div className="space-y-3 mb-4">
                  {post.comments?.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {(comment.profiles?.nickname || comment.profiles?.username || 'U')[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm">
                              {comment.profiles?.nickname || comment.profiles?.username}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(comment.created_at))} ago
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {(user?.user_metadata?.nickname || user?.user_metadata?.username || 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentContent[post.id] || ''}
                      onChange={(e) => setCommentContent({
                        ...commentContent,
                        [post.id]: e.target.value
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleComment(post.id)
                        }
                      }}
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500">Be the first to share something!</p>
        </div>
      )}
    </div>
  )
}
