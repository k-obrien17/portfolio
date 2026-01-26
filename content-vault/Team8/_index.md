---
title: Team8
type: client
---

# Team8

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Team8"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Team8"
GROUP BY contentType
SORT length(rows) DESC
```