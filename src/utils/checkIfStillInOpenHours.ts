import { parse, isWithinInterval } from "date-fns";

const openHours = [
    {
        day: "Sunday",
        open: "12:00 PM",
        close: "4:00 PM",
    },
    {
        day: "Monday",
        open: "09:00 AM",
        close: "6:00 PM",
    },
    {
        day: "Tuesday",
        open: "09:00 AM",
        close: "6:00 PM",
    },
    {
        day: "Wednesday",
        open: "09:00 AM",
        close: "6:00 PM",
    },

    {
        day: "Thursday",
        open: "09:00 AM",
        close: "6:00 PM",
    },
    {
        day: "Friday",
        open: "09:00 AM",
        close: "6:00 PM",
    },
    {
        day: "Saturday",
        open: "10:00 AM",
        close: "4:00 PM",
    },

 ]



/**
 * Checks if a given time is within the open hours for the specified date.
 * @param date - The date to check.
 * @param time - The time to check.
 * @returns True if the time is within open hours, false otherwise.
 */
export const checkIfStillInOpenHours = (date: Date): boolean => {
    const day = date.getDay();
    // const openHour = openHours[day].open;
    // const closeHour = openHours[day].close;
    // const openHourDate = new Date(`${date.toDateString()} ${openHour}`);
    // const closeHourDate = new Date(`${date.toDateString()} ${closeHour}`);


    // if (date.getTime() >= openHourDate.getTime() && date.getTime() <= closeHourDate.getTime()) {
    //     return true;
    // }
    // return false;
    const { open, close } = openHours[day];

    const openTime = parse(open, "h:mm a", date);
    const closeTime = parse(close, "h:mm a", date);

    return isWithinInterval(date, { start: openTime, end: closeTime });
}