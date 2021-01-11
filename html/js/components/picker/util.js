/**
 * Created by yyt on 2017/1/4.
 */
//import dateUtil from '../../utils/date';

define(function(require){
    var dateUtil = require("./../utils/date");
    var ys ={
         toDate : function(date) {
            date = new Date(date);
            if (isNaN(date.getTime())) return null;
            return date;
        },

         parseDate : function(string, format) {
            return dateUtil.parse(string, format || 'yyyy-MM-dd');
        },

         getDayCountOfMonth : function(year, month) {
            if (month === 3 || month === 5 || month === 8 || month === 10) {
                return 30;
            }

            if (month === 1) {
                if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
                    return 29;
                } else {
                    return 28;
                }
            }

            return 31;
        },

         getFirstDayOfMonth : function(date) {
            var temp = new Date(date.getTime());
            temp.setDate(1);
            return temp.getDay();
        },

         initTimeDate : function () {
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    },
    };
    ys.formatDate = function(date, format) {
        date = ys.toDate(date);
        if (!date) return '';
        return dateUtil.format(date, format || 'yyyy-MM-dd');
    };
    ys.prevMonth = function(src) {
        var year = src.getFullYear();
        var month = src.getMonth();
        var date = src.getDate();

        var newYear = month === 0 ? year - 1 : year;
        var newMonth = month === 0 ? 11 : month - 1;

        var newMonthDayCount = ys.getDayCountOfMonth(newYear, newMonth);
        if (newMonthDayCount < date) {
            src.setDate(newMonthDayCount);
        }

        src.setMonth(newMonth);
        src.setFullYear(newYear);

        return new Date(src.getTime());
    };
    ys.nextMonth = function(src) {
        var year = src.getFullYear();
        var month = src.getMonth();
        var date = src.getDate();

        var newYear = month === 11 ? year + 1 : year;
        var newMonth = month === 11 ? 0 : month + 1;

        var newMonthDayCount = ys.getDayCountOfMonth(newYear, newMonth);
        if (newMonthDayCount < date) {
            src.setDate(newMonthDayCount);
        }

        src.setMonth(newMonth);
        src.setFullYear(newYear);

        return new Date(src.getTime());
    };
    return ys;
})
