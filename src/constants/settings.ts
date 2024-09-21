import { StationNames } from "@/app/components/Types";
import { dayIndices} from "@/app/features/functions";

const timeTableAPI = "/api/timetable";
const holidaysAPI = "https://holidays-jp.github.io/api/v1/date.json"
const inquiryURL = "https://docs.google.com/forms/d/17Le4TKOCQyZleSlCIYQmPKOnAgT80iTY6W4h2aON1_Y/viewform?edit_requested=true";
const stationNames: StationNames = { nishihachioji: "西八王子", mejirodai: "めじろ台", aihara: "相原" };



export {timeTableAPI,holidaysAPI,inquiryURL,stationNames}