---
title: Data Zoo
type: client
---

# Data Zoo

**Total pieces:** 4

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Data Zoo"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Data Zoo"
GROUP BY contentType
SORT length(rows) DESC
```