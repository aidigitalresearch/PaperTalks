# Papers Feature

## Overview
Paper/publication management with DOI integration.

## Key Features

- Add papers via DOI lookup
- Manual paper entry
- Import from ORCID
- Link to video explainers
- Citation generation

## External Integrations

### DOI Resolution
- CrossRef API for DOI metadata
- DataCite API for datasets
- Semantic Scholar for additional data

### ORCID Import
- Fetch publications from ORCID profile
- Sync with researcher's ORCID works

## Folder Structure (To Implement)

```
src/features/papers/
├── components/
│   ├── PaperCard.tsx
│   ├── PapersList.tsx
│   ├── AddPaperForm.tsx
│   ├── DoiLookup.tsx
│   └── PaperDetails.tsx
├── hooks/
│   ├── usePapers.ts
│   ├── usePaper.ts
│   └── useDoiLookup.ts
├── actions/
│   ├── addPaper.ts
│   ├── updatePaper.ts
│   ├── deletePaper.ts
│   └── importFromOrcid.ts
└── lib/
    ├── doi-resolver.ts
    ├── crossref-client.ts
    └── citation-generator.ts
```

## Routes (To Implement)

- `/paper/[id]` - Public paper page with video
- `/dashboard/papers` - Manage papers
- `/dashboard/papers/add` - Add new paper

## TODO

- [ ] Implement DOI lookup API
- [ ] Create paper management UI
- [ ] Add ORCID import
- [ ] Generate citations (BibTeX, APA, etc.)
- [ ] Link papers to videos

