define(function (require) {
    var LIB = require('lib');
    var template = require("text!./edit.html");
    var personModel = {
        url: "user/list{/curPage}{/pageSize}",
        selectedDatas: [],
        columns: [
            {
                title: "",
                fieldName: "id",
                fieldType: "cb",
            },
            {
                title: "姓名",
                fieldName: "username",
                filterType: "text"
            }, {
                title: "所属岗位",
                fieldType: "custom",
                render: function (data) {
                    if (data.positionList) {
                        var pos = "";
                        if (!_.isEmpty(data.positionList)) {
                            data.positionList.forEach(function (e) {
                                pos += (e.name + ",");
                            });
                            pos = pos.substr(0, pos.length - 1);
                        }
                        return pos;
                    }
                }
            }, {
                title: "所属部门",
                fieldType: "custom",
                filterName: "criteria.strValue.orgName",
                filterType: "text",
                render: function (data) {
                    if (data.org) {
                        return data.org.name;
                    }
                }
            },
            {
                title: "手机",
                fieldName: "mobile",
                filterType: "text"
            }]
    };
    var objectModel = {
        url: "checkobject/list{/curPage}{/pageSize}",
        selectedDatas: [],

        columns: [
            {
                title: "",
                fieldName: "id",
                fieldType: "cb",
            }, {
                title: "受检对象名称",
                orderName: "name",//排序字段
                fieldName: "name",
                fieldType: "link",
                filterType: "text"
            }, {
                title: "负责人",
                orderName: "user.username",//排序字段
                fieldType: "custom",
                render: function (data) {
                    if (data.firstUser) {
                        return data.firstUser.username;
                    }
                },
                filterType: "text",
                filterName: "criteria.strValue.username"
            }, {
                title: "组织机构",
                orderName: "organization.name",
                fieldType: "custom",
                render: function (data) {
                    if (data.organization) {
                        return data.organization.name;
                    }
                },
                filterType: "text",
                filterName: "criteria.strValue.orgname"
            }, {
                title: "状态",
                orderName: "disable",//排序字段
                fieldName: "disable",
                filterType: "enum",
                filterName: "criteria.intsValue.disable"
            }]
    };

    var orgModel = {
        url: "organization/list{/curPage}{/pageSize}?type=2",
        selectedDatas: [],

        columns: [
            {
                title: "",
                fieldName: "id",
                fieldType: "cb",

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
                filterName: "criteria.strValue.parentName",
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

        columns: [
            {
                title: "",
                fieldName: "id",
                fieldType: "cb",
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
                filterName: "criteria.strValue.checkTableTypeName"
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
                filterName: "criteria.intsValue.disable"
            }
        ]
    };

    var positionModel = {
        url: "position/list{/curPage}{/pageSize}",
        selectedDatas: [],

        columns: [
            {
                title: "",
                fieldName: "id",
                fieldType: "cb",

            },
            {
                title: "岗位名称",
                fieldName: "name",
                fieldType: "link",
                filterType: "text",

            }, {
                title: "岗位类型",
                fieldName: "postType",
                filterType: "enum",
                popFilterEnum: LIB.getDataDicList("postType"),
                filterName: "criteria.intsValue.postType"

            }, {
                title: "岗位职责",
                fieldName: "remarks",
                filterType: "text",
            }
        ]
    };

    var courseModel = {
        url: "course/detaillist{/curPage}{/pageSize}",
        selectedDatas: [],

        columns: [
            {
                title: "",
                fieldName: "id",
                fieldType: "cb",
            }, {
                title: "课程名称",
                fieldName: "name",
                fieldType: "link",
                filterType: "text"
            }, {
                title: "课程等级",
                fieldType: "custom",
                render: function (data) {
                    return LIB.getDataDic("course_level", data.level);
                },
                filterType: "enum",
                filterName: "criteria.intsValue.level",
                orderName: "level",
                popFilterEnum: LIB.getDataDicList("course_level")
            }, {
                title: "培训方式",
                fieldType: "custom",
                render: function (data) {
                    return LIB.getDataDic("course_type", data.type);
                },
                filterType: "enum",
                filterName: "criteria.intsValue.type",
                orderName: "type",
                popFilterEnum: LIB.getDataDicList("course_type")
            }, {
                title: "有效期",
                fieldType: "custom",
                render: function (data) {
                    if (data.frequence != null && data.frequence != 0) {
                        return data.frequence + "年";
                    } else if (data.frequence == 0) {
                        return "永久"
                    } else {
                        return "";
                    }
                }
            }
        ]
    };

    var emptyTableModel = function () {
        return {
            url: "checkmethod/list{/curPage}{/pageSize}",
            selectedDatas: [],
            columns: []
        }
    };

    var checktableModel = {
        url: "checktable/list{/curPage}{/pageSize}",
        selectedDatas: [],

        columns: [{
            title: "",
            fieldName: "id",
            fieldType: "cb",
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
                return LIB.getDataDic("checkTable_type")[data.type];
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
        orgValue: ['24', '12'],
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
        data: function () {
            return dataModel;
        },
        methods: {
            doSave: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("只能选择一个!");
                    return;
                }
                //this.$dispatch("ev_editModelCanceled", rows[0], this.type);
            }
        },
        events: {
            "ev_editReload": function (nVal, type) {
                var _this = this;
                if (nVal) {
                    _this.type = type;
                    _.deepExtend(_this.tableModel, emptyTableModel());
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