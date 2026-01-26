---
title: Blameless
type: client
---

# Blameless

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Blameless"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Blameless"
GROUP BY contentType
SORT length(rows) DESC
```