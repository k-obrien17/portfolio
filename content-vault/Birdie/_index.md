---
title: Birdie
type: client
---

# Birdie

**Total pieces:** 3

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Birdie"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Birdie"
GROUP BY contentType
SORT length(rows) DESC
```