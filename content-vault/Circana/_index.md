---
title: Circana
type: client
---

# Circana

**Total pieces:** 7

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Circana"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Circana"
GROUP BY contentType
SORT length(rows) DESC
```