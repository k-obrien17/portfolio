---
title: Ubiquity
type: client
---

# Ubiquity

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Ubiquity"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Ubiquity"
GROUP BY contentType
SORT length(rows) DESC
```