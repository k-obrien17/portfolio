---
title: Carmel Solutions
type: client
---

# Carmel Solutions

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Carmel Solutions"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Carmel Solutions"
GROUP BY contentType
SORT length(rows) DESC
```