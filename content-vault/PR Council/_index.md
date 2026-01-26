---
title: PR Council
type: client
---

# PR Council

**Total pieces:** 2

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "PR Council"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "PR Council"
GROUP BY contentType
SORT length(rows) DESC
```