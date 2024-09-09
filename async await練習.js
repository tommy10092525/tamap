const url="http://localhost:3000/api/timetable"
const resoleveSample=async ()=>{
    return "resolve!!";
}


const sample=async ()=>{
    const result=await (await fetch(url)).json();
    // console.log(JSON.stringify(result))
    console.log("APIから取得完了")
}

sample()

console.log("終わり")