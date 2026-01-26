---
title: Ball Corporation
type: client
---

# Ball Corporation

**Total pieces:** 2

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Ball Corporation"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Ball Corporation"
GROUP BY contentType
SORT length(rows) DESC
```