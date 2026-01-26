---
title: TVDataNow
type: client
---

# TVDataNow

**Total pieces:** 4

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "TVDataNow"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "TVDataNow"
GROUP BY contentType
SORT length(rows) DESC
```