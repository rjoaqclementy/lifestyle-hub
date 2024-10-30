export interface HubProfile {
    id: string;
    user_id: string;
    hub_id: string;
    bio: string | null;
    profile_picture_url: string | null;
    stats: Record<string, any>;
    created_at: string;
    updated_at: string;
  }
  
  export interface SportsProfile {
    id: string;
    hub_profile_id: string;
    sport_type: 'soccer' | 'basketball' | 'volleyball' | 'tennis';
    skill_level: string | null;
    years_experience: string | null;
    player_stats: Record<string, any>;
    sport_specific_data: Record<string, any>;
    preferences: Record<string, any>;
    created_at: string;
    updated_at: string;
  }
  
  export interface CompleteProfile extends HubProfile {
    sports: SportsProfile | null;
  }