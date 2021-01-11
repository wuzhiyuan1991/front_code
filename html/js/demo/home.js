
define(function(require) {
    var template = require("text!./home.html");
	var Vue = require("vue");
	//培训计划
	var userComponent = require("./homePop/homePage");
	//
//新版首页模拟数据
	var modelData={
		//代办事项
		showTabs: true,
		tabsList : [
			{
				//value: 'beijing',
				label: '待检查',
				children:[{
					Nuber:"类型",
					Matter:"事项",
					Name:"发起人",
					StartTime:"发起时间",
					EndTime:"结束时间",
						childrens:[{
						Nuber:"待检查",
						Matter:"已经完成",
						Name:"陈",
						StartTime:"2015-10-20",
						EndTime:"2015-10-30",
						},
						{
						Nuber:"待检查",
						Matter:"已经完成",
						Name:"陈",
						StartTime:"2015-10-20",
						EndTime:"2015-10-30",
						},
						{
						Nuber:"待检查",
						Matter:"已经完成",
						Name:"陈",
						StartTime:"2015-10-20",
						EndTime:"2015-10-30",
						}]
				}]
			},
			{

				label: '待审核',
				children:[{
					Nuber:"类型",
					Matter:"事项",
					Name:"发起人",
					StartTime:"发起时间",
					EndTime:"结束时间",
					childrens:[{
						Nuber:"待检查",
						Matter:"未完成",
						Name:"王",
						StartTime:"2014-8-3",
						EndTime:"2014-9-25",
					}]
				}]
			},
			{

				label: '待分配',
				children:[{
					Nuber:"类型",
					Matter:"事项",
					Name:"发起人",
					StartTime:"发起时间",
					EndTime:"结束时间",
					childrens:[{
						Nuber:"待检查",
						Matter:"停止中",
						Name:"李",
						StartTime:"2015-5-20",
						EndTime:"2015-7-14",
					}]
				}]
			},
			{
				label: '待整改',
				children:[{
					Nuber:"类型",
					Matter:"事项",
					Name:"发起人",
					StartTime:"发起时间",
					EndTime:"结束时间",
					childrens:[{
						Nuber:"待检查",
						Matter:"已经完成",
						Name:"刘",
						StartTime:"2011-1-23",
						EndTime:"2012-2-18",
					}]
				}]
			},
			{
				label: '待验证',
				children:[{
					Nuber:"类型",
					Matter:"事项",
					Name:"发起人",
					StartTime:"发起时间",
					EndTime:"结束时间",
					childrens:[{
						Nuber:"待检查",
						Matter:"未完成",
						Name:"陈",
						StartTime:"2014-3-20",
						EndTime:"2017-5-30",
					}]
				}]
			}
		],
		//我的培训
		TrainingData:[
			{
			name:"动火作业",
			way:"自学"
			},
			{
				name:"防御性驾驶",
				way:"实操"
			},
			{
				name:"防御性驾驶",
				way:"培训"
			},
			{
				name:"国际安保培训",
				way:"培训"
			},
			{
				name:"高级风险管理实践",
				way:"实操"
			}

		],
//日历
		fcEvents:[{
		title: 'Sunny 725-727',
		start: '2016-07-25',
		end: '2016-07-27',
		cssClass: 'family'
	}, {
		title: 'Sunny 726-727',
		start: '2016-07-26',
		end: '2016-07-27',
		cssClass: ['home', 'work']
	}, {
		title: 'Sunny 727-728',
		start: '2016-07-27',
		end: '2016-07-28'
	}],
		//图表模拟数据
		polarCharts:{
			title: {
				//text: '未来一周气温变化',
				//subtext: '纯属虚构'
			},
			tooltip: {
				trigger: 'axis'
			},
			toolbox: {
				show: true,
				feature: {
					//保留切换视图
					magicType: {type: ['line', 'bar']},
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
				}
			]
		},
				//符合率排名图表
		bar:{
			title: {
				//text: '未来一周气温变化',
				//subtext: '纯属虚构'
			},
			tooltip: {
				trigger: 'axis'
			},
			toolbox: {
				show: true,
				feature: {
					//保留切换视图
					magicType: {type: ['line', 'bar']},
				}
			},
			xAxis:  {
				type: 'category',
				boundaryGap: false,
				data: ['11','12','13','14','15','16','17']
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
					data:[11, 33, 5, 8, 12, 13, 10],
					//设置颜色
					itemStyle : {
						normal : {
							lineStyle:{
								color:"#21ab8f"
							}
						}
					}
				},
				{
					name:'最低气温',
					type:'line',
					data:[4, 6, 8, 23, 12, 15, 10],
					//设置颜色
					itemStyle : {
						normal : {
							lineStyle:{
								color:"#818181"
							}
						}
					}
				}
			]

		},

		//个人报表 tab切换数据
		activeIndex: 0,
		showActive:true,
		hideActive:false,
		tabItem:[
			{name: '检查次数排名'},
			{name: '符合率排名'}
		],
		//弹框配置
		userModel:{
			//显示弹框
			show : false,
			title:"培训计划",
		},
	}
//首页效果
var home=Vue.extend({
	template: template,
	components : {
		"usercomponent":userComponent
	},
	data:function(){
		return modelData;
	},

	methods:{
		changeIndex: function(item) {
			this.activeIndex = item
			if(this.activeIndex==1){
				this.showActive=false;
				this.hideActive=true;
			}
			else{
				this.showActive=true;
				this.hideActive=false;
			}
		},
		//弹窗
		addUser:function(){
			this.userModel.show = true;
			//this.$broadcast('ev_userReload',dataModel.mainModel.vo);
		},
		next:function(){
			//console.log(this.$refs.canendar.$children[0]);
			//因为有多个子组件 所以通过数组的形式去获取这个方法
			this.$refs.canendar.$children[0].goNext(function(){
				console.log("a");
			})
		},
		prev:function(){
			this.$refs.canendar.$children[0].goPrev(function(){
				console.log("sad");
			})
		},
		changeMonth:function (start, end, current) {
			console.log('changeMonth', start, end, current)
		},
		eventClick:function eventClick(event, jsEvent, pos) {
			console.log('eventClick', event, jsEvent, pos)
		},
		dayClickDemo:function (day, jsEvent) {
			console.log('dayClick', day, jsEvent)
		},
		moreClick:function moreClick(day, events, jsEvent) {
			console.log('moreCLick', day, events, jsEvent)
		},
	},
	events : {
		//弹层点击隐藏 取消
		"ev_editCanceled" : function() {
			this.userModel.show = false;
		},
		////刷新
		//"treeRefresh" : function(){
		//	this.$refs.ruletree.isreday(function(){
		//	})
		//}
	},
	//初始化
	ready:function(){
		console.log(this);
		console.log(this.$refs.bar);
		var _this=this;
	//	setTimeout(function(){
	//		_this.$refs.bar.mergeOptions({
	//			xAxis: {
	//				data: [55,66,77,88,99,10.21]
	//			},
	//			series: [{
	//				name: '销量',
	//				data: [4, 6, 8, 23, 12, 15, 10]
	//			}]
	//		})
	//}, 3000)


}

})
	return home;
    //return {
	//	home:home,
	//	//indextest:indextest
    //
	//};
});
