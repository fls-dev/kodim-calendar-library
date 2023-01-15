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
    };

    function KodimLib() {

        var _KodimLibObject = {};

        var lang = {
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
            // console.log(lang[KodimLibSettings.lang])


            const startDiv = document.querySelector(selector);
            startDiv.classList.add('calendar-wrapper');
            const create = `<div class="cal-kodim-head"><button id="${KodimLibSettings.btnPrev}" type="button">&#8249;</button><button id="${KodimLibSettings.btnNext}" type="button">&#8250;</button></div><div id="${KodimLibSettings.idDivCal}"></div>`;
            startDiv.insertAdjacentHTML('afterbegin', create);
            var d = new Date();
            KodimLibSettings.currMonth = d.getMonth();
            KodimLibSettings.currYear = d.getFullYear();
            KodimLibSettings.currDay = d.getDate();
            startDiv.addEventListener('click', (e) => {
                // console.log(e.target)
                if (e.target.id === KodimLibSettings.btnNext) {
                    KodimLib().nextMonth(e)
                }
                if (e.target.id === KodimLibSettings.btnPrev) {
                    KodimLib().previousMonth(e)
                }
                if(e.target.classList.contains('normal')){
                    KodimLib().eventClick(e.target)
                }
            })
            KodimLib().showCurrent();
        };
        _KodimLibObject.eventClick = function (target) {
            const kDays = document.querySelectorAll('.k-days');
            var i = 0, l = kDays.length;
            while (i < l) {
                if (kDays[i].innerHTML === KodimLibSettings.currDay.toString() &&  KodimLibSettings.currMonth === new Date().getMonth()) {
                    kDays[i].classList.remove('c-selected-days', 'c-past-days');
                    kDays[i].classList.add('today', 'k-days');
                }
                else if (kDays[i].innerHTML === target.innerHTML) {
                    kDays[i].classList.add('c-selected-days', 'k-days');
                } else {
                    kDays[i].classList.remove('c-selected-days');
                    kDays[i].classList.add('normal', 'k-days');
                }
                i++;
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
            let html = '<table class="c-calendar-table">';
            html += '<thead><tr>';
            html += '<td colspan="7">' + lang[KodimLibSettings.lang].months[m] + ' ' + y + '</td>';
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
                    var k = lastDayOfLastMonth - firstDayOfMonth + 1;
                    for (var j = 0; j < firstDayOfMonth; j++) {
                        html += '<td class="not-current">' + k + '</td>';
                        k++;
                    }
                }
                // Recording the current day in a cycle
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
            console.log(new Date().getDay())
            const allTd = document.querySelectorAll('.c-calendar-tbody td');
            let control = 0;
            const t = new Date().getDay();
            if(KodimLibSettings.disableWeekend === 0 && t===6){
                control = 2
            }
            if(KodimLibSettings.disableWeekend === 0 && t ===0){
                control = 1
            }
                var d = 0, le = allTd.length, cm = new Date().getDate();
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

        return _KodimLibObject;
    }

    if (typeof (window.kodimKalendar) === 'undefined') {
        window.kodimKalendar = KodimLib();
    } else {
        console.error("error init")
    }
})(window);