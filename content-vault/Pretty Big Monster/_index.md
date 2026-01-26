---
title: Pretty Big Monster
type: client
---

# Pretty Big Monster

**Total pieces:** 3

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Pretty Big Monster"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Pretty Big Monster"
GROUP BY contentType
SORT length(rows) DESC
```