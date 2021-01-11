define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	//var tpaEquipmentSelectModal = require("componentsEx/selectTableModal/tpaEquipmentSelectModal");
	//var accidentCaseSelectModal = require("componentsEx/selectTableModal/accidentCaseSelectModal");
    var checkMethodSelectModal = require("componentsEx/selectTableModal/checkMethodSelectModal");
    var accidentCaseSelectModal = require("componentsEx/selectTableModal/accidentCaseSelectModal");
    var checkBasisSelectModal = require("componentsEx/selectTableModal/checkBasisSelectModal");
    //设备设施
    var tpaItemBoatEquipmentSelectModal = require("componentsEx/selectTableModal/tpaItemBoatEquipmentSelectModal");
	//初始化数据模型
	var newVO = function() {
		return {
            //ID
            id : null,
            //证书名称
            name:null,
            //证书编号
            code:null,
            //证书类别
            itemType:null,
            //发证日期
            awardDate:null,
            //发证机构
            compId:null,
            //有效日期
            validDate:null,
            //中间检验
            periodDate:null,
            //年度检验
            yearDate:null,
            //设备设施
            tpaEquipment : {id:'', name:''},
            //备注
            remarks:null,
            type:2,
            category:"2",
            //是否禁用，0启用，1禁用
            disable : "0"
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			//验证规则
	        rules:{
                //"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require("编码"),LIB.formRuleMgr.length()],
				"name" : [LIB.formRuleMgr.require("检查项名称"),
						  LIB.formRuleMgr.length(500)
				],
                "itemType": [{required: true, message: '请选择证书类别'},
                    LIB.formRuleMgr.length()
                ],
                "awardDate" : [LIB.formRuleMgr.require("发证日期"),
                    LIB.formRuleMgr.length()
                ],
                "compId": [{required: true, message: '请选择发证机构'},
                    LIB.formRuleMgr.length()
                ],
                "validDate" : [LIB.formRuleMgr.require("有效日期"),
                    LIB.formRuleMgr.length()
                ],
                "periodDate" : [LIB.formRuleMgr.require("中间检验"),
                    LIB.formRuleMgr.length()
                ]
	        },
	        emptyRules:{}
		},
		tableModel : {
            checkMethodTableModel : {
                url : "tpacheckitem/checkmethods/list/{curPage}/{pageSize}",
                columns : [{
                    title : "编码",
                    fieldName : "code"
                },{
                    title : "名称",
                    fieldName : "name",
                },{
                    title : "内容",
                    fieldName : "content",
                },{
                    title : "",
                    fieldType : "tool",
                    toolType : "del"
                }]
            },
            checkAccidentTableModel:{
                url : "tpacheckitem/checkmethods/list/{curPage}/{pageSize}",
                columns : [{
                    title : "编码",
                    fieldName : "code"
                },{
                    title : "内容说明",
                    fieldName : "name",
                },{
                    title : "",
                    fieldType : "tool",
                    toolType : "del"
                }]
            },
            checkBasisTableModel:{
                url : "tpacheckitem/checkbases/list/{curPage}/{pageSize}",
                columns :[
                    {
                        title:"检查依据分类",
                        fieldType:"custom",
                        render: function(data){
                            if(data.checkBasisType){
                                return data.checkBasisType.name;
                            }

                        }

                    },
                    {
                        title:"章节名称",
                        fieldName:"name"

                    },
                    {
                        title:"内容说明",
                        fieldName:"content",
                    },
                    {
                        title:"",
                        fieldType:"tool",
                        toolType:"del"
                    }
                ],
            },
            checkAccidentcaseTableModel:{
                url : "tpacheckitem/accidentcases/list/{curPage}/{pageSize}",
            },
		},
		formModel : {
		},
		cardModel : {
            checkMethodCardModel : {
                showContent : true
            },
            checkBasisTableModel:{
                showContent : true
            },
            checkAccidentcaseTableModel:{
                showContent : true
            }
		},
		selectModel : {
            checkMethodSelectModel:{
                visible:false
            },
            accidentCaseSelectModel:{
                visible:false
            },
            checkBasisSelectModel:{
                visible:false
            },
            tpaBoatEquipmentSelectModel:{
                visible:false,
                filterData: {compId: null}
            },
		},

	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
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
	 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
            "checkmethodSelectModal":checkMethodSelectModal,
            "accidentCaseSelectModal":accidentCaseSelectModal,
            "checkBasisSelectModal":checkBasisSelectModal,
            "tpaItemBoatEquipmentSelectModal":tpaItemBoatEquipmentSelectModal
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            doSaveEquipment : function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.tpaEquipment = selectedDatas[0];
                }
            },
            doShowTpaBoatEquipmentSelectModal : function() {
                this.selectModel.tpaBoatEquipmentSelectModel.visible = true;
                this.selectModel.tpaBoatEquipmentSelectModel.filterData = {compId : LIB.user.compId};
            },
            doClearInput:function(){
                this.mainModel.vo.tpaEquipment.id = "";
            },
            doShowCheckMethodSelectModel : function(param) {
                this.selectModel.checkMethodSelectModel.visible = true;
            },
            doShowAccidentCaseSelectModel : function(param) {
                this.selectModel.accidentCaseSelectModel.visible = true;
            },
            doShowCheckBasisSelectModel : function(param) {
                this.selectModel.checkBasisSelectModel.visible = true;
            },
            doSaveCheckMethods : function(selectedDatas) {
                if (selectedDatas) {
                    var _this = this;
                    api.saveCheckMethods({id : dataModel.mainModel.vo.id}, selectedDatas).then(function() {
                        _this.refreshTableData(_this.$refs.checkmethodTable);
                    });
                }
            },
            doSaveCheckBasis:function(selectedDatas){
                if (selectedDatas) {
                    var _this = this;
                    api.saveCheckBasis({id : dataModel.mainModel.vo.id}, selectedDatas).then(function() {
                        _this.refreshTableData(_this.$refs.checkbasisTable);
                    });
                }
            },
            doSaveAccident:function(selectedDatas){
                if (selectedDatas) {
                    var _this = this;
                    api.saveAccident({id : dataModel.mainModel.vo.id}, selectedDatas).then(function() {
                        _this.refreshTableData(_this.$refs.checkaccidentcaseTable);
                    });
                }
            },
            delCheckMethod: function(item) {
                var _this = this;
                var data = item.entry.data;
                api.removeCheckMethods({id : this.mainModel.vo.id}, [{id : data.id}]).then(function (res) {
                    _this.$refs.checkmethodTable.doRefresh();
                });
            },
            delCheckBasis: function(item) {
                var _this = this;
                var data = item.entry.data;
                api.removeCheckBasis({id : this.mainModel.vo.id}, [{id : data.id}]).then(function (res1) {
                    _this.$refs.checkbasisTable.doRefresh();
                });
            },
            delAccidentCase: function(item) {
                var _this = this;
                var data = item.entry.data;
                api.removeAccidentCase({id : this.mainModel.vo.id}, [{id : data.id}]).then(function (res2) {
                    _this.$refs.checkaccidentcaseTable.doRefresh();
                });
            },
			//doSaveAccidentCases : function(selectedDatas) {
			//	if (selectedDatas) {
			//		dataModel.mainModel.vo.accidentCases = selectedDatas;
			//		var param = _.map(selectedDatas, function(data){return {id : data.id}});
			//		var _this = this;
			//		api.saveAccidentCases({id : dataModel.mainModel.vo.id}, param).then(function() {
			//			_this.refreshTableData(_this.$refs.accidentcaseTable);
			//		});
			//	}
			//},
            //
			//doRemoveAccidentCases : function(item) {
			//	var _this = this;
			//	var data = item.entry.data;
			//	api.removeAccidentCases({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
			//		_this.$refs.accidentcaseTable.doRefresh();
			//	});
			//},
            beforeDoSave:function(){
                this.mainModel.vo.orgId = this.mainModel.vo.compId;
            },
			afterInitData : function() {
				//this.$refs.accidentcaseTable.doQuery({id : this.mainModel.vo.id});
                this.$refs.checkmethodTable.doQuery({id : this.mainModel.vo.id});
                this.$refs.checkbasisTable.doQuery({id : this.mainModel.vo.id});
                this.$refs.checkaccidentcaseTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				//this.$refs.accidentcaseTable.doClearData();
                this.$refs.checkmethodTable.doClearData();
                this.$refs.checkbasisTable.doClearData();
                this.$refs.checkaccidentcaseTable.doClearData();
			},

		},
		events : {
		},
        ready: function(){
        	this.$api = api;
        }
	});

	return detail;
});