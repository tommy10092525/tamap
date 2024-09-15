"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "../../public/images/Tamap_logo.png"
import mapImage from "../../public/images/Map.png"
import { initialize } from "next/dist/server/lib/render-server";
import useSWR from "swr";
import { Life_Savers } from "next/font/google";

const timeTableAPI = "/api/timetable";
const inquiryURL = "https://docs.google.com/forms/d/17Le4TKOCQyZleSlCIYQmPKOnAgT80iTY6W4h2aON1_Y/viewform?edit_requested=true";

// 時刻表型の定義
type TimeTable = {
  [direction: string]: {
    [station: string]: { arrive: string, leave: string }[]
  }
}


type Buildings = {
  [key: string]: number;
}

type StationNames = {
  [station: string]: string;
}

type Caption = {
  [key: string]: string | { arrive: string; leave: string };
}

// 書式設定
type Style = {
  [station: string]: {}
}

// APIへのフェッチャー
const fetcher = async (key: string) => {
  return fetch(key).then((res) => res.json() as Promise<TimeTable | null>);
}

export default function Home() {

  //自動更新
  let [date, setDate] = useState(new Date(`2000/1/1 ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`));

  // https://qiita.com/iwakeniwaken/items/3c3e212599e411da54e2
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(_ => new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { data, error, isLoading } = useSWR(timeTableAPI, fetcher);

  let [userInput, setUserInput] = useState({ direction: "isComingToHosei", station: "nishihachioji" });

  // ページ読み込み時の処理
  useEffect(() => {
    if (localStorage.getItem("firstAccessed") === "false") {
      // ２回目以降のアクセスにはlocalStorageから入力を復元する
      let direction: string | null = localStorage.getItem("direction");
      let station: string | null = localStorage.getItem("station");
      if ("string" === typeof direction && "string" === typeof station) {
        setUserInput({ direction: direction, station: station });
      } else {
        alert("localStorageのエラー");
      }
    } else {
      // 初回アクセス時にはlocalStorageに必要な値を格納する
      localStorage.setItem("firstAccessed", "false");
      localStorage.setItem("direction", "isComingToHosei");
      localStorage.setItem("station", "nishihachioji");
    }
  }, [])

  let caption: Caption | null;

  let times;
  if (!isLoading && !!data) {
    //表示する時刻の算出
    let hours = String(date.getHours()).padStart(2, "0");
    let minutes = String(date.getMinutes()).padStart(2, "0");
    let selected = data[userInput.direction][userInput.station];
    let time = `${hours}:${minutes}`;
    const buildings: Buildings = {
      economics: 5,
      health: 4,
      sport: 8,
      gym: 15,
    };
    // 現在時刻をもとに時刻表から二分探索する
    let n = lowerBound(selected.map(item => timeToMinutes(item.leave)), timeToMinutes(time));
    times = {
      first: selected[n % selected.length],
      second: selected[(n + 1) % selected.length]
    }
    times.first = selected[n % selected.length];

    caption = {
      economics: "",
      gym: "",
      health: "",
      left: "",
      right: "",
      sport: ""
    }
    for (let key in buildings) {
      if (userInput.direction === "isComingToHosei") {
        caption[key] = minutesToTime(buildings[key] + timeToMinutes(selected[n % selected.length].arrive));
      } else {
        caption[key] = "--:--";
      }
    }
    let stationNames: StationNames = { nishihachioji: "西八王子", mejirodai: "めじろ台", aihara: "相原" };


    if (userInput.direction === "isComingToHosei") {
      caption.left = stationNames[userInput.station];
      caption.right = "法政大学"
    } else {
      caption.right = stationNames[userInput.station];
      caption.left = "法政大学";
    }
  } else {
    caption = {
      first: { leave: "loading", arrive: "loading" },
      second: { leave: "loading", arrive: "loading" },
      economics: "loading",
      gym: "loading",
      health: "loading",
      left: "loading",
      right: "loading",
      sport: "loading"
    }
    times = {
      first: { arrive: "loading", leave: "loading" },
      second: { arrive: "loading", leave: "loading" }
    }
  }

  let style: Style = { nishihachioji: {}, mejirodai: {}, aihara: {} };
  if(!isLoading){
    // 選択されている駅のボタンの書式を変える
    style[userInput.station] = { backgroundColor: "rgba(255, 255, 255, 0.658)" };
  }

  // API取得にエラーが生じた場合エラーをコンソールに吐く
  if (error) {
    console.log(error);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen p-4 bg-gradient-to-br to-blue-300 from-orange-300">
      <Image
        className="pb-3"
        style={{ width: "60%" }}
        src={logo}
        height={274}
        alt="たまっぷのロゴ"
      />
      <div className="w-4/5 border-r-slate-400 border-b-bg-slate-600 rounded-md bg-white bg-opacity-40">
        <div className="text-center justify-center text-2xl font-bold pt-4">
          <p>{`${caption.left}→${caption.right}`}</p>
        </div>
        <div className="flex justify-center mx-0 text-center text-4xl font-bold">
          <p className="px-1">{String(times.first.leave)}</p>
          <p className="px-1">{String(times.first.arrive)}</p>
        </div>
        <div className="flex justify-center mx-0 text-center text-2xl font-bold opacity-50">
          <p className="px-1">{String(times.second.leave)}</p>
          <p className="px-1">{String(times.second.arrive)}</p>
        </div>
        <div className="inline-flex text-center items-center mx-auto font-bold w-full">
          {/* ボタンが押されたら状態を書き換える */}
          <button className="m-2 border-r-slate-400 border-b-bg-slate-600 rounded-md bg-white bg-opacity-40 w-full" onClick={() => {
            if (userInput.direction === "isComingToHosei") {
              let nextUserInput = structuredClone(userInput);
              nextUserInput.direction = "isLeavingFromHosei";
              setUserInput(nextUserInput);
              localStorage.setItem("direction", "isLeavingFromHosei")
            } else {
              let nextUserInput = structuredClone(userInput);
              nextUserInput.direction = "isComingToHosei";
              setUserInput(nextUserInput);
              localStorage.setItem("direction", "isComingToHosei")
            }
          }}>
            <p className="">入れ替え</p></button>
          <button className="m-2 border-r-slate-400 border-b-bg-slate-600 rounded-md bg-white bg-opacity-40 w-full">
            <a href={inquiryURL}><p>ご意見</p></a>
          </button>
        </div>
      </div>
      <div className="w-4/5 p-5 mx-0 my-5 rounded-md bg-white bg-opacity-30 border-opacity-40 border-r-slate-500 border-b-slate-600 backdrop-blur-xl">
        <Image
          className="w-full"
          src={mapImage}
          width={500}
          height={500}
          alt="地図" />
        <div className="rounded-md">
          <div className="w-1/4 top-4 left-2/3 rounded-md absolute text-5xl font-medium text-center bg-white bg-opacity-40 border-r-white border-b-white border-opacity-40">
            <p className="text-lg font-semibold">社会学部</p>
            <p className="text-lg font-semibold">{String(caption.health)}</p>
          </div>
          <div className="w-1/4 top-4 rounded-md absolute text-5xl font-medium text-center bg-white bg-opacity-40 border-r-white border-b-white border-opacity-40">
            <p className="text-lg font-semibold">経済学部</p>
            <p className="text-lg font-semibold">{String(caption.economics)}</p>
          </div>
          <div className="w-1/4 top-2/3 rounded-md absolute text-5xl font-medium text-center bg-white bg-opacity-40 border-r-white border-b-white border-opacity-40">
            <p className="text-lg font-semibold">体育館</p>
            <p className="text-lg font-semibold">{String(caption.gym)}</p>
          </div>
          <div className="w-1/4 top-2/3 left-2/3 rounded-md absolute text-5xl font-medium text-center bg-white bg-opacity-40 border-r-white border-b-white border-opacity-40">
            <p className="text-lg font-semibold">スポ健</p>
            <p className="text-lg font-semibold">{String(caption.sport)}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center text-center mb-5 flex-row">
        {/* ボタンが押されたら状態を書き換える */}
        <button className="w-20 mx-2 my-auto font-bold p-2 bg-white bg-opacity-30 border-r-gray-500 border-b-gray-600 rounded-md box-border"
          style={style.nishihachioji} onClick={() => {
          let nextUserInput = structuredClone(userInput);
          nextUserInput.station = "nishihachioji";
          setUserInput(nextUserInput);
          localStorage.setItem("station", "nishihachioji");
        }}><p>西八王子</p></button>
        <button className="w-20 mx-2 my-auto font-bold p-2 bg-white bg-opacity-30 border-r-gray-500 border-b-gray-600 rounded-md box-border"
          style={style.mejirodai} onClick={() => {
          let nextUserInput = structuredClone(userInput);
          localStorage.setItem("station", "mejirodai");
          nextUserInput.station = "mejirodai";
          setUserInput(nextUserInput);
        }}><p>めじろ台</p></button>
        <button className="w-20 mx-2 my-auto font-bold p-2 bg-white bg-opacity-30 border-r-gray-500 border-b-gray-600 rounded-md box-border"
          style={style.aihara} onClick={() => {
          let nextUserInput = structuredClone(userInput);
          localStorage.setItem("station", "aihara");
          nextUserInput.station = "aihara";
          setUserInput(nextUserInput);
        }}><p>相原</p></button>
      </div>
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
