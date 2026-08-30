document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("calculator-form");
    const destination = document.getElementById("destination");
    const style = document.getElementById("style");
    const travellers = document.getElementById("travellers");
    const days = document.getElementById("days");

    const result = document.getElementById("calc-result");
    const resultCode = document.getElementById("result-code");
    const resultAmount = document.getElementById("result-amount");
    const resultNote = document.getElementById("result-note");
    const breakdown = document.getElementById("result-breakdown");
    const status = document.getElementById("calc-status");

    const destinations = {
        bali: {
            name: "Bali, Indonesia",
            code: "DPS",
            daily: 60,
            stay: 90
        },
        paris: {
            name: "Paris, France",
            code: "CDG",
            daily: 110,
            stay: 180
        },
        tokyo: {
            name: "Tokyo, Japan",
            code: "NRT",
            daily: 95,
            stay: 160
        },
        sydney: {
            name: "Sydney, Australia",
            code: "SYD",
            daily: 100,
            stay: 170
        },
        rome: {
            name: "Rome, Italy",
            code: "FCO",
            daily: 90,
            stay: 150
        },
        queenstown: {
            name: "Queenstown, New Zealand",
            code: "ZQN",
            daily: 105,
            stay: 175
        }
    };

    const styles = {
        budget: {
            name: "Budget",
            multiplier: 0.8
        },
        standard: {
            name: "Standard",
            multiplier: 1
        },
        luxury: {
            name: "Luxury",
            multiplier: 1.6
        }
    };

    function calculate() {

        status.textContent = "";
        status.className = "form-status";

        const destinationData = destinations[destination.value];
        const styleData = styles[style.value];

        const numberOfTravellers = parseInt(travellers.value);
        const numberOfDays = parseInt(days.value);

        if (!destinationData) {
            status.textContent = "Please choose a destination.";
            status.className = "form-status error";
            return;
        }

        if (!styleData) {
            status.textContent = "Please choose a travel style.";
            status.className = "form-status error";
            return;
        }

        if (
            isNaN(numberOfTravellers) ||
            numberOfTravellers < 1 ||
            numberOfTravellers > 20
        ) {
            status.textContent = "Please enter between 1 and 20 travellers.";
            status.className = "form-status error";
            return;
        }

        if (
            isNaN(numberOfDays) ||
            numberOfDays < 1 ||
            numberOfDays > 90
        ) {
            status.textContent = "Please enter between 1 and 90 days.";
            status.className = "form-status error";
            return;
        }

        const dailyTravelCost =
            destinationData.daily * numberOfTravellers;

        const dailyTotal =
            dailyTravelCost + destinationData.stay;

        const baseTotal =
            dailyTotal * numberOfDays;

        const finalTotal =
            Math.round(baseTotal * styleData.multiplier);

        resultCode.textContent =
            "WLX → " + destinationData.code;

        resultAmount.textContent =
            "$" + finalTotal.toLocaleString("en-AU");

        resultNote.textContent =
            "Estimated cost for " +
            numberOfTravellers +
            " traveller" +
            (numberOfTravellers > 1 ? "s" : "") +
            " to " +
            destinationData.name +
            " for " +
            numberOfDays +
            " day" +
            (numberOfDays > 1 ? "s" : "") +
            ".";

        breakdown.innerHTML = `
            <li>
                <span>Daily travel cost</span>
                <span>$${dailyTravelCost.toLocaleString("en-AU")}/day</span>
            </li>

            <li>
                <span>Accommodation</span>
                <span>$${destinationData.stay.toLocaleString("en-AU")}/day</span>
            </li>

            <li>
                <span>Duration</span>
                <span>${numberOfDays} day${numberOfDays > 1 ? "s" : ""}</span>
            </li>

            <li>
                <span>Travel style</span>
                <span>${styleData.name} ×${styleData.multiplier}</span>
            </li>
        `;

        result.classList.add("show");
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        calculate();

        result.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });


    /* Read calculator values from URL */

    const params = new URLSearchParams(window.location.search);

    const urlDestination = params.get("destination");
    const urlStyle = params.get("style");
    const urlTravellers = params.get("travellers");
    const urlDays = params.get("days");


    if (destinations[urlDestination]) {
        destination.value = urlDestination;
    }

    if (styles[urlStyle]) {
        style.value = urlStyle;
    }

    if (urlTravellers) {
        travellers.value = urlTravellers;
    }

    if (urlDays) {
        days.value = urlDays;
    }


    /* Automatically calculate if URL contains all values */

    if (
        destinations[urlDestination] &&
        styles[urlStyle] &&
        urlTravellers &&
        urlDays
    ) {
        calculate();
    }

});
