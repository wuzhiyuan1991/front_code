/**
 * Created by yyt on 2017/1/4.
 */
define(function(require) {
    var dateUtils =require("../../../views/reportManagement/tools/dateUtils");
    var Vue = require("vue");
    var oneOf = require('../../utils/assist').oneOf;
    var Picker = require('../picker');
    var DatePanel = require('../panel/date');

    var DateRangePanel = require('../panel/date-range');
    //import Picker from '../picker.vue';
    //import DatePanel from '../panel/date.vue';
    //import DateRangePanel from '../panel/date-range.vue';
    //import { oneOf } from '../../../utils/assist';

    var getPanel = function (type) {
        if (type === 'daterange' || type === 'datetimerange') {
            return DateRangePanel;
        }
        return DatePanel;
    };

    //此方法不写在组件上。把组件对象传过来
    var getShortcuts=function (commponet) {
        var current = new Date();
        var currYear = current.getFullYear();
        var times = {
            prevWeek: new Date(currYear, current.getMonth(), current.getDate()-7),
            prevMonth: new Date(currYear, current.getMonth()-1),
            prevQuarter: new Date(currYear, current.getMonth()-3),
            prevYear: new Date(currYear-1, current.getMonth())
        };
        if(commponet.shortcuts==="daterange"&&commponet.type.toLowerCase()==="daterange"){
            //todo 假如这个本周 本月很灵活，shortscuts请配置成一个数组可自定义
            commponet.options={
                shortcuts:[
                    {text: '本周',value: function() {return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];}},
                    {text: '本月',value: function() {return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];}},
                    {text: '本季度',value: function() {return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];}},
                    {text: '本年',value: function() {return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];}},
                    // {text: '最近7天', value: dateUtils.getRecent7Days},
                    // {text: '最近30天', value: dateUtils.getRecent30Days},
                    {text: '上周',value: function() {return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];}},
                    {text: '上月',value: function() {return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];}},
                    {text: '上季度',value: function() {return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];}},
                    {text: '去年',value: function() {return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];}}
                ]};
        }
        else{
            console.error("其他默认值，请进来编写。0.0")
        }
    };
    var opts = {
        mixins: [Picker],
        props: {
            type: {
                validator :function(value) {
                    return oneOf(value, ['year', 'month', 'date', 'daterange', 'datetime', 'datetimerange']);
                },
                default: 'date'
            },
            shortcuts:{//用来配置默认的shortcuts，使用数组表示代码那种默认值，当然可以用字符串或者两个一起，请修改上面的getShortcuts 方法。
                type:[Number,String],
                default:null,
            },
            value: {}
        },
        created :function() {
            if (!this.value) {
                if (this.type === 'daterange' || this.type === 'datetimerange') {
                    this.value = ['',''];
                } else {
                    this.value = '';
                }
            }
            this.panel = getPanel(this.type);
            if(this.shortcuts){
                getShortcuts(this);
            }
        }
    };
    var component = Vue.extend(opts);
    Vue.component('vi-date-picker', component);

    return component;

});