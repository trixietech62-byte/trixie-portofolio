export function getSupabaseAuthErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return `Unable to sign in with Supabase. ${error.message}`;
  }

  return "Unable to sign in with Supabase. Please verify your credentials and try again.";
}
