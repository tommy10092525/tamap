"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "../../public/images/tamap_logo.png"
import mapImage from "../../public/images/Map.png"
import { initialize } from "next/dist/server/lib/render-server";
import useSWR from "swr";
import { Life_Savers } from "next/font/google";

const timeTableAPI = "http://localhost:3000/api/timetable";
const inquiryURL = "https://docs.google.com/forms/d/17Le4TKOCQyZleSlCIYQmPKOnAgT80iTY6W4h2aON1_Y/viewform?edit_requested=true";

type TimeTable = {
  [direction: string]: {
    [station: string]: { arrive: string, leave: string }[]
  }
}

type Times = {
  first: {
    arrive: string,
    leave: string
  }, second: {
    arrive: string,
    leave: string
  }
}

const fetcher = async (key: string) => {
  return fetch(key).then((res) => res.json() as Promise<TimeTable | null>);
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

  // ユーズステート
  let [userInput, setUserInput] = useState({ direction: "isComingToHosei", station: "nishihachioji" });

  useEffect(() => {
    if (localStorage.getItem("firstAccessed") === "false") {
      let direction: string | null = localStorage.getItem("direction");
      let station: string | null = localStorage.getItem("station");
      if ("string" === typeof direction && "string" === typeof station) {
        setUserInput({ direction: direction, station: station });
      } else {
        alert("localStorageのエラー");
      }
    } else {
      localStorage.setItem("firstAccessed", "false");
      localStorage.setItem("direction", "isComingToHosei");
      localStorage.setItem("station", "nishihachioji");
    }
  }, [])

  let caption: Caption | null;

  // 2024年9月5日16時06分
  // 依存関係を明確にする
  // ユーザ入力、API、sessionStorageからの取得による更新処理
  let times;
  if (!isLoading && data !== undefined && data !== null) {
    //表示の計算
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
    let n = lowerBound(selected.map(item => timeToMinutes(item.leave)), timeToMinutes(time));
    times= {
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
    times={
      first:{arrive:"loading",leave:"loading"},
      second:{arrive:"loading",leave:"loading"}}
    }

  // 書式設定
  type Style = {
    [station: string]: {}
  }
  let style: Style = { nishihachioji: {}, mejirodai: {}, aihara: {} };
  style[userInput.station] = { backgroundColor: "rgba(255, 255, 255, 0.658)" };

  if (error !== undefined) {
    console.log(error);
  }
  console.log({ caption: caption });

  return (
    <div className="">
      <div className="top">
        <Image
          style={{ width: "60%" }}
          src={logo}
          height={274}
          alt="たまっぷのロゴ"
        />
      </div>
      <div className="glass">
        <div className="direction">
          <p>{String(caption.left)}</p>
          <div className="direction_arrow"></div>
          <p>{String(caption.right)}</p>
        </div>
        <div className="first">
          <p>{String(times.first.leave)}</p>
          <p>{String(times.first.arrive)}</p>
        </div>
        <div className="second">
          <p>{String(times.second.leave)}</p>
          <p>{String(times.second.arrive)}</p>
        </div>
        <div className="menu">
          <button className="button" onClick={() => {
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
          }}>入れ替え</button>
          <button className="button">
            <a href={inquiryURL}>ご意見</a>
          </button>
        </div>
      </div>
      <div className="map">
        <Image
          src={mapImage}
          width={828}
          height={500}
          alt="地図" />
        <div className="map-container">
          <div className="overlay-health">
            <p>社・現福</p>
            <p>{String(caption.health)}</p>
          </div>
          <div className="overlay-economics">
            <p>経済</p>
            <p>{String(caption.economics)}</p>
          </div>
          <div className="overlay-gym">
            <p>体育館</p>
            <p>{String(caption.gym)}</p>
          </div>
          <div className="overlay-sport">
            <p>スポ健康</p>
            <p>{String(caption.sport)}</p>
          </div>
        </div>
      </div>

      <div className="tab-container">
        <button className="tab-btn" style={style.nishihachioji} onClick={() => {
          let nextUserInput = structuredClone(userInput);
          nextUserInput.station = "nishihachioji";
          setUserInput(nextUserInput);
          localStorage.setItem("station", "nishihachioji");
        }}>西八王子</button>
        <button className="tab-btn" style={style.mejirodai} onClick={() => {
          let nextUserInput = structuredClone(userInput);
          localStorage.setItem("station", "mejirodai");
          nextUserInput.station = "mejirodai";
          setUserInput(nextUserInput);
        }}>めじろ台</button>
        <button className="tab-btn" style={style.aihara} onClick={() => {
          let nextUserInput = structuredClone(userInput);
          localStorage.setItem("station", "aihara");
          nextUserInput.station = "aihara";
          setUserInput(nextUserInput);
        }}>相原</button>
      </div>
      <p className="codemates">©CODE MATES︎</p>
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

const lowerBound = (arr: Array<number>, n: number) => {
  let first = 0, last = arr.length - 1, middle;
  while (first <= last) {
    middle = 0 | (first + last) / 2;
    if (arr[middle] < n) first = middle + 1;
    else last = middle - 1;
  }
  return first;
}

// const upperBound = (arr, n) => {
//     let first = 0, last = arr.length - 1, middle;
//     while (first <= last) {
//         middle = 0 | (first + last) / 2;
//         if (arr[middle] <= n) first = middle + 1;
//         else last = middle - 1;
//     }
//     return first;
// }
