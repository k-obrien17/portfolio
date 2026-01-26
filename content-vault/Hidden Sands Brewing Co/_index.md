---
title: Hidden Sands Brewing Co
type: client
---

# Hidden Sands Brewing Co

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Hidden Sands Brewing Co"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Hidden Sands Brewing Co"
GROUP BY contentType
SORT length(rows) DESC
```