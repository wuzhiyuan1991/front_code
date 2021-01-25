define(function (require) {
    var LIB = require("lib");
    var api = require("./vuex/api");
    var template = require("text!./objSelect.html");
    var customType;
    var types = ["per", "frw", "dep", "equip"];
    var opts = {
        template: template,
        props: {
            type: { //frw-公司,dep-部门,per-人员,equip-设备设施
                type: String,
                'default': 'dep'
            },
            disabled: Boolean,
            values: Array,
            subjectMatterType: false,
            mechanismType: false,
            openDeep: 2,
            modelType: '' //数据缓存标识
        },
        data: function () {
            return {
                show: false,
                treeData: [],
                customFunc: function (item) {
                    //判断是否选择的为人员 公司 或者部门 设备设施
                    var results = {
                        "1": "<span class='reportCompModalIco reportModalCustomIco'></span>",
                        "2": "<span class='reportDeptModalIco reportModalCustomIco'></span>",
                        "3": "<span class='reportUserModalIco reportModalCustomIco'></span>",
                        "4": "<span class='reportDeviModalIco reportModalCustomIco'></span>"
                    };
                    if (_.includes(types, customType)) {
                        return results[item.type];
                    } else {
                        return '';
                    }
                }
            }
        },
        computed: {
            // 弹窗的标题
            showTitle: function () {
                var titles = {
                    "frw": "选择公司",
                    "dep": "选择部门",
                    "per": "选择人员",
                    "equip": "选择设备设施",
                    "teacher": "选择讲师",
                    "course": "选择课程",
                    "equipitem": "选择设备设施子件"
                };
                if (_.includes(_.keys(titles), this.type)) {
                    return titles[this.type];
                }
                return '选择';
            },
            // 选择父级是否全选子级
            parentNode: function () {
                return _.contains(["dep", 'per', 'equip', 'teacher', 'equipitem'], this.type);
            },
            isDepart: function () {
                return "dep" === this.type;
            },
            showFixIco: function () {
                return _.includes(types, this.type);
            }
        },
        watch: {
            type: function (type) {
                customType = type;
                this.loadTreeData(type);
            }
        },
        methods: {
            loadTreeData: function (type) {
                this.modelType = type;
                this.openDeep = 2;
                var _this = this;
                this.treeData = [];
                var qryParam = {
                    //doOrgLimit: true//"1" == LIB.getSettingByNamePath("envBusinessConfig.reportFunction.enableDataLimit")
                };
                if ("frw" === type) {//公司
                    this.subjectMatterType = false;
                    this.mechanismType = true;
                    qryParam['type'] = 1;
                    qryParam['disable'] = 0;
                    api.listOrg(qryParam).then(function (res) {
                        _this.treeData = _.map(res.data, function (d) {
                            return { key: d.id, label: d.name, parentKey: d.parentId, type: d.type };
                        });
                    });
                }
                else if ("dep" === type) {//部门
                    this.subjectMatterType = false;
                    this.mechanismType = false;
                    api.listDep().then(function (res) {
                        _this.treeData = _.map(res.data, function (d) {
                            return { key: d.id, label: d.name, parentKey: d.parentId, type: d.type };
                        });
                    });
                }
                else if ("per" === type) {//人员
                    this.openDeep = 1;
                    this.subjectMatterType = false;
                    this.mechanismType = false;

                    if (window.PERSON_ARRAY_DATA) {
                        // 不使用setTimeout页面会卡顿
                        setTimeout(function () {
                            _this.treeData = _.map(window.PERSON_ARRAY_DATA, function (d) {
                                return { key: d.id, label: d.name, parentKey: d.parentId, type: d.type };
                            });
                        }, 50)

                    } else {
                        api.listPerson(qryParam).then(function (res) {
                            window.PERSON_ARRAY_DATA = res.data;
                            _this.treeData = _.map(res.data, function (d) {
                                return { key: d.id, label: d.name, parentKey: d.parentId, type: d.type };
                            });
                        });
                    }
                }
                else if ("equip" === type) {//设备设施
                    this.subjectMatterType = false;
                    this.mechanismType = false;
                    api.listEquip(qryParam).then(function (res) {
                        _this.treeData = _.map(res.data, function (d) {
                            return { key: d.id, label: d.name, parentKey: d.parentId, type: d.type };
                        });
                    });
                }
                else if ("teacher" === type) {//讲师
                    this.subjectMatterType = false;
                    this.mechanismType = false;
                    api.listTeacher(qryParam).then(function (res) {
                        _this.treeData = _.map(res.data, function (d) {
                            return { key: d.id, label: d.name, parentKey: d.parentId, type: d.type };
                        });
                    });
                }
                else if ("course" === type) {//课程
                    this.subjectMatterType = false;
                    this.mechanismType = false;
                    api.listCourse(qryParam).then(function (res) {
                        _this.treeData = _.map(res.data, function (d) {
                            return { key: d.id, label: d.name, parentKey: d.parentId, type: d.type };
                        });
                    });
                } else if ("equipitem" === type) {
                    this.subjectMatterType = false;
                    this.mechanismType = false;
                    qryParam = {
                        "criteria.intValue": { "selectEquipWithItem": 1 }
                    };
                    api.listEquip(qryParam).then(function (res) {
                        _this.treeData = _.map(res.data, function (d) {
                            return {
                                key: d.id,
                                label: d.name,
                                parentKey: d.parentId,
                                type: d.type
                            };
                        });
                    });
                }
            }
        },
        ready: function () {
            this.loadTreeData(this.type);
        }
    };
    var comp = LIB.Vue.extend(opts);
    return comp;
});