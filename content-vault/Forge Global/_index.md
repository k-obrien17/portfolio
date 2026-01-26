---
title: Forge Global
type: client
---

# Forge Global

**Total pieces:** 7

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Forge Global"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Forge Global"
GROUP BY contentType
SORT length(rows) DESC
```