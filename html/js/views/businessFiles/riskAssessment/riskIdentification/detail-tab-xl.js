define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-tab-xl.html");
    var riskIdentifiContMeasuresFormModal = require("componentsEx/formModal/riskIdentifiContMeasuresFormModal");
    // var riskIdentificationEvalFormModal = require("componentsEx/formModal/riskIdentificationEvalFormModal");
    var riskIdentificationFormModal = require("componentsEx/formModal/riskIdentificationFormModal");
    var riskLevelComponent = require("./dialog/risklevel");
    var equipmentSelectModal = require("./dialog/equipmentSelectModal");
    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //角色编码
            code: null,
            //禁用标识 0未禁用，1已禁用
            disable: "0",
            attr2: null,
            //活动产品服务
            activeProductService: null,
            //
            aftermathAnalyze: null,
            //变更管理
            changeManage: null,
            //风险管控单位 1:基层单位,2:二级单位,3:公司机关
            controlUnit: null,
            //事件学习
            eventLearn: null,
            //存在状态 1:正常,2:异常,3:紧急
            existenceState: null,
            //存在时态 1:过去,2:现在,3:将来
            existenceTense: null,
            //四色安全评价
            fourColorEvaluation: null,
            //危害因素成因
            hazardCause: null,
            //危害因素种类
            hazardType: null,
            //是否危险重要 0:否,1:是
            isImportantDanger: null,
            //编号
            number: null,
            //其他活动
            otherActive: null,
            //涉及岗位
            position: null,
            //区域
            region: null,
            //备注
            remark: null,
            //剩余风险评价等级
            residualRiskLevel: null,
            //残余风险等级模型
            residualRiskModel: null,
            //风险评价等级
            riskLevel: null,
            //风险等级模型
            riskModel: null,
            //控制措施
            riskIdentifiContMeasures: [],
            //风险评价记录
            riskIdentificationEvals: [],
            orgId: null,
            compId: null,
            riskModelInfo: null,
            bizType: null,
            evaluMethod: null,
            hseType: null,
            residualRiskModelInfo: null,
            //设备设施类型
            equipmentType: {
                id: '',
                name: ''
            },
            riskModelScoreInfo: null,
            residualRiskModelScoreInfo: null,
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            controlUnit: [],
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            measuresType: null, //1:现有技术措施,2:现有管理措施,3:增补现有技术措施,4:增补现有管理措施,5:现有防护措施,6增补现有防护措施
            //验证规则
            rules: {
                "code": [LIB.formRuleMgr.length(100)],
                "disable": LIB.formRuleMgr.require("状态"),
                "activeProductService": [LIB.formRuleMgr.length(200)],
                "aftermathAnalyze": [LIB.formRuleMgr.length(100)],
                "changeManage": [LIB.formRuleMgr.length(200)],
                "controlUnit": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "eventLearn": [LIB.formRuleMgr.length(200)],
                "existenceState": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "existenceTense": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "fourColorEvaluation": [LIB.formRuleMgr.length(50)],
                "hazardCause": [LIB.formRuleMgr.length(500)],
                "hazardType": LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
                "isImportantDanger": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "number": [LIB.formRuleMgr.length(20)],
                "otherActive": [LIB.formRuleMgr.length(200)],
                "position": [LIB.formRuleMgr.length(50)],
                "region": [LIB.formRuleMgr.length(500)],
                "remark": [LIB.formRuleMgr.length(500)],
                "residualRiskLevel": [LIB.formRuleMgr.length(10)],
                "residualRiskModel": [LIB.formRuleMgr.length(1000)],
                "riskLevel": [LIB.formRuleMgr.length(10)],
                "riskModel": [LIB.formRuleMgr.length(1000)],
            }
        },
        tableModel: {
            equipmentTableModel: LIB.Opts.extendDetailTableOpt({
                url: "riskidentification/equipment/list/{curPage}/{pageSize}",
                columns: [
                    LIB.tableMgr.ksColumn.code,
                    {
                        title: "名称",
                        fieldName: "name",
                        width: 250,
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "属地",
                        fieldName: "dominationArea.name",
                        width: 180,
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "类型",
                        fieldName: "equipmentType.attr4",
                        keywordFilterName: "criteria.strValue.equipmentType_attr4"
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "del"
                    }
                ]
            }),
            riskIdentifiContMeasuresTableModel1: LIB.Opts.extendDetailTableOpt({
                url: "riskidentification/riskidentificontmeasures/list/{curPage}/{pageSize}?criteria.intValue[type]=1&criteria.intValue[dataType]=1",
                columns: [
                    // LIB.tableMgr.ksColumn.code,
                    {
                        title: "内容",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "创建时间",
                        fieldName: "createDate",
                        width: 150,
                        keywordFilterName: "criteria.strValue.keyWordValue_create_date"
                    },
                    {
                        title: "落实类型",
                        fieldName: "bizItemType",
                        width: 120,
                        render: function (data) {
                            return LIB.getDataDic("ira_biz_item_type", data.bizItemType);
                        },
                    },
                    {
                        title: "检查项",
                        fieldName: "checkItem.name",
                        visible: false,
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "edit,del"
                    }
                ],
            }),
            riskIdentifiContMeasuresTableModel2: LIB.Opts.extendDetailTableOpt({
                url: "riskidentification/riskidentificontmeasures/list/{curPage}/{pageSize}?criteria.intValue[type]=2&criteria.intValue[dataType]=1",
                columns: [
                    // LIB.tableMgr.ksColumn.code,
                    {
                        title: "内容",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "创建时间",
                        fieldName: "createDate",
                        width: 150,
                        keywordFilterName: "criteria.strValue.keyWordValue_create_date"
                    },
                    {
                        title: "落实类型",
                        fieldName: "bizItemType",
                        width: 120,
                        render: function (data) {
                            return LIB.getDataDic("ira_biz_item_type", data.bizItemType);
                        },
                    },
                    {
                        title: "检查项",
                        fieldName: "checkItem.name",
                        visible: false,
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "edit,del"
                    }
                ]
            }),
            riskIdentifiContMeasuresTableModel3: LIB.Opts.extendDetailTableOpt({
                url: "riskidentification/riskidentificontmeasures/list/{curPage}/{pageSize}?criteria.intValue[type]=1&criteria.intValue[dataType]=2",
                columns: [
                    // LIB.tableMgr.ksColumn.code,
                    {
                        title: "内容",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "创建时间",
                        fieldName: "createDate",
                        width: 150,
                        keywordFilterName: "criteria.strValue.keyWordValue_create_date"
                    },
                    {
                        title: "落实类型",
                        fieldName: "bizItemType",
                        width: 120,
                        render: function (data) {
                            return LIB.getDataDic("ira_biz_item_type", data.bizItemType);
                        },
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "edit,del"
                    }
                ]
            }),
            riskIdentifiContMeasuresTableModel4: LIB.Opts.extendDetailTableOpt({
                url: "riskidentification/riskidentificontmeasures/list/{curPage}/{pageSize}?criteria.intValue[type]=2&criteria.intValue[dataType]=2",
                columns: [
                    // LIB.tableMgr.ksColumn.code,
                    {
                        title: "内容",
                        fieldName: "name",
                        visible: true,
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "创建时间",
                        fieldName: "createDate",
                        width: 150,
                        keywordFilterName: "criteria.strValue.keyWordValue_create_date"
                    },
                    {
                        title: "落实类型",
                        fieldName: "bizItemType",
                        width: 120,
                        render: function (data) {
                            return LIB.getDataDic("ira_biz_item_type", data.bizItemType);
                        },
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "edit,del"
                    }
                ]
            }),
            riskIdentifiContMeasuresTableModel5: LIB.Opts.extendDetailTableOpt({
                url: "riskidentification/riskidentificontmeasures/list/{curPage}/{pageSize}?criteria.intValue[type]=3&criteria.intValue[dataType]=1",
                columns: [
                    // LIB.tableMgr.ksColumn.code,
                    {
                        title: "内容",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "创建时间",
                        fieldName: "createDate",
                        width: 150,
                        keywordFilterName: "criteria.strValue.keyWordValue_create_date"
                    },
                    {
                        title: "落实类型",
                        fieldName: "bizItemType",
                        width: 120,
                        render: function (data) {
                            return LIB.getDataDic("ira_biz_item_type", data.bizItemType);
                        },
                    },
                    {
                        title: "检查项",
                        fieldName: "checkItem.name",
                        visible: false,
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "edit,del"
                    }
                ]
            }),
            riskIdentifiContMeasuresTableModel6: LIB.Opts.extendDetailTableOpt({
                url: "riskidentification/riskidentificontmeasures/list/{curPage}/{pageSize}?criteria.intValue[type]=3&criteria.intValue[dataType]=2",
                columns: [
                    // LIB.tableMgr.ksColumn.code,
                    {
                        title: "内容",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "创建时间",
                        fieldName: "createDate",
                        width: 150,
                        keywordFilterName: "criteria.strValue.keyWordValue_create_date"
                    },
                    {
                        title: "落实类型",
                        fieldName: "bizItemType",
                        width: 120,
                        render: function (data) {
                            return LIB.getDataDic("ira_biz_item_type", data.bizItemType);
                        },
                    },
                    {
                        title: "检查项",
                        fieldName: "checkItem.name",
                        visible: false,
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "edit,del"
                    }
                ]
            }),
            riskIdentificationEvalTableModel: LIB.Opts.extendDetailTableOpt({
                url: "riskidentification/riskidentificationevals/list/{curPage}/{pageSize}",
                columns: [
                    // LIB.tableMgr.ksColumn.code,
                    {
                        title: "评价时间",
                        fieldName: "createDate",
                    },
                    {
                        title: "风险程度",
                        fieldName: "riskLevel",
                        keywordFilterName: "criteria.strValue.keyWordValue_riskLevel"
                    }
                ]
            }),
        },
        formModel: {
            riskIdentifiContMeasuresFormModel: {
                show: false,
                hiddenFields: ["riskIdentificationId"],
                queryUrl: "riskidentification/{id}/riskidentificontmeasures/{riskIdentifiContMeasuresId}"
            },
            riskIdentificationEvalFormModel: {
                show: false,
                hiddenFields: ["riskIdentificationId"],
                queryUrl: "riskidentification/{id}/riskidentificationeval/{riskIdentificationEvalId}"
            },
            riskIdentificationFormModel: {
                show: false,
                queryUrl: "riskidentification/{id}"
            }
        },
        cardModel: {
            riskIdentifiContMeasuresCardModel1: {
                showContent: true
            },
            riskIdentifiContMeasuresCardModel2: {
                showContent: true
            },
            riskIdentifiContMeasuresCardModel3: {
                showContent: true
            },
            riskIdentifiContMeasuresCardModel4: {
                showContent: true
            },
            riskIdentifiContMeasuresCardModel5: {
                showContent: true
            },
            riskIdentifiContMeasuresCardModel6: {
                showContent: true
            },
            riskIdentificationEvalCardModel: {
                showContent: true
            },
            equipmentCardModel: {
                showContent: true
            },
            riskIdentificationEvalCardAddModel: {
                showContent: false
            },
        },
        selectModel: {
            equipmentSelectModel: {
                visible: false,
                filterData: {
                    orgId: null
                }
            },
        },
        riskLevelModel: {
            title: "编辑风险评价等级",
            //显示转隐患弹框
            show: false,
            id: null
        },
        typeList: null
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *	 el
    	 template
    	 components
    	 componentName
    	 props
    	 data
    	 computed
    	 watch
    	 methods
    		_XXX    			//内部方法
    		doXXX 				//事件响应方法
    		beforeInit 			//初始化之前回调
    		afterInit			//初始化之后回调
    		afterInitData		//请求 查询 接口后回调
    		afterInitFileData   //请求 查询文件列表 接口后回调
    		beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
    		afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
    		buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
    		afterDoSave			//请求 新增/更新 接口后回调
    		beforeDoDelete		//请求 删除 接口前回调
    		afterDoDelete		//请求 删除 接口后回调
    	 events
    	 vue组件声明周期方法
    	 init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailTabXlPanel],
        template: tpl,
        components: {
            "riskidentificontmeasuresFormModal": riskIdentifiContMeasuresFormModal,
            // "riskidentificationevalFormModal":riskIdentificationEvalFormModal,
            "riskidentificationFormModal": riskIdentificationFormModal,
            "riskLevelComponent": riskLevelComponent,
            "equipmentSelectModal": equipmentSelectModal,

        },
        data: function () {
            return dataModel;
        },
        computed: {
            displayTypeName: function () {
                var id = this.mainModel.vo.equipmentType.id;
                if (!id) {
                    return ''
                }
                if (this.mainModel.vo.equipmentType.attr4) {
                    return this.mainModel.vo.equipmentType.attr4;
                } else {
                    return this.mainModel.vo.equipmentType.name;
                }
                // return _.get(_.find(this.typeList, "id", id), "name", "");
                // return this.mainModel.vo.attr2;
            },
        },
        methods: {
            newVO: newVO,
            doShowEquipmentSelectModal: function () {
                if (!this.mainModel.vo.equipmentType.id) {
                    LIB.Msg.warning("请先添加设备设施分类");
                    return
                }
                this.selectModel.equipmentSelectModel.visible = true;
                this.selectModel.equipmentSelectModel.filterData = {
                    typeId: this.mainModel.vo.equipmentType.id
                };
            },
            doSaveEquipment: function (selectedDatas) {
                if (selectedDatas) {
                    var param;
                    if (selectedDatas.isItem === '1') {
                        param = _.map(selectedDatas.equipment, function (data) {
                            return {
                                id: data.id
                            }
                        });
                    } else if (selectedDatas.isItem === '0') {
                        param = _.map(selectedDatas.equipmentType, function (data) {
                            return {
                                typeId: data.id
                            }
                        });
                    }
                    var _this = this;
                    api.saveEquipment({
                        id: dataModel.mainModel.vo.id
                    }, param).then(function () {
                        _this.refreshTableData(_this.$refs.equipmentTable);
                        _this.selectModel.equipmentSelectModel.visible = false;
                    });
                }
            },
            doRemoveEquipment: function (item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removeEquipment({
                            id: _this.mainModel.vo.id
                        }, [{
                            id: data.id
                        }]).then(function () {
                            _this.$refs.equipmentTable.doRefresh();
                        });
                    }
                });
            },
            doShowRiskIdentifiContMeasuresFormModal4Update: function (param) {
                var type = this.calMeasuresType(param.entry.data);
                var riskModelScoreInfo;
                if (type === 3 || type === 4 || type === 6) {
                    riskModelScoreInfo = this.mainModel.vo.residualRiskModelScoreInfo;
                } else {
                    riskModelScoreInfo = this.mainModel.vo.riskModelScoreInfo;
                }
                this.formModel.riskIdentifiContMeasuresFormModel.show = true;
                this.$refs.riskidentificontmeasuresFormModal.init("update", {
                    id: this.mainModel.vo.id,
                    riskIdentifiContMeasuresId: param.entry.data.id
                }, {
                    riskModelScoreInfo: riskModelScoreInfo
                });
            },
            doShowRiskIdentifiContMeasuresFormModal4Create: function (type) {
                var riskModel, riskModelScoreInfo;
                if (type === 3 || type === 4 || type === 6) {
                    riskModel = this.mainModel.vo.residualRiskModel;
                    riskModelScoreInfo = this.mainModel.vo.residualRiskModelScoreInfo;
                    if (!JSON.parse(riskModel).id) {
                        LIB.Msg.warning("请先添加剩余风险评价");
                        return;
                    }
                } else {
                    riskModel = this.mainModel.vo.riskModel;
                    riskModelScoreInfo = this.mainModel.vo.riskModelScoreInfo;
                    // if(!this.mainModel.vo.equipmentType.id){
                    // 	LIB.Msg.warning("请先添加设备设施分类");
                    // 	return;
                    // }
                    if (!JSON.parse(riskModel).id) {
                        LIB.Msg.warning("请先添加风险评价");
                        return;
                    }

                }
                console.log(riskModelScoreInfo)
                this.mainModel.measuresType = type;
                this.formModel.riskIdentifiContMeasuresFormModel.show = true;
                this.$refs.riskidentificontmeasuresFormModal.init("create", "", {
                    riskModelScoreInfo: riskModelScoreInfo
                });
            },
            setRiskModel: function (data) {
                var riskModel = null;
                if (data.dataType == 1) {
                    riskModel = this.mainModel.vo.riskModel;
                } else if (data.dataType == 2) {
                    riskModel = this.mainModel.vo.residualRiskModel;
                }
                if (data.bizItemType === '1' || data.bizItemType === '2') { //检查项
                    data.pool = null;
                    data.checkItem.riskModel = riskModel;
                } else if (data.bizItemType === '3') { //隐患
                    data.checkItem = null;
                    data.pool.riskLevel = riskModel;

                }

            },
            doSaveRiskIdentifiContMeasures: function (data) {
                // console.log(data)
                // if (!data.checkTables.length) {
                //     return LIB.Msg.warning("请先添加关联的工作表");
                // }
                if (data) {
                    var _this = this;
                    var measuresType = _this.mainModel.measuresType; //1:现有技术措施,2:现有管理措施,3:增补现有技术措施,4:增补现有管理措施,5:现有防护措施,6增补现有防护措施
                    if (measuresType == '1') {
                        data.type = 1; //1:技术措施,2:管理措施,3:防护
                        data.dataType = 1;
                    } else if (measuresType == '2') {
                        data.type = 2;
                        data.dataType = 1;
                    } else if (measuresType == '3') {
                        data.type = 1;
                        data.dataType = 2;
                    } else if (measuresType == '4') {
                        data.type = 2;
                        data.dataType = 2;
                    } else if (measuresType == '5') {
                        data.type = 3;
                        data.dataType = 1;
                    } else if (measuresType == '6') {
                        data.type = 3;
                        data.dataType = 2;
                    }
                    data.bizType = _this.mainModel.vo.bizType;
                    _this.setRiskModel(data);
                    api.saveRiskIdentifiContMeasures({
                        id: _this.mainModel.vo.id
                    }, data).then(function () {
                        _this.refreshTableData(_this.$refs["riskidentificontmeasuresTable" + measuresType]);
                    });

                }
            },
            calMeasuresType: function (data) {
                if (data) {
                    var measuresType = 1;
                    if (data.type == 1) { //技术措施
                        if (data.dataType == 1) { //现有
                            measuresType = 1;
                        } else {
                            measuresType = 3;
                        }
                    } else if (data.type == 2) { //管理措施
                        if (data.dataType == 1) { //现有
                            measuresType = 2;
                        } else {
                            measuresType = 4;
                        }
                    } else if (data.type == 3) { //防护措施
                        if (data.dataType == 1) { //现有
                            measuresType = 5;
                        } else {
                            measuresType = 6;
                        }
                    }
                    return measuresType;
                }
            },
            doUpdateRiskIdentifiContMeasures: function (data) {
                if (data) {
                    var _this = this;
                    var measuresType = _this.calMeasuresType(data);
                    _this.setRiskModel(data);
                    api.updateRiskIdentifiContMeasures({
                        id: this.mainModel.vo.id
                    }, data).then(function () {
                        _this.refreshTableData(_this.$refs["riskidentificontmeasuresTable" + measuresType]);
                    });
                }
            },
            doRemoveRiskIdentifiContMeasures: function (item) {
                var _this = this;
                var data = item.entry.data;
                var measuresType = 1;
                if (data.type == 1) { //技术措施
                    if (data.dataType == 1) { //现有
                        measuresType = 1;
                    } else {
                        measuresType = 3;
                    }
                } else if (data.type == 2) { //管理措施
                    if (data.dataType == 1) { //现有
                        measuresType = 2;
                    } else {
                        measuresType = 4;
                    }
                } else if (data.type == 3) { //防护措施
                    if (data.dataType == 1) { //现有
                        measuresType = 5;
                    } else {
                        measuresType = 6;
                    }
                }
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removeRiskIdentifiContMeasures({
                            id: _this.mainModel.vo.id
                        }, [{
                            id: data.id
                        }]).then(function () {
                            _this.refreshTableData(_this.$refs["riskidentificontmeasuresTable" + measuresType]);
                        });
                    }
                });
            },
            // doShowRiskIdentificationEvalFormModal4Update : function(param) {
            // 	this.formModel.riskIdentificationEvalFormModel.show = true;
            // 	this.$refs.riskidentificationevalFormModal.init("update", {id: this.mainModel.vo.id, riskIdentificationEvalId: param.entry.data.id});
            // },
            // doShowRiskIdentificationEvalFormModal4Create : function(param) {
            // 	this.formModel.riskIdentificationEvalFormModel.show = true;
            // 	this.$refs.riskidentificationevalFormModal.init("create");
            // },
            // doSaveRiskIdentificationEval : function(data) {
            // 	if (data) {
            // 		var _this = this;
            // 		api.saveRiskIdentificationEval({id : this.mainModel.vo.id}, data).then(function() {
            // 			_this.refreshTableData(_this.$refs.riskidentificationevalTable);
            // 		});
            // 	}
            // },
            // doUpdateRiskIdentificationEval : function(data) {
            // 	if (data) {
            // 		var _this = this;
            // 		api.updateRiskIdentificationEval({id : this.mainModel.vo.id}, data).then(function() {
            // 			_this.refreshTableData(_this.$refs.riskidentificationevalTable);
            // 		});
            // 	}
            // },
            // doRemoveRiskIdentificationEval : function(item) {
            // 	var _this = this;
            // 	var data = item.entry.data;
            // 	LIB.Modal.confirm({
            // 		title: '删除当前数据?',
            // 		onOk: function () {
            // 			api.removeRiskIdentificationEvals({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
            // 				_this.$refs.riskidentificationevalTable.doRefresh();
            // 			});
            // 		}
            // 	});
            // },
            doShowRiskIdentificationFormModal4Update: function (data) {
                this.formModel.riskIdentificationFormModel.show = true;
                this.formModel.riskIdentificationFormModel.title = "修改";
                this.formModel.riskIdentificationFormModel.type = "update";
                this.formModel.riskIdentificationFormModel.id = this.mainModel.vo.id;
                // this.$broadcast('ev_editReload', this.mainModel.vo.id);

                this.$emit("do-update-vo", this.mainModel.vo);

            },
            doUpdateRiskIdentification: function (data) {

                // this.formModel.riskIdentificationFormModel.show = false;
                this.init("view", this.mainModel.vo.id);
                // this.$dispatch("ev_dtUpdate");
                // this.$dispatch("ev_dtClose");
            },
            afterInitData: function () {
                this.mainModel.controlUnit = [];
                if (this.mainModel.vo.controlUnit) {
                    this.mainModel.controlUnit = this.mainModel.vo.controlUnit.split(',');
                }
                // var bizType = this.$route.query.bizType;
                // var columns1 = this.tableModel.riskIdentifiContMeasuresTableModel1.columns;
                // var columns2 = this.tableModel.riskIdentifiContMeasuresTableModel2.columns;
                // if (bizType == 2) {
                // 	_.each(columns1, function (item) {
                // 		if (item.fieldName == 'checkItem.name') {
                // 			item.visible = true;
                // 		}
                // 	});
                // 	_.each(columns2, function (item) {
                // 		if (item.fieldName == 'checkItem.name') {
                // 			item.visible = true;
                // 		}
                // 	});
                // } else {
                // 	_.each(columns1, function (item) {
                // 		if (item.fieldName == 'checkItem.name') {
                // 			item.visible = false;
                // 		}
                // 	});
                // 	_.each(columns2, function (item) {
                // 		if (item.fieldName == 'checkItem.name') {
                // 			item.visible = false;
                // 		}
                // 	});
                // }
                // this.$refs.riskidentificontmeasuresTable1.refreshColumns();
                // this.$refs.riskidentificontmeasuresTable2.refreshColumns();
                this.$refs.riskidentificontmeasuresTable1.doQuery({
                    id: this.mainModel.vo.id
                });
                this.$refs.riskidentificontmeasuresTable2.doQuery({
                    id: this.mainModel.vo.id
                });
                this.$refs.riskidentificontmeasuresTable3.doQuery({
                    id: this.mainModel.vo.id
                });
                this.$refs.riskidentificontmeasuresTable4.doQuery({
                    id: this.mainModel.vo.id
                });
                this.$refs.riskidentificontmeasuresTable5.doQuery({
                    id: this.mainModel.vo.id
                });
                this.$refs.riskidentificontmeasuresTable6.doQuery({
                    id: this.mainModel.vo.id
                });
                this.$refs.equipmentTable.doQuery({
                    id: this.mainModel.vo.id
                });
                // this.$refs.riskidentificationevalTable.doQuery({id : this.mainModel.vo.id});

                var dataDicList1 = this.getDataDicList('risk_hse_evalu_method');
                var dataDicList2 = this.getDataDicList('risk_integrity_evalu_method');
                var dataDicList3 = this.getDataDicList('risk_supervise_evalu_method');
                var arr = []
                _.each(dataDicList1, function (item) {
                    arr.push([item.id, item.value]);
                })
                _.each(dataDicList2, function (item) {
                    arr.push([item.id, item.value]);
                })
                _.each(dataDicList3, function (item) {
                    arr.push([item.id, item.value]);
                })
                LIB.registerDataDic("risk_evalu_method", arr);
            },
            beforeInit: function () {
                this.$refs.riskidentificontmeasuresTable1.doClearData();
                this.$refs.riskidentificontmeasuresTable2.doClearData();
                this.$refs.riskidentificontmeasuresTable3.doClearData();
                this.$refs.riskidentificontmeasuresTable4.doClearData();
                this.$refs.riskidentificontmeasuresTable5.doClearData();
                this.$refs.riskidentificontmeasuresTable6.doClearData();
                // this.$refs.riskidentificationevalTable.doClearData();
                this.$refs.equipmentTable.doClearData();
            },
            doEditRiekLevel: function (type) {
                this.riskLevelModel.show = true;
                this.riskLevelModel.title = "编辑风险评价等级";
                if (type === 3) {
                    this.riskLevelModel.title = "动态评估";
                }
                this.riskLevelModel.id = this.mainModel.vo.id;
                this.$broadcast('ev_updateRiskLevelReload', this.mainModel.vo.id, type);
            },
            doUpdateRiskLevelFinshed: function () {
                this.$dispatch("ev_dtUpdate");
                this.riskLevelModel.show = false;
                this.init("view", this.mainModel.vo.id);
            },
            _getTypeList: function () {
                var _this = this;
                api.getTypeList().then(function (res) {
                    _this.typeList = res.data;
                })
            }
        },
        events: {
            "do-update-detail": function (obj) {
                this.doUpdateRiskIdentification(obj);
            }
        },
        init: function () {
            this.$api = api;
        },
        created: function () {
            // this._getTypeList();
        }
    });

    return detail;
});