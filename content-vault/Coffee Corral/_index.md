---
title: Coffee Corral
type: client
---

# Coffee Corral

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Coffee Corral"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Coffee Corral"
GROUP BY contentType
SORT length(rows) DESC
```