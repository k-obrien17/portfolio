---
title: T-Mobile
type: client
---

# T-Mobile

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "T-Mobile"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "T-Mobile"
GROUP BY contentType
SORT length(rows) DESC
```