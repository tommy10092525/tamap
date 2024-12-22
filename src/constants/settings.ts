import { Buildings, StationNames } from "@/app/components/Types";

const timeOfEquation=9
const timeTableAPI = "/api/timetable";
const holidaysAPI = "https://holidays-jp.github.io/api/v1/date.json"
const GoogleForm = "https://docs.google.com/forms/d/17Le4TKOCQyZleSlCIYQmPKOnAgT80iTY6W4h2aON1_Y/viewform?edit_requested=true";
const Instagram="https://www.instagram.com/codemates_hosei/"
const codematesHP="https://codemates123.github.io/homepage/"
const stationNames: StationNames = { nishihachioji: "西八王子", mejirodai: "めじろ台", aihara: "相原" };
const buildings: Buildings = {
    economics: 5,
    health: 4,
    sport: 8,
    gym: 15,
  };
const urls=[
  {
    station:"めじろ台",
    url:"https://codemates.lolitapunk.jp/tamap/templates/store_detail/fuji.html",
    storeName:"うどん屋 藤"},
  {station:"八王子",
    url:"https://codemates.lolitapunk.jp/tamap/templates/store_detail/hicheese.html",
    storeName:"チーズ料理 ハイチーズ Hi Cheese!"},
  {station:"西八王子",
    url:"https://codemates.lolitapunk.jp/tamap/templates/store_detail/goemon.html",
    storeName:"ラーメン店 吾衛門"},
  {station:"相原",
    url:"https://codemates.lolitapunk.jp/tamap/templates/store_detail/kokuterudou.html",
    storeName:"カフェ コクテル堂"
  }
]

export {timeTableAPI,holidaysAPI,GoogleForm,stationNames,buildings,Instagram,codematesHP,timeOfEquation,urls}