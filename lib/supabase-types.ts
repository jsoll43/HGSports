export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type MatchStatus = 'scheduled' | 'rescheduled' | 'pending_approval' | 'final' | 'rejected'
export type ScoreSubmissionStatus = 'pending' | 'approved' | 'rejected'

export type Database = {
  public: {
    Tables: {
      sports: {
        Row: { id: string; name: string; slug: string; created_at: string }
        Insert: { id?: string; name: string; slug: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['sports']['Insert']>
      }
      leagues: {
        Row: { id: string; sport_id: string; name: string; slug: string; description: string; created_at: string }
        Insert: { id?: string; sport_id: string; name: string; slug: string; description?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['leagues']['Insert']>
      }
      seasons: {
        Row: { id: string; league_id: string; name: string; year: number; is_active: boolean; starts_on: string | null; ends_on: string | null; archived_at: string | null; created_at: string }
        Insert: { id?: string; league_id: string; name: string; year: number; is_active?: boolean; starts_on?: string | null; ends_on?: string | null; archived_at?: string | null; created_at?: string }
        Update: Partial<Database['public']['Tables']['seasons']['Insert']>
      }
      flights: {
        Row: { id: string; season_id: string; name: string; sort_order: number; color_label: string; created_at: string }
        Insert: { id?: string; season_id: string; name: string; sort_order?: number; color_label?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['flights']['Insert']>
      }
      teams: {
        Row: { id: string; season_id: string; flight_id: string; team_number: number; team_name: string; created_at: string }
        Insert: { id?: string; season_id: string; flight_id: string; team_number: number; team_name: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['teams']['Insert']>
      }
      players: {
        Row: { id: string; season_id: string; team_id: string; first_name: string; last_name: string; display_name: string; phone: string; email: string | null; created_at: string }
        Insert: { id?: string; season_id: string; team_id: string; first_name: string; last_name: string; display_name: string; phone: string; email?: string | null; created_at?: string }
        Update: Partial<Database['public']['Tables']['players']['Insert']>
      }
      matches: {
        Row: {
          id: string; season_id: string; flight_id: string; week_number: number; scheduled_date: string; scheduled_time: string; team_a_id: string; team_b_id: string; status: MatchStatus;
          proposed_makeup_at: string | null; reschedule_note: string | null; rescheduled_by_player_id: string | null; rescheduled_at: string | null; actual_played_date: string | null; notes: string | null; created_at: string; updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['matches']['Row']> & Pick<Database['public']['Tables']['matches']['Row'], 'season_id' | 'flight_id' | 'week_number' | 'scheduled_date' | 'scheduled_time' | 'team_a_id' | 'team_b_id'>
        Update: Partial<Database['public']['Tables']['matches']['Row']>
      }
      score_submissions: {
        Row: {
          id: string; match_id: string; submitted_by_player_id: string; submitted_by_team_id: string; submitted_at: string; played_date: string;
          game1_team_a_score: number; game1_team_b_score: number; game2_team_a_score: number; game2_team_b_score: number;
          team_a_total_points: number; team_b_total_points: number; team_a_game_wins: number; team_b_game_wins: number; team_a_match_win: boolean; team_b_match_win: boolean;
          status: ScoreSubmissionStatus; notes: string | null; user_agent: string | null; ip_hash: string | null; approved_by_admin_name: string | null; approved_at: string | null; rejected_by_admin_name: string | null; rejected_at: string | null; admin_note: string | null; created_at: string; updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['score_submissions']['Row']> & Pick<Database['public']['Tables']['score_submissions']['Row'], 'match_id' | 'submitted_by_player_id' | 'submitted_by_team_id' | 'played_date' | 'game1_team_a_score' | 'game1_team_b_score' | 'game2_team_a_score' | 'game2_team_b_score' | 'team_a_total_points' | 'team_b_total_points' | 'team_a_game_wins' | 'team_b_game_wins' | 'team_a_match_win' | 'team_b_match_win'>
        Update: Partial<Database['public']['Tables']['score_submissions']['Row']>
      }
      approved_scores: {
        Row: Omit<Database['public']['Tables']['score_submissions']['Row'], 'submitted_by_player_id' | 'submitted_by_team_id' | 'submitted_at' | 'played_date' | 'status' | 'notes' | 'user_agent' | 'ip_hash' | 'approved_by_admin_name' | 'approved_at' | 'rejected_by_admin_name' | 'rejected_at' | 'admin_note'> & { score_submission_id: string; approved_at: string; approved_by_admin_name: string }
        Insert: Partial<Database['public']['Tables']['approved_scores']['Row']> & Pick<Database['public']['Tables']['approved_scores']['Row'], 'match_id' | 'score_submission_id' | 'approved_by_admin_name' | 'game1_team_a_score' | 'game1_team_b_score' | 'game2_team_a_score' | 'game2_team_b_score' | 'team_a_total_points' | 'team_b_total_points' | 'team_a_game_wins' | 'team_b_game_wins' | 'team_a_match_win' | 'team_b_match_win'>
        Update: Partial<Database['public']['Tables']['approved_scores']['Row']>
      }
      app_settings: { Row: { id: string; season_id: string | null; key: string; value: Json; updated_at: string }; Insert: { id?: string; season_id?: string | null; key: string; value: Json; updated_at?: string }; Update: Partial<Database['public']['Tables']['app_settings']['Insert']> }
      audit_log: { Row: { id: string; season_id: string; actor_type: string; actor_player_id: string | null; actor_admin_name: string | null; action: string; entity_type: string; entity_id: string; before_json: Json | null; after_json: Json | null; created_at: string }; Insert: Partial<Database['public']['Tables']['audit_log']['Row']> & Pick<Database['public']['Tables']['audit_log']['Row'], 'season_id' | 'actor_type' | 'action' | 'entity_type' | 'entity_id'>; Update: never }
      daily_snapshots: { Row: { id: string; season_id: string; snapshot_date: string; snapshot_json: Json; created_at: string }; Insert: { id?: string; season_id: string; snapshot_date: string; snapshot_json: Json; created_at?: string }; Update: Partial<Database['public']['Tables']['daily_snapshots']['Insert']> }
      trophy_room_entries: { Row: { id: string; league_id: string; season_name: string; year: number; flight_name: string; champion_team_name: string; champion_player_names: string; notes: string | null; created_at: string }; Insert: { id?: string; league_id: string; season_name: string; year: number; flight_name: string; champion_team_name: string; champion_player_names: string; notes?: string | null; created_at?: string }; Update: Partial<Database['public']['Tables']['trophy_room_entries']['Insert']> }
      season_archives: { Row: { id: string; season_id: string; archived_at: string; archive_summary_json: Json; created_at: string }; Insert: { id?: string; season_id: string; archived_at?: string; archive_summary_json: Json; created_at?: string }; Update: Partial<Database['public']['Tables']['season_archives']['Insert']> }
    }
  }
}
