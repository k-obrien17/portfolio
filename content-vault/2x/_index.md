---
title: 2x
type: client
---

# 2x

**Total pieces:** 4

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "2x"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "2x"
GROUP BY contentType
SORT length(rows) DESC
```