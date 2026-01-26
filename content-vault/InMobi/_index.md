---
title: InMobi
type: client
---

# InMobi

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "InMobi"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "InMobi"
GROUP BY contentType
SORT length(rows) DESC
```