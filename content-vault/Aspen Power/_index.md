---
title: Aspen Power
type: client
---

# Aspen Power

**Total pieces:** 2

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Aspen Power"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Aspen Power"
GROUP BY contentType
SORT length(rows) DESC
```