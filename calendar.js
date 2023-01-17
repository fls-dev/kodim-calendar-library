(function (window) {
    'use strict';
    let KodimLibSettings = {
        colorNext: "red",
        lang: "ru",
        minDateToday: 1,
        disableWeekend: 0,
        idDivCal: "kMainDiv",
        btnNext: "btnNext",
        btnPrev: "btnPrev",
        inputId: "kodimValue",
        formatDate:"yyyy-MM-dd",
        message: {}
    };

    function KodimLib() {

        let _KodimLibObject = {};

        const lang = {
            ru: {
                days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
            },
            en: {
                days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sut', 'Sun'],
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            },
            pl: {
                days: ['Pon.', 'Wt.', 'Śr.', 'Czw.', 'Pt.', 'Sob.', 'Niedz.'],
                months: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']
            },
        }

        _KodimLibObject.init = function (selector, settings = {}) {
            if (settings !== {}) {
                KodimLibSettings = Object.assign(KodimLibSettings, settings)
            }
            let st="cursor: not-allowed;";
            if(KodimLibSettings.disableWeekend === 1){
                st="cursor: pointer;"
            }

            const startDiv = document.getElementById(selector);
            startDiv.classList.add('calendar-wrapper');
            const create = `<div id="${KodimLibSettings.idDivCal}"></div><input id="${KodimLibSettings.inputId}" type="text" disabled><div id="cInsMessBlock"></div>`;
            startDiv.insertAdjacentHTML('afterbegin', create);
            const d = new Date();
            KodimLibSettings.currMonth = d.getMonth();
            const style = `<style>#${selector}{width: 300px;}#${KodimLibSettings.inputId}{border: 1px solid rgb(218, 218, 218);text-align: center;margin:0 auto 15px auto;width: 100%;border-radius: 0 0 5px 5px;display: block}#${KodimLibSettings.btnPrev},#${KodimLibSettings.btnNext}{font-size: 18px;cursor: pointer;}.c-calendar-table{isolation: isolate;} table.c-calendar-table {clear: both; width: 100%; border: 1px solid #ccc;border-radius:5px 5px 0 0;color: #444; -webkit-user-select: none;-moz-user-select: none;-ms-user-select: none; } .c-calendar-table td {border-radius: 5px;height: 35px;font-size:14px;text-align: center; vertical-align: middle; width: 14.28571429%; } .c-calendar-table.days td{height: 35px;text-align: center;vertical-align: middle;font-size: 12px; width: 14.28571429%;} .c-calendar-table td.not-current {color: #ebebeb; } .c-calendar-table td.normal {cursor: pointer; color: blue;} .c-calendar-table td.today {font-weight: 500;color: #28283b; font-size: 15px;border: 1px solid green; } .c-calendar-table td.c-weekend{${st} color: #ff5555; } .c-calendar-table td.c-past-days{pointer-events: none;color: #b7b7b2; } .c-calendar-table td.c-selected-days{border: 1px solid blue } .c-calendar-table thead td {border: none;color:#28283b;font-size: 16px;}</style>`;
            document.head.insertAdjacentHTML("beforeend", style)
            KodimLibSettings.currYear = d.getFullYear();
            KodimLibSettings.currDay = d.getDate();
            startDiv.addEventListener('click', (e) => {
                console.log(e.target)
                if (e.target.id === KodimLibSettings.btnNext) {
                    KodimLib().nextMonth(e)
                }else if (e.target.id === KodimLibSettings.btnPrev) {
                    KodimLib().previousMonth(e)
                }else if(e.target.classList.contains('normal')){
                    KodimLib().eventClick(e.target)
                }else if(e.target.classList.contains('c-weekend') && KodimLibSettings.disableWeekend === 1){
                    KodimLib().eventClick(e.target)
                }
                else if(e.target.classList.contains('today')){
                    KodimLib().eventClick(e.target)
                }
            })
            KodimLib().showCurrent();
            document.getElementById(KodimLibSettings.inputId).value=KodimLib().customFormatDate(d.getDate());
        };
        _KodimLibObject.eventClick = function (target) {
            const kDays = document.querySelectorAll('.k-days');
            let i = 0, l = kDays.length;
            while (i < l) {
                if (kDays[i].innerHTML === KodimLibSettings.currDay.toString() && KodimLibSettings.currMonth === new Date().getMonth() && kDays[i].innerHTML ===target.innerHTML) {
                    kDays[i].classList.remove( 'today','c-past-days');
                    kDays[i].classList.add('c-selected-days', 'k-days');
                }
                else if (kDays[i].innerHTML === KodimLibSettings.currDay.toString() && KodimLibSettings.currMonth === new Date().getMonth()) {
                    kDays[i].classList.remove('c-selected-days', 'c-past-days');
                    kDays[i].classList.add('today', 'k-days');
                }
                else if (kDays[i].innerHTML === target.innerHTML) {
                    kDays[i].classList.add('c-selected-days', 'k-days');
                }else {
                    kDays[i].classList.remove('c-selected-days', 'today');
                    kDays[i].classList.add('normal', 'k-days');
                }
                i++;
            }
            const d=KodimLib().customFormatDate(target.innerHTML);
            document.getElementById(KodimLibSettings.inputId).value = d;

            const render = document.getElementById('cInsMessBlock');
            const ch = new Date().getHours();
            // const ch = new Date("2023-01-16 17:20").getHours();
            // const ch = new Date("2023-01-16 15:00").getHours();
            const cm = new Date().getMinutes();
            // const cm = new Date("2023-01-16 17:20").getMinutes();
            // const cm = new Date("2023-01-16 15:00").getMinutes();
            console.log("ch :" + ch)
            console.log("cm :" + cm)
            console.log("new Date().getDate() :" + new Date().getDate())
            console.log("target.innerHTML :" + target.innerHTML)

            if(new Date().getDate().toString()===target.innerHTML) {
                if (9 <= ch && ch <= 17) {
                    if (ch === 17 && cm <= 30) {
                        render.innerHTML = `<span style="color:orange">${KodimLibSettings.message[KodimLibSettings.lang].key2}</span>`;
                    } else {
                        render.innerHTML = `<span style="color:green">${KodimLibSettings.message[KodimLibSettings.lang].key1}</span>`;
                    }
                } else {
                    render.innerHTML = `<span style="color:red">${KodimLibSettings.message[KodimLibSettings.lang].key3}</span>`;
                }
            }else {render.innerHTML=""}
        };
        _KodimLibObject.nextMonth = function () {
            if (KodimLibSettings.currMonth === 11) {
                KodimLibSettings.currMonth = 0;
                KodimLibSettings.currYear = KodimLibSettings.currYear + 1;
            } else {
                KodimLibSettings.currMonth = KodimLibSettings.currMonth + 1;
            }
            KodimLib().showCurrent();
        };
        _KodimLibObject.previousMonth = function () {
            if (KodimLibSettings.currMonth === 0) {
                KodimLibSettings.currMonth = 11;
                KodimLibSettings.currYear = KodimLibSettings.currYear - 1;
            } else {
                KodimLibSettings.currMonth = KodimLibSettings.currMonth - 1;
            }
            KodimLib().showCurrent();
        };
        _KodimLibObject.showCurrent = function () {
            KodimLib().showMonth(KodimLibSettings.currYear, KodimLibSettings.currMonth);
        };
        _KodimLibObject.showMonth = function (y, m) {
            let d = new Date()
                , firstDayOfMonth = new Date(y, m, 7).getDay()
                , lastDateOfMonth = new Date(y, m + 1, 0).getDate()
                , lastDayOfLastMonth = m === 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();
            let html = '<table class="c-calendar-table">';
            html += '<thead><tr>';
            html += `<td><button id="${KodimLibSettings.btnPrev}" type="button">&#8249;</button></td><td colspan="5">${lang[KodimLibSettings.lang].months[m]}, ${y}</td><td><button id="${KodimLibSettings.btnNext}" type="button">&#8250;</button></td>`;
            // html += '<td colspan="7">' + lang[KodimLibSettings.lang].months[m] + ', ' + y + '</td>';
            html += '</tr></thead><tbody class="c-calendar-tbody">';
            html += '<tr class="days">';
            for (let i = 0; i < lang[KodimLibSettings.lang].days.length; i++) {
                html += '<td>' + lang[KodimLibSettings.lang].days[i] + '</td>';
            }
            html += '</tr>';
            let i = 1;
            do {
                let dow = new Date(y, m, i).getDay();
                if (dow === 1) {
                    html += '<tr>';
                }
                else if (i === 1) {
                    html += '<tr>';
                    let k = lastDayOfLastMonth - firstDayOfMonth + 1;
                    for (let j = 0; j < firstDayOfMonth; j++) {
                        html += '<td class="not-current">' + k + '</td>';
                        k++;
                    }
                }
                let chk = new Date();
                let chkM = chk.getMonth();
                if (i === KodimLibSettings.currDay && chkM === KodimLibSettings.currMonth) {
                    html += '<td class="k-days today">' + i + '</td>';
                } else
                if(dow === 6 || dow === 0){
                    html += '<td class="k-days c-weekend">' + i + '</td>';
                } else if (new Date(y, m, i)<new Date() && KodimLibSettings.minDateToday===1) {
                    html += '<td class="k-days c-past-days">' + i + '</td>';
                }else{
                    html += '<td class="k-days normal">' + i + '</td>';
                }
                if (dow === 0) {
                    html += '</tr>';
                }
                else if (i === lastDateOfMonth) {
                    let k = 1;
                    for (dow; dow < 7; dow++) {
                        html += '<td class="not-current">' + k + '</td>';
                        k++;
                    }
                }
                i++;
            } while (i <= lastDateOfMonth);
            html += '</tbody></table>';
            document.getElementById(KodimLibSettings.idDivCal).innerHTML = html;
            KodimLib().setTodayDate()
        };
        _KodimLibObject.setTodayDate = function () {
            const allTd = document.querySelectorAll('.c-calendar-tbody td');
            let control = 0;
            const t = new Date().getDay();
            if(KodimLibSettings.disableWeekend === 0 && t===6){
                control = 2
            }
            if(KodimLibSettings.disableWeekend === 0 && t ===0){
                control = 1
            }
                let d = 0, le = allTd.length, cm = new Date().getDate();
                while (d < le) {
                    if(allTd[d].innerHTML===cm.toString() && new Date().getMonth() === KodimLibSettings.currMonth){
                        allTd[d+control].classList.add("k-days","c-selected-days")
                    }
                    d++;
                }
        }
        _KodimLibObject.getSettings = function () {
            return KodimLibSettings;
        };
        _KodimLibObject.customFormatDate = function (day) {
            Date.prototype.format = function(format){
                const o = {
                    "M+" : this.getMonth()+1,
                    "d+" : this.getDate(),
                    "h+" : this.getHours(),
                    "m+" : this.getMinutes(),
                    "s+" : this.getSeconds(),
                    "q+" : Math.floor((this.getMonth()+3)/3),
                    "S" : this.getMilliseconds()
                }
                if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                    (this.getFullYear()+"").substr(4 - RegExp.$1.length));
                for(let k in o)if(new RegExp("("+ k +")").test(format))
                    format = format.replace(RegExp.$1,
                        RegExp.$1.length==1 ? o[k] :
                            ("00"+ o[k]).substr((""+ o[k]).length));
                return format;
            }
           return new Date(KodimLibSettings.currYear, KodimLibSettings.currMonth, day).format(KodimLibSettings.formatDate)
        };

        return _KodimLibObject;
    }

    if (typeof (window.kodimKalendar) === 'undefined') {
        window.kodimKalendar = KodimLib();
    } else {
        console.error("error init")
    }
})(window);