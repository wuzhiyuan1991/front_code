define(function (require) {
    var LIB = require('lib');
    var api = require("views/businessFiles/riskAssessment/riskIdentification/vuex/api");
    //数据模型
    var tpl = require("text!./riskIdentifiContMeasuresFormModal.html");
    var checkItemSelectModal = require("componentsEx/selectTableModal/checkItemSelectModal");
    var poolSelectModal = require("componentsEx/selectTableModal/poolSelectModal");
    var periodicWorkTableSelectModal = require("componentsEx/selectTableModal/periodicWorkTableSelectModal");
    var checkTableSelectModal = require("views/businessFiles/riskAssessment/riskIdentification/dialog/checkTableAndGroup");
    var newPool = function () {
        return {
            id: null,
            //公司id
            compId: null,
            //部門id
            orgId: null,
            problem: null,
            type: "1",
            specialty: null,
            riskLevel: null,
        }
    }

    var newCheckItem = function () {
        return {
            id: null,
            name: null,
            riskModel: null,
            type: 1,
            compId: null,
            orgId: null,
            bizType: null,
            checkObjName: null,
            checkStd: null,
            groupId: null,
            equipmentType: null
        }
    }
    //周期性工作表
    var newPeriodicWorkTable = function () {
        return {
            id: null,
            name: null,
            group: {
                id: null,
            }
        }
    }
    //初始化数据模型
    var newVO = function () {
        return {
            //角色编码
            code: null,
            //措施
            name: null,
            //措施类型 1:技术措施,2:管理措施,3:个人防护
            type: null,
            //危害辨识
            riskIdentification: {
                id: '',
                name: ''
            },
            checkItem: newCheckItem(),
            pool: newPool(),
            periodicWorkTable: newPeriodicWorkTable(),
            bizType: null,
            bizItemType: null, //检查项类型
            checkTables: [],
        }
    };

    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'create',
            isReadOnly: false,
            title: "添加",
            //验证规则
            rules: {
                "code": [LIB.formRuleMgr.length(100)],
                "name": [{
                    required: true,
                    message: '请输入控制措施'
                }, LIB.formRuleMgr.length(1000)],
                "type": [{
                    required: true,
                    message: '请选择措施类型'
                }, LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "riskIdentification.id": [LIB.formRuleMgr.allowStrEmpty],
                "pool.compId": [{
                    required: true,
                    message: '请选择所属公司'
                }],
                "pool.orgId": [{
                        required: true,
                        message: '请选择所属部门'
                    },
                    {
                        validator: function (rule, value, callback) {
                            var error = [];
                            if (dataModel.mainModel.vo.pool.orgId === dataModel.mainModel.vo.pool.compId) {
                                error.push("请选择所属部门");
                            }
                            callback(error);
                        }
                    }
                ],
                "pool.type": [{
                    required: true,
                    message: '请选择隐患类型'
                }],
                "pool.problem": [{
                    required: true,
                    message: '请输入问题描述'
                }, LIB.formRuleMgr.length(500, 1)],
                // "pool.specialty": [{required: true, message: '请选择专业'}],
                "pool": [{
                    validator: function (rule, value, callback) {
                        var pool = dataModel.mainModel.vo.pool;
                        var error = [];
                        if ((_.isEmpty(pool.compId)) || (_.isEmpty(pool.orgId)) || (_.isEmpty(pool.problem))) {
                            error.push("请选择或完善隐患信息");
                        }
                        callback(error);
                    }
                }],
                "checkItem.checkStd": [{
                    required: true,
                    message: '请输入检查标准'
                }, LIB.formRuleMgr.require("检查标准"), LIB.formRuleMgr.length(255)],
                "checkItem.checkObjName": [{
                    required: true,
                    message: '请输入检查对象名称'
                }, LIB.formRuleMgr.require("检查对象名称"), LIB.formRuleMgr.length(255)],
                "checkItem.name": [{
                    required: true,
                    message: '请输入检查项内容'
                }, LIB.formRuleMgr.require("检查项内容"), LIB.formRuleMgr.length(500)],
                "checkItem.type": [{
                    required: true,
                    message: '请选择类型'
                }, LIB.formRuleMgr.length()],
                "checkItem.compId": [{
                    required: true,
                    message: '请选择所属公司'
                }, LIB.formRuleMgr.length()],
                // "bizItemType": [{required: true, message: '请选择类型'}],

            },
            emptyRules: {},
            equipmentType: {
                id: null,
                name: null
            },
            periodicWorkTableGroupList: [], //工作表分组
            checkTableList: [], //巡检表
        },
        selectModel: {
            checkItemSelectModal: {
                visible: false,
                filterData: {}
            },
            poolSelectModal: {
                visible: false,
                filterData: {}
            },
            periodicWorkTableSelectModal: {
                visible: false,
                filterData: {}
            },
            checkTableSelectModal: {
                visible: false,
                filterData: {}
            }
        },
        tableModel: {
            checkTable: {
                columns: [{
                        title: "checkbox",
                        fieldName: "id",
                        fieldType: "cb",
                        width: 10
                    },
                    {
                        title: "检查表",
                        fieldName: "checkTable.name",
                        visible: true,
                        width: 40
                    },
                    {
                        title: "分组名",
                        fieldName: "checkTable.group.name",
                        width: 40
                    },
                ],
                dataList: [],
                selectedDatas: [],
                visible: false
            }
        },
        showSpecialty: false,
        riskModelScoreInfo: null,
        isFinish: false,
        disableBizItemType: false,
        poolType: 0,
    };

    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components: {
            'checkitemSelectModal': checkItemSelectModal,
            'poolSelectModal': poolSelectModal,
            "periodicWorkTableSelectModal": periodicWorkTableSelectModal,
            "checkTableSelectModal": checkTableSelectModal,
        },
        props: {
            equipmentType: {
                type: Object,
                default: {}
            },
            compId: {
                type: String,
                default: null
            },
            orgId: {
                type: String,
                default: null
            },
            riskModelScoreInfo: {
                type: String,
                default: null
            },
            residualRiskModelScoreInfo: {
                type: String,
                default: null
            },
            riskIdentificationId: {
                type: String,
                default: null
            },
        },
        data: function () {
            return dataModel;
        },
        watch: {
            "mainModel.vo.periodicWorkTable.id": function (val) {
                if (!val) {
                    this.mainModel.periodicWorkTableGroupList = [];
                    this.mainModel.vo.periodicWorkTable.group.id = null;
                }
            },
            "mainModel.vo.bizItemType": function (nVal, oVal) {
                if (!this.disableBizItemType && nVal != oVal) {
                    this.mainModel.vo.checkItem = newCheckItem();
                    this.mainModel.vo.pool = newPool();
                    this.tableModel.checkTable.dataList = [];
                    this.tableModel.checkTable.selectedDatas = [];
                    if (nVal === '1') {
                        this.mainModel.vo.checkItem.checkObjName = this.mainModel.equipmentType.name;
                        this.tableModel.checkTable.dataList = this.mainModel.checkTableList;
                        this.$nextTick(function () {
                            this.$refs.checkTable.setAllCheckBoxValues(true);
                        })

                    }
                    if (nVal === '1' || nVal === '2') {
                        this.mainModel.vo.checkItem.compId = this.compId;
                    } else if (nVal === '3') {
                        this.mainModel.vo.pool.compId = this.compId;
                    }
                }
                if (nVal === '1') {
                    this.tableModel.checkTable.columns[1].title = "检查表";
                    this.$refs.checkTable.refreshColumns();
                } else if (nVal === '2') {
                    this.tableModel.checkTable.columns[1].title = "工作表";
                    this.$refs.checkTable.refreshColumns();
                }
            },
            "poolType": function (val) {
                if (val == 1) {
                    this.doShowPoolSelectModal();
                } else if (this.mainModel.vo.pool.id) {
                    this.mainModel.vo.pool = newPool();
                    this.mainModel.vo.pool.compId = this.compId;
                }
            },
            "selectModel.poolSelectModal.visible": function (val) {
                if (!val) {
                    if (!this.mainModel.vo.pool.id) {
                        this.poolType = 0;
                    }
                }
            }

        },
        computed: {
            checkTableTitle: function () {
                if (this.mainModel.vo.bizItemType === '1') {
                    return "关联的检查表";
                } else if (this.mainModel.vo.bizItemType === '2') {
                    return "关联的工作表";
                }
            },
            diaPlayEqTypeName: function () {
                var id = this.equipmentType.id;
                if (!id) {
                    return ''
                }
                if (this.equipmentType.attr4) {
                    return this.equipmentType.attr4;
                } else {
                    return this.equipmentType.name;
                }
            }
        },
        methods: {
            newVO: newVO,
            // doShowCheckItemSelectModal:function(){
            // 	this.selectModel.checkItemSelectModal.visible = true;
            // },
            // doSaveCheckItem:function(obj){
            // 	this.mainModel.vo.checkItem.id = obj[0].id;
            // 	this.mainModel.vo.checkItem.name = obj[0].name;
            // },
            doShowPoolSelectModal: function () {
                //var path = this.$route.path;
                this.selectModel.poolSelectModal.visible = true;
                var dataDicList = LIB.getDataDicList("pool_biz_source_type").filter(function (item) {
                    return item.id.charAt(0) == 5 || item.id.charAt(0) == 4; //外部检查4开头，专项检查5开头
                });
                this.selectModel.poolSelectModal.filterData = {
                    "disable": "0",
                    "criteria.orderValue": {
                        fieldName: "modifyDate",
                        orderType: "1"
                    },
                    "criteria.strsValue.bizType": _.pluck(dataDicList, 'id'),
                    "criteria.strValue.filterType": "riskIdentification"
                };
            },
            doSavePool: function (obj) {
                this.mainModel.vo.pool = _.pick(obj[0], 'id', 'compId', 'orgId', 'problem', 'specialty');
            },
            doShowCheckTableSelectModel: function () {
                this.selectModel.checkTableSelectModal.visible = true;
                if (this.mainModel.vo.bizItemType === '1') {
                    this.selectModel.checkTableSelectModal.filterData = {
                        bizType: "inspect"
                    };
                } else if (this.mainModel.vo.bizItemType === '2') {
                    this.selectModel.checkTableSelectModal.filterData = {
                        bizType: "job"
                    };
                }

            },
            doSaveCheckTable: function (data) {
                if (this.mainModel.vo.bizItemType === '1' || this.mainModel.vo.bizItemType === '2') {
                    if (!_.find(this.tableModel.checkTable.dataList, "checkTable.name", data.checkTable.name) || !_.find(this.tableModel.checkTable.dataList, "checkTable.group.name", data.checkTable.group.name)) {
                        this.tableModel.checkTable.dataList.push(data);
                        this.tableModel.checkTable.selectedDatas.push(data);
                    }
                }
                // else if (this.mainModel.vo.bizItemType === '2') {
                //     this.tableModel.checkTable.dataList = [data];
                //     this.tableModel.checkTable.selectedDatas = [data];
                // }
                this.selectModel.checkTableSelectModal.visible = false;
            },
            doShowPeriodicWorkTableSelectModal: function () {
                this.selectModel.periodicWorkTableSelectModal.visible = true;
                this.selectModel.periodicWorkTableSelectModal.filterData = {
                    bizType: 'job'
                };
            },
            doSavePeriodicWorkTable: function (obj) {
                this.mainModel.vo.periodicWorkTable.id = obj[0].id;
                this.mainModel.vo.periodicWorkTable.name = obj[0].name;
                var _this = this;
                api.getCheckTable({
                    id: this.mainModel.vo.periodicWorkTable.id
                }).then(function (res) {
                    if (res.data.tirList.length > 0) {
                        _this.mainModel.vo.periodicWorkTable.group.id = res.data.tirList[0].groupId; //默认选中第一个分组
                        res.data.tirList.forEach(function (item) {
                            _this.mainModel.periodicWorkTableGroupList.push({
                                id: item["groupId"],
                                name: item["groupName"]
                            });
                        })
                    }
                })
            },
            _updateShowSpecialty: function () {
                var _this = this;
                api.getShowSpecialtyConfig().then(function (res) {
                    var result = _.get(res, "data.result", '1');
                    _this.showSpecialty = (result === '2');
                })
            },
            beforeInit: function () {
                this.mainModel.vo = newVO();
                this.mainModel.equipmentType = this.equipmentType;
                this._updateShowSpecialty();
                this.isFinish = false;
                this.disableBizItemType = false;
                this.poolType = 0;
            },
            afterInit: function (data) {
                if (data && data.riskModelScoreInfo) {
                    this.riskModelScoreInfo = data.riskModelScoreInfo;
                    if (this.mainModel.opType === 'create') {
                        this.getCheckTableByCheckPrinciple(data.riskModelScoreInfo);
                    }
                }
                var bizType = this.$route.query.bizType;
                if (bizType) {
                    this.mainModel.vo.bizType = bizType;
                } else {
                    this.mainModel.vo.bizType = "1";
                }
            },
            afterInitData: function () {
                var _this = this;
                this.disableBizItemType = false;
                if (this.mainModel.opType === 'update' && this.mainModel.vo.bizItemType) {
                    this.disableBizItemType = true;
                }
                _this.tableModel.checkTable.dataList = [];
                _this.tableModel.checkTable.selectedDatas = [];
                if (this.mainModel.vo.bizItemType === '1' || this.mainModel.vo.bizItemType == null) {
                    this.getCheckTableByCheckPrinciple(this.riskModelScoreInfo);
                }
                if (this.mainModel.vo.bizItemType === '2') {
                    if (this.mainModel.vo.checkTables.length > 0) {
                        this.mainModel.vo.checkTables.forEach(function (checkTable) {
                            if (checkTable.groups) {
                                checkTable.groups.forEach(function (group) {
                                    var data = {
                                        id: group.id,
                                        checkTable: {
                                            id: checkTable.id,
                                            name: checkTable.name,
                                            compId: checkTable.compId,
                                            group: group,
                                        }
                                    }
                                    _this.tableModel.checkTable.dataList.push(data);
                                    _this.tableModel.checkTable.selectedDatas.push(data);
                                })
                            }
                        })
                    }
                }
                // if(this.mainModel.vo.checkItem.checkTableId){
                // 	api.getCheckTable({id:this.mainModel.vo.checkItem.checkTableId}).then(function(res){
                // 		_this.mainModel.vo.periodicWorkTable.id = res.data.id;
                // 		_this.mainModel.vo.periodicWorkTable.name = res.data.name;
                // 	})
                // }
            },
            beforeDoSave: function () {
                if (this.mainModel.vo.bizItemType === '1' || this.mainModel.vo.bizItemType === '2') { //新增检查项
                    this.mainModel.vo.pool = null;
                    this.mainModel.vo.checkTables = _.pluck(this.tableModel.checkTable.selectedDatas, 'checkTable');
                    this.mainModel.vo.checkItem.equipmentType = this.equipmentType;
                    if (this.mainModel.vo.bizItemType === '1') {
                        this.mainModel.vo.checkItem.bizType = 'inspect'; //检查项
                        this.mainModel.vo.checkItem.checkStd = this.mainModel.vo.name;
                    }
                    if (this.mainModel.vo.bizItemType === '2') {
                        this.mainModel.vo.checkItem.bizType = 'job'; //工作项
                        this.mainModel.vo.checkItem.name = this.mainModel.vo.name;
                    }
                    //必须选择工作表
                    if(!this.tableModel.checkTable.selectedDatas || this.tableModel.checkTable.selectedDatas.length == 0) {
                        LIB.Msg.warning("请先添加关联的" + ((this.mainModel.vo.bizItemType === '1' ? "检查表" : "工作表")));
                        return false;
                    }


                } else if (this.mainModel.vo.bizItemType === '3') {
                    this.mainModel.vo.checkItem = null;
                } else {
                    this.mainModel.vo.pool = null;
                    this.mainModel.vo.checkItem = null;
                }
            },
            /**
             * @Description 根据检查原则生成巡检表
             **/
            getCheckTableByCheckPrinciple: function (key) {
                var _this = this;
                _this.mainModel.checkTableList = [];
                _this.tableModel.checkTable.dataList = [];
                _this.tableModel.checkTable.selectedDatas = [];
                var orgName = LIB.LIB_BASE.setting.orgMap[this.orgId ? this.orgId : this.compId].name;
                api.getCheckPrinciple().then(function (res) {
                    res.data.list.forEach(function (item) {
                        var severity = item.severity;
                        var possibility = item.possibility;
                        if ((severity + "*" + possibility) === key || (possibility + "*" + severity) === key) {
                            item.frequencyTypes.forEach(function (it) { //在用设备(巡检频率-类型)
                                if (it) {
                                    var tableName = orgName + LIB.getDataDic("ira_check_principle_frequency_type", it).replace("-", "") + "巡检表";
                                    _this.mainModel.checkTableList.push({
                                        type: 1, //在用
                                        name: tableName,
                                        compId: _this.compId,
                                    });
                                }

                            });
                            // item.unUseFrequencyTypes.forEach(function(it){//停用设备(巡检频率-类型)
                            // 	if(it){
                            // 		var tableName = orgName + LIB.getDataDic("ira_check_principle_frequency_type",it).replace("-","") + "巡检表";
                            // 		_this.mainModel.checkTableList.push({
                            // 			type:0,//停用
                            // 			name:tableName,
                            // 			compId:_this.compId,
                            // 		});
                            // 	}
                            //
                            // });
                        }

                    })
                    _this.getEquipmentArea();
                });
            },
            /**
             * @Description 设备属地
             **/
            getEquipmentArea: function () {
                var _this = this;
                var id = 1;
                api.queryEquipment({
                    id: _this.riskIdentificationId,
                    pageNo: 1,
                    pageSize: 1000
                }).then(function (res) {
                    var equipment = res.data.list;
                    var equipmentInUse = _.filter(equipment, function (item) {
                        return item.state === '0'
                    })
                    var equipmentUnUse = _.filter(equipment, function (item) {
                        return item.state === '1'
                    })
                    var dominationArea_inUnseEquip = _.union(_.pluck(equipmentInUse, "dominationArea"));
                    var dominationArea_unUnseEquip = _.union(_.pluck(equipmentUnUse, "dominationArea"));
                    var checkTableMap = {};
                    _this.mainModel.checkTableList.forEach(function (checkTable) {
                        //暂时只处理在用设备
                        if (checkTable.type === 1) {
                            var funcArr = [];
                            dominationArea_inUnseEquip.forEach(function (area) {

                                var func = api.listByTableNameAndAreaId({
                                    checkTableName: checkTable.name,
                                    compId: _this.compId,
                                    dominationAreaId: area.id
                                }).then(function (res) {

                                    var group = res.data;
                                    if (group.length > 0) {
                                        group.forEach(function (it) {
                                            checkTableMap[checkTable.name + it.groupName] = {
                                                id: id++,
                                                checkTable: {
                                                    id: null,
                                                    name: checkTable.name,
                                                    compId: _this.compId,
                                                    group: {
                                                        id: it.id,
                                                        name: it.groupName,
                                                        dominationAreaId: area.id
                                                    },
                                                }
                                            }
                                        })
                                    } else {
                                        checkTableMap[checkTable.name + area.name] = {
                                            id: id++,
                                            checkTable: {
                                                id: null,
                                                name: checkTable.name,
                                                compId: _this.compId,
                                                group: {
                                                    id: null,
                                                    name: area.name,
                                                    dominationAreaId: area.id
                                                },
                                            }
                                        }
                                    }

                                    return res;
                                });

                                funcArr.push(func);
                            })
                            Promise.all(funcArr).then(function (res) {
                                if (_this.mainModel.opType === 'update') {
                                    var checkTables = _this.mainModel.vo.checkTables; //后台返回的已勾选的检查表
                                    checkTables.forEach(function (checkTable) {
                                        if (checkTable.groups) {
                                            checkTable.groups.forEach(function (group) {
                                                var tableGroup = checkTableMap[checkTable.name + group.name];
                                                if (tableGroup) {
                                                    tableGroup.id = group.id;
                                                    tableGroup.checkTable.id = checkTable.id;
                                                    tableGroup.checkTable.group.id = group.id;

                                                } else {
                                                    tableGroup = {
                                                        id: group.id,
                                                        checkTable: {
                                                            id: checkTable.id,
                                                            name: checkTable.name,
                                                            compId: checkTable.compId,
                                                            group: group,
                                                        }
                                                    }
                                                    checkTableMap[checkTable.name + group.name] = tableGroup;
                                                }
                                                _this.tableModel.checkTable.selectedDatas.push(tableGroup);
                                            })
                                        }
                                    })
                                    _this.tableModel.checkTable.dataList = _.values(checkTableMap);
                                }
                                _this.mainModel.checkTableList = _.values(checkTableMap);
                                _this.isFinish = true;
                            });
                        }
                    });

                })
            }



        },
    });

    return detail;
});