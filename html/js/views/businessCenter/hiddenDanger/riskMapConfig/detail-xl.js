define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");

	var chinese2Pinyin = require("libs/chinese2pinyin");

    var checkTableSelectModal = require("componentsEx/selectTableModal/checkTableSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//编码
			code : null,
			//名称
			name : null,
			compId: '',
			orgId: '',
			remark: '',
			//禁用标识 0未禁用，1已禁用
			disable : '1',
            abbreviate: ''
		}
	};


	//Vue数据
	var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            disableList: [{id: "0", name: "启用"}, {id: "1", name: "停用"}],
            rules: {
                "name": [LIB.formRuleMgr.require("名称"),
                    LIB.formRuleMgr.length()
                ],
                "compId": [{required: true, message: '请选择所属公司'}, LIB.formRuleMgr.length()],
                "orgId": [{required: true, message: '请选择所属部门'}, LIB.formRuleMgr.length()],
                "disable": [
                    LIB.formRuleMgr.require("状态")
                ]
            },
        },
        selectModel: {
            showCheckTableSelectModal: {
                visible: false,
            },
        },
        tableModel: {
            tableObjectModel: {
                url: "tableobjectrel/riskpoint/list/{curPage}/{pageSize}",
                columns: [
                    {
                        title: "风险点名称",
                        width: 220,
                        fieldName: "name",
                    },
                    {
                        title: '固有',
                        width: 120,
                        fieldName:'isInherent',
                        renderClass: 'text-center',
                        fieldType: "custom",
                        render: function (data) {
                            if (data.isTemporary === '10') {
                                return '<label class="ivu-checkbox-wrapper ivu-checkbox-wrapper-disabled"><span class="ivu-checkbox ivu-checkbox-disabled"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                            } else {
                                if (data.isInherent === '10') {
                                    return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span></span><span></span></label>'
                                } else {
                                    return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                                }
                            }
                        }
                    },
                    {
                        title: '临时',
                        width: 120,
                        fieldName:'isTemporary',
                        renderClass: 'text-center',
                        fieldType: "custom",
                        render: function (data) {
                            if (data.isInherent === '10') {
                                return '<label class="ivu-checkbox-wrapper ivu-checkbox-wrapper-disabled"><span class="ivu-checkbox ivu-checkbox-disabled"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                            } else {
                                if (data.isTemporary === '10') {
                                    return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span></span><span></span></label>'
                                } else {
                                    return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                                }
                            }
                        }
                    },
                    {
                        title: '临时启用',
                        width: 120,
                        fieldName:'isTemporaryEnable',
                        renderClass: 'text-center',
                        fieldType: "custom",
                        render: function (data) {
                            if (data.isInherent === '10') {
                                return '<label class="ivu-checkbox-wrapper ivu-checkbox-wrapper-disabled"><span class="ivu-checkbox ivu-checkbox-disabled"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                            } else {
                                if (data.isTemporary === '10') {
                                    if (data.isTemporaryEnable === '10') {
                                        return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span></span><span></span></label>'
                                    } else {
                                        return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                                    }
                                } else {
                                    return '<label class="ivu-checkbox-wrapper ivu-checkbox-wrapper-disabled"><span class="ivu-checkbox ivu-checkbox-disabled"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                                }
                            }
                        }
                    }
                ]
            }
        }
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
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
            "checktableSelectModal":checkTableSelectModal
        },
        computed: {
            disableLabel: function () {
                return this.mainModel.vo.disable === '1' ? '停用' : '启用';
            }
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            onNameChanged: function () {
				var name = this.mainModel.vo.name;
				this.mainModel.vo.abbreviate = chinese2Pinyin.convert(name, "F", {remainSpecial: true});
            },
            doShowCheckTableSelectModel:function () {
			    this.selectModel.showCheckTableSelectModal.visible = true;
            },
            doSaveCheckTable : function(selectedDatas) {
			    var _this = this;
                if (selectedDatas) {
                    var params = _.map(selectedDatas, function (item) {
                        return {
                            checkObjectId: _this.mainModel.vo.id,
                            checkObjType: "1",
                            tabType: "1",
                            checkTableId: item.id,
                        }
                    });
                    api.createTableobjectrel(null, params).then(function (res) {
                        LIB.Msg.success("保存成功");
                        _this.$refs.tableobjectTable.doQuery({'criteria.strValue':{dominationAreaId : _this.mainModel.vo.id}});
                    })
                }
            },

            doClickCOCell: function(data) {
                var _this = this,
                    cell = data.cell,
                    row = data.entry.data;
                var el = data.event.target;
                var isDisabled = el.closest(".ivu-checkbox-wrapper") && (el.closest(".ivu-checkbox-wrapper").classList.contains("ivu-checkbox-wrapper-disabled"));
                if (isDisabled) return;

                //固有
                if ( 'isInherent' === cell.fieldName){
                    var isInherent = (row.isInherent === '0' || !row.isInherent) ? '10' : '0';
                    if(row.relId) {
                        api.updateTableobjectrel({id: row.relId, isInherent: isInherent}).then(function () {
                            _this.$refs.tableobjectTable.doQuery({'criteria.strValue':{dominationAreaId : _this.mainModel.vo.id}});
                            // row.isInherent = isInherent;
                            LIB.Msg.info("操作成功");
                        })
                    }else {
                        var param ={
                                checkObjectId: _this.mainModel.vo.id,
                                checkObjType: "1",
                                tabType: "1",
                                checkTableId: row.id,
                                isInherent:isInherent
                            };
                        api.createTableobjectrel(null, [param]).then(function (res) {
                            LIB.Msg.success("保存成功");
                            _this.$refs.tableobjectTable.doQuery({'criteria.strValue':{dominationAreaId : _this.mainModel.vo.id}});
                        })
                    }
                }
                //临时
                if ( 'isTemporary' === cell.fieldName){
                    var isTemporary = (row.isTemporary === '0' || !row.isTemporary) ? '10' : '0';
                    var isTemporaryEnable = isTemporary === '0' ? '0' : null;
                    if(row.relId) {
                        api.updateTableobjectrel({id: row.relId, isTemporary: isTemporary,isTemporaryEnable: isTemporaryEnable}).then(function () {
                            _this.$refs.tableobjectTable.doQuery({'criteria.strValue':{dominationAreaId : _this.mainModel.vo.id}});
                            // row.isTemporary = isTemporary;
                            // row.isTemporaryEnable = isTemporaryEnable;
                            LIB.Msg.info("操作成功");
                        })
                    }else {
                        var param ={
                            checkObjectId: _this.mainModel.vo.id,
                            checkObjType: "1",
                            tabType: "1",
                            checkTableId: row.id,
                            isTemporary:isTemporary,
                            isTemporaryEnable:isTemporaryEnable
                        };
                        api.createTableobjectrel(null, [param]).then(function (res) {
                            LIB.Msg.success("保存成功");
                            _this.$refs.tableobjectTable.doQuery({'criteria.strValue':{dominationAreaId : _this.mainModel.vo.id}});
                        })
                    }
                }
                //启动临时
                if ( 'isTemporaryEnable' === cell.fieldName){
                    var isTemporaryEnable = (row.isTemporaryEnable === '0' || !row.isTemporaryEnable) ? '10' : '0';
                    if(row.relId) {
                        api.updateTableobjectrel({id: row.relId, isTemporaryEnable: isTemporaryEnable}).then(function () {
                            _this.$refs.tableobjectTable.doQuery({'criteria.strValue':{dominationAreaId : _this.mainModel.vo.id}});
                            // row.isTemporaryEnable = isTemporaryEnable;
                            LIB.Msg.info("操作成功");
                        })
                    }else {
                        var param ={
                            checkObjectId: _this.mainModel.vo.id,
                            checkObjType: "1",
                            tabType: "1",
                            checkTableId: row.id,
                            isTemporaryEnable:isTemporaryEnable
                        };
                        api.createTableobjectrel(null, [param]).then(function (res) {
                            LIB.Msg.success("保存成功");
                            _this.$refs.tableobjectTable.doQuery({'criteria.strValue':{dominationAreaId : _this.mainModel.vo.id}});
                        })
                    }
                }
            },
            afterInitData : function() {
                this.$refs.tableobjectTable.doQuery({'criteria.strValue':{dominationAreaId : this.mainModel.vo.id}});
            },
            beforeInit : function() {
                this.$refs.tableobjectTable.doClearData();
            },
		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});