---
title: Sodexo
type: client
---

# Sodexo

**Total pieces:** 26

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Sodexo"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Sodexo"
GROUP BY contentType
SORT length(rows) DESC
```