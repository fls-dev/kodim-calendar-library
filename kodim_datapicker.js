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
        oldV: "",
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
            KodimLibSettings.selector = selector;
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
            const style = `<style>#${KodimLibSettings.idDivCal}{background:#fff;width:${KodimLibSettings.width};border-top: 1px solid;border-left: 1px solid;border-right: 1px solid;border-color: #ccc;border-radius: 5px 5px 0 0;}#${selector}{width: ${KodimLibSettings.width}}#${selector} *{box-sizing: border-box; font-weight: 300;font-size: 13px}.c-calendar-head{display:flex;justify-content:space-between;align-items: center;margin-bottom:10px}.c-calendar-body{display:block}.c-calendar-body div.days {color: #28283b;font-size: 12px;}.c-calendar-body div.days,.c-calendar-body div.kod-line{display:flex;justify-content:space-around}.kod-line div{width:35px;line-height:35px;height:35px;text-align:center;border:1px solid transparent}#${KodimLibSettings.inputId}{padding: 5px;border:1px solid #dadada;text-align:center;margin:0 auto 15px;width:100%;border-radius:0 0 5px 5px;display:block}#${KodimLibSettings.btnPrev},#${KodimLibSettings.btnNext}{font-size:18px;line-height: 16px;cursor:pointer;width:25px;height:25px;background:#fff;border:none;border-radius: 5px;}.c-calendar-body div.not-current{color:#ebebeb}.c-calendar-body div.normal{cursor:pointer;color:blue}.c-calendar-body div.c-weekend{${st} color: #ff5555;}.c-calendar-body div.today{font-weight:500;color:green;font-size:15px;}.c-calendar-body div.c-past-days{pointer-events:none;color:#b7b7b2}.c-calendar-body div.c-selected-days{border:1px solid blue}.c-calendar-head div{border:none;color:#28283b;font-size:16px}#cInsMessBlock{font-size:10px;border-radius:5px;padding:5px}</style>`;
            document.head.insertAdjacentHTML("beforeend", style);
            KodimLibSettings.currYear = d.getFullYear();
            KodimLibSettings.currDay = d.getDate();
            startDiv.addEventListener('click', (e) => {
                const id = e.target.id;
                if (id === KodimLibSettings.btnNext) {
                    KodimLib().nextMonth(e)
                } else if (id === KodimLibSettings.btnPrev) {
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
            const inD = KodimLib().customFormatDate(d.getDate());
            const inpId = document.getElementById(KodimLibSettings.inputId);
            inpId.value = inD;
        };
        _KodimLibObject.resetToday = function () {
            const d = new Date();
            let contr = 0;
            const t = d.getDay();
            if (KodimLibSettings.weekend === 0 && t === 6) {
                contr = 2;
            }
            if (KodimLibSettings.weekend === 0 && t === 0) {
                contr = 1;
            }
            d.setDate(d.getDate() + contr);
            KodimLibSettings.currMonth = d.getMonth();
            KodimLibSettings.currYear = d.getFullYear();
            KodimLibSettings.currDay = d.getDate();
            KodimLib().showCurrent(true)
        }

        _KodimLibObject.eventClick = function (target, type) {
            const t = target.innerHTML;
            const date = new Date();
            const dow = new Date(KodimLibSettings.currYear, KodimLibSettings.currMonth, Number(t));
            const kDays = document.querySelectorAll('.k-days');
            const dIso = date.toLocaleDateString();
            const dowIso = dow.toLocaleDateString();
            KodimLibSettings.oldV = dow;

            if(dow >= new Date()){
                for(let i=0;i<kDays.length;i++){
                    const elem = kDays[i].innerHTML;
                    if (elem === t) {
                        kDays[i].classList.add('c-selected-days')
                    } else {
                        kDays[i].classList.remove('c-selected-days')
                    }
                }
            }else if(dIso===dowIso){
                for(let i=0;i<kDays.length;i++){
                    const elem = kDays[i].innerHTML;
                    if (elem === t) {
                        kDays[i].classList.add('c-selected-days')
                    } else {
                        kDays[i].classList.remove('c-selected-days')
                    }
                }
            }
            const d = KodimLib().customFormatDate(t);
            const d2 = KodimLib().customFormatDate(t, "yyyy-MM-dd");
            document.getElementById(KodimLibSettings.inputId).value = d;
            document.getElementById(KodimLibSettings.selector).dataset.actual = d2;
            document.getElementById(KodimLibSettings.selector).dispatchEvent(new Event('change'));
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
        _KodimLibObject.showCurrent = function (set=false) {
            KodimLib().showMonth(KodimLibSettings.currYear, KodimLibSettings.currMonth,set);
        };
        _KodimLibObject.showMonth = function (y, m, set) {
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
                }else {
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
            KodimLib().setsDate(set);
        };
        _KodimLibObject.setsDate = function (set) {
            let dLast = new Date(KodimLibSettings.oldV);
            if(set){
                dLast = new Date();
                const d = KodimLib().customFormatDate(dLast.getDate());
                const d2 = KodimLib().customFormatDate(dLast.getDate(), "yyyy-MM-dd");
                document.getElementById(KodimLibSettings.inputId).value = d;
                document.getElementById(KodimLibSettings.selector).dataset.actual = d2;
            }

            const lD = dLast.getDate().toString();
            const lM = dLast.getMonth();
            const allDiv = document.querySelectorAll('.c-calendar-body .k-days');
            let control = 0;
            const t = new Date().getDay();
            const cm = new Date().getDate();
            if (KodimLibSettings.weekend === 0 && t === 6) {
                control = 2
            }
            if (KodimLibSettings.weekend === 0 && t === 0) {
                control = 1
            }
            let le = allDiv.length;
            for (let d = 0; d < le; d++) {
                if (allDiv[d].innerHTML === lD && lM === KodimLibSettings.currMonth && allDiv[d].classList.contains('not-current') === false) {
                    allDiv[d + control].classList.add("k-days", "c-selected-days")
                }
                if (allDiv[d].innerHTML === cm.toString() && new Date().getMonth() === KodimLibSettings.currMonth && isNaN(dLast.getTime())) {
                    console.log(allDiv[d + control])
                    allDiv[d + control].classList.add("k-days", "c-selected-days")
                }
            }
        }
        _KodimLibObject.customFormatDate = function (day, strF) {
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
            if(strF){
                return new Date(KodimLibSettings.currYear, KodimLibSettings.currMonth, day).format(strF);
            }else {
                return new Date(KodimLibSettings.currYear, KodimLibSettings.currMonth, day).format(KodimLibSettings.formatDate);
            }
        };

        return _KodimLibObject;
    }

    if (typeof (window.kodimKalendar) === 'undefined') {
        window.kodimKalendar = KodimLib();
    } else {
        console.error("error init")
    }
})(window);