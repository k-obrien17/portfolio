---
title: Kyndryl
type: client
---

# Kyndryl

**Total pieces:** 2

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Kyndryl"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Kyndryl"
GROUP BY contentType
SORT length(rows) DESC
```