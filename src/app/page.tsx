"use client";
import Image from "next/image";
import { useCallback, useEffect, useState, useMemo } from "react";
import useSWR from "swr";

import { Buildings, BusTime, Caption, Holidays, StationNames, Style, TimeTable, UserInput } from "../app/components/Types"
import Card from "./components/Card";
import TimeCaption from "./components/TimeCaption";
import StationSwitch from "./components/StationSwitch";
import Map from "./components/Map";
import DiscountInformation from "./components/DiscountInformation";
import Logo from "./components/Logo";
import LinkBox from "./components/LinkBox";
import { dayIndices, findNextBuses, holidaysFetcher, minutesToTime,  timeTableFetcher,} from "./features/functions";
import {holidaysAPI, inquiryURL, stationNames, timeTableAPI } from "@/constants/definitation";


// 現在の時刻と曜日を取得

export default function Home() {
  const now = new Date();
  const currentDayIndex = now.getDay();
  const currentDay = dayIndices[currentDayIndex];
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  
  const { data: holidayData, error: holidayError, isLoading: holidayIsLoading } = useSWR(holidaysAPI, holidaysFetcher);
  const { data: timeTable, error: timeTableError, isLoading: timeTableIsLoading } = useSWR(timeTableAPI, timeTableFetcher);

  let [userInput, setUserInput] = useState({ isComingToHosei: true, station: "nishihachioji", showModal: false });
  let [_, setNow] = useState(new Date(`2000/1/1 ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`));

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
  let firstBus: BusTime | null;
  let secondBus: BusTime | null;
  let style: Style = { nishihachioji: {}, mejirodai: {}, aihara: {} };

  if (!timeTableIsLoading && !!timeTable && !holidayIsLoading && !!holidayData) {
    // 駅と方向から絞る
    let targetTimes = timeTable
      .filter(item => item.isComingToHosei == userInput.isComingToHosei && item.station == userInput.station)
    const arr = findNextBuses(targetTimes,holidayData, currentDay, currentHour, currentMinutes, now);
    firstBus = arr[0];
    secondBus = arr[1];

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
  } else {
    caption = {
      economics: "loading",
      gym: "loading",
      health: "loading",
      left: "loading",
      right: "loading",
      sport: "loading"
    }
    firstBus = null
    secondBus = null
  }

  if (!timeTableIsLoading && !holidayIsLoading) {
    // 選択されている駅のボタンの書式を変える
    style[userInput.station] = {color:"blue"};
  }

  // API取得にエラーが生じた場合エラーをコンソールに吐く
  if (timeTableError) {
    console.log(timeTableError);
  }

  const handleDirectionChange = () => {
    if (userInput.isComingToHosei) {
      let nextUserInput = structuredClone(userInput);
      nextUserInput.isComingToHosei = false;
      setUserInput(nextUserInput);
      localStorage.setItem("isComingToHosei", "false")
    } else {
      let nextUserInput = structuredClone(userInput);
      nextUserInput.isComingToHosei = true;
      setUserInput(nextUserInput);
      localStorage.setItem("isComingToHosei", "true")
    }
  }

  const handleShowModalChange = () => {
    let nextUserInput = structuredClone(userInput);
    nextUserInput.showModal = !nextUserInput.showModal;
    setUserInput(nextUserInput);
  }

  const handleStationChange = (station: string) => {
    let nextUserInput = structuredClone(userInput);
    nextUserInput.station = station;
    nextUserInput.showModal = false;
    setUserInput(nextUserInput);
    localStorage.setItem("station", station);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 to-orange-300 dark:from-orange-400 dark:to-indigo-600 p-5">
      <div className="max-w-screen-sm">
        <Logo />
        <TimeCaption
          caption={caption}
          firstBus={firstBus}
          secondBus={secondBus}
          isLoading={timeTableIsLoading || holidayIsLoading}
          handleDirectionChange={handleDirectionChange}
          minutesToTime={minutesToTime}
        />
        <StationSwitch
          isLoading={holidayIsLoading || timeTableIsLoading}
          userInput={userInput}
          handleShowModalChange={handleShowModalChange}
          handleStationChange={handleStationChange}
          style={style}
        />
        <Map
          caption={caption}
          isLoading={timeTableIsLoading || holidayIsLoading}
        />
        <DiscountInformation text="飲食店割引はこちらから" />

        <div className="flex flex-wrap justify-center w-full">
          {[
            <a key={null} href={inquiryURL}>アプリご意見</a>,
            "アプリを共有",
            "CODE MATESとは",
            "Instagram"].map(item => <LinkBox key={null}>{item}</LinkBox>)
          }
        </div>
        <p className="text-xs">時間は目安であり、交通状況等により変わることがあります。利用上の注意を読む→</p>
        <p className="flex justify-center items-center text-center text-lg">©CODE MATES︎</p>
      </div>
    </div>
  );
}
