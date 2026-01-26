---
title: UIPath
type: client
---

# UIPath

**Total pieces:** 2

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "UIPath"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "UIPath"
GROUP BY contentType
SORT length(rows) DESC
```