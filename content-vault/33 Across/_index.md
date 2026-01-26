---
title: 33 Across
type: client
---

# 33 Across

**Total pieces:** 13

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "33 Across"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "33 Across"
GROUP BY contentType
SORT length(rows) DESC
```