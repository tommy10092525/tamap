// 時刻表型の定義

type BusTime={
    day: string;
    isComingToHosei: boolean;
    station: string;
    leaveHour: number;
    leaveMinute: number;
    arriveHour: number;
    arriveMinute: number;
    otherInformation: string
  }
  
  type TimeTable = BusTime[]
  
  type Buildings = {
    [key: string]: number;
  }
  
  type StationNames = {
    [station: string]: string;
  }
  
  type Caption = {
    [key: string]: string;
  }
  
  type Style = {
    [station: string]: {}
  }
  
  type Holidays = {
    [date: string]: string;
  }
  
  type UserInput={
    isComingToHosei:boolean;
    station:string;
    showModal:boolean;
  }
  
  
  
  type StationSwitchProps={
    userInput:UserInput,
    timeTableIsLoading:boolean,
    style:Style,
    handleShowModalChange:()=>void
    handleStationChange:(station:string)=>void
  }
  
  type MapProps={
    isLoading:boolean,caption:Caption;
  }
  
  type ModalProps={
    handleStationChange:(station:string)=>void;
    style:Style
  }

export type {BusTime,TimeTable,Buildings,StationNames,Caption,Style,Holidays,UserInput,StationSwitchProps,MapProps,ModalProps}