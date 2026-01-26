---
title: Catch + Release
type: client
---

# Catch + Release

**Total pieces:** 2

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Catch + Release"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Catch + Release"
GROUP BY contentType
SORT length(rows) DESC
```