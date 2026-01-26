---
title: Infinity Loop
type: client
---

# Infinity Loop

**Total pieces:** 9

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Infinity Loop"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Infinity Loop"
GROUP BY contentType
SORT length(rows) DESC
```