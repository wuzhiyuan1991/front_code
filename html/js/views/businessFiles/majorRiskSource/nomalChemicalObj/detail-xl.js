define(function(require){
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var checkObjectCatalogSelectModal = require("componentsEx/selectTableModal/checkObjectCatalogSelectModal");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");

    //初始化数据模型
    var newVO = function() {
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
            dataType : '3',
            //实际储量
            actualReserves : null,
            //部门id
            orgId : null,
            //备注
            remark : null,
            //类型
            catalog : {id:'', name:'', unit: ''},
            //属地
            dominationArea : {id:'', name:''}
        }
    };


    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            opType : 'view',
            isReadOnly : true,
            title:"",
            disableList: [{id: "0", name: "启用"}, {id: "1", name: "停用"}],
            rules: {
                "name" : [LIB.formRuleMgr.require("名称"),
                    LIB.formRuleMgr.length()
                ],
                "catalog.id": [LIB.formRuleMgr.require("化学品")],
                "compId": [{required: true, message: '请选择所属公司'}, LIB.formRuleMgr.length()],
                "orgId": [{required: true, message: '请选择所属部门'}, LIB.formRuleMgr.length()],
                "dominationArea.id" : [LIB.formRuleMgr.require("属地")],
                "disable": [LIB.formRuleMgr.require("状态")],
                // "actualReserves" : [{ type:'number', required: true, message: '请输入正确实际储量'}],
                "actualReserves": LIB.formRuleMgr.range(0, 9999999, 2),
                "remark" : [LIB.formRuleMgr.length(500)]
            }
        },
        selectModel : {
            checkObjectCatalogSelectModel : {
                visible : false,
                filterData : {dataType : '3'}
            },
            dominationAreaSelectModel : {
                visible : false,
                filterData : {orgId : null}
            }
        },
        fileModel:{
            M3 : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'M3',//涉及的所有化学品安全技术说明书（MSDS）
                        fileType: 'M'
                    }
                },
                data : []
            },
            M5 : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'M5',//安全管理规章制度及安全操作规程
                        fileType: 'M'
                    }
                },
                data : []
            },
            M7 : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'M7',//事故应急预案、评审意见、演练计划和评估报告
                        fileType: 'M'
                    }
                },
                data : []
            },
            M10 : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'M10',//场所安全警示标志的设置情况
                        fileType: 'M'
                    }
                },
                data : []
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
            "checkobjectcatalogSelectModal":checkObjectCatalogSelectModal,
            "dominationareaSelectModal":dominationAreaSelectModal,

        },
        computed: {
            limitStyle: function () {
                if(!this.mainModel.vo.actualReserves ||
                    !this.mainModel.vo.catalog ||
                    !this.mainModel.vo.catalog.maxReserves) {
                    return {}
                }
                if(parseFloat(this.mainModel.vo.actualReserves ) > parseFloat(this.mainModel.vo.catalog.maxReserves)) {
                    return {
                        color: '#f00',
                        fontWeight: 'bold'
                    }
                }
                return {};
            }
        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            doShowCheckObjectCatalogSelectModal : function() {
                if(this.mainModel.isReadOnly) {
                    return;
                }
                this.selectModel.checkObjectCatalogSelectModel.visible = true;
                //this.selectModel.checkObjectCatalogSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveCheckObjectCatalog : function(items) {
                this.mainModel.vo.catalog = items[0];
                this.mainModel.vo.name = items[0].name;
            },
            doShowDominationAreaSelectModal : function() {
                if(!this.mainModel.vo.orgId) {
                    return LIB.Msg.warning("请先选中所属部门");
                }
                this.selectModel.dominationAreaSelectModel.visible = true;
                this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveDominationArea : function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.dominationArea = selectedDatas[0];
                }
            },
			afterInitFileData : function(data){
				var fileModel = this.fileModel;
				_.each(data, function(d){
					var fileData = _.property("data")(_.propertyOf(fileModel)(d.dataType));
					if(_.isArray(fileData)){
						fileData.push(d);
					}
				});
			},
            buildSaveData: function () {
                var _intValue = {};
                if(!this.mainModel.vo.actualReserves) {
                    _intValue.actualReserves_empty = 1;
                }
                if(!_.isEmpty(_intValue)) {
                    this.mainModel.vo["criteria"] = {
                        intValue: _intValue
                    };
                }
                return this.mainModel.vo;
            }
        },
        events : {
        },
        init: function(){
            this.$api = api;
        }
    });

    return detail;
});