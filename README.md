# pet-vital-signs

**Vet-reviewed normal physiological parameters for companion animals** —
temperature, heart rate, respiratory rate, capillary refill time by species,
size group and life stage, with red-flag thresholds ("this reading means go
to the clinic"). Plus a second table: pet-to-human age conversion, healthy
weight ranges and the 9-point Body Condition Score scale.

> **Status: 1.0.0 — vet-reviewed.** Exotic species (rabbit, guinea
> pig, chinchilla, Syrian and dwarf hamsters, rat, ferret, budgerigar,
> cockatiel, Horsfield's tortoise, red-eared slider) follow the reference
> table signed by the chief veterinarian of the BioVet clinic network
> (Moscow, 24/7) on **2026-09-20**; dog and cat rows, healthy weights,
> age conversion and the BCS scale were signed off by BioVet
> veterinarians on **2026-11-24**. Every row carries
> `"evidence": "clinic-reviewed"`. Where the vets give only an upper
> limit (adult cat resting respiratory rate: up to 30), `normal_min` is `null`.

Normal vital signs for pets exist only as PDFs and posters. Every pet app
that wants to answer "is my dog's heart rate normal?" hardcodes its own
table. This repo gives developers one validated, bilingual (en/ru) JSON.

## Data

- [`data/vital-signs.json`](data/vital-signs.json) — 13 species
  (dogs by size group, cats, rabbit, ferret, guinea pig, Syrian and dwarf
  hamsters, rat, chinchilla, budgerigar-size and cockatiel-size and large
  parrots, Horsfield's tortoise, red-eared slider), each parameter with a
  normal range, measurement notes, a red-flag threshold and an `evidence`
  level (`clinic-reviewed` / `reference`). Reptile temperature rows are the
  preferred optimal temperature zone of the enclosure (`potz_c`), not body
  temperature.
- [`data/age-weight.json`](data/age-weight.json) — pet age → human age
  (AAHA-style, dog size groups matter), healthy weight ranges by
  species/size, and the 9-point BCS scale with descriptions.

Bilingual (en/ru). See `scripts/validate.mjs` for the enforced shape.

## License

Data: CC BY 4.0 — free to use with attribution
("Data: BioVet veterinary clinic network, bio.vet"). Code: MIT.

## Disclaimer

Reference ranges for healthy resting animals, for educational use. A single
reading outside the range is not a diagnosis — stress, activity and
individual variation matter. When in doubt, call a veterinarian.

## Live use

These numbers power the pet-owner tools at [bio.vet](https://bio.vet)
(symptom triage, first-visit guide). Related datasets:
[pet-food-safety](https://github.com/Bio-Vet/pet-food-safety).
