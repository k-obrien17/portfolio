---
title: GoodTime.io
type: client
---

# GoodTime.io

**Total pieces:** 10

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "GoodTime.io"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "GoodTime.io"
GROUP BY contentType
SORT length(rows) DESC
```