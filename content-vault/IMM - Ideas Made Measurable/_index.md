---
title: IMM - Ideas Made Measurable
type: client
---

# IMM - Ideas Made Measurable

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "IMM - Ideas Made Measurable"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "IMM - Ideas Made Measurable"
GROUP BY contentType
SORT length(rows) DESC
```