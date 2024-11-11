export interface CreateUserResponse {
  id: number;
  supabase_user_id: string;
  created_at: string;
}

export interface CreateUserVariables {
  supabase_user_id: string;
}
