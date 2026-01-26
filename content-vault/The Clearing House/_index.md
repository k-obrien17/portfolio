---
title: The Clearing House
type: client
---

# The Clearing House

**Total pieces:** 2

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "The Clearing House"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "The Clearing House"
GROUP BY contentType
SORT length(rows) DESC
```