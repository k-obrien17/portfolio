---
title: GERTRUDE
type: client
---

# GERTRUDE

**Total pieces:** 2

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "GERTRUDE"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "GERTRUDE"
GROUP BY contentType
SORT length(rows) DESC
```