define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var courseSelectModal = require("componentsEx/selectTableModal/courseSelectModal");
	var positionSelectModal = require("componentsEx/selectTableModal/positionSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//矩阵主键
			id : null,
			//组织机构id
			compId : null,
			name:null,
			////修改日期
			//modifyDate : null,
			////创建日期
			//createDate : null,
			////课程
			course : [],
			////岗位
			positionId:null,
			orgId:null

		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			type:"0",
			position:{id:'', name:''},//岗位桥接变量
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"type" : [{required: true, message: '请选择岗位/角色'}],
				"compId":[{required: true, message: '请选择所属公司'}],
				"position.id":[{required: true, message: '请选择岗位'}]
	        },
	        emptyRules:{}
		},
		tableModel : {
			courseCategoryTableModel:{
				url:"coursematrix/position/courses/list/{curPage}/{pageSize}",
				columns : [{
					title : "编码",
					fieldName : "code"
				},{
					title : "名称",
					fieldName : "name",
				},{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			}
		},
		formModel : {
		},
		cardModel : {
			courseCategoryCardModel:{
				showContent:true
			}
		},
		selectModel : {
			courseSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			positionSelectModel : {
				visible : false,
				filterData : {"criteria.strValue.orderType" : null}
			},
			roleSelectModal : {
				visible : false,
				filterData : {orgId : null}
			},
		},
		selectedDatas:[],
	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
	 template
	 components
	 componentName
	 props
	 data
	 computed
	 watch
	 methods
	 events
	 vue组件声明周期方法
	 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			"courseSelectModal":courseSelectModal,
			"positionSelectModal":positionSelectModal,
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowCourseSelectModal : function() {
				this.selectModel.courseSelectModel.visible = true;
				this.selectModel.courseSelectModel.filterData = {disable : 0,"criteria.strValue":{excludePositionId:this.mainModel.vo.id}};
			},
			doSaveCourse : function(selectedDatas) {
				var _this = this;
				_this.selectedDatas = _this.selectedDatas.concat(selectedDatas);
				if (selectedDatas) {
					dataModel.mainModel.vo.course = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveCourses({positionId:_this.mainModel.vo.id},param).then(function(){
						_this.refreshTableData(_this.$refs.courseTable);
						_this.$emit("do-detail-finshed")
						})
					};
			},
			doRemoveCourseCategories:function(item){
				var _this = this;
				if(!_this.hasPermission('4020006003')){
					LIB.Msg.warning("没有删除权限");
					return;
				}
				var data = item.entry.data;
				api.remove({positionId:_this.mainModel.vo.id,courseId : data.id}).then(function() {
					_this.$refs.courseTable.doRefresh();
					_this.$emit("do-detail-finshed")
				});
			},
			//岗位modal
			doShowPositionSelectModal : function() {
				this.selectModel.positionSelectModel.visible = true;
				this.selectModel.positionSelectModel.filterData = {"criteria.strValue.orderType" : this.mainModel.type};
			},
			//安全角色modal
			doShowHseSelectModal:function(){
				this.selectModel.positionSelectModel.visible = true;
				this.selectModel.positionSelectModel.filterData = {"criteria.strValue.orderType" : this.mainModel.type};
			},
			doSavePosition : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.position = selectedDatas[0];
				}
			},
			doSave:function(){
				var _this = this;
				var _data = _this.mainModel;
				var _vo = _data.vo;
				//if(!_this.mainModel.position.id){
				//	_this.mainModel.type== 0 ? LIB.Msg.warning("请选择岗位"):LIB.Msg.warning("请选择安全角色");
				//	return;
				//}
				//课程为null 就不能保存
				if(_this.selectedDatas.length <= 0){
					LIB.Msg.warning("请选择对应课程");
					return;
				}
				this.$refs.ruleform.validate(function (valid){
					if (valid) {
						//_vo.positionId = _vo.id;
						var arrList = [];
						_.each(_vo.course,function(item){
							var arr ={
								id:item.id,
							}
							arrList.push(arr);
						})
						_vo.course = arrList;
							api.saveCourses({positionId:_vo.id},arrList).then(function(res){
								LIB.Msg.info("保存成功");
								_this.$emit("do-detail-finshed")
							});

					} else {
					}
				});
			},

		},
		events : {
			"ev_dtReload":function(id,val){
				var _vo = dataModel.mainModel.vo;
				var _data = dataModel.mainModel;
				var _this = this;
				//清空数据
				_.extend(_vo,newVO());
                this.mainModel.type = null;
                this.mainModel.type = val;
				//this.mainModel.position = {id:'', name:''};
				this.selectedDatas = [];
				//通过id去获取岗位跟角色详情
				api.getHse({id:id}).then(function(res){
					_.deepExtend(_vo, res.data);
					_this.$refs.courseTable.doQuery({id : _this.mainModel.vo.id});
				})
				api.countByPosition({id:id}).then(function(res){
					
				});
				api.statisticsByPosition({id:id,postType:0}).then(function(res){
					
				});
				
				api.statisticsByCourse({id:'esqtq4ypnc','criteria.intValue':{postType:0}}).then(function(res){
					
				});
				this.$refs.courseTable.doClearData();

				//this.mainModel.type = type;

			}
		},
        init: function(){
        	this.$api = api;
        }
	});

	return detail;
});