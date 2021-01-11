define(function(require) {
	var LIB = require('lib');
    var template = require("text!./main.html");
    var actions = require("./vuex/actions");
    var api = require("./vuex/api");
	//培训计划
	var userComponent = require("./homePop/homePage");
	//报表组件
	var reportTabsComponent = require("views/reportManagement/components/reportTabsComponent");

//新版首页模拟数据
	var modelData={
		tabsList : [
			//{
			//	//value: 'beijing',
			//	label: '待办',
			//	children:[{
			//		Nuber:"类型",
			//		Matter:"事项",
			//		Name:"发起人",
			//		StartTime:"发起时间",
			//		EndTime:"结束时间",
			//			childrens:[{
			//			Nuber:"待检查",
			//			Matter:"已经完成",
			//			Name:"陈",
			//			StartTime:"2015-10-20",
			//			EndTime:"2015-10-30",
			//			},
			//			{
			//			Nuber:"待检查",
			//			Matter:"已经完成",
			//			Name:"陈",
			//			StartTime:"2015-10-20",
			//			EndTime:"2015-10-30",
			//			},
			//			{
			//			Nuber:"待检查",
			//			Matter:"已经完成",
			//			Name:"陈",
			//			StartTime:"2015-10-20",
			//			EndTime:"2015-10-30",
			//			}]
			//	}]
			//},
			//{
            //
			//	label: '已完成',
			//	children:[{
			//		Nuber:"类型",
			//		Matter:"事项",
			//		Name:"发起人",
			//		StartTime:"发起时间",
			//		EndTime:"结束时间",
			//		childrens:[{
			//			Nuber:"待检查",
			//			Matter:"停止中",
			//			Name:"李",
			//			StartTime:"2015-5-20",
			//			EndTime:"2015-7-14",
			//		}]
			//	}]
			//},
		],
		//我的培训
		trainingData:[
			{
				
			}

		],
		todoList:[],
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
				},
				//设置切换的位置
				right:35
			},
			xAxis:  {
				type: 'category',
				boundaryGap: false,
				data: ['周一','周二','周三','周四','周五','周六','周日']
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value}'
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
				},
				//设置切换的位置
				right:35
			},
			xAxis:  {
				type: 'category',
				boundaryGap: false,
				data: ['11','12','13','14','15','16','17']
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value}'
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
		//
		isShowTabs:false
	}

//首页效果
var home = LIB.Vue.extend({
	mixins : [LIB.VueMixin.dataDic],
	template: template,
	components : {
		"usercomponent":userComponent,
		"report-tabs-component":reportTabsComponent
	},
	data:function(){
		return modelData;
	},

	methods:{
		//控制台点击切换
		doTabs:function(data){
			var index = parseInt(data.key) - 1;
			var _this = this;
			api.listTodo({"criteria.intValue":{status:index}}).then(function(res){
				_this.tabsList = res.data.list;
			});
		},
		doChangeIndex: function(item) {
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
		//检查计划跳转路由链接
		doAddInspectionPlan:function(){
			var routerPart="/businessCenter/hiddenDanger/inspectionPlan?method=create";
			this.$router.go(routerPart);
		},
		//我的培训跳转路由链接
		doToTrainingActuality:function(id){
			window.isClickTrainingTaskExecutBtn = true;
			var routerPart="/businessCenter/trainingManagement/myTraining?method=detail&id="+id;
			this.$router.go(routerPart);
		},
		//待办跳转路由链接
		doTodo:function(type,id,isComplete){
             var router = LIB.ctxPath("/html/main.html#!");
			if((type == 1 || type == 2 || type == 3 || type == 11) && isComplete == 1) {
				window.isClickPoolTotalExecutBtn = true;
				var routerPart="/businessCenter/hiddenGovernance/total?method=detail&opt=isClickPoolTotalExecutBtn&id="+id;
                window.open(router + routerPart);
				//this.$router.go(routerPart);
			}else if(type == 1) {
                //window.isClickPoolRegistExecutBtn = true;
                window.isClickPoolAssignExecutBtn = true;
                //var routerPart="/businessCenter/hiddenGovernance/regist?method=detail&id="+id;
                var routerPart="/businessCenter/hiddenGovernance/assign?method=detail&opt=isClickPoolAssignExecutBtn&id="+id;
                window.open(router + routerPart);
				//this.$router.go(routerPart);
			}else if(type == 2) {
				window.isClickPoolReformExecutBtn = true;
				var routerPart="/businessCenter/hiddenGovernance/reform?method=detail&opt=isClickPoolReformExecutBtn&id="+id;
                window.open(router + routerPart);
				//this.$router.go(routerPart);
			}else if(type == 3) {
				window.isClickPoolVerifyExecutBtn = true;
				var routerPart="/businessCenter/hiddenGovernance/verify?method=detail&opt=isClickPoolVerifyExecutBtn&id="+id;
                window.open(router + routerPart);
				//this.$router.go(routerPart);
			}else if(type == 5) {
				window.isClickCheckTaskExecutBtn = true;
				var routerPart="/businessCenter/hiddenDanger/inspectionTask?method=detail&opt=isClickCheckTaskExecutBtn&id="+id;
                window.open(router + routerPart);
				//this.$router.go(routerPart);
			}else if(type == 11) {
				window.isClickPoolAssignExecutBtn = true;
				var routerPart="/businessCenter/hiddenGovernance/assign?method=detail&opt=isClickPoolAssignExecutBtn&id="+id;
                window.open(router + routerPart);
				//this.$router.go(routerPart);
			}
			
		},
		//弹窗
		doAddUser:function(){
			this.userModel.show = true;
			//this.$broadcast('ev_userReload',dataModel.mainModel.vo);
		},
		doNext:function(){

			//因为有多个子组件 所以通过数组的形式去获取这个方法
			this.$refs.canendar.$children[0].goNext(function(){
			})
		},
		doPrev:function(){
			this.$refs.canendar.$children[0].goPrev(function(){
			})
		},
		changeMonth:function (start, end, current) {
			//console.log('changeMonth', start, end, current)
		},
		eventClick:function eventClick(event, jsEvent, pos) {
			//console.log('eventClick', event, jsEvent, pos)
		},
		dayClickDemo:function (date, jsEvent){ 
			var routerPart="/businessCenter/hiddenDanger/inspectionPlan";
			this.$router.go(routerPart);

			var searchData = {};
			searchData.value = {displayName:"日期", filterName: "criteria.dateValue.inspectionDate", filterValue : date.Format("yyyy-MM-dd")};
			searchData.code = LIB.ModuleCode.BC_Hal_InsP;
			this.updateSearchKey(searchData);
			
		},
		moreClick:function moreClick(day, events, jsEvent) {
			// console.log('moreCLick', day, events, jsEvent)
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
		var _this=this;
		// console.log(LIB.setting)
		for ( var i in LIB.setting.dataDic.tool_type){
			var arr ={name:LIB.setting.dataDic.tool_type[i]}
			_this.todoList.push(arr);
		}
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
		api.listMyTraining().then(function(res){
			_this.trainingData = res.data.list;
		});
		api.listTodo({"criteria.intValue":{status:0}}).then(function(data){
			_this.tabsList = data.data.list;
		});
		_this.isShowTabs = true;
	},
	//vuex 提供数据和事件响应
	vuex :{
		actions: {
			updateSearchKey:actions.updateSearchKey
		}
	}

})
	return home;
});
