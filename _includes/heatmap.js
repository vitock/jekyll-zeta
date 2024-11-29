;!(function () {
  
  const WeeKStart = parseInt(WeeKStartStr)


  var GDATA = window._G_DATA;
  if (!GDATA) {
    GDATA = {}
    window._G_DATA = GDATA
  }


  function date2ymd(t) {
    let m = t.getMonth() + 1;
    let d = t.getDate();
    return `${t.getFullYear()}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
  }

  const dateEnd =
    endYear && endYear.length == 4 ? new Date(`${endYear}-12-31`) : new Date();

  const endStamp = dateEnd.getTime();
  const dayEleId = Math.random().toString(16).substring(2);
  let arr = _allyearurl.split("/");
  arr.pop();
  const jsonUrlBase = arr.join("/");

  const nLastColumnCount = (dateEnd.getDay() -  WeeKStart + 7) % 7 + 1
  const ColumnsCount = 53;
  const RowCount = 7;
  const DayCount = (ColumnsCount - 1) * RowCount + nLastColumnCount;

  let queue  = window._y_queue || []
  window._y_queue = queue;
 

  function getAllYearCfg(){
    
    
    if (GDATA['_allYear']) {
      return GDATA['_allYear'];
    }

    if (window._isFetchAllYearData == 1) {
      return new Promise(r=>{
        queue.push(r);
      })
    }

    
    window._isFetchAllYearData = 1;
    return fetch(_allyearurl)
      .then((r) => r.json())
      .then(d => { 
        window._isFetchAllYearData = 0;
        if (queue.length) {
          queue.forEach(calback=>{calback(d)});
          queue.length = 0;
        }
        GDATA['_allYear'] = d ;return d ;})
  }
  !(function fillData() {
    let year = "" + dateEnd.getFullYear();
    let preYear = "" + (year - 1);
    getAllYearCfg()
      .then((d) => {
        let yearCfg = d;
        let arr = [];
        if (yearCfg[year]) {
          arr.push(getYearData(year));
        }

        if (yearCfg[preYear]) {
          arr.push(getYearData(preYear));
        }
        Promise.all(arr).then((alldata) => {
          let combineData = {};
          let d1 = alldata[0];
          let d2 = alldata[1];

          for (const key in d1) {
            if (Object.prototype.hasOwnProperty.call(d1, key)) {
              const element = d1[key];
              let keyNew = "K1-" + key;
              combineData[keyNew] = element;
            }
          }

          for (const key in d2) {
            if (Object.prototype.hasOwnProperty.call(d2, key)) {
              const element = d2[key];
              let keyNew = "K2-" + key;
              combineData[keyNew] = element;
            }
          }

          updateCell(combineData);
        });
      });

    function getIndex(ymd) {
      return (
        DayCount -
        Math.floor((endStamp - new Date(ymd).getTime()) / (24 * 3600000)) -
        1
      );
    }

    function idx2Ymd(idx) {
      let t = new Date(endStamp - (DayCount - 1 - idx) * 3600000 * 24);
      let m = t.getMonth() + 1;
      let d = t.getDate();
      return `${t.getFullYear()}-${m < 10 ? "0" + m : m}-${
        d < 10 ? "0" + d : d
      }`;
    }

    function updateCell(data) {
      if (!data) return;


      let daysEle = document.getElementById(dayEleId);
      let dayCells = daysEle.childNodes;

      let Map = {};

      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key];
          if (Array.isArray(element)) {
            element.forEach((e) => {
              if (e.date && e.title && e.url) {
                let arr = Map[e.date];
                if (!arr) {
                  arr = [];
                  Map[e.date] = arr;
                }
                arr.push(e);
              }
            });
          }
        }
      }

      let ymdArr = [];

      for (const dateKeyYmd in Map) {
        if (Object.prototype.hasOwnProperty.call(Map, dateKeyYmd)) {
          ymdArr.push(dateKeyYmd);
        }
      }

      var G_idxOfDay = DayCount - 1;

      function shuffle(array) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {
          // Pick a remaining element...
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
          ];
        }
      }

      const SEQ = new Array(DayCount);
      let tmp = DayCount;
      while (tmp-- > 0) {
        SEQ[tmp] = tmp;
      }

      shuffle(SEQ);

      function update1Day() {
        if (G_idxOfDay < 0) {
          return;
        }
        const idxOfDay = SEQ[G_idxOfDay--];
        let dateKeyYmd = idx2Ymd(idxOfDay);
        let arrPostInOneDay = Map[dateKeyYmd];
        const dayCell = dayCells[idxOfDay];
        const nobg =
          parseInt(dateKeyYmd.substring(5, 7)) % 2 == 1
            ? "hm-check-no-b"
            : "hm-check-no-a";
        dayCell.classList = `heatmap-day-cell ${
          !arrPostInOneDay
            ? nobg
            : arrPostInOneDay.length > 1
            ? "hm-check2"
            : "hm-check"
        }`;

        if (arrPostInOneDay && arrPostInOneDay.length > 0) {
          let isDirectly = arrPostInOneDay.length == 1;
          let tip = document.createElement("div");

          if (isDirectly) {
            let lnk = document.createElement("a");
            lnk.href = arrPostInOneDay[0].url;
            dayCell.appendChild(lnk);
          }

          tip.className = "hm-tip";
          let desc = "";
          arrPostInOneDay.forEach((element) => {
            let lnk = document.createElement("a");
            lnk.className = "hm-tiplink";
            lnk.href = element.url;
            tip.appendChild(lnk);

            let t = document.createElement("span");
            t.className = "hm-date";
            t.innerText = dateKeyYmd.substring(5);
            lnk.appendChild(t);

            let t2 = document.createElement("span");
            t2.className = "hm-title";
            t2.innerText = element.title;
            lnk.appendChild(t2);
          });
          dayCell.appendChild(tip);
        }
      }

      function updateMultiDays() {
        let day = heatMapLoadCount;
        if (!day || day <= 0) {
          day = 8;
        }
        while (day--) {
          update1Day();
        }

        if (G_idxOfDay >= 0) {
          requestAnimationFrame(updateMultiDays);
        }
      }
      requestAnimationFrame(updateMultiDays);

      return;
    }

    function getYearData(year) {
      year = '' + year

    
      if(GDATA[year]){

        return GDATA[year]
      }

      let queueFlgKey = '_singleyearFlg' + year
      let queueArrKey = '_singleyearQueue' + year
      if (GDATA[queueFlgKey] == 1) {
        // console.log('put in queue',year,Math.random())
        let arrQueue = GDATA[queueArrKey]
        if (!arrQueue) {
          arrQueue = []
          GDATA[queueArrKey] = arrQueue;
        }
        
        return  new Promise(r=>{
          arrQueue.push(r);
        });
      }


      GDATA[queueFlgKey] = 1;
      // console.log('RealQuery',year,Math.random())
      return fetch(`${jsonUrlBase}/${year}.json`)
        .then((r) => r.json())
        .then(d=>{
          GDATA[queueFlgKey] = 0 ;GDATA[year] = d; 
          let queue = GDATA[queueArrKey];
          // console.log('queryFinish',year)
          if(queue && queue.length){
            queue.forEach(cb=>{
              // console.log('queryFinishQueue',year,queue.length,Math.random());
              cb(d);})
            queue.length = 0;
            GDATA[queueArrKey] = undefined
          }

          return d})
        .catch((e) => {
          return null;
        });
    }
  })();
  (function initMap() {
    let Father = document.getElementById(heatmapid);

    const Frag = document.createDocumentFragment();

    const monthEle = document.createElement("div");
    monthEle.className = "heatmap-month";
    Frag.appendChild(monthEle);
    const monthStr = _MonthStr.split(" ");

    let nowM = dateEnd.getMonth();
    let nowWeekIdx = nLastColumnCount - 1;

    for (let i = 0; i < monthStr.length; i++) {
      let m = document.createElement("span");
      m.className = "heatmap-month-cell";
      m.innerHTML = `${monthStr[(i + nowM + 1) % 12]}`;
      monthEle.appendChild(m);
    }

    const weekEle = document.createElement("div");
    weekEle.className = "heatmap-week";
    const WeekStr = _showWeek.split(" ");

    for (let i = 0; i < WeekStr.length; i++) {
      const idx = (i + WeeKStart) % 7
      let m = document.createElement("div");
      m.className = "heatmap-week-cell";
      m.innerHTML = i % 2  ?  `<span>${WeekStr[idx]}</span>` : ''
      weekEle.appendChild(m);
    }

    Frag.appendChild(weekEle);

    const dayEle = document.createElement("div");

    dayEle.className = "heatmap-day";
    dayEle.id = dayEleId;

    // console.log(nowWeekIdx, firstDateDayDiff);

    for (let c = 0; c < ColumnsCount; c++) {
      for (let r = 0; r < RowCount; r++) {
        if (r > nowWeekIdx && c == ColumnsCount - 1) {
          break;
        }

        let m = document.createElement("span");
        m.classList = `heatmap-day-cell hm-check-nodata`;
        dayEle.appendChild(m);
      }
    }

    Frag.appendChild(dayEle);
    Father.append(Frag);
  })();
})();
