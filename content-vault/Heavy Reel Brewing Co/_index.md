---
title: Heavy Reel Brewing Co
type: client
---

# Heavy Reel Brewing Co

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Heavy Reel Brewing Co"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Heavy Reel Brewing Co"
GROUP BY contentType
SORT length(rows) DESC
```