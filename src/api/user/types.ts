export interface CreateUserResponse {
  id: number;
  supabase_user_id: string;
  created_at: string;
}

export interface CreateUserVariables {
  supabase_user_id: string;
}

export interface RecentScan {
  id: number;
  name: string;
  image: string;
  description: string;
  postedOn: string[];
  date: string;
}
