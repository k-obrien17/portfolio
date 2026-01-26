---
title: Uber for Business
type: client
---

# Uber for Business

**Total pieces:** 2

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Uber for Business"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Uber for Business"
GROUP BY contentType
SORT length(rows) DESC
```