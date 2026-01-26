---
title: Ciberspring
type: client
---

# Ciberspring

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Ciberspring"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Ciberspring"
GROUP BY contentType
SORT length(rows) DESC
```