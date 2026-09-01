/* =========================================================
   MEGHDHRISTI NOWCAST
========================================================= */


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const clock =
        document.getElementById(
            "navClock"
        );

    if (!clock) return;


    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour12: false,
                timeZone:
                    "Asia/Kolkata"
            }
        );


    clock.textContent =
        `${time} IST`;

}


updateClock();

setInterval(
    updateClock,
    1000
);



/* =========================================================
   FOOTER YEAR
========================================================= */

const year =
    document.getElementById(
        "year"
    );

if (year) {

    year.textContent =
        new Date().getFullYear();

}



/* =========================================================
   FORECAST DATA
========================================================= */

const nowcastData = {

    now: {

        risk: "HIGH",

        probability: 82,

        lightning: 91,

        speed: 28,

        direction: "ENE",

        arrival: "NOW"

    },


    "+15 MIN": {

        risk: "HIGH",

        probability: 86,

        lightning: 93,

        speed: 30,

        direction: "ENE",

        arrival: "15 min"

    },


    "+30 MIN": {

        risk: "SEVERE",

        probability: 92,

        lightning: 95,

        speed: 32,

        direction: "ENE",

        arrival: "30 min"

    },


    "+45 MIN": {

        risk: "SEVERE",

        probability: 94,

        lightning: 96,

        speed: 32,

        direction: "ENE",

        arrival: "45 min"

    },


    "+60 MIN": {

        risk: "MODERATE",

        probability: 64,

        lightning: 71,

        speed: 29,

        direction: "NE",

        arrival: "60 min"

    }

};

/* =========================================================
   NOWCAST INTERACTIVE ENGINE
========================================================= */
const API_BASE = "https://megh-backend.onrender.com";
const forecastData = [
    {
        time: "NOW",
        risk: "SEVERE",
        probability: 85.5,
        lightning: 54.3,
        speed: 19.0,
        direction: "W",
        icon: "⛈",
        description: "Thunderstorm activity detected with severe risk.",
        confidence: 88.9
    },
    {
        time: "+1H",
        risk: "SEVERE",
        probability: 85.2,
        lightning: 50.0,
        speed: 19.0,
        direction: "W",
        icon: "⛈",
        description: "Severe thunderstorm conditions expected within the next hour.",
        confidence: 87.6
    },
    {
        time: "+2H",
        risk: "SEVERE",
        probability: 87.0,
        lightning: 55.6,
        speed: 19.0,
        direction: "W",
        icon: "⛈",
        description: "Thunderstorm probability remains elevated.",
        confidence: 89.1
    },
    {
        time: "+3H",
        risk: "SEVERE",
        probability: 88.0,
        lightning: 59.6,
        speed: 19.0,
        direction: "W",
        icon: "⛈",
        description: "Peak thunderstorm probability in the current outlook.",
        confidence: 89.5
    },
    {
        time: "+4H",
        risk: "HIGH",
        probability: 83.0,
        lightning: 47.9,
        speed: 19.0,
        direction: "W",
        icon: "⚡",
        description: "Thunderstorm probability remains high.",
        confidence: 86.7
    },
    {
        time: "+5H",
        risk: "SEVERE",
        probability: 87.9,
        lightning: 61.4,
        speed: 19.0,
        direction: "W",
        icon: "⛈",
        description: "Severe thunderstorm risk continues into the fifth hour.",
        confidence: 90.3
    }
];
async function loadNowcastFromBackend() {
    try {
        console.log("MEGHDHRISTI: Fetching nowcast...");

        const response = await fetch(
            `${API_BASE}/api/nowcast`
        );

        if (!response.ok) {
            throw new Error(
                `Backend returned ${response.status}`
            );
        }

        const data = await response.json();
        backendNowcast = data;

        console.log(
            "MEGHDHRISTI: Backend nowcast:",
            data
        );

        if (!Array.isArray(data.outlook)) {
            throw new Error(
                "Backend outlook data missing"
            );
        }

        forecastData.length = 0;

        data.outlook.forEach(item => {

            forecastData.push({
                time: item.label,
                risk: item.risk,
                probability:
                    Number(
                        item.thunderstorm_probability
                    ),
                lightning:
                    Number(
                        item.lightning_probability
                    ),
                speed:
                    Number(
                        data.movement?.speed_kmh || 0
                    ),
                direction:
                    data.movement?.direction || "—",
                icon:
                    item.risk === "SEVERE"
                        ? "⛈"
                        : "⚡",
                description:
                    `Thunderstorm probability ${Number(
                        item.thunderstorm_probability
                    ).toFixed(1)}% with ${item.risk.toLowerCase()} risk.`,
                confidence:
                    Number(item.confidence)
            });

        });

        console.log(
            "MEGHDHRISTI: Forecast updated from backend.",
            forecastData
        );

        updateForecast(0);

    } catch (error) {

        console.error(
            "MEGHDHRISTI: Nowcast API error:",
            error
        );

        /*
         * Keep existing frontend data
         * if backend is temporarily unavailable.
         */

        updateForecast(0);
    }
}


const points =
    document.querySelectorAll(
        ".forecast-point"
    );


const slider =
    document.getElementById(
        "forecastSlider"
    );


const playButton =
    document.getElementById(
        "forecastPlay"
    );


let currentIndex = 0;

let playing = false;

let playTimer = null;
let backendNowcast = null;



/* =========================================================
   ELEMENTS
========================================================= */

const confidenceValue =
    document.getElementById(
        "confidenceValue"
    );

const confidenceTrend =
    document.getElementById(
        "confidenceTrend"
    );

const selectedTime =
    document.getElementById(
        "selectedTime"
    );

const selectedRisk =
    document.getElementById(
        "selectedRisk"
    );

const selectedProbability =
    document.getElementById(
        "selectedProbability"
    );

const selectedLightning =
    document.getElementById(
        "selectedLightning"
    );

const selectedMovement =
    document.getElementById(
        "selectedMovement"
    );

const selectedDirection =
    document.getElementById(
        "selectedDirection"
    );
const selectedETA =
    document.getElementById(
        "selectedETA"
    );

const selectedDescription =
    document.getElementById(
        "selectedDescription"
    );

const selectedIcon =
    document.getElementById(
        "selectedIcon"
    );

const vectorDirection =
    document.getElementById(
        "vectorDirection"
    );

const tooltipTime =
    document.getElementById(
        "tooltipTime"
    );

const tooltipRisk =
    document.getElementById(
        "tooltipRisk"
    );

const tooltipProbability =
    document.getElementById(
        "tooltipProbability"
    );

const tooltipLightning =
    document.getElementById(
        "tooltipLightning"
    );

const tooltipSpeed =
    document.getElementById(
        "tooltipSpeed"
    );

const tooltip =
    document.getElementById(
        "trajectoryTooltip"
    );



/* =========================================================
   UPDATE FORECAST
========================================================= */

function updateForecast(index) {

    const data =
        forecastData[index];

    if (!data) return;


    currentIndex = index;


    /* ---------------------------------------------
       Selected point
    --------------------------------------------- */

    points.forEach(
        point => {

            point.classList.toggle(
                "selected",
                Number(point.dataset.index) === index
            );

        }
    );


    /* ---------------------------------------------
       Slider
    --------------------------------------------- */

    if (slider) {

        slider.value = index;

        const percentage =
            forecastData.length > 1
                ? (index / (forecastData.length - 1)) * 100
                : 0;

        slider.style.background = `
            linear-gradient(
                90deg,
                var(--cyan) 0%,
                var(--cyan) ${percentage}%,
                rgba(255,255,255,.08) ${percentage}%,
                rgba(255,255,255,.08) 100%
            )
        `;

    }


    /* ---------------------------------------------
       Header confidence
    --------------------------------------------- */

    confidenceValue.textContent =
        `${data.confidence}%`;


    if (index === 0) {

        confidenceTrend.textContent =
            "↑ Stable";

    } else if (data.confidence >= 90) {

        confidenceTrend.textContent =
            "↑ High confidence";

    } else {

        confidenceTrend.textContent =
            "↓ Forecast uncertainty increasing";

    }


    /* ---------------------------------------------
       Selected information
    --------------------------------------------- */

    selectedTime.textContent =
        data.time;

    selectedRisk.textContent =
        data.risk;

    selectedProbability.textContent =
        `${data.probability}%`;

    selectedLightning.textContent =
        `${data.lightning}%`;

    selectedMovement.textContent =
        `${data.speed} km/h`;

    selectedDirection.textContent =
        data.direction;

    selectedDescription.textContent =
        data.description;
    if (
        selectedETA &&
        backendNowcast &&
        backendNowcast.movement
    ) {

        const eta =
            Number(
                backendNowcast.movement.eta_hours
            );

        selectedETA.textContent =
            `${eta.toFixed(1)} h`;

    }

    selectedIcon.textContent =
        data.icon;

    vectorDirection.textContent =
        `↗ ${data.direction}`;


    /* ---------------------------------------------
       Risk color
    --------------------------------------------- */

    if (
        data.risk.includes("SEVERE")
    ) {

        selectedRisk.style.color =
            "var(--red)";

    } else if (
        data.risk.includes("HIGH")
    ) {

        selectedRisk.style.color =
            "var(--red)";

    } else {

        selectedRisk.style.color =
            "var(--yellow)";

    }


    /* ---------------------------------------------
       Tooltip
    --------------------------------------------- */

    tooltipTime.textContent =
        data.time;

    tooltipRisk.textContent =
        data.risk.replace(
            " RISK",
            ""
        );

    tooltipProbability.textContent =
        `${data.probability}%`;

    tooltipLightning.textContent =
        `${data.lightning}%`;

    tooltipSpeed.textContent =
        `${data.speed} km/h`;

}



/* =========================================================
   POINT CLICK
========================================================= */

points.forEach(
    point => {

        point.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        point.dataset.index
                    );

                updateForecast(index);

            }
        );


        /* ---------------------------------------------
           Hover
        --------------------------------------------- */

        point.addEventListener(
            "mouseenter",
            () => {

                const index =
                    Number(
                        point.dataset.index
                    );

                const data =
                    forecastData[index];


                tooltipTime.textContent =
                    data.time;

                tooltipRisk.textContent =
                    data.risk.replace(
                        " RISK",
                        ""
                    );

                tooltipProbability.textContent =
                    `${data.probability}%`;

                tooltipLightning.textContent =
                    `${data.lightning}%`;

                tooltipSpeed.textContent =
                    `${data.speed} km/h`;


                tooltip.style.left =
                    point.style.left;

                tooltip.style.top =
                    `calc(${point.style.top} - 155px)`;

            }
        );

    }
);



/* =========================================================
   SLIDER
========================================================= */

if (slider) {

    slider.addEventListener(
        "input",
        event => {

            updateForecast(
                Number(
                    event.target.value
                )
            );

        }
    );

}



/* =========================================================
   PLAY FORECAST
========================================================= */

function startForecast() {

    if (playing) return;


    playing = true;


    playButton.classList.add(
        "playing"
    );


    document.getElementById(
        "playIcon"
    ).textContent = "Ⅱ";


    document.getElementById(
        "playText"
    ).textContent =
        "Pause forecast";


    playTimer =
        setInterval(
            () => {

                let next =
                    currentIndex + 1;


                if (
                    next >=
                    forecastData.length
                ) {

                    next = 0;

                }


                updateForecast(next);

            },
            1400
        );

}



function stopForecast() {

    playing = false;


    clearInterval(
        playTimer
    );


    playTimer = null;


    playButton.classList.remove(
        "playing"
    );


    document.getElementById(
        "playIcon"
    ).textContent = "▶";


    document.getElementById(
        "playText"
    ).textContent =
        "Play forecast";

}



if (playButton) {

    playButton.addEventListener(
        "click",
        () => {

            if (playing) {

                stopForecast();

            } else {

                startForecast();

            }

        }
    );

}



/* =========================================================
   INITIAL STATE
========================================================= */

updateForecast(0);
loadNowcastFromBackend();

setInterval(
    loadNowcastFromBackend,
    5 * 60 * 1000
);
/* =========================================================
   NEWSLETTER
========================================================= */

const newsletter =
    document.getElementById(
        "newsletterForm"
    );


if (newsletter) {

    newsletter.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const message =
                document.getElementById(
                    "newsletterMessage"
                );


            if (message) {

                message.textContent =
                    "You're on the MEGHDHRISTI intelligence list.";

                message.style.color =
                    "#21e695";

            }

        }
    );

}