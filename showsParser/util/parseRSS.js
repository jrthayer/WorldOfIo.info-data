// Potential improvements/current design issues
// ===========================================
// 1. Shows title is used as a unique identifier for the show container and the associated playlist.
//      - currently the title is saved with the casing intact which adds complexity to accessing/manipulating the shows

function parseRss(rssData, showsContainer, specialCases) {
    //Strip data from default rss feed and create a clean dataObject
    rssData = convertRssData(rssData.reverse());

    // Go through each show to see if their title is contained in the session title
    // if it is add it to the show and the corresponding season
    // else check if any of the seasons has a title that is contained in the session transitionDelay:
    //==============
    //NOTE: This is needed because some show seasons have their own unique name but are just a continuation of the show
    rssData.forEach((sessionData, index) => {
        let sessionAdded = false;
        sessionData.index = index;

        sessionAdded = addSpecialCaseShows(
            specialCases,
            showsContainer,
            sessionData
        );

        if (sessionAdded === false) {
            let addedToCore = addCoreShows(showsContainer, sessionData);

            if (addedToCore[0]) {
                let phaseObject;
                if (index < 262) {
                    phaseObject = showsContainer.get("Phase 2");
                } else {
                    phaseObject = showsContainer.get("Phase 3");
                }

                addSessionData(phaseObject, sessionData);

                let newSeries = phaseObject.seasons.some((season) => {
                    return season.childShow === addedToCore[1];
                });

                if (!newSeries) {
                    phaseObject.seasons.push({
                        childShow: addedToCore[1],
                    });
                }
            } else {
                addSessionData(showsContainer.get("misc"), sessionData);
            }
        }
    });

    // generate imageCss attribute for all series and their seasons
    for (const [key, value] of showsContainer) {
        let seriesData = value;
        seriesData.imageCss = generateSpriteReference(seriesData.title);

        if (Object.hasOwn(seriesData, "seasons")) {
            seriesData.seasons.forEach((season, index) => {
                let seasonNumber = index + 1;
                season.title = seriesData.title;
                season.subTitle = `Season ${seasonNumber}`;

                let spriteTitle;
                if (
                    seasonNumber === 1 ||
                    seriesData.title === "Arcane Academy" ||
                    seriesData.title === "Miss Demeanor"
                ) {
                    spriteTitle = seriesData.title;
                } else {
                    spriteTitle = seriesData.title + ` s${seasonNumber}`;
                }

                season.imageCss = generateSpriteReference(spriteTitle);
                season.playlist = seriesData.playlist;
            });
        }
    }

    // copy child data to parent
    for (const [key, value] of showsContainer) {
        let seriesData = value;
        let numberOfSeasons = 1;

        let subTitleText = "Season";
        if (seriesData.title === "Phase 2" || seriesData.title === "Phase 3") {
            subTitleText = "Series";
        }

        if (Object.hasOwn(seriesData, "seasons")) {
            numberOfSeasons = seriesData.seasons.length;

            seriesData.seasons.forEach((season, index, seasons) => {
                if (Object.hasOwn(season, "childShow")) {
                    let seasonNumber = index + 1;
                    seasons[index] = {
                        ...showsContainer.get(season.childShow),
                        subTitle: `${seriesData.title} ${subTitleText} ${seasonNumber}`,
                    };
                }
            });
        }

        seriesData.subTitle = `${numberOfSeasons} ${subTitleText}${
            numberOfSeasons > 1 && subTitleText === "Season" ? "s" : ""
        }`;
    }

    return [rssData, showsContainer];
}

function generateSpriteReference(title) {
    title = title.toLowerCase();
    title = title.replace(new RegExp("'", "g"), "");
    let underscoreTitle = title
        .split(" ")
        .reduce((sum, word) => sum + "_" + word);
    return "banner-" + underscoreTitle;
}

function addSpecialCaseShows(specialCases, showsContainer, sessionData) {
    for (let x = 0; x < specialCases.length; x++) {
        let specialCase = specialCases[x];
        let sessionTitle = sessionData.title.toLowerCase();

        if (sessionTitle.includes(specialCase.title.toLowerCase())) {
            for (let y = 0; y < specialCase.showsToAddTo.length; y++) {
                let showAddedTo = specialCase.showsToAddTo[y];
                let show = showsContainer.get(showAddedTo.title);

                if (Object.hasOwn(showAddedTo, "indexPosition")) {
                    sessionData.indexPosition = showAddedTo.indexPosition;
                }

                addSessionData(show, sessionData);

                // add to parent show if it has one
                if (Object.hasOwn(show, "parentShow")) {
                    if (Object.hasOwn(showAddedTo, "parentIndexPosition")) {
                        sessionData.indexPosition =
                            showAddedTo.parentIndexPosition;
                    }

                    addSessionData(
                        showsContainer.get(show.parentShow),
                        sessionData
                    );
                }

                // Exception added for the case were a special event occurs and needs to be added to a specific season
                if (Object.hasOwn(showAddedTo, "seasonIndex")) {
                    addSessionData(
                        show.seasons[showAddedTo.seasonIndex],
                        sessionData
                    );
                } else {
                    addToSeasons(show, sessionData);
                }
            }
            return true;
        }
    }
    return false;
}

function addCoreShows(showsContainer, sessionData) {
    for (let [key, value] of showsContainer) {
        let show = value;

        let sessionTitle = sessionData.title.toLowerCase();
        if (sessionTitle.includes(show.title.toLowerCase())) {
            // add to show
            addSessionData(show, sessionData);

            // add to parent show if it has one
            if (Object.hasOwn(show, "parentShow")) {
                addSessionData(
                    showsContainer.get(show.parentShow),
                    sessionData
                );
            }

            // add to seasons if it has seasons
            addToSeasons(show, sessionData);

            return [true, show.title];
        }
    }
    return [false, ""];
}

function addToSeasons(show, sessionData) {
    let sessionTitle = sessionData.title.toLowerCase();

    if (Object.hasOwn(show, "seasons")) {
        let seasons = show.seasons;
        // Starts from the end of the seasons because season 1 usually has an empty string as
        // its matching string and would therefore match every session.
        // ========
        // Note for generally unused js feature
        // js label
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label
        // ===============
        seasonLoop: for (let x = seasons.length - 1; x >= 0; x--) {
            if (Object.hasOwn(seasons[x], "seasonStringMatch")) {
                let season = seasons[x];
                let matchingStrings = season.seasonStringMatch;
                for (let y = 0; y < matchingStrings.length; y++) {
                    if (
                        sessionTitle.includes(matchingStrings[y].toLowerCase())
                    ) {
                        addSessionData(season, sessionData);

                        break seasonLoop;
                    }
                }
            }
        }
    }
}

function addSessionData(show, data) {
    show.numberOfSessions++;

    if (typeof show.startDate === "undefined") {
        show.startDate = data.airDate;
    }
    show.endDate = data.airDate;
    if (Object.hasOwn(data, "indexPosition")) {
        show.sessionIndexes.splice(data.indexPosition, 0, data.index);
    } else {
        show.sessionIndexes.push(data.index);
    }
}

function convertRssData(rssData) {
    let duplicateKey = 0;
    let convertedData = rssData.map((singleSession) => {
        if (singleSession.title.includes("Curios Season 3 Session 1")) {
            if (duplicateKey === 1) {
                singleSession.title = "Curious Curios Season 3 Session 2 MP3";
            }
            duplicateKey++;
        }

        //strip data
        const singleSessionData = stripData(singleSession);

        //return converted show object
        return singleSessionData;
    });

    return convertedData;
}

// =============================================================
// Create Data Structure to hold shows
// =============================================================
function generateShowsMap(showsData, playlistData) {
    let showsMap = new Map();

    showsData.forEach((data) => {
        let singleShowData = { ...data };
        // Add playlist to show if it exists
        if (playlistData.get(singleShowData.title) !== undefined) {
            singleShowData.playlist = playlistData.get(singleShowData.title);
        }

        let showObject = generateShowObject(singleShowData);

        showsMap.set(showObject.title, showObject);
    });

    return showsMap;
}

function generateShowObject(showData) {
    // if concluded isn't defined add and set to true
    if (!Object.hasOwn(showData, "concluded")) {
        showData.concluded = true;
    }
    //  Generate season playlistObjects
    if (Object.hasOwn(showData, "seasonMatchStrings")) {
        let seasons = [];
        for (let x = 0; x < showData.seasonMatchStrings.length; x++) {
            let seasonMatchData = showData.seasonMatchStrings[x];
            // Special case where there is a show inside a show instead of just a subset playlist(season of a show)
            if (
                typeof seasonMatchData === "object" &&
                !Array.isArray(seasonMatchData)
            ) {
                seasons.push(seasonMatchData);
            } else {
                let seasonData = {};

                //Set concluded state based on position of season
                if (x === showData.seasonMatchStrings.length - 1) {
                    seasonData.concluded = showData.concluded;
                } else {
                    seasonData.concluded = true;
                }

                // Special case where there is a show inside a show instead of just a subset playlist(season of a show)

                if (typeof seasonMatchData === "string") {
                    seasonData.seasonStringMatch = [seasonMatchData];
                } else {
                    seasonData.seasonStringMatch = seasonMatchData;
                }
                seasons.push(generatePlaylistObject(seasonData));
            }
        }

        showData.seasons = seasons;
        delete showData.seasonMatchStrings;
    }

    return generatePlaylistObject(showData);
}

function generatePlaylistObject(showData) {
    let showObject = {
        numberOfSessions: 0,
        endDate: new Date(),
        sessionIndexes: [],
        ...showData,
    };

    return showObject;
}

function stripData(rawData) {
    //Generally the mp3 is uploaded the day AFTER it originally aired
    const epochDay = 24 * 60 * 60 * 1000;

    const showData = {
        title: rawData.title,
        airDate: new Date(rawData.created - epochDay),
        link: rawData.enclosures[0].url,
    };

    return showData;
}

// Export functions as properties of an object
module.exports = {
    parseRss,
    generateShowsMap,
};
