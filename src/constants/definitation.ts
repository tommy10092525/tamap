import { StationNames } from "@/app/components/Types";
import { dayIndices,currentDayIndex,now } from "@/app/features/functions";

const timeTableAPI = "/api/timetable";
const holidaysAPI = "https://holidays-jp.github.io/api/v1/date.json"
const inquiryURL = "https://docs.google.com/forms/d/17Le4TKOCQyZleSlCIYQmPKOnAgT80iTY6W4h2aON1_Y/viewform?edit_requested=true";
const stationNames: StationNames = { nishihachioji: "西八王子", mejirodai: "めじろ台", aihara: "相原" };
const currentDay = dayIndices[currentDayIndex];
const currentHour = now.getHours();
const currentMinutes = now.getMinutes();


export {timeTableAPI,holidaysAPI,inquiryURL,stationNames,currentDay,currentHour,currentMinutes}