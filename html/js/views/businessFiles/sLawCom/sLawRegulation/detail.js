define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");

    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //编码
            code: null,
            //名称
            name: null,
            //禁用标识 0启用，1禁用
            disable: "0",
            //公司id
            compId: null,
            //部门id
            orgId: null,
            //预留字段
            content: null,
            //实施时间
            effectiveDate: null,
            //编号
            identifier: null,
            //适用行业
            industryApply: null,
            //解读
            interpretation: null,
            //关键字
            keyword: null,
            //标签
            label: null,
            //颁布时间
            publishDate: null,
            office:null,
            //分类
            irlLegalRegulationType: { id: '', name: '' },
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",

            //验证规则
            rules: {
                "code": [LIB.formRuleMgr.length(100)],
                "name": [LIB.formRuleMgr.require("名称"),
                LIB.formRuleMgr.length(255)
                ],
                'office':[LIB.formRuleMgr.require("发布机关")],
                "disable": LIB.formRuleMgr.require("状态"),
                "compId": [LIB.formRuleMgr.require("公司")],
                "orgId": [LIB.formRuleMgr.length(10),LIB.formRuleMgr.require("部门")],
                "content": [LIB.formRuleMgr.length(100)],
                "effectiveDate": [LIB.formRuleMgr.require("实施时间")],
                "identifier": [LIB.formRuleMgr.require("编号"),LIB.formRuleMgr.length(255)],
                "industryApply": [LIB.formRuleMgr.length(100)],
                "interpretation": [LIB.formRuleMgr.length(65535)],
                "keyword": [LIB.formRuleMgr.length(100)],
                "label": [LIB.formRuleMgr.length(100)],
                "publishDate": [LIB.formRuleMgr.require("颁布时间")],
                "irlLegalRegulationType.id": [LIB.formRuleMgr.allowStrEmpty],
            }
        },
        tableModel: {
        },
        formModel: {
        },
        selectModel: {
            legalRegulationTypeSelectModel: {
                visible: false,
                filterData: { orgId: null }
            },
        },
        fileModel: {
            file: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'IRL1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                        fileType: 'IRL'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                    },
                    filters: {
                        max_file_size: '10mb',
                    },
                },
                data: []
            }
        },
        legalTypes: null,
        legalRegulationTypes:[],
        typeSelectData:[]

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
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            // "legalregulationtypeSelectModal":legalRegulationTypeSelectModal,
            // "checkitemSelectModal":checkItemSelectModal,
        },
        props: {
            typeId: {
                type: String,
                default: ''
            },
            data1: {
                type: Object,
                default: null
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
        watch:{
            typeSelectData:function(val){
                if (val.length>0) {
                    
                    this.mainModel.vo.irlLegalRegulationType.name = val[0].name;
                }
                
            }
        },
        data: function () {
            return dataModel;
        },

        methods: {
            newVO: newVO,
            doShowLegalRegulationTypeSelectModal: function () {
                this.selectModel.legalRegulationTypeSelectModel.visible = true;
                //this.selectModel.legalRegulationTypeSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
     
         

           
            afterInit: function () {
                var _this = this


                this.mainModel.vo.irlLegalRegulationType = { id: this.typeId, name: (this.data1 ? this.data1.name : '') };

                if (this.mainModel.opType == 'create') {

                    this.$api.getUUID().then(function (res) {
                        _this.mainModel.vo.id = res.data;
                        _this.fileModel.file.cfg.params.recordId = res.data

                    })
                }
                api.queryLegalTypes().then(function (res) {
                    if (res.data.length > 0) {
                        _this.legalRegulationTypes = res.data;
                        var data =   _.filter(_this.legalRegulationTypes,function(item){
                            return item.id ==  _this.mainModel.vo.irlLegalRegulationType.id
                        })
                        _this.typeSelectData = data
                    } else {
                        _this.legalRegulationTypes = []
                        _this.typeSelectData = []
                    }
                });
                return;
            },

            afterInitData: function () {
                var _this = this
                _this.fileModel.file.cfg.params.recordId = _this.mainModel.vo.id
                

            },
          
           


          
        },
        events: {
        },
        init: function () {
            this.$api = api;
        },
    });

    return detail;
});