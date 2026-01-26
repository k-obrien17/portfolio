---
title: NOVUS
type: client
---

# NOVUS

**Total pieces:** 13

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "NOVUS"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "NOVUS"
GROUP BY contentType
SORT length(rows) DESC
```