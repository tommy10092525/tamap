import { Holidays, TimeTable } from "../components/Types";

// 曜日ごとの配列インデックス
const dayIndices = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// 時刻を数値に変換するヘルパー関数（分単位）
function toMinutes(hour: number, minutes: number) {
    return hour * 60 + minutes;
}

// 指定された時刻（分）との差を計算
function timeDifference(nowInMinutes: number, busInMinutes: number) {
    return busInMinutes - nowInMinutes;
}

// 日付が祝日かどうかを判定
function isHoliday(date: Date, holidayData: Holidays) {
    const formattedDate = date.toISOString().split('T')[0];
    if (!holidayData) {
        alert("祝日データがpending状態です！！！");
        return false;
    }
    return holidayData.hasOwnProperty(formattedDate);
}

// 平日かどうかを判定
function isWeekday(day: string) {
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day);
}

// 次の曜日を取得する関数（祝日も「日曜日」として扱う）
function getNextDay(currentDay: string, currentDate: Date, holidayData: Holidays) {
    let nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    if (isHoliday(nextDate, holidayData)) {
        return "Sunday"; // 祝日を日曜日と扱う
    }
    const nextDayIndex = (dayIndices.indexOf(currentDay) + 1) % 7;
    return dayIndices[nextDayIndex];
}

// 祝日も日曜日とする
function getPreviousDay(currentDay: string, currentDate: Date, holidayData: Holidays) {
    let previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);
    if (isHoliday(previousDate, holidayData)) {
        return "Sunday";
    }
    const previousDayIndex = mod((dayIndices.indexOf(currentDay) - 1), 7);
    return dayIndices[previousDayIndex];
}

// 次のバスを検索
function findBuses(args: {
    timeTable: TimeTable, holidayData: Holidays, busesLength: number,
    currentDay: string, currentHour: number, currentMinutes: number, currentDate: Date
}) {

    const { holidayData, currentDay, currentHour, currentMinutes, currentDate, busesLength } = args;
    let { timeTable } = args;
    const nowInMinutes = toMinutes(currentHour, currentMinutes);
    let findedBuses = [];
    // 現在の曜日のバスを取得
    let dayToCheck: string;
    if (isHoliday(currentDate, holidayData)) {
        dayToCheck = "Sunday"
    } else {
        dayToCheck = currentDay;
    }
    let dateToCheck = currentDate;
    if (busesLength < 0) {
        timeTable.reverse();
    }
    // バスが見つかるまで次の日に進む   
    for (let i = 0; i < 7; i++) {
        // 以前のバスを取得する場合には時刻表を前後逆にする
        const busesForDay = timeTable.filter(bus =>
            bus.day === dayToCheck || (isWeekday(dayToCheck) && bus.day === "weekday")
        );
        for (let bus of busesForDay) {
            const busLeaveTime = toMinutes(bus.leaveHour, bus.leaveMinute);

            // 現在の曜 日かつ未来/過去のバス、または翌日/前日のバス
            if (busesLength > 0) {
                if (i > 0 || timeDifference(nowInMinutes, busLeaveTime) >= 0) {
                    findedBuses.push(bus);
                }
            } else if (busesLength < 0) {
                if (i > 0 || timeDifference(nowInMinutes, busLeaveTime) < 0) {
                    findedBuses.push(bus)
                }
            }
            else {
                return [];
            }
            if (findedBuses.length >= Math.abs(busesLength)) {
                return findedBuses;
            }
        }
        // 次の日に進む
        dayToCheck = (busesLength > 0 ? getNextDay(dayToCheck, dateToCheck, holidayData) : getPreviousDay(dayToCheck, dateToCheck, holidayData));
        dateToCheck.setDate(dateToCheck.getDate() + (busesLength > 0 ? 1 : -1));
    }
    return findedBuses;
}

// `hh:mm` を分単位に変換する関数
const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

// 分単位を `hh:mm` に戻す関数
const minutesToTime = (minutes: number) => {
    const hours = String(Math.floor(minutes / 60));
    const mins = String(minutes % 60).padStart(2, "0");
    return `${hours}:${mins}`;
};

const mod = (a: number, b: number) => {
    return ((a % b) + b) % b;
}

export { findBuses, dayIndices, timeToMinutes, minutesToTime, isHoliday }
