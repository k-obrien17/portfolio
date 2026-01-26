---
title: McKinsey
type: client
---

# McKinsey

**Total pieces:** 44

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "McKinsey"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "McKinsey"
GROUP BY contentType
SORT length(rows) DESC
```