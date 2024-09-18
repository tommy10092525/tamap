"use client";
import Image from "next/image";
import { Children, useEffect, useState } from "react";
import logo from "../../public/images/Tamap_logo.png"

import useSWR from "swr";
import { ReactNode, FC } from "react";

import {Buildings,BusTime,Caption,Holidays,MapProps,ModalProps,StationNames,StationSwitchProps,Style,TimeTable,UserInput} from "../app/components/Types"
import TimeCaption from "./components/TimeCaption";
import StationSwitch from "./components/StationSwitch";
import Map from "./components/Map";
import DiscountInformation from "./components/DiscountInformation";

const timeTableAPI = "/api/timetable";
const holydaysAPI = "https://holidays-jp.github.io/api/v1/date.json"
const inquiryURL = "https://docs.google.com/forms/d/17Le4TKOCQyZleSlCIYQmPKOnAgT80iTY6W4h2aON1_Y/viewform?edit_requested=true";



const holidaysFetcher = async (key: string) => {
  return fetch(key).then(res => res.json() as Promise<Holidays>)
}

// 時刻表APIへのフェッチャー
const timeTableFetcher = async (key: string) => {
  return fetch(key).then((res) => res.json() as Promise<TimeTable | null>);
}

const stationNames:StationNames = { nishihachioji: "西八王子", mejirodai: "めじろ台", aihara: "相原" };


export default function Home() {
  // 曜日ごとの配列インデックス
  const dayIndices = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // 現在の時刻と曜日を取得
  const now = new Date();
  const currentDayIndex = now.getDay();
  const currentDay = dayIndices[currentDayIndex];
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const { data: holidayData, error: holidayError, isLoading: holidayIsLoading } = useSWR(holydaysAPI, holidaysFetcher);
  const { data: timeTable, error: timeTableError, isLoading: timeTableIsLoading } = useSWR(timeTableAPI, timeTableFetcher);

  let [userInput, setUserInput] = useState({ isComingToHosei: true, station: "nishihachioji", showModal: false });
  let [_, setNow] = useState(new Date(`2000/1/1 ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`));

  // 時刻を数値に変換するヘルパー関数（分単位）
  function toMinutes(hour: number, minutes: number) {
    return hour * 60 + minutes;
  }

  // 指定された時刻（分）との差を計算
  function timeDifference(nowInMinutes: number, busInMinutes: number) {
    return busInMinutes - nowInMinutes;
  }

  // 日付が祝日かどうかを判定
  function isHoliday(date: Date) {
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
  function getNextDay(currentDay: string, currentDate: Date) {
    let nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    if (isHoliday(nextDate)) {
      return "Sunday"; // 祝日を日曜日と扱う
    }

    const nextDayIndex = (dayIndices.indexOf(currentDay) + 1) % 7;
    return dayIndices[nextDayIndex];
  }

  // 次のバスを検索
  function findNextBuses(timetable: TimeTable, currentDay: string, currentHour: number, currentMinutes: number, currentDate: Date) {
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
      dayToCheck = getNextDay(dayToCheck, dateToCheck);
      dateToCheck.setDate(dateToCheck.getDate() + 1);
    }

    return nextBuses;
  }

  const initializeUserInput = () => {
    console.log(JSON.stringify(localStorage))
    if (localStorage.getItem("firstAccessed") === "false") {
      // ２回目以降のアクセスにはlocalStorageから入力を復元する
      let isComingToHosei: string | null = localStorage.getItem("isComingToHosei");
      let station: string | null = localStorage.getItem("station");
      if ("string" === typeof isComingToHosei && "string" === typeof station) {
        setUserInput({ isComingToHosei: true, station: station, showModal: false });
      } else {
        alert("localStorageのエラー");
      }
    } else {
      // 初回アクセス時にはlocalStorageに必要な値を格納する
      localStorage.setItem("firstAccessed", "false");
      localStorage.setItem("isComingToHosei", "true");
      localStorage.setItem("station", "nishihachioji");
    }
  }



  // ページ読み込み時の処理
  // https://qiita.com/iwakeniwaken/items/3c3e212599e411da54e2
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(_ => new Date());
    }, 1000);
    initializeUserInput();
    return () => clearInterval(interval);
  }, [])

  let caption: Caption | null;
  let firstBus:BusTime|null,secondBus:BusTime|null;
  if (!timeTableIsLoading && !!timeTable && !holidayIsLoading && !!holidayData) {
    // 駅と方向から絞る
    let targetTimes = timeTable
      .filter(item => item.isComingToHosei == userInput.isComingToHosei && item.station == userInput.station)
    const arr=findNextBuses(targetTimes,currentDay,currentHour,currentMinutes,now);
    firstBus=arr[0];
    secondBus=arr[1];

    const buildings: Buildings = {
      economics: 5,
      health: 4,
      sport: 8,
      gym: 15,
    };
    caption = {
      economics: "",
      gym: "",
      health: "",
      left: "",
      right: "",
      sport: ""
    }

    for (let key in buildings) {
      if (userInput.isComingToHosei) {
        caption[key] = minutesToTime(firstBus.arriveHour*60+firstBus.arriveMinute+buildings[key]);
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
  } else {
    caption = {
      economics: "loading",
      gym: "loading",
      health: "loading",
      left: "loading",
      right: "loading",
      sport: "loading"
    }
    firstBus=null
    secondBus=null
  }

  let style: Style = { nishihachioji: {}, mejirodai: {}, aihara: {} };
  if (!timeTableIsLoading) {
    // 選択されている駅のボタンの書式を変える
    style[userInput.station] = { backgroundColor: "rgba(255, 255, 255, 0.658)" };
  }

  // API取得にエラーが生じた場合エラーをコンソールに吐く
  if (timeTableError) {
    console.log(timeTableError);
  }

  const handleDirectionChange=()=>{
    if (userInput.isComingToHosei) {
      let nextUserInput = structuredClone(userInput);
      nextUserInput.isComingToHosei = false;
      setUserInput(nextUserInput);
      localStorage.setItem("isComingToHosei", "false")
    } else {
      let nextUserInput = structuredClone(userInput);
      nextUserInput.isComingToHosei =true;
      setUserInput(nextUserInput);
      localStorage.setItem("isComingToHosei", "true")
    }
  }

  const handleShowModalChange=()=>{
    let nextUserInput = structuredClone(userInput);
    nextUserInput.showModal = !nextUserInput.showModal;
    setUserInput(nextUserInput);
  }
  
  const handleStationChange=(station:string)=>{
    let nextUserInput = structuredClone(userInput);
    nextUserInput.station = station;
    nextUserInput.showModal = false;
    setUserInput(nextUserInput);
    localStorage.setItem("station", station);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 to-orange-300 p-5">
      <Image
        className="pb-3"
        style={{ width: "60%" }}
        src={logo}
        height={274}
        alt="たまっぷのロゴ"
      />

      <TimeCaption
        caption={caption}
        firstBus={firstBus}
        secondBus={secondBus}
        isLoading={timeTableIsLoading || holidayIsLoading}
        handleDirectionChange={handleDirectionChange}
        minutesToTime={minutesToTime}
      />
      <StationSwitch
        timeTableIsLoading={holidayIsLoading||timeTableIsLoading}
        userInput={userInput}
        handleShowModalChange={handleShowModalChange}
        handleStationChange={handleStationChange}
        style={style}
      />
      <Map
        caption={caption}
        isLoading={timeTableIsLoading || holidayIsLoading}
      />
      <DiscountInformation />

      <div className="flex flex-wrap justify-center w-full">
        <p className="font-bold mb-1 mx-1 w-5/12 bg-white bg-opacity-40 rounded-md shadow text-center">
          <a href={inquiryURL}>アプリご意見</a>
        </p>
        <p className="font-bold mb-1  mx-1 w-5/12 bg-white bg-opacity-40 rounded-md shadow text-center">アプリを共有</p>
        <p className="font-bold my-1 mx-1 w-5/12 bg-white bg-opacity-40 rounded-md shadow text-center">CODE MATESとは</p>
        <p className="font-bold my-1 mx-1 w-5/12 bg-white bg-opacity-40 rounded-md shadow text-center">Instagram</p>
      </div>
      <p className="text-xs">時間は目安であり、交通状況等により変わることがあります。利用上の注意を読む→</p>
      <p className="flex justify-center items-center text-center text-lg">©CODE MATES︎</p>
    </div>
  );
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

