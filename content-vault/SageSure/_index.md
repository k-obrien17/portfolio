---
title: SageSure
type: client
---

# SageSure

**Total pieces:** 6

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "SageSure"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "SageSure"
GROUP BY contentType
SORT length(rows) DESC
```