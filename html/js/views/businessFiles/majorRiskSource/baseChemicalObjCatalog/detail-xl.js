define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var catalogSelect = require("./dialog/catalog");
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
			disable : null,
			//最大储量
			maxReserves : null,
			//数据类型 1-重点危险化学工艺 2-重点危险化学品 3-一般危险化学品 4-重大危险源
			dataType : '2',
			//别名
			alias : null,
			//CAS编码
			casNumber : null,
			//UN编号
			unNumber : null,
			//单位
			unit : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查表
			checkObjectCatalogClassify : {id:'', name:''},
            description: ''
		}
	};


	//Vue数据
	var dataModel = {
        mainModel: {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
            dataTypes: [
				{
					id: '2',
					name: '是'
				},
                {
                    id: '3',
                    name: '否'
                }
			],
            rules: {
				"code": [ LIB.formRuleMgr.length(50)],
                "name" : [LIB.formRuleMgr.require("名称"),
                    LIB.formRuleMgr.length()
                ],
                "dataType" : [LIB.formRuleMgr.require("数据类型"),
                    LIB.formRuleMgr.length()
                ],
                "alias" : [LIB.formRuleMgr.length()],
                "casNumber" : [LIB.formRuleMgr.length()],
                "description": [LIB.formRuleMgr.length(500)],
                "maxReserves": LIB.formRuleMgr.range(0, 9999999, 2)
            }
		},
		selectModel : {
			checkObjectCatalogClassifySelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},
        fileModel:{
            default : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'M1',
                        fileType: 'M'
                    }
                },
                data : []
            }
        },
        catalogs: []
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
            catalogSelect: catalogSelect
        },
		computed: {
            dataTypeLabel: function () {
            	var _this = this;
				return _.find(this.mainModel.dataTypes, function (item) {
					return item.id === _this.mainModel.vo.dataType;
                }).name;
            }
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			//doShowCheckObjectCatalogClassifySelectModal : function() {
			//	this.selectModel.checkObjectCatalogClassifySelectModel.visible = true;
			//	//this.selectModel.checkObjectCatalogClassifySelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			//},
			doSaveCheckObjectCatalogClassify : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.checkObjectCatalogClassify = selectedDatas[0];
				}
			},
            /**
			 * 选择分类
             */
            onSelectCatalog: function (item) {
				this.mainModel.vo.checkObjectCatalogClassify = item;
            },
			// NOTE fix非必填数值删除后引起的bug：9897
            buildSaveData: function () {
                var _intValue = {};
                if(!this.mainModel.vo.maxReserves) {
                    _intValue.maxReserves_empty = 1;
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
