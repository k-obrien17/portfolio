---
title: Lemma
type: client
---

# Lemma

**Total pieces:** 3

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Lemma"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Lemma"
GROUP BY contentType
SORT length(rows) DESC
```