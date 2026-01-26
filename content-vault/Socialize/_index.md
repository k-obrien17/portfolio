---
title: Socialize
type: client
---

# Socialize

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Socialize"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Socialize"
GROUP BY contentType
SORT length(rows) DESC
```