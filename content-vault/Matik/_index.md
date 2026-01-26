---
title: Matik
type: client
---

# Matik

**Total pieces:** 4

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Matik"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Matik"
GROUP BY contentType
SORT length(rows) DESC
```