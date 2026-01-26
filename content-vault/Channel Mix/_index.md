---
title: Channel Mix
type: client
---

# Channel Mix

**Total pieces:** 3

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Channel Mix"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Channel Mix"
GROUP BY contentType
SORT length(rows) DESC
```