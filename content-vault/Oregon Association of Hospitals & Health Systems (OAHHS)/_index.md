---
title: Oregon Association of Hospitals & Health Systems (OAHHS)
type: client
---

# Oregon Association of Hospitals & Health Systems (OAHHS)

**Total pieces:** 6

## Content

```dataview
TABLE contentType as Type, datePublished as Published, publication as Publication
FROM "Oregon Association of Hospitals & Health Systems (OAHHS)"
SORT datePublished DESC
```

## By Type

```dataview
TABLE length(rows) as Count
FROM "Oregon Association of Hospitals & Health Systems (OAHHS)"
GROUP BY contentType
SORT length(rows) DESC
```