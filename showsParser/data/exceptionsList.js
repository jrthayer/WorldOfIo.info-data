const exceptionsList = [
    {
        title: "Astral Academy Series Premiere (Arcane Academy Season 3)",
        showsToAddTo: [{ title: "Astral Academy" }],
    },
    {
        title: "Goblins of Io Ep 42",
        showsToAddTo: [
            { title: "Goblins of IO", indexPosition: 49 },
            { title: "Phase 2", indexPosition: 216 },
        ],
    },
    {
        title: "Spire of Euclid Ep 12 MP3",
        showsToAddTo: [
            {
                title: "Spire of Euclid",
                indexPosition: 12,
                parentIndexPosition: 22,
            },
            { title: "Phase 2", indexPosition: 216 },
        ],
    },
    {
        title: "Podcast",
        showsToAddTo: [{ title: "misc" }],
    },

    {
        title: "Phase 3 - Level 1 Encounter Workshop MP3",
        showsToAddTo: [{ title: "misc" }],
    },
    // Crossovers
    {
        title: "Arcane Academy x Goblins",
        showsToAddTo: [
            { title: "Astral Academy" },
            { title: "Goblins of IO" },
            { title: "Phase 2" },
        ],
    },
    {
        title: "Deadbeats x Pipe Dreamers",
        showsToAddTo: [
            { title: "Deadbeats", seasonIndex: 1 },
            { title: "Pipe Dreamers", seasonIndex: 1 },
            { title: "Phase 3" },
        ],
    },
    // Special Events
    {
        title: "Oswin",
        showsToAddTo: [{ title: "Goblins of IO" }, { title: "Phase 2" }],
    },
    {
        title: "Weyzi",
        showsToAddTo: [
            { title: "Miss Demeanor", seasonIndex: 2 },
            { title: "Phase 2" },
        ],
    },
    {
        title: "Chamber of the Eight",
        showsToAddTo: [
            { title: "Miss Demeanor", seasonIndex: 2 },
            { title: "Goblins of IO" },
            { title: "Phase 2" },
        ],
    },
    {
        title: "Kaasma Khara Final Battle",
        showsToAddTo: [
            { title: "Miss Demeanor", seasonIndex: 1 },
            { title: "Goblins of IO" },
            { title: "Astral Academy" },
            { title: "Phase 2" },
        ],
    },
    {
        title: "The Shadow Invasion",
        showsToAddTo: [
            { title: "Miss Demeanor", seasonIndex: 2 },
            { title: "Goblins of IO" },
            { title: "Bronn" },
            { title: "Phase 2" },
        ],
    },
    // Typos
    {
        title: "Into the Shadows Breach",
        showsToAddTo: [
            { title: "Into The Shadow's Breach" },
            { title: "Phase 3" },
        ],
    },
    {
        title: "Curious Curious",
        showsToAddTo: [{ title: "Curious Curios" }, { title: "Phase 3" }],
    },
    {
        title: "March of Faewunder",
        showsToAddTo: [{ title: "March on Faewunder" }, { title: "Phase 3" }],
    },
    {
        title: "Dawn of Ganyemde",
        showsToAddTo: [{ title: "Dawn of Ganymede" }, { title: "Phase 3" }],
    },
];

module.exports = exceptionsList;
