---
title: UBS
type: client
---

# UBS

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "UBS"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "UBS"
GROUP BY contentType
SORT length(rows) DESC
```