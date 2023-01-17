(function (window) {
    'use strict';
    let KodimLibSettings = {
        colorNext: "red",
        lang: "ru",
        minDateToday: 1,
        weekend: 0,
        idDivCal: "kMainDiv",
        btnNext: "btnNext",
        btnPrev: "btnPrev",
        inputId: "kodimValue",
        formatDate: "yyyy-MM-dd",
        width: '280px',
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
            let st = "cursor: not-allowed;";
            if (KodimLibSettings.weekend === 1) {
                st = "cursor: pointer;"
            }

            const startDiv = document.getElementById(selector);
            startDiv.classList.add('calendar-wrapper');
            const create = `<div id="${KodimLibSettings.idDivCal}"></div><input id="${KodimLibSettings.inputId}" type="text" disabled><div id="cInsMessBlock"></div>`;
            startDiv.insertAdjacentHTML('afterbegin', create);
            const d = new Date();
            KodimLibSettings.currMonth = d.getMonth();
            const style = `<style>#${KodimLibSettings.idDivCal}{background:#fff;width:${KodimLibSettings.width};border-top: 1px solid;border-left: 1px solid;border-right: 1px solid;border-color: #ccc;border-radius: 5px 5px 0 0;}#${selector}{width: ${KodimLibSettings.width}}#${selector} *{box-sizing: border-box}.c-calendar-head{display:flex;justify-content:space-between;margin-bottom:10px}.c-calendar-body{display:block}.c-calendar-body div.days {color: #28283b;font-size: 12px;}.c-calendar-body div.days,.c-calendar-body div.kod-line{display:flex;justify-content:space-around}.kod-line div{width:35px;line-height:35px;height:35px;text-align:center;border:1px solid transparent}#${KodimLibSettings.inputId}{padding: 5px;border:1px solid #dadada;text-align:center;margin:0 auto 15px;width:100%;border-radius:0 0 5px 5px;display:block}#${KodimLibSettings.btnPrev},#${KodimLibSettings.btnNext}{font-size:18px;cursor:pointer;width:25px;height:25px;background:#fff;border:none;border-radius: 5px;}.c-calendar-body div.not-current{color:#ebebeb}.c-calendar-body div.normal{cursor:pointer;color:blue}.c-calendar-body div.c-weekend{${st} color: #ff5555;}.c-calendar-body div.today{font-weight:500;color:#28283b;font-size:15px;border:1px solid green}.c-calendar-body div.c-past-days{pointer-events:none;color:#b7b7b2}.c-calendar-body div.c-selected-days{border:1px solid blue}.c-calendar-head div{border:none;color:#28283b;font-size:16px}#cInsMessBlock{font-size:10px;border-radius:5px;padding:5px}</style>`;
            document.head.insertAdjacentHTML("beforeend", style);
            KodimLibSettings.currYear = d.getFullYear();
            KodimLibSettings.currDay = d.getDate();
            startDiv.addEventListener('click', (e) => {
                if (e.target.id === KodimLibSettings.btnNext) {
                    KodimLib().nextMonth(e)
                } else if (e.target.id === KodimLibSettings.btnPrev) {
                    KodimLib().previousMonth(e)
                } else if (e.target.classList.contains('normal')) {
                    KodimLib().eventClick(e.target)
                } else if (e.target.classList.contains('c-weekend') && KodimLibSettings.weekend === 1) {
                    KodimLib().eventClick(e.target);
                } else if (e.target.classList.contains('today')) {
                    KodimLib().eventClick(e.target)
                }
            })
            KodimLib().showCurrent();
            document.getElementById(KodimLibSettings.inputId).value = KodimLib().customFormatDate(d.getDate());
        };


        _KodimLibObject.eventClick = function (target) {
            const t = target.innerHTML;
            const date = new Date();
            const dow = new Date(KodimLibSettings.currYear, KodimLibSettings.currMonth, t);
            const weekOff = KodimLibSettings.weekend;
            const render = document.getElementById('cInsMessBlock');
            const nowM = date.getMonth();
            const ch = date.getHours();
            const cm = date.getMinutes();
            const d = KodimLib().customFormatDate(t);
            const kDays = document.querySelectorAll('.k-days');

            if(dow>date) {
                let i = 0, l = kDays.length;
                while (i < l) {
                    const elem = kDays[i].innerHTML;
                    if (elem === KodimLibSettings.currDay.toString() && KodimLibSettings.currMonth === nowM && elem === t) {
                        kDays[i].className = "c-selected-days k-days"
                    } else if (elem === KodimLibSettings.currDay.toString() && KodimLibSettings.currMonth === nowM) {
                        kDays[i].className = "today k-days"
                    } else if (elem === t) {
                        kDays[i].classList.add('c-selected-days', 'k-days');
                    } else {
                        kDays[i].classList.remove('c-selected-days', 'today');
                        if (kDays[i].classList.contains('c-weekend') && weekOff === 1) {
                            kDays[i].classList.add('normal', 'k-days');
                        }
                    }
                    i++;
                }
            }
            document.getElementById(KodimLibSettings.inputId).value = d;

            // const ch = new Date("2023-01-16 17:20").getHours();
            // const ch = new Date("2023-01-16 15:00").getHours();

            // const cm = new Date("2023-01-16 17:20").getMinutes();
            // const cm = new Date("2023-01-16 15:00").getMinutes();
            // console.log("ch :" + ch)
            // console.log("cm :" + cm)
            // console.log("new Date().getDate() :" + new Date().getDate())
            // console.log("target.innerHTML :" + target.innerHTML)

            if (date.getDate().toString() === t && KodimLibSettings.currMonth === date.getMonth()) {
                if (9 <= ch && ch <= 17) {
                    if (ch === 17 && cm <= 30) {
                        render.innerHTML = `<span style="color:orange">${KodimLibSettings.message[KodimLibSettings.lang].key2}</span>`;
                    } else {
                        render.innerHTML = `<span style="color:green">${KodimLibSettings.message[KodimLibSettings.lang].key1}</span>`;
                    }
                } else {
                    render.innerHTML = `<span style="color:red">${KodimLibSettings.message[KodimLibSettings.lang].key3}</span>`;
                }
            } else {
                render.innerHTML = ""
            }
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
            let html = '<div class="c-calendar-head">';
            html += `<button id="${KodimLibSettings.btnPrev}" type="button">&#8249;</button><div>${lang[KodimLibSettings.lang].months[m]}, ${y}</div><button id="${KodimLibSettings.btnNext}" type="button">&#8250;</button></div>`;
            html += '<div class="c-calendar-body">';
            html += '<div class="days">';
            for (let i = 0; i < lang[KodimLibSettings.lang].days.length; i++) {
                html += '<div>' + lang[KodimLibSettings.lang].days[i] + '</div>';
            }
            html += '</div>';
            let i = 1;
            do {
                let dow = new Date(y, m, i).getDay();
                if (dow === 1) {
                    html += '<div class="kod-line">';
                } else if (i === 1) {
                    html += '<div class="kod-line">';
                    let k = lastDayOfLastMonth - firstDayOfMonth + 1;
                    for (let j = 0; j < firstDayOfMonth; j++) {
                        html += '<div class="not-current">' + k + '</div>';
                        k++;
                    }
                }
                let chk = new Date();
                let chkM = chk.getMonth();
                if (i === KodimLibSettings.currDay && chkM === KodimLibSettings.currMonth) {
                    html += '<div class="k-days today">' + i + '</div>';
                } else if (dow === 6 || dow === 0) {
                    html += '<div class="k-days c-weekend">' + i + '</div>';
                } else if (new Date(y, m, i) < new Date() && KodimLibSettings.minDateToday === 1) {
                    html += '<div class="k-days c-past-days">' + i + '</div>';
                } else {
                    html += '<div class="k-days normal">' + i + '</div>';
                }
                if (dow === 0) {
                    html += '</div>';
                } else if (i === lastDateOfMonth) {
                    let k = 1;
                    for (dow; dow < 7; dow++) {
                        html += '<div class="not-current">' + k + '</div>';
                        k++;
                    }
                }
                i++;
            } while (i <= lastDateOfMonth);
            html += '</div>';
            document.getElementById(KodimLibSettings.idDivCal).innerHTML = html;
            KodimLib().setTodayDate()
        };
        _KodimLibObject.setTodayDate = function () {
            const allTd = document.querySelectorAll('.c-calendar-tbody div');
            let control = 0;
            const t = new Date().getDay();
            if (KodimLibSettings.weekend === 0 && t === 6) {
                control = 2
            }
            if (KodimLibSettings.weekend === 0 && t === 0) {
                control = 1
            }
            let d = 0, le = allTd.length, cm = new Date().getDate();
            while (d < le) {
                if (allTd[d].innerHTML === cm.toString() && new Date().getMonth() === KodimLibSettings.currMonth) {
                    allTd[d + control].classList.add("k-days", "c-selected-days")
                }
                d++;
            }
        }
        _KodimLibObject.getSettings = function () {
            return KodimLibSettings;
        };
        _KodimLibObject.customFormatDate = function (day) {
            Date.prototype.format = function (format) {
                const o = {
                    "M+": this.getMonth() + 1,
                    "d+": this.getDate(),
                    "h+": this.getHours(),
                    "m+": this.getMinutes(),
                    "s+": this.getSeconds(),
                    "q+": Math.floor((this.getMonth() + 3) / 3),
                    "S": this.getMilliseconds()
                }
                if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
                    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (let k in o) if (new RegExp("(" + k + ")").test(format))
                    format = format.replace(RegExp.$1,
                        RegExp.$1.length == 1 ? o[k] :
                            ("00" + o[k]).substr(("" + o[k]).length));
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