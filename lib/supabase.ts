import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Profile {
  id: string
  username: string
  nickname?: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  profiles?: Profile
  likes?: Like[]
  comments?: Comment[]
  _count?: {
    likes: number
    comments: number
  }
}

export interface Like {
  id: string
  user_id: string
  post_id: string
  created_at: string
  profiles?: Profile
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
  profiles?: Profile
}

export interface Comment {
  id: string
  user_id: string
  post_id: string
  content: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Conversation {
  id: string
  user1_id: string
  user2_id: string
  created_at: string
  updated_at: string
  messages?: Message[]
  profiles?: Profile[]
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  read_at?: string
  profiles?: Profile
}
