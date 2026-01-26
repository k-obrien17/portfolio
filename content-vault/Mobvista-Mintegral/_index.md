---
title: Mobvista/Mintegral
type: client
---

# Mobvista/Mintegral

**Total pieces:** 14

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Mobvista/Mintegral"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Mobvista/Mintegral"
GROUP BY contentType
SORT length(rows) DESC
```