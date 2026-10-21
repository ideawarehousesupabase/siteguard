<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Firestore (`users` collection) is used only for sign up, sign in, and profile read/update; no Firebase Auth — the product brief explicitly forbids it.
- Firebase config is served from a server function reading project secrets (GOOGLE_API_KEY, GOOGLE_ANALYTICS_MEASUREMENT_ID) because secrets are not exposed as VITE_ vars; firebase is dynamically imported client-side only.
- All operational data (sites, workers, docs, gate activity, visitors, incidents, briefings) lives in src/data/mock.ts and session state in src/lib/store.tsx — brief requires frontend-only mock data.
- Session = `siteguard_current_user` in localStorage; `_app` layout (ssr: false) guards protected pages.
- No admin features or Year-2 scope anywhere.
