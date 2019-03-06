// --------------------------------------------
// |  Configure APIs and any respective keys  |
// --------------------------------------------
require("dotnev").config();

var keys = require("./keys.js");

// File System
const fs      = require("fs");

// Operating System (for end-of-line)
const os = require("os");

// ------------------------------
// |         Initialize         |
// ------------------------------

process.stdout.write("\033c");

// Create a log file if it does not exist
const file_log = "log.txt";

if (!fs.existsSync(file_log)) {
    fs.writeFile(file_log, "", error => {
        if (error) {
            console.log(`Error in creating "${file_log}"\n${error}\n\n\n`);
            return;
        }
    });
}

const option = process.argv[2];
const title  = process.argv.slice(3).join(" ");

mainMenu(option, title);

// ------------------------------
// |        Menu options        |
// ------------------------------
function mainMenu(option = "", title) {
    switch (option.toLowerCase()) {

      case "spotify-this-song":
        getSong((title) ? title : "The Sign");
        break;

      default:
        saveOutput(`Error:\n"${option}" is a not valid command.\nPlease select "spotify-this-song."\n\n\n`);

    }
}

function getSong(title) {
    const parameters = {
        "type" : "track",
        "query": title,
        "limit": 1
    };

    spotify.search(parameters, (error, data) => {
        if (error) {
            saveOutput(`Error in calling "Spotify"\n${error}\n\n\n`);
            return;
        }

        // For simplicity, we assume that Spotify always finds the right song
        const song = data.tracks.items[0];

        // Display all artists
        const artists = song.artists.map(a => a.name);


        /********************************************************************
            
            Write to terminal and file
            
        *********************************************************************/
        let output = "Spotify This Song\n";
        
        output += addSeparator();
        
        output += `Artists      : ${artists.join(", ")}\n`;
        output += `Album        : ${song.album.name}\n`;
        output += `Track        : ${song.name}\n`;
        output += `Preview link : ${song.preview_url}\n\n`;
        
        output += addSeparator() + "\n";

        saveOutput(output);
    });
}

function addSeparator() {
    return "-".repeat(60) + "\n\n";
}

function saveOutput(output) {
    // Write to the terminal
    console.log(output);

    // Write to the log file
    fs.appendFile(file_log, output, error => {
        if (error) {
            return console.log(`Error in appending to "${file_log}"\n${error}\n\n\n`);
        }
    });
}


// ------------------------------
// |                            |
// ------------------------------


// ------------------------------
// |                            |
// ------------------------------

