---
title: ReadySetRocket
type: client
---

# ReadySetRocket

**Total pieces:** 1

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "ReadySetRocket"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "ReadySetRocket"
GROUP BY contentType
SORT length(rows) DESC
```