import { Holidays, TimeTable, Caption, BusTime, UserInput } from "../components/Types";
import { buildings, stationNames } from "@/constants/settings";

// 祝日APIへのフェッチャー
const holidaysFetcher = async (key: string) => {
    return fetch(key).then(res => res.json() as Promise<Holidays>)
}

// 時刻表APIへのフェッチャー
const timeTableFetcher = async (key: string) => {
    return fetch(key).then((res) => res.json() as Promise<TimeTable>);
}

const initializeCaption = ({userInput, minutesToTime, firstBus }: {userInput: UserInput, minutesToTime: (minutes: number) => string, firstBus: BusTime }) => {
    let caption: Caption = {
        economics: "",
        gym: "",
        health: "",
        left: "",
        right: "",
        sport: ""
    }

    for (let key in buildings) {
        if (userInput.isComingToHosei) {
            caption[key] = minutesToTime(firstBus.arriveHour * 60 + firstBus.arriveMinute + buildings[key]);
        } else {
            caption[key] = "--:--";
        }
    }


    if (userInput.isComingToHosei) {
        caption.left = stationNames[userInput.station];
        caption.right = "法政大学"
    } else {
        caption.right = stationNames[userInput.station];
        caption.left = "法政大学";
    }
    return caption;
}

export { holidaysFetcher, timeTableFetcher,initializeCaption}