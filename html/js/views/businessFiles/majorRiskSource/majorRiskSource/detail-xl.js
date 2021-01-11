define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");
    var equipmentSelectModal = require("componentsEx/selectTableModal/equipmentSelectModal");
    var checkObjectCatalogSelectModal = require("componentsEx/selectTableModal/checkObjectCatalogSelectModal");
    var tabMainPipeEquipment=require("./components/mainPipeEquipment/main");
    var tabSafetyEvaluation=require("./components/safetyEvaluation/tabSafetyEvaluation");
    var tabSafetyMonitor=require("./components/safetyMonitor/main");
    //初始化数据模型
    var newVO = function () {
        return {
            //ID
            id : null,
            //编码
            code : null,
            //名称
            name : null,
            //禁用标识 0未禁用，1已禁用
            disable : '1',
            //公司id
            compId : null,
            //数据类型 1-重点危险化学工艺 2-重点危险化学品 3-一般危险化学品 4-重大危险源
            dataType : '4',
            //实际储量
            actualReserves : null,
            //部门id
            orgId : null,
            //厂区边界外500米范围人口估值（人）
            approximationPopulationOfBoundary : null,
            //与周边重点防护目标的最近距离（米）
            protectionDistance : null,
            //重大危险源级别 1:一级,2:二级,3:三级,4:四级
            riskLevel : "1",
            //投用时间
            timeOfInvestment : null,
            //R值
            valueOfR : null,
            //备注
            remark : null,
            //修改日期
            modifyDate : null,
            //创建日期
            createDate : null,
            //属地
            dominationArea : {id:'', name:''},
            //危险化学品操作压力（MPa）
            mrsCatalogOperatingPressure : null,
            //危险化学品操作温度（℃）
            mrsCatalogOperatingTemperature : null,
            //危险化学品物理状态
            mrsCatalogPhysicalState : null,
            //危险化学品备注
            mrsCatalogRemark : null,
            //危险化学品用途 1:原材料,2:中间产品,3:成品
            mrsCatalogUse : "1",
            //危险化学品临界量（T）
            mrsCriticalReserves : null,
            //单元内主要装置/设施
            mrsEquipmentOfUnit : null,
            //占地面积（m2）
            mrsFloorArea : null,
            //所处环境功能区 1工业区,2:农业区,3:商业区,4:居民区,5:行政办公区,6:交通枢纽区,7:科技文化区,8:水源保护区,9:文物保护区
            mrsFunctionalArea : "1",
            //单元内单个最大容器危险化学品存量（T）
            mrsMaxSingleReservesOfUnit : null,
            //所在地址
            mrsPlace : null,
            //单元内主要生产工艺
            mrsProdProcessOrUnit : null,
            //单元内所有危险化学品总存量（T）
            mrsTotalReservesOfUnit : null,
            //重大危险源单元分类 1:生产单元,2:储存单元
            mrsUnitClassification : "1",
            //危险化学品
            catalog: {id:null, name:null, code:null, unNumber:null},
        }
    };


    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            isChemicalObjReadOnly: true,//危化品基本性质是否只读
            originChemicalObj:null,//点击编辑是存储的对象，用来取消还原
            title: "",
            disableList: [{id: "0", name: "启用"}, {id: "1", name: "停用"}],
            rules: {
                "name": [LIB.formRuleMgr.require("名称"),
                    LIB.formRuleMgr.length(50)
                ],
                "mrsPlace" : [LIB.formRuleMgr.require("所在地址"), LIB.formRuleMgr.length(200)],
                "compId": [{required: true, message: '请选择所属公司'}, LIB.formRuleMgr.length()],
                "orgId": [{required: true, message: '请选择所属部门'}, LIB.formRuleMgr.length()],
                "dominationArea.id" : [LIB.formRuleMgr.require("属地")],
                "mrsFloorArea" : [LIB.formRuleMgr.require("占地面积")].concat(LIB.formRuleMgr.range(1)),
                "mrsTotalReservesOfUnit" : [LIB.formRuleMgr.require("单元内所有危险化学品总存量")].concat(LIB.formRuleMgr.range(1)),
                "valueOfR" : [LIB.formRuleMgr.require("R值")].concat(LIB.formRuleMgr.rangePositiveDecimal()),
                    // {type:'number', min:0],
                "mrsEquipmentOfUnit" : [LIB.formRuleMgr.length(200)],
                "mrsProdProcessOrUnit" : [LIB.formRuleMgr.length(200)],
                "riskLevel": [LIB.formRuleMgr.require("重大危险源级别"),LIB.formRuleMgr.length()],
                "mrsMaxSingleReservesOfUnit" : [LIB.formRuleMgr.require("单元内单个最大容器危险化学品存量")].concat(LIB.formRuleMgr.rangePositiveDecimal()),
                "mrsCriticalReserves" : [LIB.formRuleMgr.require("危险化学品临界量")].concat(LIB.formRuleMgr.rangePositiveDecimal()),
                "timeOfInvestment": [LIB.formRuleMgr.require("投用时间"),LIB.formRuleMgr.length()],
                "mrsFunctionalArea": [LIB.formRuleMgr.require("所处环境功能区")],
                "remark": [LIB.formRuleMgr.length(500)],
                "protectionDistance": [LIB.formRuleMgr.require("与周边重点防护目标最近距离情况")].concat(LIB.formRuleMgr.range(1)),
                "approximationPopulationOfBoundary": [LIB.formRuleMgr.require("厂区边界外500m范围内人数估算值")].concat(LIB.formRuleMgr.range(1)),
            },
            chemicalObjRules: {
                "catalog.id": [LIB.formRuleMgr.require("危险化学品")],
                "catalog.code": [LIB.formRuleMgr.require("危险化学品编码")],
                //"catalog.unNumber": [LIB.formRuleMgr.require("UN编号")],
                "mrsCatalogPhysicalState": [LIB.formRuleMgr.length(100)],
                "mrsCatalogOperatingTemperature": [LIB.formRuleMgr.length(100)],
                "mrsCatalogOperatingPressure": [LIB.formRuleMgr.length(100)],
                "mrsCatalogRemark": [LIB.formRuleMgr.length(500)],
            },
            componentData:{
                equipment:[],
                pipe:[],
                record:[],
                safetyEvaluation:[],
                safetyEvaluationCommon:[],
                systemM5C:[],
            }
        },
        tabs:[{id:1, name:"危险化学品基本性质"},{id:2, name:"危险化学品安全技术说明书（SDS）"},{id:3, name:"区域位置图"}
            ,{id:4, name:"平面布置图"},{id:5, name:"工艺流程图"},{id:6, name:"主要管道/设备"},{id:7, name:"制度化管理"}
            ,{id:8, name:"安全评价（评估）报告"},{id:9, name:"安全监测监控系统"}
        ],
        checkedTabIndex:0, // 被选中页签序号
        tableModel: {
            equipmentModel: {
                url: 'majorrisksource/equipments/list/{curPage}/{pageSize}',
                columns: [
                    {
                        title: "设备设施名称",
                        fieldName: 'name'
                    },
                    {
                        title: "设备设施分类",
                        fieldType : "custom",
                        render: function(data){
                            if(data.equipmentType){
                                return data.equipmentType.name;
                            }
                        }
                    },
                    {
                        title : "所属公司",
                        fieldType : "custom",
                        render: function(data){
                            if(data.compId){
                                return LIB.getDataDic("org", data.compId)["compName"];
                            }
                        }
                    },
                    {
                        title : "所属部门",
                        fieldType : "custom",
                        render: function(data){
                            if(data.orgId){
                                return LIB.getDataDic("org", data.orgId)["deptName"];
                            }
                        }
                    },
                    {
                        title: "属地",
                        fieldName: "dominationArea.name"
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "del"
                    }
                ]
            }
        },
        selectModel: {
            checkObjectCatalogSelectModel : {
                visible : false,
            },
            dominationAreaSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            equipmentSelectModel: {
                visible: false,
                filterData: {'dominationArea.id': null}
            }

        },
        fileModel:{
            M1 : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'M1',//危险化学品安全技术说明书（SDS）
                        fileType: 'M'
                    },
                    filters:{limit_file_num:false}
                },
                data : []
            },
            M2 : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'M2',//区域位置图
                        fileType: 'M'
                    },
                    filters:{limit_file_num:false}
                },
                data : []
            },
            M3 : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'M3',//平面布置图
                        fileType: 'M'
                    },
                    filters:{limit_file_num:false}
                },
                data : []
            },
            M4 : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'M4',//工艺流程图
                        fileType: 'M'
                    },
                    filters:{limit_file_num:false}
                },
                data : []
            },
            M5 : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'M5',//制度化管理
                        fileType: 'M'
                    },
                    filters:{limit_file_num:false}
                },
                data : []
            },
            M5C : {
                cfg: {
                    params: {
                        recordId: '9999999999',
                        dataType: 'M5C',//制度化管理-公共common
                        fileType: 'M'
                    },
                    filters:{limit_file_num:false}
                },
                data : []
            },
            M12 : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'M12',//备案附件
                        fileType: 'M'
                    },
                    filters:{limit_file_num:false}
                },
                data : []
            },
            M13 : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'M13',//预案备案附件
                        fileType: 'M'
                    },
                    filters:{limit_file_num:false}
                },
                data : []
            },
        }

    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
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
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "checkobjectcatalogSelectModal":checkObjectCatalogSelectModal,
            "dominationareaSelectModal": dominationAreaSelectModal,
            equipmentSelectModal: equipmentSelectModal,
            tabMainPipeEquipment:tabMainPipeEquipment,
            tabSafetyEvaluation:tabSafetyEvaluation,
            tabSafetyMonitor:tabSafetyMonitor,

        },
        computed: {
            chemicalObjRules: function () {
                return this.mainModel.isChemicalObjReadOnly ? {} : this.mainModel.chemicalObjRules;
            },
            disableLabel: function () {
                return this.mainModel.vo.disable === '1' ? '停用' : '启用';
            },
            timeOfInvestment : function() {
            	if(!!this.mainModel.vo.timeOfInvestment) {
            		return this.mainModel.vo.timeOfInvestment.substr(0,10);
            	}
            }
        },
        data: function () {
            return dataModel;
        },
        methods: {
            newVO: newVO,
            doShowCheckObjectCatalogSelectModal : function() {
                if(this.mainModel.isChemicalObjReadOnly) {
                    return;
                }
                this.selectModel.checkObjectCatalogSelectModel.visible = true;
                //this.selectModel.checkObjectCatalogSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveCheckObjectCatalog : function(items) {
                this.mainModel.vo.catalog.id = items[0].id;
                this.mainModel.vo.catalog.name = items[0].name;
                this.mainModel.vo.catalog.code = items[0].code;
                this.mainModel.vo.catalog.unNumber = items[0].unNumber;
            },
            doChangeTab:function (index) {
                this.checkedTabIndex = index;
            },
            doUpdateChemicalObj: function() {
                this.mainModel.isChemicalObjReadOnly = false;
                this.mainModel.originChemicalObj=_.cloneDeep(this.mainModel.vo);
            },
            doCancelChemicalObj:function(){
                _.extend(this.mainModel.vo,this.mainModel.originChemicalObj);
                this.mainModel.isChemicalObjReadOnly = true;
            },
            doSaveChemicalObj: function() {
                var _this = this;
                var _data = this.mainModel;
                if (this.beforeDoSave() === false) {
                    return;
                }
                this.$refs.chemicalobjform.validate(function(valid) {
                    if (valid) {
                        var _vo = _this.buildSaveData() || _data.vo;
                        _vo = _this._checkEmptyValue(_vo);
                        _this.$api.update(_vo).then(function(res) {
                            LIB.Msg.info("保存成功");
                            _this.mainModel.isChemicalObjReadOnly = true;
                        });
                    }
                });

            },
            doShowDominationAreaSelectModal: function () {
                if(!this.mainModel.vo.orgId) {
                    return LIB.Msg.warning("请先选中所属部门");
                }
                this.selectModel.dominationAreaSelectModel.visible = true;
                this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveDominationArea: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.dominationArea = selectedDatas[0];
                }
            },
            /**
             * 设备设施
             */
            //getEquipments: function () {
            //    this.$refs.equipmentTable.doQuery({id: this.mainModel.vo.id});
            //},
            //showEquipmentModal: function () {
            //    this.selectModel.equipmentSelectModel.filterData = {'dominationArea.id' : this.mainModel.vo.dominationArea.id};
            //    this.selectModel.equipmentSelectModel.visible = true;
            //},
            //doSaveEquipment: function (items) {
            //    var _this = this;
            //    var params = _.map(items, function (item) {
            //        return {
            //            id: item.id
            //        }
            //    });
            //    this.$api.addEquipment({id: this.mainModel.vo.id}, params).then(function () {
            //        _this.getEquipments();
            //    })
            //},
            //doRemoveEquipment: function (item) {
            //    var _this = this;
            //    var params = [
            //        {
            //            id: item.entry.data.id
            //        }
            //    ];
            //    this.$api.removeEquipment({id: this.mainModel.vo.id}, params).then(function () {
            //        _this.getEquipments();
            //    })
            //},
            /**
             * 自定义钩子函数
             */
            beforeInit: function () {
                this.checkedTabIndex=0;
                this.mainModel.componentData.equipment=[];
                this.mainModel.componentData.pipe=[];
                this.mainModel.componentData.safetyEvaluation=[];
                // this.mainModel.componentData.safetyEvaluationCommon=[];
                //下面两个是公共的，不依赖主表 危险源
                // this.loadSafetyEvaluationCommon();
                // this.loadM5CFileData();
            },
            afterInitData: function () {
                // this.fileModel.M5C.cfg.params.recordId="9999999999";
                var _this=this;
                this.mainModel.isChemicalObjReadOnly = true;
                var id = this.mainModel.vo.id;
                this.checkedTabIndex=0;
                if (id) {
                    this.loadEquipment();
                    this.loadPipe();
                    this.loadSafetyEvaluation();
                }
                else{
                    _this.mainModel.componentData.equipment=[];
                    _this.mainModel.componentData.pipe=[];
                    _this.mainModel.componentData.safetyEvaluation=[];
                }

            },
			beforeDoSave: function() {
				if(this.mainModel.vo.timeOfInvestment && this.mainModel.vo.timeOfInvestment.length === 10) {
					this.mainModel.vo.timeOfInvestment += " 00:00:00"; 
				}
			},
            buildSaveData: function () {
			    var _intValue = {};

			    if(!this.mainModel.vo.protectionDistance) {
                    _intValue.protectionDistance_empty = 1;
                }
                if(!this.mainModel.vo.approximationPopulationOfBoundary) {
                    _intValue.approximationPopulationOfBoundary_empty = 1;
                }

                if(!_.isEmpty(_intValue)) {
                    this.mainModel.vo["criteria"] = {
                        intValue: _intValue
                    };
                }
                return this.mainModel.vo;
            },
            beforeDoDelete: function () {
                if(this.mainModel.vo.timeOfInvestment && this.mainModel.vo.timeOfInvestment.length === 10) {
                    this.mainModel.vo.timeOfInvestment += " 00:00:00";
                }
            },
            //加载设备，安全附件（安全附件的数据在设备里）数据
            loadEquipment:function () {
                var _this=this;
                api.queryMrsEquipments(this.mainModel.vo.id,"1").then(function (res) {
                    _this.mainModel.componentData.equipment=res.data||[];
                })
            },
            //加载管道数据
            loadPipe:function () {
                var _this=this;
                api.queryMrsEquipments(this.mainModel.vo.id,"2").then(function (res) {
                    _this.mainModel.componentData.pipe=res.data||[];
                })
            },
            loadSafetyEvaluation:function(){
                var _this = this;
                api.queryMrsSafetyEvaluations({
                    id: _this.mainModel.vo.id,
                }).then(function (res) {
                    _this.mainModel.componentData.safetyEvaluation=res.data||[];
                })
            },
            loadSafetyEvaluationCommon:function(){
                var _this = this;
                api.queryMrsSafetyEvaluations({
                    id: '9999999999',
                }).then(function (res) {
                    _this.mainModel.componentData.safetyEvaluationCommon=res.data||[];
                })
            },
            loadM5CFileData:function () {
                var _this=this;
                api.listFile({
                    dataType:"M5C",
                    recordId:"9999999999",
                }).then(function (res) {
                    _this.mainModel.componentData.systemM5C=res.data||[];


                })
            },
            afterDoSave:function (pms) {
                if(pms.type=="C"){

                }

            }
            
        },
        created:function(){
            //下面两个是公共的，不依赖主表 危险源
            this.loadSafetyEvaluationCommon();
            this.loadM5CFileData();
        },
        watch:{
            'mainModel.vo.catalog.id':function (val,old) {
               if(!val&&old){
                   this.mainModel.vo.catalog.code=null;
                   this.mainModel.vo.catalog.unNumber=null;
               }
            },
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});