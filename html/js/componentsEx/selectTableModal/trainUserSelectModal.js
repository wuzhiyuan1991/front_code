define(function(require) {

	var LIB = require('lib');
	
	var initDataModel = function () {
        return {
        	mainModel:{
				title:"选择人员",
				selectedDatas:[]
			},
            tableModel: (
	            {
	                //url: "user/list{/curPage}{/pageSize}?disable=0",
					url:"trainplan/traintasks/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
						fieldType: "cb"
					},
						{
							title : "姓名",
							fieldName : "user.name",
							width : "100px"
						},{
							title : "所属公司",
							fieldType : "custom",
							render: function(data){
								if(data.compId){
									return LIB.getDataDic("org", data.compId)["compName"];
								}
							},
							width : "100px"
						},
						{
							title : "所属部门",
							fieldType : "custom",
							render: function(data){
								if(data.orgId){
									return LIB.getDataDic("org", data.orgId)["deptName"];
								}
							},
							width : "100px"
						},{
							title:"岗位",
							fieldType:"custom",
							render: function(data){
								if(_.propertyOf(data.user)("positionList")){
									var posNames = "";
									data.user.positionList.forEach(function (e) {
										if(e.postType == 0){
											posNames += (e.name + "/");
										}
									});
									posNames = posNames.substr(0, posNames.length - 1);
									return posNames;

								}
							},
							width : "100px"
						},
						{
							title:"安全角色",
							fieldType:"custom",
							render: function(data){
								if(_.propertyOf(data.user)("positionList")){
									var roleNames = "";
									data.user.positionList.forEach(function (e) {
										if(e.postType == 1){
											roleNames += (e.name + "/");
										}
									});
									roleNames = roleNames.substr(0, roleNames.length - 1);
									return roleNames;

									}
							},
							width : "100px"
						},{
							//title : "任务类型",
							title:"任务类型",
							fieldType : "custom",
							render : function(data){
								return LIB.getDataDic("train_task_type",data.source);
							},
							width : "100px"
						},
						{
							title: "培训结果",
							fieldType: "custom",
							render: function (data) {
								var status = data.status;
								if (data.course.type == 1 && data.status == 2 && data.endTime < data.trainDate) {
									status = '7';
								}
								if(data.course.type == 1 && data.status == 0 && new Date(data.endTime).getTime() < new Date().getTime()) {
									status = '6';
								}

								var item = LIB.getDataDic('train_task_result', status);

								if (status == 2 || status == 7) {
									return "<span style='color:#009900'>" + item + "</span>"
								} else if (status == 1 || status == 3) {
									return "<span style='color:red'>" + item + "</span>"
								} else {
									return "<span style='color:#8c6666'>" + item + "</span>"
								}

							},
							tipRender: function (data) {
								var item = LIB.getDataDic('train_task_result', data.status);
								return item
							},
							width: 150
						}
	                ],
	                defaultFilterValue : {"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"}},
	                resetTriggerFlag:false
	            }
            )
        };
    }
	
	var opts = {
		mixins : [LIB.VueMixin.selectorTableModal],
		data:function(){
			var data = initDataModel();
			return data;
		},
		name:"trainUserSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});