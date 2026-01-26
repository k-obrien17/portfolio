---
title: Cratoflow
type: client
---

# Cratoflow

**Total pieces:** 3

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Cratoflow"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Cratoflow"
GROUP BY contentType
SORT length(rows) DESC
```