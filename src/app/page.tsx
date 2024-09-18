"use client";
import Image from "next/image";
import { Children, useEffect, useState } from "react";
import logo from "../../public/images/Tamap_logo.png"
import mapImage from "../../public/images/Map.png"
import useSWR from "swr";
import { ReactNode, FC } from "react";
import next from "next";

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

const stationNames: StationNames = { nishihachioji: "西八王子", mejirodai: "めじろ台", aihara: "相原" };


export default function Home() {

  //自動更新
  let [date, setDate] = useState(new Date(`2000/1/1 ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`));

  
  const { data, error, isLoading } = useSWR(timeTableAPI, fetcher);
  
  let [userInput, setUserInput] = useState({ direction: "isComingToHosei", station: "nishihachioji",showModal:false });
  
  // ページ読み込み時の処理
  // https://qiita.com/iwakeniwaken/items/3c3e212599e411da54e2
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(_ => new Date());
    }, 5000);


    if (localStorage.getItem("firstAccessed") === "false") {
      // ２回目以降のアクセスにはlocalStorageから入力を復元する
      let direction: string | null = localStorage.getItem("direction");
      let station: string | null = localStorage.getItem("station");
      if ("string" === typeof direction && "string" === typeof station) {
        setUserInput({ direction: direction, station: station,showModal:false });
      } else {
        alert("localStorageのエラー");
      }
    } else {
      // 初回アクセス時にはlocalStorageに必要な値を格納する
      localStorage.setItem("firstAccessed", "false");
      localStorage.setItem("direction", "isComingToHosei");
      localStorage.setItem("station", "nishihachioji");
    }
    return () => clearInterval(interval);
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
  if (!isLoading) {
    // 選択されている駅のボタンの書式を変える
    style[userInput.station] = { backgroundColor: "rgba(255, 255, 255, 0.658)" };
  }

  // API取得にエラーが生じた場合エラーをコンソールに吐く
  if (error) {
    console.log(error);
  }

  // コンポーネント
  const TimeCaption=()=>{
    return(
      <div className="w-full shadow rounded-md bg-white bg-opacity-40">
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
          <button className="my-2 mx-auto border-solid shadow rounded-md bg-white bg-opacity-40 w-1/2 text-center" onClick={() => {
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
            <p className="">(⇆)左右入替</p></button>
        </div>
        
      </div>
    )
  }

  const StationSwitch=()=>{
    return(
      <div className="my-3 shadow rounded-md bg-white bg-opacity-40 h-full p-2 w-full">
        <div className="inline-flex">
          <p className="font-bold text-xl">{isLoading ? "loading" : stationNames[userInput.station]}</p>
          {isLoading ? <></> : <p className="font-bold text-sm mt-2">のバス</p>}
        </div>
        <button
          className="w-1/2 float-right font-bold shadow rounded-md bg-white bg-opacity-40 p-1 text-center"
          onClick={()=>{
          let nextUserInput=structuredClone(userInput);
          nextUserInput.showModal=!nextUserInput.showModal;
          setUserInput(nextUserInput);
        }}>
        <p className=""
        >バスを変更</p>
        </button>
        {userInput.showModal ? <Modal/>:<></>}
      </div>
    )
  }

  const Modal=()=>{
    return(<div className="flex justify-center text-center w-full scroll-mb-36 mt-3">
      {/* ボタンが押されたら状態を書き換える */}
      <button className="w-2/5 my-auto font-bold p-2 rounded-md box-border
      bg-white bg-opacity-30 shadow"
        style={style.nishihachioji} onClick={() => {
          let nextUserInput = structuredClone(userInput);
          nextUserInput.station = "nishihachioji";
          nextUserInput.showModal=false;
          setUserInput(nextUserInput);
          localStorage.setItem("station", "nishihachioji");
        }}><p className="text-sm">西八王子</p></button>
      <button className="w-2/5 mx-2 my-auto font-bold p-2 rounded-md box-border
      bg-white bg-opacity-30 shadow"
        style={style.mejirodai} onClick={() => {
          let nextUserInput = structuredClone(userInput);
          localStorage.setItem("station", "mejirodai");
          nextUserInput.station = "mejirodai";
          nextUserInput.showModal=false;
          setUserInput(nextUserInput);
        }}><p className="text-sm">めじろ台</p></button>
      <button className="w-2/5 my-auto font-bold p-2 rounded-md box-border
      bg-white bg-opacity-30 shadow"
        style={style.aihara} onClick={() => {
          let nextUserInput = structuredClone(userInput);
          localStorage.setItem("station", "aihara");
          nextUserInput.station = "aihara";
          nextUserInput.showModal=false;
          setUserInput(nextUserInput);
        }}><p className="text-sm">相原</p></button>
    </div>)
  }

  const Map=()=>{
    return(
      <div className="w-full p-5 mx-0 rounded-md
        bg-white bg-opacity-30 border-opacity-40 shadow backdrop-blur-xl">
        <Image
          className="w-full"
          src={mapImage}
          width={500}
          height={500}
          alt="地図" />
        <div className="rounded-md">
          <div className="w-1/2 top-0 left-0 rounded-md absolute text-5xl font-medium text-center ml-2 mt-2
            bg-white bg-opacity-70 shadow">
            <p className="text-sm font-semibold">学部到達時刻目安</p>
          </div>
          <div className="w-1/3 top-1/3 left-1/2 rounded-md absolute text-5xl font-medium text-center mt-4 ml-8
            bg-white bg-opacity-70 shadow">
            <p className="text-sm font-semibold">{isLoading ? "loading" :`社会学部 ${caption.health}`}</p>
          </div>
          <div className="w-1/3 top-1/3 left-0 rounded-md absolute text-5xl font-medium text-center mt-4 ml-4
            bg-white bg-opacity-70 shadow">
            <p className="text-sm font-semibold">{isLoading ? "loading" :`経済学部 ${caption.economics}`}</p>
          </div>
          <div className="w-1/3 top-2/3 left-0 rounded-md absolute text-5xl font-medium text-center ml-4
            bg-white bg-opacity-70 shadow">
            <p className="text-sm font-semibold">{isLoading ? "loading" :`体育館 ${caption.gym}`}</p>
          </div>
          <p className="text-sm font-semibold"></p>
          <div className="w-1/3 top-2/3 left-1/2 rounded-md absolute text-5xl font-medium text-center ml-8
            bg-white bg-opacity-70 shadow">
            <p className="text-sm font-semibold">{isLoading ? "loading" :`スポ健 ${caption.sport}`}</p>
          </div>
        </div>
      </div>
    )
  }

  const DiscountInformation=()=>{
    return(
    <div className="bg-gradient-to-r bg-opacity-80 from-orange-400 to-purple-500 border-gray-300 border rounded-full shadow my-2">
        <p className="text-2xl m-3 font-semibold from-red-600 to-purple-700 bg-clip-text text-transparent tracking-widest bg-gradient-to-r">飲食店割引はこちら</p>
    </div>
    )
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

      <TimeCaption/>
      <StationSwitch/>
      <Map/>
      <DiscountInformation/>
      
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
