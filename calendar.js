(function (window) {
    'use strict';
    function KodimLib() {
        var _KodimLibObject = {};

        var settings = {
            colorNext: "red"
        };

        _KodimLibObject.init = function (selector) {
            const startDiv = document.querySelector(selector)
            startDiv.classList.add('calendar-wrapper');
            const create = '<button id="btnPrev" type="button">&#8249;</button><button id="btnNext" type="button">&#8250;</button><div id="kMainDiv"></div>';
            startDiv.insertAdjacentHTML('afterbegin', create);

            startDiv.addEventListener('click',(e)=> {
                if(e.target.id === "btnNext"){
                    KodimLib().setEventNext(e)
                }
            })
        };

        _KodimLibObject.setEventNext = function(e) {
            console.log(settings)
            console.log("setEventNext")
            console.log(e.target)
        };
        _KodimLibObject.setEventPrev = function(e) {
            console.log(settings)
            console.log("setEventPrev")
            console.log(e.target)
        };

        _KodimLibObject.getSettings = function() {
            return settings;
        };

        return _KodimLibObject;
    }
    if (typeof (window.kodimKalendar) === 'undefined') {
        window.kodimKalendar = KodimLib();
    }
})(window);






// function KodimCalendar(selector){
//     const element = document.querySelector(selector);
//     return new initFunc(element);
// }

// function initFunc(startDiv){
// // var KodimCalendar = function(startDiv) {
//     startDiv.classList.add('calendar-wrapper');
//     const create = '<button id="btnPrev" type="button">&#8249;</button><button id="btnNext" type="button">&#8250;</button><div id="kMainDiv"></div>';
//     startDiv.insertAdjacentHTML('afterbegin', create);
//     document.getElementById('btnNext').addEventListener('click', KodimCalendar.prototype.nextMonth)
//     //save main div insert
//     this.divId = "kMainDiv";
//
//     // days
//     this.DaysOfWeek = [
//         'Пн',
//         'Вт',
//         'Ср',
//         'Чт',
//         'Пт',
//         'Сб',
//         'Вс'
//     ];
//
//     // months
//     this.Months =['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
//
//     //Setting the current month, year
//     var d = new Date();
//
//     this.currMonth = d.getMonth('9');
//     this.currYear = d.getFullYear('22');
//     this.currDay = d.getDate('3');
// };

/**
 *
 * prototype
 *
 */
// Go to the next month
// KodimCalendar.prototype.nextMonth = function() {
//     if ( this.currMonth == 11 ) {
//         this.currMonth = 0;
//         this.currYear = this.currYear + 1;
//     }
//     else {
//         this.currMonth = this.currMonth + 1;
//     }
//     KodimCalendar.prototype.showcurr();
// };
//
// // Go to the previous month
// KodimCalendar.prototype.previousMonth = function() {
//     if ( this.currMonth == 0 ) {
//         this.currMonth = 11;
//         this.currYear = this.currYear - 1;
//     }
//     else {
//         this.currMonth = this.currMonth - 1;
//     }
//     this.showcurr();
// };
//
// // Show the current month
// KodimCalendar.prototype.showcurr = function() {
//     KodimCalendar.prototype.showMonth(this.currYear, this.currMonth);
// };
//
//
//
// // Show month (year, month)
// KodimCalendar.prototype.showMonth = function(y, m) {
//
//     var d = new Date()
//         // first day of the current month
//         , firstDayOfMonth = new Date(y, m, 7).getDay()
//         // last day of the current month
//         , lastDateOfMonth =  new Date(y, m+1, 0).getDate()
//         // Last day of the previous month
//         , lastDayOfLastMonth = m == 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();
//
//     //  create table
//     var html = '<table>';
//
//     // Recording of the selected month and year
//     html += '<thead><tr>';
//     html += '<td colspan="7">' + this.Months[m] + ' ' + y + '</td>';
//     html += '</tr></thead>';
//
//
//     // heading of days of the week
//     html += '<tr class="days">';
//     for(var i=0; i < this.DaysOfWeek.length;i++) {
//         html += '<td>' + this.DaysOfWeek[i] + '</td>';
//     }
//     html += '</tr>';
//
//     // Recording days
//     var i=1;
//     do {
//         var dow = new Date(y, m, i).getDay();
//
//         // Start a new line on Monday
//         if ( dow === 1 ) {
//             html += '<tr>';
//         }
//
//         // If the first day of the week is not Monday, show the last days of the previous month
//         else if ( i === 1 ) {
//             html += '<tr>';
//             var k = lastDayOfLastMonth - firstDayOfMonth+1;
//             for(var j=0; j < firstDayOfMonth; j++) {
//                 html += '<td class="not-current">' + k + '</td>';
//                 k++;
//             }
//         }
//
//         // Recording the current day in a cycle
//         var chk = new Date();
//         var chkY = chk.getFullYear();
//         var chkM = chk.getMonth();
//         if (chkY == this.currYear && chkM == this.currMonth && i == this.currDay) {
//             html += '<td class="today">' + i + '</td>';
//         } else {
//             html += '<td class="normal">' + i + '</td>';
//         }
//         // close the line on Sunday
//         if ( dow == 0 ) {
//             html += '</tr>';
//         }
//         // If the last day of the month is not Sunday, show the first days of the next month
//         else if ( i == lastDateOfMonth ) {
//             var k=1;
//             for(dow; dow < 7; dow++) {
//                 html += '<td class="not-current">' + k + '</td>';
//                 k++;
//             }
//         }
//
//         i++;
//     }while(i <= lastDateOfMonth);
//
//     // End table
//     html += '</table>';
//
//     // add content to div
//     document.getElementById(this.divId).innerHTML = html;
// };

// При загрузке окна
// window.onload = function() {
//
//     // Начать календарь
//     var c = new KodimCalendar("divKodimCalendar");
//     c.showcurr();
//
//     // Привязываем кнопки «Следующий» и «Предыдущий»
//     getId('btnNext').onclick = function() {
//         c.nextMonth();
//     };
//     getId('btnPrev').onclick = function() {
//         c.previousMonth();
//     };
// }
//
// // Получить элемент по id
// function getId(id) {
//     return document.getElementById(id);
// }
