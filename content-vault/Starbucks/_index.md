---
title: Starbucks
type: client
---

# Starbucks

**Total pieces:** 3

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Starbucks"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Starbucks"
GROUP BY contentType
SORT length(rows) DESC
```