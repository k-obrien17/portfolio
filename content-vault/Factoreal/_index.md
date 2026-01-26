---
title: Factoreal
type: client
---

# Factoreal

**Total pieces:** 5

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Factoreal"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Factoreal"
GROUP BY contentType
SORT length(rows) DESC
```