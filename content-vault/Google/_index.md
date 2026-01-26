---
title: Google
type: client
---

# Google

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Google"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Google"
GROUP BY contentType
SORT length(rows) DESC
```