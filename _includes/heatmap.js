;



const dateEnd = new Date();
const  endStamp = dateEnd.getTime()
const dayEleId = Math.random().toString(16).substring(2);
let arr = _allyearurl.split('/');
arr.pop();
const jsonUrlBase = arr.join('/')


const ColumnsCount = 53;
const RowCount = 7;
const DayCount = (ColumnsCount - 1) * RowCount + dateEnd.getDay() + 1;

!function fillData(){
  let year = '' + dateEnd.getFullYear()
  let preYear = '' + (year - 1)
  fetch(_allyearurl)
  .then(r => r.json())
  .then(d=>{
    let yearCfg = d ;
    let arr = []
    if (yearCfg[year]) {
      arr.push(getYearData(year ))
    }

    if (yearCfg[preYear]) {
      arr.push(getYearData(preYear ))
    }
    Promise.all(arr).then(d2=>{
      console.log(d2)
      updateCell(d2[0])
      updateCell(d2[1])
      

    })
  })

  function getIndex(ymd){
    return DayCount - Math.floor((endStamp - new Date(ymd).getTime())/ (24 * 3600000)) -1
  }

  function updateCell(data){
    if(!data)return
    let year = data.year;

    let daysEle = document.getElementById(dayEleId)
    let dayCells = daysEle.childNodes

    let Map = {}

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        if(Array.isArray(element)){
          element.forEach(e=>{
            if(e.date && e.title && e.url){
              let arr = Map[e.date]
              if (!arr) {
                arr = []
                Map[e.date] = arr
              }
              arr.push(e)
            }
          })
        }
      }
    }

    for (const dateKeyYmd in Map) {
      if (Object.prototype.hasOwnProperty.call(Map, dateKeyYmd)) {
        const arrPostInOneDay = Map[dateKeyYmd];
        const idx = getIndex(dateKeyYmd)
        const dayCell = dayCells[idx]
        dayCell.classList = `heatmap-day-cell ${!arrPostInOneDay ? 'hm-check-no':arrPostInOneDay.length > 1 ? 'hm-check2' : 'hm-check' }`  

        
        if (arrPostInOneDay ) {
          var isDirectly = arrPostInOneDay.length == 1
          var tip = document.createElement("div");
    
          if (isDirectly) {
            var lnk = document.createElement('a');
            lnk.href = arrPostInOneDay[0].url
            dayCell.appendChild(lnk)
          }
    
          tip.className = "hm-tip";
          var desc = ''
          arrPostInOneDay.forEach(element => {
    
            var lnk = document.createElement('a');
            lnk.className = 'hm-tiplink'
            lnk.href = element.url
            tip.appendChild(lnk)
    
            var t = document.createElement('span')
            t.className = 'hm-date'
            t.innerText = dateKeyYmd.substring(5);
            lnk.appendChild(t);
    
            
            var t2 = document.createElement('span')
            t2.className = 'hm-title'
            t2.innerText = element.title
            lnk.appendChild(t2);
    
          });
          dayCell.appendChild(tip);
          
        }
        
      }
    } 
  }
   

  function getYearData(year){
    return fetch(`${jsonUrlBase}/${year}.json`)
    .then(r => r.json())
    .catch(e=>{
      return null
    })

  }
}()



;(function initMap(){


// 2024-09-09: {title date, url}
var Map = {} 
 

var Father = document.getElementById("heatmap");

const Frag = document.createDocumentFragment();

const monthEle = document.createElement("div");
monthEle.className = "heatmap-month";
Frag.appendChild(monthEle);
const monthStr = _MonthStr.split(" ");


var nowM = dateEnd.getMonth();
var nowWeek = dateEnd.getDay();


for (var i = 0; i < monthStr.length; i++) {
  var m = document.createElement("span");
  m.className = "heatmap-month-cell";
  m.innerHTML = `${monthStr[(i + nowM + 1) % 12]}`;
  monthEle.appendChild(m);
}

const weekEle = document.createElement("div");
weekEle.className = "heatmap-week";
const WeekStr = _showWeek.split(" ");

for (var i = 0; i < WeekStr.length; i++) {
  var m = document.createElement("div");
  m.className = "heatmap-week-cell";
  m.innerHTML = `<span>${WeekStr[i]}</span>`;
  weekEle.appendChild(m);
}

Frag.appendChild(weekEle);

const dayEle = document.createElement("div");

dayEle.className = "heatmap-day";
dayEle.id = dayEleId;


var  firstDateDayDiff = (ColumnsCount - 1) * RowCount + nowWeek;


console.log(nowWeek, firstDateDayDiff);

for (let c = 0; c < ColumnsCount; c++) {
  for (let r = 0; r < RowCount; r++) {
    if (r > nowWeek && c == ColumnsCount - 1) {
      break
    }

    var m = document.createElement("span");
    m.classList = `heatmap-day-cell hm-check-no`  
    dayEle.appendChild(m);
  }
}


Frag.appendChild(dayEle);
Father.append(Frag);
})()








