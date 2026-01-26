---
title: IBM
type: client
---

# IBM

**Total pieces:** 75

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "IBM"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "IBM"
GROUP BY contentType
SORT length(rows) DESC
```