
export function isNumber(n) {
    return typeof n === 'number' && isFinite(n);
}

export function isObjectEmpty(obj) {
    if (obj === null || obj === undefined) return true;

    return Object.keys(obj).length === 0;
}

export function formatToCurrency(amount) {
    if (amount === null || amount === undefined || amount === NaN) return '';

    if (!isNumber(amount)) return amount;

    return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10, decPlaces);

    // Enumerate number abbreviations
    var abbrev = ["k", "m", "b", "t"];

    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10, (i + 1) * 3);

        // If the number is bigger or equal do the abbreviation
        if (size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            number = Math.round(number * decPlaces / size) / decPlaces;

            // Handle special case where we round up to the next abbreviation
            if ((number == 1000) && (i < abbrev.length - 1)) {
                number = 1;
                i++;
            }

            // Add the letter for the abbreviation
            number += abbrev[i];

            // We are done... stop
            break;
        }
    }

    return number;
}

export const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}


export function isEmail(emailAdress) {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (emailAdress.match(regex))
        return true;

    else
        return false;
}

export const handleFormSubmit = (e) => {
    e.preventDefault();
}

export const holiday_dates = {
    "2023": [
        "2023-01-02",
        "2023-01-16",
        "2023-02-20",
        "2023-04-14",
        "2023-05-29",
        "2023-07-04",
        "2023-09-04",
        "2023-11-23",
        "2023-12-25"
    ],
    "2024": [
        "2024-01-01",
        "2024-01-15",
        "2024-02-19",
        "2024-03-29",
        "2024-05-27",
        "2024-07-04",
        "2024-09-02",
        "2024-11-28",
        "2024-12-25"
    ],
    "2025": [
        "2025-01-01",
        "2025-01-20",
        "2025-02-17",
        "2025-04-18",
        "2025-05-26",
        "2025-07-04",
        "2025-09-01",
        "2025-11-27",
        "2025-12-25"
    ],
    "2026": [
        "2026-01-01",
        "2026-01-19",
        "2026-02-16",
        "2026-04-03",
        "2026-05-25",
        "2026-07-03",
        "2026-09-07",
        "2026-11-26",
        "2026-12-25"
    ],
    "2027": [
        "2027-01-01",
        "2027-01-18",
        "2027-02-15",
        "2027-04-16",
        "2027-05-31",
        "2027-07-05",
        "2027-09-06",
        "2027-11-25",
        "2027-12-24"
    ],
    "2028": [
        "2028-01-17",
        "2028-02-21",
        "2028-04-07",
        "2028-05-29",
        "2028-07-04",
        "2028-09-04",
        "2028-11-23",
        "2028-12-25"
    ],
    "2029": [
        "2029-01-01",
        "2029-01-15",
        "2029-02-19",
        "2029-03-30",
        "2029-05-28",
        "2029-07-04",
        "2029-09-03",
        "2029-11-22",
        "2029-12-25"
    ],
    "2030": [
        "2030-01-01",
        "2030-01-21",
        "2030-02-18",
        "2030-04-19",
        "2030-05-27",
        "2030-07-04",
        "2030-09-02",
        "2030-11-28",
        "2030-12-25"
    ],
    "2031": [
        "2031-01-01",
        "2031-01-20",
        "2031-02-17",
        "2031-04-11",
        "2031-05-26",
        "2031-07-04",
        "2031-09-01",
        "2031-11-27",
        "2031-12-25"
    ],
    "2032": [
        "2032-01-01",
        "2032-01-19",
        "2032-02-16",
        "2032-03-26",
        "2032-05-31",
        "2032-07-05",
        "2032-09-06",
        "2032-11-25",
        "2032-12-24"
    ],
    "2033": [
        "2033-01-17",
        "2033-02-21",
        "2033-04-15",
        "2033-05-30",
        "2033-07-04",
        "2033-09-05",
        "2033-11-24",
        "2033-12-26"
    ],
    "2034": [
        "2034-01-02",
        "2034-01-16",
        "2034-02-20",
        "2034-04-07",
        "2034-05-29",
        "2034-07-04",
        "2034-09-04",
        "2034-11-23",
        "2034-12-25"
    ],
}

export const filterDataForChart = (tempData, filter) => {
    // compare start and end date to determine if reverse is needed
    if (new Date(tempData[0].datetime) > new Date(tempData[tempData.length - 1].datetime)) {
        tempData.reverse(); // Reverse the order of the data
    }

    // let filteredData = tempData

    let filteredData = tempData.filter(({ datetime }) => {
        // debugger

        const dateInQuestion = new Date(datetime);

        const date = new Date()
        const day = date.getDay();
        const year = date.getFullYear();
        if (day >= 6 || day === 0) {
            if (day === 6) {
                date.setDate(date.getDate() - 1);
            } else if (day === 0) {
                date.setDate(date.getDate() - 2);
            }
        } else if (day <= 5 && day > 0) {
            if (holiday_dates[year].includes(date.toISOString().slice(0, 10))) {
                if (day === 1) {
                    date.setDate(date.getDate() - 3);
                } else {
                    date.setDate(date.getDate() - 1);
                }
            } else if (date.getHours() < 9) {
                if (day === 1) {
                    date.setDate(date.getDate() - 3);
                } else {
                    date.setDate(date.getDate() - 1);
                }
            }
        }

        let startDate, endDate;

        if (filter === '1D') {
            // const day = date.getDay();
            if (day === 0) {
                startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 2, 9, 30);
                endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 2, 16, 0);
            } else if (day === 6) {
                startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 9, 30);
                endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 16, 0);
            } else {
                startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 30);
                endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 16, 0);
            }
        } else if (filter === '1W') {
            startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7, 0, 0);
            endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        } else if (filter === '1M') {
            startDate = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate(), 0, 0);
            endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        } else if (filter === '3M') {
            startDate = new Date(date.getFullYear(), date.getMonth() - 3, date.getDate(), 0, 0);
            endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        } else if (filter === '1Y') {
            startDate = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate(), 0, 0);
            endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        } else if (filter === '5Y') {
            startDate = new Date(date.getFullYear() - 5, date.getMonth(), date.getDate(), 0, 0);
            endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        } else {
            startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 0, 0);
            endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        }

        return dateInQuestion >= startDate && dateInQuestion <= endDate;
    });

    return filteredData;

}