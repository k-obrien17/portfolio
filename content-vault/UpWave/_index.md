---
title: UpWave
type: client
---

# UpWave

**Total pieces:** 23

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "UpWave"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "UpWave"
GROUP BY contentType
SORT length(rows) DESC
```