import { Holidays, TimeTable } from "../components/Types";


// 曜日ごとの配列インデックス
const dayIndices = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// 現在の時刻と曜日を取得
const now = new Date();
const currentDayIndex = now.getDay();


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
        alert("関数呼び出し順序の異常！！！");
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

// 次のバスを検索
function findNextBuses(timetable: TimeTable, holidayData: Holidays, currentDay: string, currentHour: number, currentMinutes: number, currentDate: Date) {
    const nowInMinutes = toMinutes(currentHour, currentMinutes);
    let nextBuses = [];

    // 現在の曜日のバスを取得
    let dayToCheck = currentDay;
    let dateToCheck = currentDate;

    // バスが見つかるまで次の日に進む
    for (let i = 0; i < 7; i++) {
        const busesForDay = timetable.filter(bus =>
            bus.day === dayToCheck || (isWeekday(dayToCheck) && bus.day === "weekday")
        );

        for (let bus of busesForDay) {
            const busLeaveTime = toMinutes(bus.leaveHour, bus.leaveMinute);

            // 現在の曜日かつ未来のバス、または翌日のバス
            if (i > 0 || timeDifference(nowInMinutes, busLeaveTime) >= 0) {
                nextBuses.push(bus);
            }

            if (nextBuses.length >= 2) {
                return nextBuses; // 2本のバスを見つけたら返す
            }
        }

        // 次の日に進む
        dayToCheck = getNextDay(dayToCheck, dateToCheck, holidayData);
        dateToCheck.setDate(dateToCheck.getDate() + 1);
    }

    return nextBuses;
}

// `hh:mm` を分単位に変換する関数
const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

// 分単位を `hh:mm` に戻す関数
const minutesToTime = (minutes: number) => {
    const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mins = String(minutes % 60).padStart(2, "0");
    return `${hours}:${mins}`;
};

// 二分探索用の関数
// https://qiita.com/oimo23/items/8c92aec97adc321c6cb0
const lowerBound = (arr: Array<number>, n: number) => {
    let first = 0, last = arr.length - 1, middle;
    while (first <= last) {
        middle = 0 | (first + last) / 2;
        if (arr[middle] < n) first = middle + 1;
        else last = middle - 1;
    }
    return first;
}

const holidaysFetcher = async (key: string) => {
    return fetch(key).then(res => res.json() as Promise<Holidays>)
  }
  
  // 時刻表APIへのフェッチャー
  const timeTableFetcher = async (key: string) => {
    return fetch(key).then((res) => res.json() as Promise<TimeTable | null>);
  }


export { findNextBuses, now, currentDayIndex, dayIndices, timeToMinutes, minutesToTime,holidaysFetcher,timeTableFetcher}