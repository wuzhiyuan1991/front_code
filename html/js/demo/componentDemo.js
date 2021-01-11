
define(function(require) {
    var template = require("text!./componentDemo.html");
    var $ = require('jquery'),
        BASE = require('base'),
        LIB = require('lib'),
        CONST = require('const');
    var Vue = require("vue");
    var storeApp = require("./vuex/store");
    var actions = require("./vuex/actions");
    var types = require("./vuex/mutation-types");
    var VueI18n=require('libs/vue-i18n.min');
    var Message = require("components/iviewMessage");
    var Notice = require("components/base/notification/notice");
	require("components/picker/picker/date-picker");
	require("components/picker/picker/time-picker");
	//图表
	//var highcharts= require("libs/highcharts");
	//var Vuehighcharts = require("components/vuehighcharts");



    Vue.config.debug = true;


	

    var dataModel = {
		inputValue : "insdjflaksdjfl;ajksdflk",
		//modal 显示属性
		modal1 : false,
		//aside 显示属性
		showRight : false,
		//card 显示属性
		limitNum: 5,
		limitFrom: 0,
		dataquery:null,
		//select-tree-list
		treeSelectData: [
			{
				key: "eitm3wrjyw",
				label: "范向东",
				parentKey: "eitlobj6op",
				type: "1"
			}, {
				key: "eitlobj6op",
				label: "研发部",
				parentKey: "eitlnfge5l",
				type: "0"
			},
			{
				key: "eitlobjasd",
				label: "培训部",
				parentKey: "eitlnfge5l",
				type: "0"
			},
			{
				key:"eitm3wrjrr",
				label: "小明",
				parentKey: "eitlobjasd",
				type: "1",
			},
			{
				key:"eitm3wrjdz",
				label: "小超",
				parentKey: "eitlobjasd",
				type: "1",
			},
			{
				key: "eitlnfge5l",
				label: "赛为科技",
				parentKey: "eitlmcx1pl",
				type: "0"
			},{
				key: "eitlmcx1pl",
				label: "赛为集团",
				parentKey: "",
				type: "0"
			}, {
				key:"eitm3wrjyy",
				label: "谢青",
				parentKey: "eitlobj6op",
				type: "1",
			}, {
				key:"eitm3wrjyz",
				label: "卢鹏程",
				parentKey: "eitlobj6op",
				type: "1"
			}, {
				key:"eitm3wrjz0",
				label: "刘红星",
				parentKey: "eitlobj6op",
				type: "1"
			}, {
				key:"elxgp5t1te",
				label: "唐僧",
				parentKey: "eitlobj6op",
				type: "1"
			},
			{
				key: "eitlnfga5d",
				label: "阿里",
				parentKey: "",
				type: "0"
			},
			{
				key: "eitlnfadsa",
				label: "百度",
				parentKey: "eitlnfga5d",
				type: "0"
			},
			{
				key: "eitlnfwerq",
				label: "腾讯",
				parentKey: "eitlnfadsa",
				type: "0"
			},
			{
				key:"enc1sp5b9f",
				label: "刘芳",
				parentKey: "eitlobj6op",
				type: "1"
			}
			],
		//listdata:[{key:"11",label:"风险评估"},{key:"111",label:"危害辨识"},{key:"12",label:"隐患排查"}],
		model:[{key:"elxgp5t1te",label:"唐僧"},{key:"enc1sp5b9f",label:"刘芳"}],
		treeSelectData1: [
			{
				"key" : "22",
				"createBy" : "",
				"modifyBy" : "eitm3wrjz7",
				"modifyDate" : "2016-12-01 18:38:29",
				"deleteFlag" : "0",
				"attr1" : "",
				"attr2" : "",
				"attr3" : "",
				"attr4" : "",
				"attr5" : "",
				"code" : "",
				"label" : "我的公司",
				"menuUrl" : "",
				"menuLevel" : "2",
				"parentKey" : "1",
				"remarks" : "",
				"icon" : "icon-coins",
				"systemId" : ""
			}, {
				"key" : "222",
				"createBy" : "",
				"modifyBy" : "eitm3wrjz7",
				"modifyDate" : "2016-12-04 17:26:19",
				"deleteFlag" : "0",
				"attr1" : "/businessFiles/riskAssessment/riskAssessment",
				"attr2" : "views/businessFiles/riskAssessment/riskAssessment/main",
				"attr3" : "",
				"attr4" : "",
				"attr5" : "",
				"code" : "",
				"label" : "关于我们",
				"menuUrl" : "/html/js/views/businessFiles/riskAssessment/riskAssessment/main.html",
				"menuLevel" : "3",
				"parentKey" : "11",
				"remarks" : "",
				"icon" : "",
				"systemId" : ""
			}, {
				"key" : "23",
				"createBy" : "",
				"modifyBy" : "",
				"deleteFlag" : "0",
				"attr1" : "",
				"attr2" : "",
				"attr3" : "",
				"attr4" : "",
				"attr5" : "",
				"code" : "",
				"label" : "联系我们",
				"menuUrl" : "",
				"menuLevel" : "2",
				"parentKey" : "1",
				"remarks" : "",
				"icon" : "icon-hammer",
				"systemId" : ""
			}, {
				"key" : "231",
				"createBy" : "",
				"modifyBy" : "",
				"deleteFlag" : "0",
				"attr1" : "/businessCenter/hiddenDanger/inspectionPlan",
				"attr2" : "views/businessCenter/hiddenDanger/inspectionPlan/main",
				"attr3" : "",
				"attr4" : "",
				"attr5" : "",
				"code" : "",
				"label" : "联系电话",
				"menuUrl" : "/html/js/views/businessCenter/hiddenDanger/inspectionPlan/main.html",
				"menuLevel" : "3",
				"parentKey" : "12",
				"remarks" : "",
				"icon" : "",
				"systemId" : ""
			}, {
				"key" : "223",
				"createBy" : "",
				"modifyBy" : "",
				"deleteFlag" : "0",
				"attr1" : "/businessCenter/hiddenDanger/checkRecord",
				"attr2" : "views/businessCenter/hiddenDanger/checkRecord/main",
				"attr3" : "",
				"attr4" : "",
				"attr5" : "",
				"code" : "",
				"label" : "记录",
				"menuUrl" : "/html/js/views/businessCenter/hiddenDanger/checkRecord/main.html",
				"menuLevel" : "3",
				"parentKey" : "12",
				"remarks" : "",
				"icon" : "",
				"systemId" : ""
			}, {
				"key" : "2231",
				"createBy" : "",
				"modifyBy" : "",
				"deleteFlag" : "0",
				"attr1" : "/businessCenter/hiddenDanger/radomObser",
				"attr2" : "views/businessCenter/hiddenDanger/radomObser/main",
				"attr3" : "",
				"attr4" : "",
				"attr5" : "",
				"code" : "",
				"label" : "观察",
				"menuUrl" : "/html/js/views/businessCenter/hiddenDanger/radomObser/main.html",
				"menuLevel" : "3",
				"parentKey" : "12",
				"remarks" : "",
				"icon" : "",
				"systemId" : ""
			}, {
				"key" : "21",
				"createBy" : "",
				"modifyBy" : "",
				"deleteFlag" : "0",
				"attr1" : "",
				"attr2" : "",
				"attr3" : "",
				"attr4" : "",
				"attr5" : "",
				"code" : "",
				"label" : "治理",
				"menuUrl" : "",
				"menuLevel" : "2",
				"parentKey" : "1",
				"remarks" : "",
				"icon" : "icon-folder_bookmark",
				"systemId" : ""
			}, {
				"key" : "211",
				"createBy" : "",
				"modifyBy" : "",
				"deleteFlag" : "0",
				"attr1" : "/businessCenter/hiddenGovernance/regist",
				"attr2" : "views/businessCenter/hiddenGovernance/regist/main",
				"attr3" : "",
				"attr4" : "",
				"attr5" : "",
				"code" : "",
				"label" : "登记",
				"menuUrl" : "/html/js/views/businessCenter/hiddenGovernance/regist/main.html",
				"menuLevel" : "3",
				"parentKey" : "13",
				"remarks" : "",
				"icon" : "",
				"systemId" : ""
			}, {
				"key" : "233",
				"createBy" : "",
				"modifyBy" : "",
				"deleteFlag" : "0",
				"attr1" : "/businessCenter/hiddenGovernance/assign",
				"attr2" : "views/businessCenter/hiddenGovernance/assign/main",
				"attr3" : "",
				"attr4" : "",
				"attr5" : "",
				"code" : "",
				"label" : "任务",
				"menuUrl" : "/html/js/views/businessCenter/hiddenGovernance/assign/main.html",
				"menuLevel" : "3",
				"parentKey" : "13",
				"remarks" : "",
				"icon" : "",
				"systemId" : ""
			}, {
				"key" : "234",
				"createBy" : "",
				"modifyBy" : "",
				"deleteFlag" : "0",
				"attr1" : "/businessCenter/hiddenGovernance/reform",
				"attr2" : "views/businessCenter/hiddenGovernance/reform/main",
				"attr3" : "",
				"attr4" : "",
				"attr5" : "",
				"code" : "",
				"label" : "整改",
				"menuUrl" : "/html/js/views/businessCenter/hiddenGovernance/reform/main.html",
				"menuLevel" : "3",
				"parentKey" : "13",
				"remarks" : "",
				"icon" : "",
				"systemId" : ""
			}],
		model1:[{key:"234",label:"整改"},{key:"233",label:"任务"},{key:"211",label:"登记"}],
		//model2:[{key:"11",label:"风险评估"},{key:"111",label:"危害辨识"},{key:"12",label:"隐患排查"}],
		//model3:[{key:"11",label:"风险评估"},{key:"111",label:"危害辨识"},{key:"12",label:"隐患排查"}],
		//model:[],
		//model2:[],
		//model3:[],
		//treeCheckData:[11,111,12],
		//model:[],

		valuestwo: [
			{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			},{
				"id": 1,
				"name": "John",
				"country": "UK",
				"age": 25,
			},
			{
				"id": 2,
				"name": "Mary",
				"country": "France",
				"age": 30,
			},
			{
				"id": 3,
				"name": "Ana",
				"country": "Portugal",
				"age": 20,
			}

		],
	//	polar: {
	//		title: {
	//			text: '极坐标双数值轴'
	//		},
	//		legend: {
	//			data: ['line']
	//		},
	//		polar: {
	//			center: ['50%', '54%']
	//		},
	//		tooltip: {
	//			trigger: 'axis',
	//			axisPointer: {
	//				type: 'cross'
	//			}
	//		},
	//		angleAxis: {
	//			type: 'value',
	//			startAngle: 0
	//		},
	//		radiusAxis: {
	//			min: 0
	//		},
	//		series: [
	//			{
	//				coordinateSystem: 'polar',
	//				name: 'line',
	//				type: 'line',
	//				showSymbol: false,
	//				//data: data
	//				data:[1,10,20,30,40,50,60,70,80]
	//			}
	//		],
	//		animationDuration: 2000
    //
	//},
		polar:{
			title: {
				//text: '未来一周气温变化',
				//subtext: '纯属虚构'
			},
			tooltip: {
				trigger: 'axis'
			},
			//legend: {
			//	data:['最高气温','最低气温']
			//},
			toolbox: {
				show: true,
				feature: {
					//dataZoom: {
					//	yAxisIndex: 'none'
					//},
					//dataView: {readOnly: false},
					//保留切换视图
					magicType: {type: ['line', 'bar']},
					//restore: {},
					//saveAsImage: {}
				}
			},
			xAxis:  {
				type: 'category',
				boundaryGap: false,
				data: ['周一','周二','周三','周四','周五','周六','周日']
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value} °C'
				}
			},
			series: [
				{
					name:'最高气温',
					type:'line',
					//数据
					data:[1, 11, 15, 13, 12, 13, 10],
					//设置颜色
					itemStyle : {
						normal : {
							lineStyle:{
								color:"#21ab8f"
							}
						}
					}
					//markPoint: {
					//	data: [
					//		{type: 'max', name: '最大值'},
					//		{type: 'min', name: '最小值'}
					//	]
					//},
					//markLine: {
					//	data: [
					//		{type: 'average', name: '平均值'}
					//	]
					//}
				},
				{
					name:'最低气温',
					type:'line',
					data:[1, 2, 2, 5, 3, 2, 0],
					//设置颜色
					itemStyle : {
						normal : {
							lineStyle:{
								color:"#818181"
							}
						}
					}
					//markPoint: {
					//	data: [
					//		{name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
					//	]
					//},
					//markLine: {
					//	data: [
					//		{type: 'average', name: '平均值'},
					//		[{
					//			symbol: 'none',
					//			x: '90%',
					//			yAxis: 'max'
					//		}, {
					//			symbol: 'circle',
					//			label: {
					//				normal: {
					//					position: 'start',
					//					formatter: '最大值'
					//				}
					//			},
					//			type: 'max',
					//			name: '最高点'
					//		}]
					//	]
					//}
				}
			]
		},
		//urlTree:"http://192.168.88.12/menu/list",
		//GridData:[
		//	{"id":"1","text":"商品管理","name":"name1",
		//		"children":[
		//			{"id":"11","text":"商品列表","name":"编辑",},
		//			{"id":"12","text":"添加新商品","name":"编辑",},
		//			{"id":"13","text":"商品分类","name":"编辑",
		//				//    "children":[
		//				//        {"id":"131","text":"商品列表1","name":"name11"},
		//				//]
		//			}
		//		]
		//	},
		//	{"id":"2","text":"2",
		//		"children":[
		//			{"id":"21","text":"商品列表2"},
		//		]
		//	}
		//],
		"urlTree":"http://192.168.88.12/menu/list",
		//"content" : [ {
		//	"id" : "100001000",
		//	"createDate" : "2016-10-12 10:25:55",
		//	"disable" : "0",
		//	"name" : "系统管理",
		//	"menuLevel" : "1",
		//	"children":[
		//		{"id" : "100001103", "name" : "提醒设置", "menuLevel" : "3", "parentId" : "100001100",
		//			"children":[
		//				{"id" : "100001103", "name" : "test", "menuLevel" : "3", "parentId" : "100001100"}]}]
		//}],

		movieList: [
			{
				name: '肖申克的救赎',
				url: 'https://movie.douban.com/subject/1292052/',
				rate: 9.6
			},
			{
				name: '这个杀手不太冷',
				url: 'https://movie.douban.com/subject/1295644/',
				rate: 9.4
			},
			{
				name: '霸王别姬',
				url: 'https://movie.douban.com/subject/1291546/',
				rate: 9.5
			},
			{
				name: '阿甘正传',
				url: 'https://movie.douban.com/subject/1292720/',
				rate: 9.4
			},
			{
				name: '美丽人生',
				url: 'https://movie.douban.com/subject/1292063/',
				rate: 9.5
			},
			{
				name: '千与千寻',
				url: 'https://movie.douban.com/subject/1291561/',
				rate: 9.2
			},
			{
				name: '辛德勒的名单',
				url: 'https://movie.douban.com/subject/1295124/',
				rate: 9.4
			},
			{
				name: '海上钢琴师',
				url: 'https://movie.douban.com/subject/1292001/',
				rate: 9.2
			},
			{
				name: '机器人总动员',
				url: 'https://movie.douban.com/subject/2131459/',
				rate: 9.3
			},
			{
				name: '盗梦空间',
				url: 'https://movie.douban.com/subject/3541415/',
				rate: 9.2
			}

		],

		//checkbox 数据
		social: ['facebook', 'github'],
		fruit: ['苹果'],
		single: false,
		//radioGroup  数据
		single: false,
		phone: 'apple',
		animal: '爪哇犀牛',
		//select 下拉框 数据
		cityList: [
			{
				value: 'beijing',
				label: '北京市'
			},
			{
				value: 'shanghai',
				label: '上海市'
			},
			{
				value: 'shenzhen',
				label: '深圳市'
			},
			{
				value: 'hangzhou',
				label: '杭州市'
			},
			{
				value: 'nanjing',
				label: '南京市'
			},
			{
				value: 'chongqing',
				label: '重庆市'
			}
		],
		model10: [],
		//vuetable 配置
		// 日历 数据
		calendar:{
			show:false,
//				                x:0,
//				                y:0,
//				                picker:"",
			type:"date",
			value:"",
//				                begin:"",
//				                end:"",
//				                sep:"/",
//				                weeks:[],
//				                months:[],
			range:false,
			items:{
				// 单选模式
				picker1:{
//				                        type:"date",
//				                        begin:"2016-10-1",
//				                        end:"2016-11-25",
					value:"2016-10-21",
//				                        sep:"-",
//				                        weeks:['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//				                        months:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				},
				// 2个日期模式
				picker2:{
					type:"date",
					value:"",
					range:true,
					sep:".",
				},
				// 日期时间模式
				picker3:{
					type:"datetime",
					value:"",
					sep:"-",
				},
				// 日期时间模式
				picker4:{
					type:"time",
					value:"",
				},
			}
		},

		selectedDate:null,
		selectedDateone:null,
		selectedDatetwo:null,
		//minData:null,
		//maxData:null,
		//min:selectedDate,
		////结束时间 最大值
		//max:selectedDatetwo,
		//	calendar:{
		//		begin:"2011.12.15"
		//},

		//data.calendar.begin:selectedDate
		//mindData:"min",
		//maxData:"max",
		// format:'yyyy-MM-dd',
		//bootstrap table配置属性
		showFilter: true,
		showPicker: true,
		columns: [
			{
				title:"checkbox 标题",
				fieldName:"id",
				fieldType:"cb"
			},
			{
				title:"radio 标题",
				fieldName:"id",
				fieldType:"radio"
			},
			{
				title:"id 标题",
				fieldName:"id"
			},
			{
				title:"name 标题",
				fieldName:"name"
			},
			//{
			//	title:"friend name 标题",
			//	fieldType:"custom",
			//	render: function(data){
			//		if(data && data.friend){
			//			return data.friend.name;
			//		};
			//		return "";
			//	},
			//	renderClass : "link"
            //
			//},
			//{
			//	title:"content 标题",
			//	fieldName:"content"
			//},
			{
				title:"操作",
				fieldType:"tool",
				toolType:"del"
			}
		],
		values: [

		],
		columns2: [
			{
				title:"",
				fieldName:"id",
				fieldType:"cb"
			},
			{
				title:"名称",
				fieldName:"name"
			},
			{
				title:"内容",
				fieldName:"content"
			},
			{
				title:"操作",
				fieldType:"tool",
				toolType:"view,edit,del"
			}
		],
		url:"checkmethod/list{/curPage}{/pageSize}",
		urlDelete:"checkmethod",
		filterColumn:["name"],
		selectedDatas : [

		],

		resetTriggerFlag:false,

		//step组件测试数据
		current: 0,

		//select组件测试
		modelSelect:{value:null,label:null},
		modelSelectMulti:[],
		//card组件测试
		isShowCardContent : true,

		//tree组件测试
		treeData : [{
			label: '一级 1',
			children: [{
				label: '二级 1-1'
			}]
		}, {
			label: '一级 2',
			children: [{
				label: '二级 2-1'
			}, {
				label: '二级 2-2'
			}]
		}, {
			label: '一级 3',
			children: [{
				label: '二级 3-1'
			}, {
				label: '二级 3-2'
			}]
		}],
		treeProps : {
			children: 'children',
			label: 'label'
		},
		//el-tabs测试数据
		tabsList : [],
		showTabs: false
    };
    
//    dataModel = _.extend(dataModel, treeTestData);
    //全部分类
    //配置全部分类数据
    var categoryData={
    	//添加全部分类默认显示文字
    	title:"赛为集团V",
    	config:[{
    		//是否显示设置按钮
    		NodeEdit:true,
    		//左侧类别名称
    		title:"赛为集团",
			//数据源网址  请求优先
			url:"http://sz.safewaychina.cn:10025/safeye-web/user/setting",
			//数据源
    		data:[]
    	},
    	{
    		//是否显示设置按钮
    		NodeEdit:false,
    		//左侧类别名称
    		title:"赛为集团2",
			//数据源网址
			url:"http://192.168.88.13:8081/safeye-web/risktype/list",
			//数据源
    		data:[]
    	},
    	{
    		NodeEdit:false,
    		title:"业务分类",
    		url:"",
    		data:[
    			{"id":"id310","name":"数据趋势",
          		"children":[
            		{"id":"id311","name":"检查总次数",
            		"children": [
	                        {"id": "id3111","name": "检查总次数5555"}
	                        ]
            		},
            		{"id":"id312","name":"人均检查次数"},
            		{"id":"id313","name":"平均检查次数"},
            		{"id":"id314","name":"整改率"}
          		]
    		}]
    	}]
  };
    //添加请求回馈传参
    var editResult=false;
    //绑定数据到dataModel
    dataModel = _.extend(dataModel,{categoryData:categoryData,editResult:editResult});
    var indextest=Vue.extend({
		/*************************************************************************/
		template: template,
		//DOM元素的Id
//		el: '#app_vuex',
		/*************************************************************************/
//						data: scopeData1,
		components : {
			"cb-test" : require("./checkbox/test"),
			"tree-test" : require("./tree/test"),
			"all-class" : require("./allClassification/test"),
			"formDemo" : require("./form/index"),
			"transferDemo" : require("./transfer/demo"),
			"cascaderDemo" : require("./cascader/demo"),
			"playerDemo" : require("./player/demo")
		},
		data : function() {
			return dataModel;
		},
		//DOM元素内事件调用的方法
		methods: {
			//测试select 搜索框

			vailForm:function(){
				 this.$refs.ruleform.validate(function (valid){
					 if (valid) {
			            alert('submit!');
			          } else {
			            console.log('error submit!!');
			            return false;
			          }
			        });
			},
			resetForm:function(){
				 this.$refs.ruleform.resetFields();
			},
			modifyTableColumn:function() {
				this.columns2.push(
					{
						title:"name 标题",
						fieldName:"name"
					}
				);
			},
			resetTable:function() {
				this.resetTriggerFlag = true;
			},
			changeTableDataScource : function(e) {

//					    		var resource = this.$resource('checkmethod/list/{/curPage}{/pageSize}');
//					    		resource.get({curPage:1, pageSize:10}).then(function(res){
//					    			debugger;
//					    			var data = res.data;
//					    			var pageSize = data.pageSize;
//					    			var pageNum = data.pageNum;
//					    			var total = data.total;
//					    			this.values = data.list;
//					    		});
//					    		this.url = this.url == "checkmethod/list{/curPage}{/pageSize}" ? "checkitem/list{/curPage}{/pageSize}" : "checkmethod/list{/curPage}{/pageSize}";
			},

			printSelectedDate: function() {
				console.log(this.selectedDate);
			},
			changeSelectedDate: function() {
				this.selectedDate = null;
			},
//图表
			updateCredits: function() {
				var chart = this.$refs.highcharts.chart;
				chart.credits.update({
					style: {
						color: '#' + (Math.random() * 0xffffff | 0).toString(16)
					}
				})
			},
			//打印table的selecteDatas数据
			changeSelectDataProvider: function() {
				if(this.cityList.length != 2) {
					this.cityList = [
						{
							value: 'beijing',
							label: '北京市'
						},
						{
							value: 'shanghai',
							label: '上海市'
						}
//									            {
//							                        value: 'dongjin',
//							                        label: '东京'
//							                    },
//							                    {
//							                        value: 'niuyue',
//							                        label: '纽约'
//							                    }
					];


//									this.model10 = [];
//									this.model10.push(
//				                    {
//				                        value: 'niuyue',
//				                        label: '纽约'
//				                    });

//									this.model10.$set(0, {
//									    value: 'niuyue',
//									    label: '纽约'
//									});

//									_.deepExtend(modelSelect, {
//												    value: 'niuyue',
//												    label: '纽约'
//												});

					_.extend(this.modelSelect, {
						value: 'niuyue',
						label: '纽约'
					});

				} else {
					this.cityList = [
						{
							value: 'beijing',
							label: '北京市'
						},
						{
							value: 'shanghai',
							label: '上海市'
						},
						{
							value: 'shenzhen',
							label: '深圳市'
						},
						{
							value: 'hangzhou',
							label: '杭州市'
						}
					];
//									this.model10 = [];
//									this.model10.$set(0, {
//									    value: 'beijing',
//									    label: '北京市'
//									});



//									_.deepExtend(modelSelect, {
//												    value: 'beijing',
//												    label: '北京市'
//												});

					_.extend(this.modelSelect, {
						value: 'beijing',
						label: '北京市'
					});

//									this.model10.push({
//									    value: 'beijing',
//									    label: '北京市'
//									});
				}

			},
			printSelectBindData : function() {
				console.log(this.modelSelect);
			},
			changeSelectBindData : function() {
				if(this.cityList.length == 2) {
					_.extend(this.modelSelect, {
						value: 'shenzhen',
						label: '深圳市'
					});
				}else {
					_.extend(this.modelSelect, {
						value: 'beijing',
						label: '北京市'
					});
				}
				console.log(this.modelSelect);
			},
			//select 测试
			printSelectedDatas: function() {
				console.log(this.selectedDatas);
			},
			//打印绑定的数据
			showData: function() {
				console.log(JSON.stringify(this.single));
				Modal.info({
					title: "123",
					content: "312"
				});
				this.clearSearchKey();
			},
			//测试iview全局提示组件
			info: function() {
				Message.info('这是一条普通的提醒,5s后消失', 1);
			},
			notice: function()  {
				Notice.open({
					title: '这是通知标题',
					desc: '这里是通知描述这里,是通知描述这里是通知描述这里,是通知描述这里,是通知描述这里是通知描述这里是通知描述',
					duration: 0
				});
			},

			ok: function()  {
				Message.info('点击了确定');
			},
			cancel: function()  {
				Message.info('点击了取消');
			},
			showModal: function()  {
				this.modal1 = true;
			},
			//card测试方法
			changeLimit: function()  {
				this.limitFrom = this.limitFrom === 0 ? 5 : 0;
			},

			// calendar测试方法
			open:function(e,type) {
				// 设置类型
				this.calendar.picker=type;
				this.calendar.type=this.calendar.items[type].type;
				this.calendar.range=this.calendar.items[type].range;
				this.calendar.begin=this.calendar.items[type].begin;
				this.calendar.end=this.calendar.items[type].end;
				this.calendar.value=this.calendar.items[type].value;
				// 可不用写
				this.calendar.sep=this.calendar.items[type].sep;
				this.calendar.weeks=this.calendar.items[type].weeks;
				this.calendar.months=this.calendar.items[type].months;
//
				this.calendar.show=true;
				this.calendar.x=e.target.offsetLeft;
				this.calendar.y=e.target.offsetTop+e.target.offsetHeight+8;
			},
			//bootstrap table方法
			addItem: function() {
				var self = this;
				var item = {
					"id" : this.values.length + 1,
					"name": "name " + (this.values.length+1),
					"country": "Portugal",
					"age": 26,
				};
				this.values.push(item);
			},
			toggleFilter: function() {
				this.showFilter = !this.showFilter;
			},
			togglePicker: function() {
				this.showPicker = !this.showPicker;
			},

			//气泡提示 poptip测试方法
			okPoptip:function() {
				Message.info('点击了确定')
			},
			cancelPoptip:function() {
				Message.info('点击了取消');
			},

			//step组件测试方法
			next : function() {
				if (this.current == 3) {
					this.current = 0;
				} else {
					this.current += 1;
				}
			},

			//图钉组件测试方法
			affixChange: function(status) {
				Message.info('当前状态：'+ status);
			},

			//table row事件处理
			viewRowHandler: function() {
				Message.info('viewRowHandler：'+ '');
			},
			editRowHandler: function() {
				Message.info('editRowHandler：'+ '');
			},

			//tree 组件测试方法
			handleTreeNodeClick: function() {
			},
			printPage: function() {
			},
			//tabletree事件处理
			viewTree: function(event) {
				Message.info('viewTree：'+ event);
				console.log(event);

			},

			//全部分类处理事件
//			//添加类别事件
//			doAddCategory:function(event){
//				debugger;
//				Message.info('addcategory：'+ event);
//				console.log("文本内容:"+event.item+"   父级ID:"+event.parentid+" 当前OPT INDEX:"+event.parentIndex+"当前ID:"+event.itemCode);
//				var obj={};
//					obj.id="1111";
//					obj.name="测试";
//					
//				//请求成功，请修改值
//				this.editResult=true;
////				debugger;
//			},
//			//修改类别事件
//			doEditCategory:function(event){
//				debugger;
//				Message.info('editcategory：'+ event);
//				console.log("修改内容:"+event.item+"修改ID:"+event.itemid+" 当前OPT INDEX:"+event.parentIndex);
//				//请求成功，请修改值
//				this.editResult=true;
////				debugger;
//			},
//			//删除类别事件
//			doDelCategory:function(event){
//				debugger;
//				Message.info('delcategory：'+ event);
//				console.log("删除ID:"+event.itemid+" 当前OPT INDEX:"+event.parentIndex);
//				//请求成功，请修改值
//				this.editResult = true;
//			},
//			//选中全部分类事件
//			checkCategoryVal:function(event){
//		      console.log("大类index:"+event.category.index+"大类name:"+event.category.title);
//		      console.log("选择id:"+event.val.id+"选择name:"+event.val.name);
//			}
		},
		// 处理值的传递
		watch:{
			//calendar测试方法
			'calendar.value': function (value) {
				this.calendar.items[this.calendar.picker].value=value
			},

		},
		ready:function(){
			LIB.spinMgr.spinShowAll();
			setTimeout(function(){ LIB.spinMgr.spinHideAll();},10000);
		},

	})

	
	setTimeout(function() {

//		dataModel.ttt = dataModel.selectedTreeDatas[0].id;
//		
//		setTimeout(function() {
//			dataModel.treeData2 = data2;
//		}, 1000);
		
		dataModel.tabsList = [
			{
				value: 'beijing',
				label: '北京市'
			},
			{
				value: 'shanghai',
				label: '上海市'
			}
		];
		dataModel.showTabs = true;
//		dataModel.values =
//			[
//				{
//					"id": 1,
//					"name": "John",
//					"country": "UK",
//					"age": 25,
//					"friend": {"id": 99,"name": "John's friend", "country": "Portugal","age": 20}
//				},
//				{
//					"id": 2,
//					"name": "Mary",
//					"country": "France",
//					"age": 30,
//				},
//				{
//					"id": 3,
//					"name": "Ana",
//					"country": "Portugal",
//					"age": 20,
//				},
//				{"id": 4,"name": "Ana1", "country": "Portugal","age": 20, },
//				{"id": 5,"name": "Ana2", "country": "Portugal","age": 20, },
//				{"id": 6,"name": "Ana3", "country": "Portugal","age": 20, },
//				{"id": 7,"name": "Ana4", "country": "Portugal","age": 20, }
//			];
	}, 1000);


    return indextest;
});
