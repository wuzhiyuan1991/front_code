define(function (require) {
    var LIB = require('lib');
    var template = require("text!./conditionValue.html");

    var personModel = {
        url: "user/list{/curPage}{/pageSize}?disable=0",
        selectedDatas: [],
        resetTriggerFlag:false,
        columns:[
            {
                title: "",
                fieldName: "id",
                fieldType: "radio",
            },
            {
                title:"姓名",
                fieldName:"username"
            }
            ,
            {
                title:"所属机构",
                fieldType:"custom",
                render: function(data){
                    if(data.org){
                        return data.org.name;
                    }
                }
            },
            //{
            //    title:"岗位",
            //    fieldType:"custom",
            //    render: function(data){
            //        if(data.positionList){
            //            var pos = "";
            //            data.positionList.forEach(function(e){
            //                if(e.name) {
            //                    pos = pos+"  "+e.name;
            //                }
            //            });
            //            return pos;
            //        }
            //    }
            //},
            {
                title:"上级领导",
                fieldType:"custom",
                render: function(data){
                    if(data.leader){
                        return data.leader.username;
                    }
                }
            },
            {
                title:"手机",
                fieldName:"mobile"
            },
            {
                title:"状态",
                fieldType:"custom",
                render: function(data){
                    if(data.disable == 1){
                        return "离职";
                    }
                    else if(data.disable == 0){
                        return "在职";
                    }
                }
            }
        ],
    };
    var objectModel = {
        url: "checkobject/list{/curPage}{/pageSize}",
        selectedDatas: [],

        columns: [
            {
                title: "",
                fieldName: "id",
                fieldType: "radio",
            },
            {
                title: "受检对象名称",
                orderName: "name",//排序字段
                fieldName: "name",
                fieldType: "link",
                filterType: "text"
            },
            {
                title: "负责人",
                orderName: "user.username",//排序字段
                fieldType: "custom",
                render: function (data) {
                    if (data.firstUser) {
                        return data.firstUser.username;
                    }
                },
                filterType: "text",
                filterName: "criteria.strsValue.username"
            },
            {
                title: "组织机构",
                orderName: "organization.name",
                fieldType: "custom",
                render: function (data) {
                    if (data.organization) {
                        return data.organization.name;
                    }
                },
                filterType: "text",
                filterName: "criteria.strsValue.orgname"
            },
            {
                title: "状态",
                orderName: "disable",//排序字段
                fieldName: "disable",
                filterType: "enum",
                filterName: "criteria.strsValue.disable"
            }]
    };

    var orgModel = {
        url: "organization/list{/curPage}{/pageSize}?type=2",
        selectedDatas: [],
        title:"11",
        columns: [
            {
                title: "",
                fieldName: "id",
                fieldType: "radio",

            },
            {
                title: "部门名称",
                fieldName: "name",
                filterType: "text"
            }, {
                title: "所属公司",
                fieldType: "custom",
                filterName: "parent.name",
                filterType: "text",
                render: function (data) {
                    if (data.parent) {
                        return data.parent.name;
                    }
                }

            }, {
                title: "联系电话   ",
                fieldName: "phone",
                filterType: "text"

            }
        ]
    };
    var checkPlanModel = {
        url: "checkplan/list{/curPage}{/pageSize}",
        selectedDatas: [],

        columns: [{
            title: "",
            fieldName: "id",
            fieldType: "radio",
        },
            {
                title: "检查计划名称",
                orderName: "name",
                fieldName: "name",
                fieldType: "link",
                filterType: "text"
            },
            {
                title: "开始时间",
                fieldName: "startDate"
            },
            {
                title: "结束时间",
                fieldName: "endDate"
            },
            {
                title: "检查表",
                orderName: "checktable.name",
                fieldType: "custom",
                render: function (data) {
                    if (data.checkTable) {
                        return data.checkTable.name;
                    }
                },
                filterType: "text",
                filterName: "criteria.strsValue.checktableName"
            }, {
                title: "状态",
                orderName: "disable",
                fieldType: "custom",
                render: function (data) {
                    return LIB.getDataDic("isPublished", data.disable);
                },
                popFilterEnum: LIB.getDataDicList("isPublished"),
                filterType: "enum",
                filterName: "criteria.strsValue.disable"
            }]
    };

    var positionModel = {
        url: "position/list{/curPage}{/pageSize}",
        selectedDatas: [],

        columns: [
            {
                title: "",
                fieldName: "id",
                fieldType: "radio",

            },
            {
                title: "岗位名称",
                fieldName: "name",
                fieldType: "link",
                filterType: "text",

            },
            {
                title: "岗位类型",
                fieldName: "postType",
                filterType: "enum",
                filterName: "criteria.strsValue.postType"

            },
            {
                title: "岗位职责",
                fieldName: "remarks",
                filterType: "text",
            }
        ]
    };


    var emptyTableModel = function () {
        return {
            url: "checkmethod/list{/curPage}{/pageSize}",
            selectedDatas: [],
            columns: [],
            resetTriggerFlag:false,
            filterColumn:["criteria.strValue.username", "criteria.strValue.mobile"],
        }
    };

    var checktableModel = {
        url: "checktable/list{/curPage}{/pageSize}",
        selectedDatas: [],

        columns: [{
            title: "",
            fieldName: "id",
            fieldType: "radio",
        }, {
            title: "检查表名称",
            orderName: "name",
            fieldName: "name",
            fieldType: "link",
            filterType: "text"
        }, {
            title: "分类",
            orderName: "checktabletype.name",
            fieldType: "custom",
            render: function (data) {
                if (data.checkTableType) {
                    return data.checkTableType.name;
                }
            },
            filterType: "text",
            filterName: "criteria.strsValue.checkTableTypeName"
        }, {
            title: "类型",
            orderName: "type",
            fieldType: "custom",
            render: function (data) {
                return LIB.getDataDic("checkTable_type", data.type);
            },
            popFilterEnum: LIB.getDataDicList("checkTable_type"),
            filterType: "enum",
            filterName: "criteria.strsValue.type"
        }, {
            title: "创建时间",
            fieldName: "createDate"
        }, {
            title: "状态",
            orderName: "disable",
            fieldName: "disable",
            filterType: "enum",
            filterName: "criteria.strsValue.disable"
        }]
    };

    var dataModel = {
        tableModel: emptyTableModel(),
        personValue: [],
        // 受检对象
        objectValue: ['6'],
        // 组织机构
        orgValue: ['117', '118'],
        // 检查计划
        planValue: ['7'],
        // 岗位
        positionValue: ['37'],
        // 课程
        courseValue: ['36', '30'],
        // 检查表
        tableValue: ['23'],
        // 改进记录
        type: null
    };


    var opts = {
        template: template,
        props:{
            person:{
                type:Object,
                'default':function(){
                    return {
                        id:null,
                        name:null
                    }
                }
            }
        },
        data: function () {
            return dataModel;
        },
        methods: {
            doSave: function () {
                var row = this.tableModel.selectedDatas[0];
                if (!row) {
                    LIB.Msg.warning("请选择人员");
                    return;
                }

                this.$dispatch("ev_conditionValueModel", row, this.type);

                this.tableModel.resetTriggerFlag=true;
            },
            //双击关闭modal
            onDbClickCell:function(){
                    this.visible=false;
                    this.resetTriggerFlag=!this.resetTriggerFlag;
                    this.doSave();
            },
        },
        events: {
            "ev_conditionValueReload": function (nVal, type) {
                var _this = this;
                if (nVal) {
                    _this.type = type;
                    _.deepExtend(_this.tableModel, emptyTableModel());
                    _this.tableModel.columns = [];
                    if (_.contains(_this.objectValue, nVal)) {
                        _.deepExtend(_this.tableModel, objectModel);
                    } else if (_.contains(_this.orgValue, nVal)) {
                        _.deepExtend(_this.tableModel, orgModel);
                    } else if (_.contains(_this.planValue, nVal)) {
                        _.deepExtend(_this.tableModel, checkPlanModel);
                    } else if (_.contains(_this.positionValue, nVal)) {
                        _.deepExtend(_this.tableModel, positionModel);
                    } else if (_.contains(_this.courseValue, nVal)) {
                        _.deepExtend(_this.tableModel, courseModel);
                    } else if (_.contains(_this.tableValue, nVal)) {
                        _.deepExtend(_this.tableModel, checktableModel);
                    } else {
                        _.deepExtend(_this.tableModel, personModel);
                    }
                }
            }
        }
    };
    var demo = LIB.Vue.extend(opts);
    return demo;
});