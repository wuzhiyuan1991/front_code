define(function(require){
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");

    //初始化数据模型
    var newVO = function() {
        return {
            id : null,
            //编码
            code : null,
            //依据内容
            name : null,
            //禁用标识 0启用，1禁用
            disable : '0',
            //法律法规类型
            legalRegulationType : {id:'', name:''},
            //监督项
            // checkItems : [],
            insertPointObjId: null,
            orderNo: null,
            keyword:null,
            label:null,
            interpretation:null,
            topType:null,
            industryApply:null
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
                "code" : [LIB.formRuleMgr.length(100)],
                "name" : [LIB.formRuleMgr.require("依据内容"),
                    LIB.formRuleMgr.length(500)
                ],
                "disable" :LIB.formRuleMgr.require("状态"),
                "keyword" : [LIB.formRuleMgr.length(100)],
                "label" : [LIB.formRuleMgr.length(100)],
                "interpretation" : [LIB.formRuleMgr.length(65535)],
                "industryApply":[LIB.formRuleMgr.length(100)]
            }
        },
        tableModel : {
        },
        formModel : {
        },
        selectModel : {
            legalRegulationTypeSelectModel : {
                visible : false,
                filterData : {orgId : null}
            },
        },
        legalTypes: null,
        orderList: null, // 排序位置列表
        positionList:[{key:"first",name:"当前层级最前"},{key:"last",name:"当前层级最后"},{key:"middle",name:"某个节点之后"}],//位置方式列表
        positionKey:'first'
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
     beforeInit 		//初始化之前回调
     afterInit			//初始化之后回调
     afterInitData		//请求 查询 接口后回调
     afterInitFileData  //请求 查询文件列表 接口后回调
     beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
     afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
     buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
     afterDoSave		//请求 新增/更新 接口后回调
     beforeDoDelete		//请求 删除 接口前回调
     afterDoDelete		//请求 删除 接口后回调
     events
     vue组件声明周期方法
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
        template: tpl,
        components : {
            // "legalregulationtypeSelectModal":legalRegulationTypeSelectModal,
            // "checkitemSelectModal":checkItemSelectModal,
        },
        props: {
            typeId: {
                type: String,
                default: ''
            },
            data1: {
                type:Object,
                default:null
            }
        },
        computed: {
            'displayTypeName': function () {
                var id = this.mainModel.vo.legalRegulationType.id;
                if (!id) {
                    return '';
                }
                var type = _.find(this.legalTypes, function (t) {
                    return t.id === id;
                });
                return _.get(type, "name");
            }
        },
        data:function(){
            return dataModel;
        },

        methods:{
            newVO : newVO,
            doShowLegalRegulationTypeSelectModal : function() {
                this.selectModel.legalRegulationTypeSelectModel.visible = true;
                //this.selectModel.legalRegulationTypeSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveLegalRegulationType : function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.legalRegulationType.id = selectedDatas[0].id;
                    this.mainModel.vo.legalRegulationType.name = selectedDatas[0].name;
                }
            },
            onSelect:function () {
                var _this = this;
                this.$nextTick(function (item) {
                    if(_this.positionKey=='middle'){
                        // _this.mainModel.vo.insertPointObjId = _this.orderList[0].id;
                    }
                })
            },

            afterDoSave:function () {

            },
            afterInit: function () {
                this.mainModel.vo.typeId = this.typeId;

                this.mainModel.vo.legalRegulationType = {id: this.typeId, name:(this.data1?this.data1.name:'')};
                this.positionKey = "last";
                if(this.mainModel.opType == 'create') {
                    this._setOrderList(this.typeId);
                }
                return ;
            },
            afterInitData: function() {
                this._setOrderList();
            },
            beforeDoSave: function() {
                var _this = this;
                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        if(!_this.mainModel.vo.insertPointObjId && _this.positionKey=='middle'){
                            if (_this.orderList.length == 0) {
                                _this.mainModel.vo.insertPointObjId = '';
                            } else {
                                _this.mainModel.vo.insertPointObjId = _this.orderList[0].id;
                            }
                        }
                        if(_this.positionKey === "last"){
                            if (_this.orderList.length == 0) {
                                _this.mainModel.vo.insertPointObjId = '';
                            } else {
                                _this.mainModel.vo.insertPointObjId = _this.orderList.slice(-1)[0].id;
                            }
                        }
                        else if(_this.positionKey === "first"){
                            _this.mainModel.vo.insertPointObjId = '';
                        }
                        if(_this.mainModel.vo.insertPointObjId) {
                            _this.mainModel.vo["criteria"] = {
                                strValue: {insertPointObjId: _this.mainModel.vo.insertPointObjId}
                            };
                            _this.mainModel.vo.orderNo = null;
                        }
                        _this.mainModel.vo = _.omit(_this.mainModel.vo, ['topType', 'modifyDate']);
                    }
                });
            },
            /**
             * 设置排序位置列表数据
             * @param pid 父级节点id
             * @private
             */
            _setOrderList: function (pid) {
                var _this = this;
                var orderList = null;
                var parentId = pid || this.mainModel.vo.legalRegulationType.id;
                var id = this.mainModel.vo.id;
                if(parentId) {
                    api.querLegalregulations({id:  parentId}).then(function(res){
                        if(res.data) {
                            orderList = _.sortBy(res.data, function (item) {
                                return item.orderNo ? parseInt(item.orderNo) : 0;
                            });
                            if(id) {
                                var index = _.findIndex(orderList, "id", id);
                                if(index == orderList.length - 1) {
                                    _this.positionKey = "last";
                                } else if(index == 0) {
                                    _this.positionKey = "first";
                                } else {
                                    _this.positionKey = "middle";
                                }
                                orderList.splice(index, 1);
                                var prevItem = index > 0 ? orderList[index - 1] : null;
                                if(prevItem) {
                                    _this.mainModel.vo.insertPointObjId = prevItem.id;
                                }
                            }
                            _this.orderList = orderList;

                            if(!_.isArray(orderList) || orderList.length === 0) {
                                _this.mainModel.vo.insertPointObjId = '';
                            }
                        }
                    })
                }
            },
        },
        events : {
        },
        init: function(){
            this.$api = api;
        },
    });

    return detail;
});