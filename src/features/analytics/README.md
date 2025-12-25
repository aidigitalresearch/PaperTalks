# Analytics Feature

## Overview
Track video engagement and calculate Teaching Credit Scores.

## Key Metrics

### Video Metrics
- View count
- Watch time
- Completion rate
- Retention curve
- Share count
- Citation count

### Teaching Credit Score Factors
1. **Clarity & Structure** (25%)
   - Video length optimization
   - Chapter usage
   - Pacing analysis

2. **Engagement** (30%)
   - Completion rate
   - Retention curve
   - Return viewers

3. **Peer Feedback** (25%)
   - Ratings from verified researchers
   - Comments and discussions

4. **Accessibility** (20%)
   - Captions availability
   - Visual aid usage
   - Audio quality

## Data Pipeline

1. Collect events from video player
2. Store in analytics table
3. Aggregate daily/weekly/monthly
4. Calculate Teaching Credit Score
5. Update researcher badges

## Folder Structure (To Implement)

```
src/features/analytics/
├── components/
│   ├── AnalyticsDashboard.tsx
│   ├── ViewsChart.tsx
│   ├── RetentionChart.tsx
│   ├── ScoreBreakdown.tsx
│   └── BadgesList.tsx
├── hooks/
│   ├── useVideoAnalytics.ts
│   ├── useTeachingScore.ts
│   └── useAggregatedStats.ts
├── actions/
│   ├── trackEvent.ts
│   ├── calculateScore.ts
│   └── awardBadge.ts
└── lib/
    ├── analytics-client.ts
    ├── score-calculator.ts
    └── aggregation-utils.ts
```

## Privacy Considerations

- Aggregate data, not individual tracking
- Anonymous viewer analytics
- GDPR-compliant data handling
- Clear opt-out mechanisms

## TODO

- [ ] Design analytics event schema
- [ ] Build event tracking client
- [ ] Create aggregation jobs
- [ ] Implement scoring algorithm
- [ ] Build analytics dashboard
- [ ] Add export functionality for institutions

