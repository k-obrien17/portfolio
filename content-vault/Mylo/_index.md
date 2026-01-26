---
title: Mylo
type: client
---

# Mylo

**Total pieces:** 5

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Mylo"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Mylo"
GROUP BY contentType
SORT length(rows) DESC
```