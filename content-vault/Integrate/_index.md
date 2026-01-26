---
title: Integrate
type: client
---

# Integrate

**Total pieces:** 7

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Integrate"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Integrate"
GROUP BY contentType
SORT length(rows) DESC
```