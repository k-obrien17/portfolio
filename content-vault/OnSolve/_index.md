---
title: OnSolve
type: client
---

# OnSolve

**Total pieces:** 3

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "OnSolve"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "OnSolve"
GROUP BY contentType
SORT length(rows) DESC
```