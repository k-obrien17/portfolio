---
title: Google DeepMind
type: client
---

# Google DeepMind

**Total pieces:** 13

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Google DeepMind"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Google DeepMind"
GROUP BY contentType
SORT length(rows) DESC
```