Lovable Cloud is now enabled. Because this request is very large, I'll ship it in 4 phases so each piece is reviewable and working before the next. Nothing on the public site's look, layout, or navigation changes — the current pages keep their design and just start reading from the new backend where relevant.

## Phase 1 — Foundation (auth + schema + admin shell migration)
- Real auth (email/password + Google), replace hardcoded TRIXIE/5210.
- `profiles` table + `user_roles` table with `has_role()` security-definer function; only your account gets the `admin` role (auto-granted for your email on first sign-in).
- Protected `/admin/*` routes: unauthenticated → login; authenticated non-admin → "access denied".
- Backend tables (all with RLS + GRANTs, public read where appropriate, admin-only writes):
  - `advertisements` (image or video, title, description, button text/link, enabled, sort_order)
  - `projects` (title, description, tech[], thumbnail, screenshots[], demo_video, github_url, live_url, featured)
  - `posts` (title, content, excerpt, tags[], featured_image, video, status: draft/published)
  - `gallery_items` (media_url, media_type, caption, description, album)
  - `likes` (polymorphic: target_type + target_id + user_id) — shared across posts/projects
  - `comments` (polymorphic + status: pending/approved/hidden, parent_id for replies)
  - `notifications` (admin-scoped feed)
- `media` storage bucket (public read, admin write) for all uploads.
- Data migration: seed current default projects/posts into DB on first admin login.

## Phase 2 — Public site wiring + new Admin Dashboard home
- Home, Projects, Blog, Gallery pages read from DB instead of localStorage (design unchanged).
- Likes and comments become real, persisted, and visible across all visitors. Signed-in users can like/comment; anonymous visitors can still comment with name (moderated).
- New Admin Dashboard landing: totals for ads / posts / projects / gallery / likes / comments / emails, plus recent activity lists.
- Advertisements admin CRUD + Home page renders the enabled ads in sort order automatically.
- Notifications bell in admin header (new email, new comment, new like, new post/project/ad/gallery item).

## Phase 3 — Full CRUD admins
- Posts admin: create/edit/delete, drafts, publish/unpublish, featured image + video upload, search + filter.
- Projects admin: multi-screenshot upload, demo video, featured toggle, GitHub + live links, search.
- Gallery admin: upload images/videos, edit captions/descriptions, albums, delete with confirm.
- Comments moderation: approve / hide / delete / reply, per-target and global view.
- Global confirm-dialogs before every destructive action; toast notifications for success/error; zod input validation on every form.

## Phase 4 — Gmail inbox
- Connect Gmail via the Lovable Google Mail connector (OAuth to your Gmail account).
- Edge functions: `gmail-list`, `gmail-get`, `gmail-modify` (read/unread/star/archive/trash), `gmail-send` (reply, forward, new), `gmail-drafts`.
- Admin Inbox UI: list with unread/starred filters + search, message reader, reply / forward / new, drafts, sent, archived, trash, refresh, unread count on dashboard.
- Realtime-ish refresh (poll every 60s) — full IMAP push isn't available through the connector.

## Technical notes
- Stack unchanged: Vite + React + Tailwind + Framer Motion + Three.js.
- Backend: Lovable Cloud (Postgres + auth + storage + edge functions).
- Roles: `app_role` enum + `user_roles` + `has_role()` — never store role on `profiles` (prevents privilege escalation).
- Likes/comments: polymorphic tables so one implementation covers projects, posts, and (later) gallery.
- Gmail: connector-gateway calls proxied through edge functions so the OAuth token never touches the browser.
- All existing pages keep their current markup and styling; only their data source changes.

## Out of scope (explicit)
- No visual redesign of any existing page.
- No change to the 3D hero, page transitions, or navbar.
- No third-party email service (Resend/SendGrid) — Gmail connector only, per your choice.

Shall I proceed with Phase 1?