;(function(){

var Map = {}
var  arr1 = _GALLPOSTSTR.split("\n")
arr1.forEach(element => {
  var post = element.split('\x01')

  var url = post[0]
  var title = post[1]
  var date = post[2]
  var arrDatePost = Map[date]
  if (!arrDatePost ) {
    arrDatePost = []
    Map[date] = arrDatePost;
  }
  arrDatePost.push({title,url})
});
 

var Father = document.getElementById("heatmap");

const Frag = document.createDocumentFragment();

const monthEle = document.createElement("div");
monthEle.className = "heatmap-month";
Frag.appendChild(monthEle);
const monthStr = _MonthStr.split(" ");

var nowM = new Date().getMonth();
var nowWeek = new Date().getDay();

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

const ColumnsCount = 53;
const RowCount = 7;

var  firstDateDayDiff = (ColumnsCount - 1) * RowCount + nowWeek;
var  nowStamp = Date.now();

console.log(nowWeek, firstDateDayDiff);

for (let c = 0; c < ColumnsCount; c++) {
  for (let r = 0; r < RowCount; r++) {
    if (r > nowWeek && c == ColumnsCount - 1) {
      break
    }
    const i = c * RowCount + r ;
    const date = new Date(nowStamp - (firstDateDayDiff - i) * 3600000 * 24);
    const month = date.getMonth() + 1
    let dateStr = `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${date.getDate() < 10 ? '0' + date.getDate() :  date.getDate() }`

    var m = document.createElement("span");
    const arrPostInOneDay = Map[dateStr]
    m.classList = `heatmap-day-cell ${!arrPostInOneDay ? 'hm-check-no':arrPostInOneDay.length > 1 ? 'hm-check2' : 'hm-check' }`  
    

    if (arrPostInOneDay ) {
      var isDirectly = arrPostInOneDay.length == 1
      var tip = document.createElement("div");

      if (isDirectly) {
        var lnk = document.createElement('a');
        lnk.href = arrPostInOneDay[0].url
        m.appendChild(lnk)
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
        t.innerText = dateStr.substring(5);
        lnk.appendChild(t);

        
        var t2 = document.createElement('span')
        t2.className = 'hm-title'
        t2.innerText = element.title
        lnk.appendChild(t2);

      });
      m.appendChild(tip);
      
    }
    dayEle.appendChild(m);
  }
}


Frag.appendChild(dayEle);
Father.append(Frag);
})()