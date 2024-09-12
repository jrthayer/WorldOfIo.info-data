const fs = require("fs");
require("dotenv").config();
const { parse } = require("rss-to-json");
const { parseRss, generateShowsMap } = require("./util/parseRSS");

const playlists = require("./data/playlists");
const showsList = require("./data/showsList");
const exceptionsList = require("./data/exceptionsList");

const url = process.env.rss_url;

parse(url)
    .then((rss) => {
        let showMap = generateShowsMap(showsList, playlists);
        let convertedArrays = parseRss(rss.items, showMap, exceptionsList);

        // Define the file path where the JSON will be saved
        const filePath = "../showsData.json";
        let showsData = Object.fromEntries(convertedArrays[1]);
        showsData = Object.values(showsData);

        // Convert the array to a JSON string
        const jsonString = JSON.stringify(showsData);

        // Write the JSON string to the file
        fs.writeFile(filePath, jsonString, (err) => {
            if (err) {
                console.error("Error writing file:", err);
            } else {
                console.log("File has been saved.");
            }
        });
    })
    .catch((error) => `There has been an error: ${error}`);
