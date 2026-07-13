
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_email_confirmed() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_new_comment() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_new_like() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_new_project() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_new_ad() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_new_gallery() FROM anon, authenticated;
