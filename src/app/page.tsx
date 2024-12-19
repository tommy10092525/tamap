"use client";
import { useCallback, useEffect, useMemo, useState as rerender, useState } from "react";
import useSWR from "swr";

import { Buildings, BusTime, Caption, Style } from "../app/components/Types"
import TimeCaption from "./components/TimeCaption";
import StationSwitch from "./components/StationSwitch";
import MapCaption from "./components/MapCaption";
import DiscountInformation from "./components/DiscountInformation";
import Logo from "./components/Logo";
import LinkBox from "./components/LinkBox";
import { dayIndices, findBuses, minutesToTime, } from "./features/timeHandlers";
import { buildings, holidaysAPI, GoogleForm, stationNames, timeTableAPI, Instagram, codematesHP } from "@/constants/settings";
import { initializeCaption, holidaysFetcher, timeTableFetcher } from "./features/utilities";
import GradationContainer from "./components/GradationContainer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cell, Column, Row, Table, TableBody, TableHeader } from 'react-aria-components';
import {Card} from "@/components/ui/card"


// 現在の時刻と曜日を取得

const Home = () => {
  const now = new Date();
  const currentDayIndex = now.getDay();
  const currentDay = dayIndices[currentDayIndex];
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  const [_, rerender] = useState([]);

  const { data: holidayData, error: holidayError, isLoading: isHolidayLoading } = useSWR(holidaysAPI, holidaysFetcher);
  let { data: timeTable, error: timeTableError, isLoading: isTimeTableLoading } = useSWR(timeTableAPI, timeTableFetcher);


  let [userInput, setUserInput] = useState({ isComingToHosei: true, station: "nishihachioji", showModal: false });
  const initializeUserInput = () => {
    if (localStorage.getItem("firstAccessed") === "false") {
      // ２回目以降のアクセスにはlocalStorageから入力を復元する
      let isComingToHosei: string | null = localStorage.getItem("isComingToHosei");
      let station: string | null = localStorage.getItem("station");
      if ("string" === typeof isComingToHosei && "string" === typeof station) {
        setUserInput(prev => {
          prev.isComingToHosei = isComingToHosei === "true";
          prev.station = station;
          return prev;
        });
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
  console.log(userInput);

  // ページ読み込み時の処理
  // https://qiita.com/iwakeniwaken/items/3c3e212599e411da54e2
  useEffect(() => {
    rerender([]);
    const interval = setInterval(() => {
      rerender(prev => []);
    }, 1000);
    initializeUserInput();
    return () => clearInterval(interval);
  }, [])

  let caption: Caption;
  let futureBuses: BusTime[];
  let previousBuses: BusTime[];

  if (!isTimeTableLoading && !!timeTable && !isHolidayLoading && !!holidayData) {
    // 駅と方向から絞る
    timeTable = timeTable
      .filter(item => item.isComingToHosei == userInput.isComingToHosei && item.station == userInput.station);
    futureBuses = findBuses({
      timeTable,
      holidayData,
      currentDay,
      currentHour,
      currentMinutes,
      currentDate: now,
      busesLength: 5
    });
    previousBuses = findBuses({
      timeTable,
      holidayData,
      currentDay,
      currentHour,
      currentMinutes,
      currentDate: now,
      busesLength: -4
    });
  } else {
    futureBuses = [];
    previousBuses = [];
  }
  caption = useMemo(() => initializeCaption({
    userInput,
    minutesToTime,
    futureBuses,
    previousBuses,
    isLoading: isHolidayLoading || isTimeTableLoading
  }), [futureBuses, previousBuses, userInput, isHolidayLoading, isTimeTableLoading]);
  // API取得にエラーが生じた場合エラーをコンソールに吐く
  if (timeTableError) {
    console.log(timeTableError);
  }

  const handleDirectionChange = () => {
    setUserInput(prev => {
      let next = structuredClone(prev);
      if (next.isComingToHosei) {
        next.isComingToHosei = false;
        localStorage.setItem("isComingToHosei", "false")
      } else {
        next.isComingToHosei = true;
        localStorage.setItem("isComingToHosei", "true")
      }
      return next;
    })
  }

  const handleShowModalChange = () => {
    setUserInput(prev => {
      let next = structuredClone(prev);
      next.showModal = !next.showModal;
      return next;
    })
  }

  const handleStationChange = (station: string) => {
    setUserInput(prev => {
      let next = structuredClone(prev);
      next.station = station;
      next.showModal = false;
      return next;
    })
    localStorage.setItem("station", station);
  }


  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-bl from-sky-500 to-orange-300 p-5 min-h-screen dark:text-black">
      <div className="max-w-screen-sm">
        <Logo />
        <TimeCaption
          caption={caption}
          isLoading={isTimeTableLoading || isHolidayLoading}
          handleDirectionChange={handleDirectionChange}
        />
        <StationSwitch
          isLoading={isHolidayLoading || isTimeTableLoading}
          userInput={userInput}
          handleShowModalChange={handleShowModalChange}
          handleStationChange={handleStationChange}
        />
        <MapCaption
          caption={caption}
          isLoading={isTimeTableLoading || isHolidayLoading}
        />
        <DiscountInformation text="飲食店割引はこちら" />

        <div className="flex flex-wrap justify-center w-full">
          <div className="px-1 w-1/2">
            <Button className="float-left bg-white hover:bg-white bg-opacity-50 hover:bg-opacity-50 shadow mx-1 mb-1 rounded-md w-full font-bold text-black text-center">
              <Link href={GoogleForm} className="w-full">アプリご意見</Link>
            </Button>
          </div>
          <div className="px-1 w-1/2">
            <Button className="float-left bg-white hover:bg-white bg-opacity-50 hover:bg-opacity-50 shadow mx-1 mb-1 rounded-md w-full font-bold text-black text-center" onClick={async () => {
              try {
                await navigator.share({
                  title: "たまっぷ!(Next.js)",
                  text: codematesHP.concat("tamap/")
                });
              } catch (error) {
                console.log("Error sharing:", error);
              }
            }}>アプリを共有</Button>
          </div>
          <div className="px-1 w-1/2">
            <Button className="float-left bg-white hover:bg-white bg-opacity-50 hover:bg-opacity-50 shadow mx-1 mb-1 rounded-md w-full font-bold text-black text-center">
              <Link href={codematesHP} className="w-full">CODE MATESとは</Link>
            </Button>
          </div>
          <div className="px-1 w-1/2">
            <Button className="float-left bg-white hover:bg-white bg-opacity-50 hover:bg-opacity-50 shadow mx-1 mb-1 rounded-md w-full font-bold text-black text-center">
              <Link href={Instagram} className="w-full">Instagram</Link>
            </Button>
          </div>
        </div>
        <p className="text-center text-xs">時刻は目安であり、交通状況等によって変わる可能性があります。また臨時便等には対応しておりません。</p>
        <p className="flex justify-center items-center text-center text-lg">©CODE MATES︎</p>
      </div>
    </div>
  );
}

export default Home;