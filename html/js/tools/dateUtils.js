define(function(require){
	/**
	 * 本周第一天
	 */
	var getWeekFirstDay = function(date)
	 {
	     var Nowdate= date || new Date();
	     var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);
	     return WeekFirstDay;
	 }
	 /**
	  * 本周最后一天
	  */
	 var getWeekLastDay = function(date)
	 {
	     var Nowdate= date || new Date();
	     var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);
	     var WeekLastDay=new Date((WeekFirstDay/1000+6*86400)*1000);
	     return WeekLastDay;
	 }
	 /**
	  * 本月第一天
	  */
	 var getMonthFirstDay = function(date)
	 {
	     var Nowdate=date || new Date();
	     var MonthFirstDay=new Date(Nowdate.getFullYear(),Nowdate.getMonth(),1);
	     return MonthFirstDay;
	 }
	 /**
	  * 本月最后一天
	  */
	 var getMonthLastDay = function(date)
	 {
	     var Nowdate=date || new Date();
	     var MonthNextFirstDay=new Date(Nowdate.getFullYear(),Nowdate.getMonth()+1,1);
	     var MonthLastDay=new Date(MonthNextFirstDay-86400000);
	     return MonthLastDay;
	 }
	 /**
	  * 本季度第一天
	  */
	 var getQuarterFirstDay = function(date){
		 var Nowdate=date || new Date();
		 var month = Math.floor(Nowdate.getMonth() / 3) * 3; 
		 var QuarterNextFirstDay=new Date(Nowdate.getFullYear(),month,1);
		 return QuarterNextFirstDay;
	 }
	 /**
	  * 本季度最后一天
	  */
	 var getQuarterLastDay = function(date){
		 var Nowdate=date || new Date();
		 var month = Math.floor(Nowdate.getMonth() / 3) * 3 + 2; 
		 var QuarterNextLastDay=new Date(Nowdate.getFullYear(),month,1);
		 QuarterNextLastDay.setDate(getMonthDays(QuarterNextLastDay));
		 return QuarterNextLastDay;
	 }
	 /**
	  * 本年第一天
	  */
	 var getYearFirstDay = function(date){
		 var Nowdate=date || new Date();
		 var YearNextFirstDay=new Date(Nowdate.getFullYear(),0,1);
		 return YearNextFirstDay;
	 }
	 /**
	  * 本年最后一天
	  */
	 var getYearLastDay = function(date){
		 var Nowdate=date || new Date();
		 var YearNextLastDay=new Date(Nowdate.getFullYear(),11,31);
		 return YearNextLastDay;
	 }
	 /**
	  * 获得某月的天数
	  */ 
	 var getMonthDays = function(date){
		 var currentDate = date || new Date();
		 var nowYear = currentDate.getFullYear();
		 var myMonth = currentDate.getMonth();
		 var monthStartDate = new Date(nowYear, myMonth, 1); 
		 var monthEndDate = new Date(nowYear, myMonth + 1, 1); 
		 var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24); 
		 return days; 
	 }
	/**
	 * 获取指定年数日期
	 * @param years
	 * @param date
     */
	var getDateAfterYear = function(years,date){
		var currentDate = date || new Date();
		var nowYear = currentDate.getFullYear();
		currentDate.setFullYear(nowYear+years);
		return new Date(nowYear+years, currentDate.getMonth()+1, currentDate.getDate());
	};

	var getRecent7Days = function () {
		var currentDate = new Date();
		var weekAgo = new Date((new Date).setDate(currentDate.getDate() - 6));
		return [weekAgo, currentDate]
    };
    var getRecent30Days = function () {
        var currentDate = new Date();
        var weekAgo = new Date((new Date).setDate(currentDate.getDate() - 29));
        return [weekAgo, currentDate]
    };

	 return {
		 getWeekFirstDay:getWeekFirstDay,
		 getWeekLastDay:getWeekLastDay,
		 getMonthFirstDay:getMonthFirstDay,
		 getMonthLastDay:getMonthLastDay,
		 getQuarterFirstDay:getQuarterFirstDay,
		 getQuarterLastDay:getQuarterLastDay,
		 getYearFirstDay:getYearFirstDay,
		 getYearLastDay:getYearLastDay,
		 getDateAfterYear:getDateAfterYear,
         getRecent7Days: getRecent7Days,
         getRecent30Days: getRecent30Days
	 };
});