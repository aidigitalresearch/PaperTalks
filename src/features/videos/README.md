# Videos Feature

## Overview
Video explainer recording, upload, and playback.

## Key Features

- In-browser video recording
- Video upload to cloud storage
- Video processing and transcoding
- Thumbnail generation
- VRI (Video Research Identifier) generation
- Captions and accessibility

## External Integrations

### Video Hosting (Choose One)
1. **Mux** - Recommended for quality and features
   - Adaptive bitrate streaming
   - Auto-generated thumbnails
   - Analytics built-in

2. **Cloudflare Stream** - Cost-effective alternative
   - Global CDN delivery
   - Simple pricing
   - Good analytics

### Transcription
- Whisper API or AssemblyAI for auto-captions

## Folder Structure (To Implement)

```
src/features/videos/
├── components/
│   ├── VideoPlayer.tsx
│   ├── VideoRecorder.tsx
│   ├── VideoUploader.tsx
│   ├── VideoCard.tsx
│   ├── VideoGrid.tsx
│   └── VriBadge.tsx
├── hooks/
│   ├── useVideo.ts
│   ├── useVideoRecorder.ts
│   ├── useVideoUpload.ts
│   └── useVideoAnalytics.ts
├── actions/
│   ├── uploadVideo.ts
│   ├── processVideo.ts
│   ├── generateVri.ts
│   └── updateVideo.ts
└── lib/
    ├── mux-client.ts
    ├── vri-generator.ts
    └── video-utils.ts
```

## Routes (To Implement)

- `/video/[vri]` - Public video page (by VRI)
- `/dashboard/videos` - Manage videos
- `/dashboard/videos/record` - Record new video
- `/dashboard/videos/[id]/edit` - Edit video details

## VRI Format

Video Research Identifier format:
```
VRI:10.papertalks/{year}.{author_slug}.{sequence}
Example: VRI:10.papertalks/2024.chen.0042
```

## TODO

- [ ] Choose and integrate video hosting (Mux/Cloudflare)
- [ ] Build video recorder component
- [ ] Implement video upload flow
- [ ] Generate and validate VRIs
- [ ] Add caption support
- [ ] Create video player with analytics

