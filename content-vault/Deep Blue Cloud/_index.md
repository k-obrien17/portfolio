---
title: Deep Blue Cloud
type: client
---

# Deep Blue Cloud

**Total pieces:** 2

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Deep Blue Cloud"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Deep Blue Cloud"
GROUP BY contentType
SORT length(rows) DESC
```