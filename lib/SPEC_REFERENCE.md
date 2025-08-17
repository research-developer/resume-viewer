# Idea Graph — RDF Spec (Markdown for LLM Ingestion)

This specification represents Preston’s projects, skills, experiences, theories, musings, and media concepts as RDF‑like triples. It is optimized for ingestion by an AI‑powered IDE or LLM system.

---

## 1. Data Model

### Node Types

- `Person`
- `Idea`
- `Project`
- `Experiment`
- `Theory`
- `Musing`
- `Skill`
- `Experience`
- `Education`
- `Animal`
- `Media`
- `Website`
- `Tool`

### Predicates

- `authored` (Person → Idea/Project/Musing)
- `proposes` (Person → Theory/Experiment)
- `worked_on` (Person → Project)
- `built` (Person → Tool/Website)
- `holds_degree_in` (Person → Education)
- `learned_at_age` (Person → Skill)
- `role` (Person → Experience)
- `inspired_by` (Idea/Theory → Experience/Event)
- `about` (Idea/Theory → Topic)
- `relates_to` (Any → Any)
- `category` (Any → Tag)
- `tag` (Any → Tag)
- `status` (Project/Idea → planned | active | paused | archived)
- `evidence` (Theory → Source/Note)

---

## 2. Triples — Projects & Product Concepts

```json
[
  {"s": "person.preston", "p": "worked_on", "o": "project.digital_cannabis_vaporizer"},
  {"s": "project.digital_cannabis_vaporizer", "p": "summary", "o": "‘iPod Touch of vaporizers’ with microfluidic terpene/cannabinoid delivery, multi-zone heating, and precision control."},

  {"s": "person.preston", "p": "worked_on", "o": "project.language_tutor_translator"},
  {"s": "project.language_tutor_translator", "p": "summary", "o": "Real-time translation widget with contextual micro-lessons for expats and immersion learners."},

  {"s": "person.preston", "p": "worked_on", "o": "project.witness_platform"},
  {"s": "project.witness_platform", "p": "summary", "o": "Emotional safety-based sharing platform with FOAF visibility, selective response types, and CPTSD-friendly gradual story disclosure."},

  {"s": "person.preston", "p": "worked_on", "o": "project.branching_llm_tree_of_thought"},
  {"s": "project.branching_llm_tree_of_thought", "p": "summary", "o": "Chainlit + Pydantic structured object tree with event-driven inference."},

  {"s": "person.preston", "p": "worked_on", "o": "project.global_economic_shift_ai"},
  {"s": "project.global_economic_shift_ai", "p": "summary", "o": "Multi-model system ingesting current events, building event trees/graphs to suggest trade/investment strategies."},

  {"s": "person.preston", "p": "worked_on", "o": "project.trading_algorithm"},
  {"s": "project.trading_algorithm", "p": "summary", "o": "Detects upstream geopolitical signals for downstream investment moves."},

  {"s": "person.preston", "p": "worked_on", "o": "project.family_constellation_simulator"},
  {"s": "project.family_constellation_simulator", "p": "summary", "o": "Game-engine visualized AI representatives with gestures and emotion tools."},

  {"s": "person.preston", "p": "worked_on", "o": "project.trump_archive"},
  {"s": "project.trump_archive", "p": "summary", "o": "Searchable video transcripts, chronological timeline, political bias heatmap."},

  {"s": "person.preston", "p": "worked_on", "o": "project.media_bias_dual_site"},
  {"s": "project.media_bias_dual_site", "p": "summary", "o": "Two opposing narrative sites using identical Trump legal data + neutral third mode."},

  {"s": "person.preston", "p": "worked_on", "o": "project.youtube_transcript_heatmap"},
  {"s": "project.youtube_transcript_heatmap", "p": "summary", "o": "Cross-reference YouTube transcripts with outlet bias maps."},

  {"s": "person.preston", "p": "worked_on", "o": "project.music_reinterpretation"},
  {"s": "project.music_reinterpretation", "p": "summary", "o": "Strip rap verses and layer new harmonies/melodies via DAW + DJ decks."},

  {"s": "person.preston", "p": "worked_on", "o": "project.passive_ambient_sampler"},
  {"s": "project.passive_ambient_sampler", "p": "summary", "o": "Automated sampler recording ambient snippets, filtering for silence/speech/music."},

  {"s": "person.preston", "p": "worked_on", "o": "project.children_cancer_book"},
  {"s": "project.children_cancer_book", "p": "summary", "o": "Pixar-style children’s book about cancer."},

  {"s": "person.preston", "p": "worked_on", "o": "project.mlp_homeschool_curriculum"},
  {"s": "project.mlp_homeschool_curriculum", "p": "summary", "o": "Esoteric/archetypal lesson plan based on My Little Pony: Friendship is Magic."},

  {"s": "person.preston", "p": "worked_on", "o": "project.educational_game_mashups"},
  {"s": "project.educational_game_mashups", "p": "summary", "o": "Paper-based lemonade stand game teaching math & entrepreneurship."},

  {"s": "person.preston", "p": "worked_on", "o": "project.vibecoding_shell"},
  {"s": "project.vibecoding_shell", "p": "summary", "o": "Gamified AI software development control using game controller + microphone."},

  {"s": "person.preston", "p": "worked_on", "o": "project.web_browser"},
  {"s": "project.web_browser", "p": "summary", "o": "Experimental modular Chromium fork, composable interfaces."},

  {"s": "person.preston", "p": "worked_on", "o": "project.gambling_game_rating"},
  {"s": "project.gambling_game_rating", "p": "summary", "o": "Website to rate games by their adjacency to gambling mechanics."}
]
```

---

## 3. Triples — Blog & Writing Ideas

```json
[
  {"s": "person.preston", "p": "authored", "o": "blog.economics_tariffs"},
  {"s": "blog.economics_tariffs", "p": "summary", "o": "Deep dives into trade deficit elimination attempts, extreme tariffs, ripple effects."},

  {"s": "person.preston", "p": "authored", "o": "blog.media_polarization_series"},
  {"s": "blog.media_polarization_series", "p": "summary", "o": "Historical + neurochemical analysis of U.S. media polarization (Fairness Doctrine onward)."},

  {"s": "person.preston", "p": "authored", "o": "blog.philosophy_thought_pieces"},
  {"s": "blog.philosophy_thought_pieces", "p": "summary", "o": "Enlightenment → postmodernism arcs; nihilism & existentialism modern applicability."},

  {"s": "person.preston", "p": "authored", "o": "blog.weather_manipulation"},
  {"s": "blog.weather_manipulation", "p": "summary", "o": "Myth-busting hurricane modification energy requirements."},

  {"s": "person.preston", "p": "authored", "o": "blog.dog_genetics"},
  {"s": "blog.dog_genetics", "p": "summary", "o": "Master genes, Williams syndrome parallels, and unusual dog genetics facts."},

  {"s": "person.preston", "p": "authored", "o": "blog.roman_longevity_poison"},
  {"s": "blog.roman_longevity_poison", "p": "summary", "o": "Speculative history: Romans lived long enough to experience cumulative lead poisoning."},

  {"s": "person.preston", "p": "authored", "o": "blog.simulation_theory"},
  {"s": "blog.simulation_theory", "p": "summary", "o": "Philosophical, mathematical, experiential takes on Simulation Theory."}
]
```

---

## 4. Triples — YouTube / Video Content Ideas

```json
[
  {"s": "person.preston", "p": "authored", "o": "video.ai_vs_human_framing"},
  {"s": "video.ai_vs_human_framing", "p": "summary", "o": "Identical data framed in opposing narratives; reveal truth."},

  {"s": "person.preston", "p": "authored", "o": "video.educational_kids_content"},
  {"s": "video.educational_kids_content", "p": "summary", "o": "Explainers tied to Samaya’s curiosities: Statue of Liberty, dyes, bubbles."},

  {"s": "person.preston", "p": "authored", "o": "video.physics_experiments"},
  {"s": "video.physics_experiments", "p": "summary", "o": "Laser substrates, marble/bubble inversion experiments."},

  {"s": "person.preston", "p": "authored", "o": "video.history_symbolism_explainers"},
  {"s": "video.history_symbolism_explainers", "p": "summary", "o": "Explainers: Statue of Liberty, Gregorian calendar, star shapes."},

  {"s": "person.preston", "p": "authored", "o": "video.game_based_learning"},
  {"s": "video.game_based_learning", "p": "summary", "o": "Lemonade stand math, Animal Crossing guides."}
]
```

---

## 5. Triples — Website Concepts

```json
[
  {"s": "person.preston", "p": "built", "o": "website.witness_full"},
  {"s": "website.witness_full", "p": "summary", "o": "Full build-out of Witness platform."},

  {"s": "person.preston", "p": "built", "o": "website.trump_archive_timeline"},
  {"s": "website.trump_archive_timeline", "p": "summary", "o": "Trump Archive / Media Bias Timeline."},

  {"s": "person.preston", "p": "built", "o": "website.heatmap_media_index"},
  {"s": "website.heatmap_media_index", "p": "summary", "o": "Political media bias heatmap index."},

  {"s": "person.preston", "p": "built", "o": "website.global_event_graph"},
  {"s": "website.global_event_graph", "p": "summary", "o": "Global event graph for traders."},

  {"s": "person.preston", "p": "built", "o": "website.pokemon_strategy_tracker"},
  {"s": "website.pokemon_strategy_tracker", "p": "summary", "o": "High-damage Pokémon team builder with meta-shift updates."},

  {"s": "person.preston", "p": "built", "o": "website.gambling_game_rating"},
  {"s": "website.gambling_game_rating", "p": "summary", "o": "Rates games on similarity to gambling mechanics."}
]
```

---

## 6. Triples — Miscellaneous / “Idea Ideas”

```json
[
  {"s": "person.preston", "p": "authored", "o": "idea.bdd_from_rdf"},
  {"s": "idea.bdd_from_rdf", "p": "summary", "o": "Generate nested Gherkin scripts from RDF triples."},

  {"s": "person.preston", "p": "authored", "o": "idea.blockchain_music_licensing"},
  {"s": "idea.blockchain_music_licensing", "p": "summary", "o": "Songs evolve post-release with on-chain licensing."},

  {"s": "person.preston", "p": "authored", "o": "idea.global_climate_economics"},
  {"s": "idea.global_climate_economics", "p": "summary", "o": "Correlate equatorial climate metrics with GDP/infrastructure growth."},

  {"s": "person.preston", "p": "authored", "o": "idea.vr_fitness_meditation"},
  {"s": "idea.vr_fitness_meditation", "p": "summary", "o": "Muse EEG headset + VR boxing as meditation/exercise habit."}
]
```

