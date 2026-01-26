---
title: Gusto Brewing Co
type: client
---

# Gusto Brewing Co

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Gusto Brewing Co"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Gusto Brewing Co"
GROUP BY contentType
SORT length(rows) DESC
```