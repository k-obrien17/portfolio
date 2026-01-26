---
title: Bloomberg
type: client
---

# Bloomberg

**Total pieces:** 2

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Bloomberg"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Bloomberg"
GROUP BY contentType
SORT length(rows) DESC
```