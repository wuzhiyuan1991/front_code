define(function (require) {

    var LIB = require('lib');

    var initDataModel = function () {
        return {
            mainModel: {
                title: "选择外部公司人员",
                selectedDatas: []
            },
            tableModel: ({
            	url: "user/list/otherOrgan/{/curPage}{/pageSize}?disable=0",
            	selectedDatas: [],
                columns: [
                	{
                		fieldType: "cb"
					},
					{
						title : "姓名",
						fieldName : "username",
						width : "100px"
					},
					{
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
					},
					{
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
					}
				]
            })
        };
    }

    var opts = {
        mixins: [LIB.VueMixin.selectorTableModal],
        data: function () {
            var data = initDataModel();
            return data;
        },
        name: "otherOranUserSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});