# Authentication Feature

## Overview
Handles user authentication for PaperTalks using Supabase Auth.

## Planned Integrations

### Supabase Auth
- Email/password authentication
- Magic link (passwordless)
- OAuth providers (ORCID, Google, GitHub)

### ORCID Integration
- OAuth 2.0 flow for researcher verification
- Import publications from ORCID profile
- Display ORCID badge on profiles

## Folder Structure (To Implement)

```
src/features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   ├── OrcidButton.tsx
│   └── AuthProvider.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useSession.ts
│   └── useOrcid.ts
├── actions/
│   ├── login.ts
│   ├── signup.ts
│   ├── logout.ts
│   └── orcid-callback.ts
└── lib/
    └── orcid-client.ts
```

## TODO

- [ ] Set up Supabase Auth
- [ ] Create auth UI components
- [ ] Implement ORCID OAuth flow
- [ ] Add session management
- [ ] Create protected route middleware
- [ ] Add email verification flow

