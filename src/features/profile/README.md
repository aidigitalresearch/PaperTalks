# Profile Feature

## Overview
Researcher profiles - the core identity of PaperTalks users.

## Key Features

- Public researcher profiles
- Publication list
- Video explainer gallery
- Teaching Credit Score display
- ORCID verification badge
- Institution affiliation

## Folder Structure (To Implement)

```
src/features/profile/
├── components/
│   ├── ProfileHeader.tsx
│   ├── ProfileStats.tsx
│   ├── PublicationsList.tsx
│   ├── VideoGallery.tsx
│   ├── TeachingScoreBadge.tsx
│   └── EditProfileForm.tsx
├── hooks/
│   ├── useProfile.ts
│   ├── usePublications.ts
│   └── useVideos.ts
├── actions/
│   ├── updateProfile.ts
│   └── uploadAvatar.ts
└── lib/
    └── profile-utils.ts
```

## Routes (To Implement)

- `/researcher/[id]` - Public profile page
- `/dashboard/profile` - Edit own profile
- `/dashboard/profile/settings` - Account settings

## TODO

- [ ] Design profile page layout
- [ ] Create profile components
- [ ] Implement profile editing
- [ ] Add avatar upload (Supabase Storage)
- [ ] Connect to papers and videos
- [ ] Add social sharing for profiles

