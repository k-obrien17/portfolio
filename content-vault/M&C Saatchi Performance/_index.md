---
title: M&C Saatchi Performance
type: client
---

# M&C Saatchi Performance

**Total pieces:** 7

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "M&C Saatchi Performance"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "M&C Saatchi Performance"
GROUP BY contentType
SORT length(rows) DESC
```