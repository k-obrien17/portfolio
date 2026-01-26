---
title: Andiamo
type: client
---

# Andiamo

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Andiamo"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Andiamo"
GROUP BY contentType
SORT length(rows) DESC
```