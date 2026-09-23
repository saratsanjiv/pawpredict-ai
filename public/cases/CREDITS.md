# Case photo credits

Real photos were sourced from Wikimedia Commons only, under CC0/CC-BY/CC-BY-SA licenses.
Unsplash and Pexels were checked first for every case but had no matching clinical images —
their stock libraries favor groomed, aesthetic pet photography, not visible skin/coat conditions.
Each file below was resized to max 1200px wide and re-encoded as JPEG; original EXIF/GPS data
was stripped in the process.

## Replaced with real photos

| File | Case | Source | Author | License |
|---|---|---|---|---|
| `pp-1001.jpg` | Bella — ventral abdomen allergic dermatitis | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Allergie_und_Malassezien_(Schenkel,_Bauch)_Juli_2012.jpg) | Maja Dumat | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| `pp-1002.jpg` | Max — hot spot (pyotraumatic dermatitis), Golden Retriever | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:HotSpot_dog.jpg) | Kalumet | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `pp-1004.jpg` | Rocky — solitary raised skin nodule | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Canine_histiocytoma.jpg) | Caroldermoid | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |

Notes on fit:
- **pp-1001**: the photographed dog isn't a Labrador, but the case photo is a close crop of
  ventral-abdomen skin, not the whole dog, so coat/breed mismatch doesn't affect what the image
  actually shows.
- **pp-1002**: real match on both breed (Golden Retriever) and condition (hot spot); the lesion
  in the photo sits on the chest/lower neck rather than specifically the cheek, which is the one
  inexact detail against the case's stated photo region ("Left cheek, below the ear").
- **pp-1004**: the file's own Commons title says "histiocytoma," not the mast cell tumor Rocky's
  case suspects — but the photo simply shows what an owner's phone photo of *any* solitary raised
  dermal nodule looks like, which is what the case calls for. The filename/diagnosis label was
  not given to the model; it only sees the image and the case's own region text ("Right lateral
  thorax"). Resolution is native 337×311, lower than the others.

## Still using placeholder images

No suitable free-license photo turned up on Unsplash, Pexels, or Wikimedia Commons for these
four, despite an extensive search (including German- and French-language Commons queries, since
much of Commons' veterinary dermatology material is credited from non-English-speaking vets).
Rather than force a mismatched photo, these keep the generated `PAWPREDICT_PLACEHOLDER`-tagged
JPGs, which the app treats as "no photo available" so the AI doesn't try to analyze them.

| File | Case | What's needed | Why it's hard to find | Suggested next step |
|---|---|---|---|---|
| `pp-1003.jpg` | Luna — round bald, scaly patches, **face and left pinna**, cat ringworm | A cat's face/ear showing circular alopecic scaly patches | Commons has feline dermatophytosis images, but they're culture plates or full-body/torso shots — nothing framed on a cat's face | A paid veterinary image library (e.g. VIN, DVM360 image bank) or a real de-identified clinic photo, used with permission |
| `pp-1005.jpg` | Milo — greasy, matted, unkempt dorsal coat from systemic illness | A cat with visibly neglected/matted fur, not just "fluffy" | Not a disease category on Commons; stock sites (Unsplash/Pexels) return only groomed, aesthetic cats | Search "senior cat poor grooming" on a rights-cleared pet photography marketplace, or a shelter/rescue's own release photo |
| `pp-1006.jpg` | Daisy — red, damp, smelly facial folds, French Bulldog | A close-up of an inflamed, moist nasal fold | Commons has plenty of healthy French Bulldog portraits but no fold-dermatitis close-ups | Same as above — a veterinary dermatology image source, not general pet photography |
| `pp-1008.jpg` | Charlie — patchy hair loss around eyes/muzzle, young Beagle, suspected demodicosis | A young dog's face with periocular/muzzle thinning fur | Commons' mange/demodicosis photos are mostly wild canids (foxes, wolves) or unrelated breeds | Search a veterinary teaching-hospital image archive for "juvenile localized demodicosis" |

`pp-1007` (Oliver) intentionally has no photo — the case itself specifies none was submitted.
