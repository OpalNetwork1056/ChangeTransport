"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("uv-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("uv-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("uv-error-code");

// Assuming `BareMux` is a global object or import it if necessary
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

// Ensure bareUrl and wispURL are defined and assigned correctly
const bareUrl = "your_bare_url_here";
const wispURL = "your_wisp_url_here";

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        await registerSW();
    } catch (err) {
        error.textContent = "Failed to register service worker.";
        errorCode.textContent = err.toString();
        throw err;
    }

    const url = search(address.value, searchEngine.value);

    let frame = document.getElementById("uv-frame");
    frame.style.display = "block";
    let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
    frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);

    document.getElementById("switcher").onchange = async function (event) {
        switch (event.target.value) {
            case "epoxy":
                await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
                break;
            case "bare":
                await connection.setTransport("/baremod/index.mjs", [bareUrl]);
                break;
            case "libcurl":
                await connection.setTransport("/libcurl/index.mjs", [{ wisp: wispURL }]);
                break; 
        }
    };
});
