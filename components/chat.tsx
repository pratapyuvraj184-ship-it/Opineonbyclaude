'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, Profile, Conversation, Message } from '../lib/supabase'
import { Send, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function Chat() {
  const { user, profile } = useAuth()
  const [users, setUsers] = useState<Profile[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchUsers, setSearchUsers] = useState('')
  const [showUserSearch, setShowUserSearch] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchConversations()
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
      subscribeToMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id)
        .order('username')

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchConversations = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages:messages(
            id,
            content,
            created_at,
            sender_id
          )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false })

      if (error) throw error

      // Get the other user's profile for each conversation
      const conversationsWithProfiles = await Promise.all(
        (data || []).map(async (conv) => {
          const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id
          const { data: otherUser, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', otherUserId)
            .single()

          if (userError) throw userError

          return {
            ...conv,
            otherUser,
            lastMessage: conv.messages?.[0] || null
          }
        })
      )

      setConversations(conversationsWithProfiles)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:sender_id (
            id,
            username,
            nickname
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const subscribeToMessages = (conversationId: string) => {
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        }, 
        (payload) => {
          fetchMessages(conversationId)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const startConversation = async (otherUser: Profile) => {
    if (!user) return

    try {
      // Check if conversation already exists
      const { data: existingConv, error: searchError } = await supabase
        .from('conversations')
        .select('*')
        .or(
          `and(user1_id.eq.${user.id},user2_id.eq.${otherUser.id}),and(user1_id.eq.${otherUser.id},user2_id.eq.${user.id})`
        )
        .single()

      if (searchError && searchError.code !== 'PGRST116') throw searchError

      let conversation = existingConv

      if (!conversation) {
        // Create new conversation
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            user1_id: user.id,
            user2_id: otherUser.id
          })
          .select()
          .single()

        if (createError) throw createError
        conversation = newConv
      }

      const convWithOtherUser = {
        ...conversation,
        otherUser,
        messages: [],
        lastMessage: null
      }

      setSelectedConversation(convWithOtherUser)
      setShowUser
