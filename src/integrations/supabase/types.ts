export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          name: string
          rarity: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
          rarity?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          rarity?: string | null
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          blog_id: string
          content: string
          created_at: string
          id: string
          is_approved: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          blog_id: string
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          blog_id?: string
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_likes: {
        Row: {
          blog_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_likes_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          category: string | null
          comments_count: number | null
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          likes_count: number | null
          published: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
          views_count: number | null
        }
        Insert: {
          category?: string | null
          comments_count?: number | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          likes_count?: number | null
          published?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          views_count?: number | null
        }
        Update: {
          category?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          likes_count?: number | null
          published?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_views: {
        Row: {
          blog_id: string
          created_at: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          blog_id: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          blog_id?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_views_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          title: string
          xp_reward: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          xp_reward?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      city_data: {
        Row: {
          aqi: number | null
          city_name: string
          country: string | null
          created_at: string | null
          data_source: string | null
          humidity: number | null
          id: string
          latitude: number | null
          longitude: number | null
          recorded_at: string | null
          temperature: number | null
          urban_growth: number | null
          vegetation_cover: number | null
          water_quality: number | null
        }
        Insert: {
          aqi?: number | null
          city_name: string
          country?: string | null
          created_at?: string | null
          data_source?: string | null
          humidity?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          recorded_at?: string | null
          temperature?: number | null
          urban_growth?: number | null
          vegetation_cover?: number | null
          water_quality?: number | null
        }
        Update: {
          aqi?: number | null
          city_name?: string
          country?: string | null
          created_at?: string | null
          data_source?: string | null
          humidity?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          recorded_at?: string | null
          temperature?: number | null
          urban_growth?: number | null
          vegetation_cover?: number | null
          water_quality?: number | null
        }
        Relationships: []
      }
      climate_simulations: {
        Row: {
          city: string
          created_at: string | null
          id: string
          interventions: Json | null
          is_public: boolean | null
          name: string
          results: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          city: string
          created_at?: string | null
          id?: string
          interventions?: Json | null
          is_public?: boolean | null
          name: string
          results?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string
          created_at?: string | null
          id?: string
          interventions?: Json | null
          is_public?: boolean | null
          name?: string
          results?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "climate_simulations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_groups: {
        Row: {
          admin_id: string | null
          avatar_url: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          member_count: number | null
          name: string
        }
        Insert: {
          admin_id?: string | null
          avatar_url?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          member_count?: number | null
          name: string
        }
        Update: {
          admin_id?: string | null
          avatar_url?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          member_count?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_groups_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_missions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          title: string
          xp_reward: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          xp_reward?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      eco_action_comments: {
        Row: {
          content: string
          created_at: string | null
          eco_action_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          eco_action_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          eco_action_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eco_action_comments_eco_action_id_fkey"
            columns: ["eco_action_id"]
            isOneToOne: false
            referencedRelation: "eco_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eco_action_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      eco_action_likes: {
        Row: {
          created_at: string | null
          eco_action_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          eco_action_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          eco_action_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eco_action_likes_eco_action_id_fkey"
            columns: ["eco_action_id"]
            isOneToOne: false
            referencedRelation: "eco_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eco_action_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      eco_actions: {
        Row: {
          action_type: string
          comments_count: number | null
          created_at: string | null
          description: string | null
          eco_coins_reward: number | null
          id: string
          image_url: string | null
          likes_count: number | null
          location: string | null
          title: string
          user_id: string | null
          verification_status: string | null
          verified_at: string | null
          xp_reward: number | null
        }
        Insert: {
          action_type: string
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          eco_coins_reward?: number | null
          id?: string
          image_url?: string | null
          likes_count?: number | null
          location?: string | null
          title: string
          user_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
          xp_reward?: number | null
        }
        Update: {
          action_type?: string
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          eco_coins_reward?: number | null
          id?: string
          image_url?: string | null
          likes_count?: number | null
          location?: string | null
          title?: string
          user_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "eco_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_feedback: {
        Row: {
          game_id: string | null
          id: string
          rating: number | null
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          game_id?: string | null
          id?: string
          rating?: number | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          game_id?: string | null
          id?: string
          rating?: number | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          game_id: string | null
          id: string
          started_at: string | null
          user_id: string | null
          xp_earned: number | null
        }
        Insert: {
          game_id?: string | null
          id?: string
          started_at?: string | null
          user_id?: string | null
          xp_earned?: number | null
        }
        Update: {
          game_id?: string | null
          id?: string
          started_at?: string | null
          user_id?: string | null
          xp_earned?: number | null
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          created_at: string | null
          id: string
          job_id: string | null
          message: string | null
          proposed_rate: number | null
          status: string | null
          worker_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          message?: string | null
          proposed_rate?: number | null
          status?: string | null
          worker_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          message?: string | null
          proposed_rate?: number | null
          status?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          category: string
          client_id: string | null
          created_at: string | null
          deadline: string | null
          description: string
          id: string
          is_featured: boolean | null
          is_urgent: boolean | null
          location: string
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at: string | null
          worker_id: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          category: string
          client_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description: string
          id?: string
          is_featured?: boolean | null
          is_urgent?: boolean | null
          location: string
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at?: string | null
          worker_id?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          category?: string
          client_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string
          id?: string
          is_featured?: boolean | null
          is_urgent?: boolean | null
          location?: string
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
          updated_at?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboards: {
        Row: {
          created_at: string | null
          id: string
          leaderboard_type: string
          period: string | null
          position: number
          reference_id: string | null
          score: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          leaderboard_type: string
          period?: string | null
          position: number
          reference_id?: string | null
          score: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          leaderboard_type?: string
          period?: string | null
          position?: number
          reference_id?: string | null
          score?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_items: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          eco_coins_cost: number
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          stock_quantity: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          eco_coins_cost: number
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          stock_quantity?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          eco_coins_cost?: number
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          stock_quantity?: number | null
        }
        Relationships: []
      }
      marketplace_purchases: {
        Row: {
          created_at: string | null
          eco_coins_spent: number
          id: string
          item_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          eco_coins_spent: number
          id?: string
          item_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          eco_coins_spent?: number
          id?: string
          item_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_purchases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_stats: {
        Row: {
          co2_offset: number | null
          id: string
          trees_planted: number | null
          updated_at: string | null
          water_saved: number | null
        }
        Insert: {
          co2_offset?: number | null
          id?: string
          trees_planted?: number | null
          updated_at?: string | null
          water_saved?: number | null
        }
        Update: {
          co2_offset?: number | null
          id?: string
          trees_planted?: number | null
          updated_at?: string | null
          water_saved?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          current_streak: number | null
          eco_coins: number | null
          eco_points: number | null
          experience_years: number | null
          full_name: string | null
          hourly_rate: number | null
          id: string
          is_admin: boolean | null
          last_login: string | null
          level: number | null
          location: string | null
          phone_number: string | null
          rating: number | null
          resilience_score: number | null
          role: string | null
          skills: string[] | null
          streak_days: number | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          total_jobs: number | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"] | null
          username: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          current_streak?: number | null
          eco_coins?: number | null
          eco_points?: number | null
          experience_years?: number | null
          full_name?: string | null
          hourly_rate?: number | null
          id: string
          is_admin?: boolean | null
          last_login?: string | null
          level?: number | null
          location?: string | null
          phone_number?: string | null
          rating?: number | null
          resilience_score?: number | null
          role?: string | null
          skills?: string[] | null
          streak_days?: number | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          total_jobs?: number | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
          username?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          current_streak?: number | null
          eco_coins?: number | null
          eco_points?: number | null
          experience_years?: number | null
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          is_admin?: boolean | null
          last_login?: string | null
          level?: number | null
          location?: string | null
          phone_number?: string | null
          rating?: number | null
          resilience_score?: number | null
          role?: string | null
          skills?: string[] | null
          streak_days?: number | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          total_jobs?: number | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
          username?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          xp?: number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          job_id: string | null
          rating: number | null
          reviewee_id: string | null
          reviewer_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          rating?: number | null
          reviewee_id?: string | null
          reviewer_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          rating?: number | null
          reviewee_id?: string | null
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          start_date: string | null
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          start_date?: string | null
          stripe_subscription_id?: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          start_date?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          accepted_tc: boolean
          consent: boolean
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          q1: string
          q2: string
          q3: string
          q4: string
          q5: string
          q6: string
          q7: string
          updated_at: string
        }
        Insert: {
          accepted_tc?: boolean
          consent?: boolean
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone: string
          q1: string
          q2: string
          q3: string
          q4: string
          q5: string
          q6: string
          q7: string
          updated_at?: string
        }
        Update: {
          accepted_tc?: boolean
          consent?: boolean
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          q1?: string
          q2?: string
          q3?: string
          q4?: string
          q5?: string
          q6?: string
          q7?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string | null
          badge_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          awarded_at?: string | null
          badge_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          awarded_at?: string | null
          badge_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          challenge_id: string | null
          completed: boolean | null
          completed_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_daily_missions: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: string
          mission_id: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          mission_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          mission_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_daily_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "daily_missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_daily_missions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          eco_coins_earned: number | null
          id: string
          session_type: string
          user_id: string | null
          xp_earned: number | null
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          eco_coins_earned?: number | null
          id?: string
          session_type: string
          user_id?: string | null
          xp_earned?: number | null
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          eco_coins_earned?: number | null
          id?: string
          session_type?: string
          user_id?: string | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_user_points: {
        Args: {
          eco_coins?: number
          reason?: string
          target_user_id: string
          xp_points?: number
        }
        Returns: boolean
      }
      create_notification: {
        Args: {
          notification_data?: Json
          notification_message: string
          notification_title: string
          notification_type: string
          target_user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      job_status:
        | "open"
        | "assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
      subscription_tier: "free" | "basic" | "premium"
      user_type: "worker" | "client" | "admin"
      verification_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      job_status: ["open", "assigned", "in_progress", "completed", "cancelled"],
      subscription_tier: ["free", "basic", "premium"],
      user_type: ["worker", "client", "admin"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
