---
title: Total Emphasis  
type: client
---

# Total Emphasis  

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Total Emphasis  "
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Total Emphasis  "
GROUP BY contentType
SORT length(rows) DESC
```