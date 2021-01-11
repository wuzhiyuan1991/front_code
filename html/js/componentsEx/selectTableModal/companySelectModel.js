define(function(require) {

    var LIB = require('lib');
    var rebuildOrgName = function(id, type, name) {

        var spliteChar = " / ";

        var curOrgName = name || '';

        //if(type == 'comp') {
        //	return LIB.getDataDic("org", id)["compName"];
        //} else if(type == 'dept') {
        //	return LIB.getDataDic("org", id)["deptName"];
        //}

        //var orgFieldName = type == "comp" ? "compName" :"deptName";
        //使用公司简称csn(company short name)代替compName
        var orgFieldName = type == "comp" ? "csn" : "deptName";

        if (BASE.setting.orgMap[id]) {

            if (curOrgName != '') {
                var orgName = LIB.getDataDic("org", id)[orgFieldName]

                //如果渲染的组织结构是部门, 通过DataDic获取的值为undefine，则表示父级是公司了，则当前是顶级部门, 直接返回即可
                if (orgName != undefined) {
                    curOrgName = orgName + spliteChar + curOrgName;
                } else {
                    return curOrgName;
                }
            } else {
                curOrgName = LIB.getDataDic("org", id)[orgFieldName];
            }

            var parentId = BASE.setting.orgMap[id]["parentId"];

            //不存在父级组织机构了,则表示是顶级组织机构
            if (!!parentId) {

                //部门的 id==parentId 时表示是顶级部门
                if (id == parentId) {
                    return curOrgName;
                }
                curOrgName = rebuildOrgName(parentId, type, curOrgName);
            }
        }
        return curOrgName;
    };


    var initDataModel = function () {
        return {
            mainModel:{
                title:"选择",
                selectedDatas:[]
            },
            tableModel: (
                {
                    url: "organization/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                            width:"60px"
                        },
                        // {
                        //     title: '编码',
                        //     fieldName: "code",
                        //     width: 180,
                        // },
                        // {
                        //     title: "cb",
                        //     fieldName: "id",
                        //     fieldType: "cb",
                        //     width:"8%"
                        // },
                        {
                            title: "所属公司",
                            fieldName: "name",
                            width:"700px"
                        },
                        // _.omit({
                        //         title: "所属公司",
                        //         fieldType: "custom",
                        //         render: function(data) {
                        //             if (data.compId) {
                        //                 return rebuildOrgName(data.compId, 'comp');
                        //             }
                        //         },
                        //         filterType: "text",
                        //         filterName: "criteria.strValue.compName",
                        //         fieldName: "compId",
                        //         width: "92%"
                        //     },
                        //     "filterType"),

                        // _.omit(LIB.tableMgr.column.company, "filterType"),
                        //LIB.tableMgr.column.company,
//					{
//						//公司地址
//						title: "公司地址",
//						fieldName: "address",
//					},
//					{
//						//经纬度
//						title: "经纬度",
//						fieldName: "coordinate",
//					},
//					{
//						//是否禁用 0启用,1禁用
//						title: "是否禁用",
//						fieldName: "disable",
//					},
//					{
//						//机构等级
//						title: "机构等级",
//						fieldName: "level",
//					},
//					{
//						//机构电话
//						title: "机构电话",
//						fieldName: "phone",
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//					},
//					{
//						//机构类型 1:机构,2:部门
//						title: "机构类型",
//						fieldName: "type",
//					},
//					{
//						//修改日期
//						title: "修改日期",
//						fieldName: "modifyDate",
//					},
//					{
//						//创建日期
//						title: "创建日期",
//						fieldName: "createDate",
//					},
                    ],

                    defaultFilterValue : {"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},"type" : 1, "disable": 0},
                    resetTriggerFlag:false
                }
            )
        };
    }

    var opts = {
        mixins : [LIB.VueMixin.selectorTableModal],
        data: initDataModel,
        name: "deptSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});