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
					url:"trainplan/users/latesttrainlist{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
						fieldType: "cb"
					},
						{
							title : "姓名",
							fieldName : "username",
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
								if(data.positionList){
									var posNames = "";
									data.positionList.forEach(function (e) {
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
								if(data.positionList){
									var roleNames = "";
									data.positionList.forEach(function (e) {
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
							title:"培训状态",
							fieldType : "custom",
							render : function(data){
								return LIB.getDataDic("train_task_status",data.status);
							},
							width : "100px"
						}
	                ],
	                filterColumn:["criteria.strValue.selectUserWord"],
	                defaultFilterValue : {"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},"criteria.intValue.hasPassed":0,"criteria.strValue.selectFlag":"trainplan"},
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