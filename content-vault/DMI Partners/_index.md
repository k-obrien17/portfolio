---
title: DMI Partners
type: client
---

# DMI Partners

**Total pieces:** 2

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "DMI Partners"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "DMI Partners"
GROUP BY contentType
SORT length(rows) DESC
```