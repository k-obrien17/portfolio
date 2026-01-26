---
title: Rasa
type: client
---

# Rasa

**Total pieces:** 8

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Rasa"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Rasa"
GROUP BY contentType
SORT length(rows) DESC
```