---
title: " You.com #client"
type: client
---

#  You.com #client

**Total pieces:** 6

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM " You.com #client"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM " You.com #client"
GROUP BY contentType
SORT length(rows) DESC
```