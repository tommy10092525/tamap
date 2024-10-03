const API = "https://holidays-jp.github.io/api/v1/date.json"
fetch(API).then(res => res.json())
    .then(data => {
        console.log(JSON.stringify(data))
    }).catch(error => {
        console.log(error)
    }).finally(() => {
        console.log("終わり")
    })