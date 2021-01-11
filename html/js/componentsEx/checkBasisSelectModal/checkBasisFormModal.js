define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./checkBasisFormModal.html");
    var api = require("views/businessFiles/hiddenDanger/checkItem/vuex/api");

	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//
			code : null,
			//方法名称
			name : null,
            legalRegulationType:{id:'',name:''}
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
                // "code" : [LIB.formRuleMgr.require(""),
					// 	  LIB.formRuleMgr.length()
                // ],
				"name" : [LIB.formRuleMgr.require("依据内容"),
						  LIB.formRuleMgr.length(500,1)
				],
                "code" : [LIB.formRuleMgr.length(100)],
				"legalRegulationType.id":[
                    LIB.formRuleMgr.require("检查依据分类"),
				]
                // "compId": [{ required: true, message: '请选择所属公司' },
                //     LIB.formRuleMgr.length()
                // ],
                // "content": [LIB.formRuleMgr.require("内容"),
                //     LIB.formRuleMgr.length(500, 1)
                // ],
				// "disable" : [LIB.formRuleMgr.length()],
				// "modifyDate" : [LIB.formRuleMgr.length()],
				// "createDate" : [LIB.formRuleMgr.length()],
	        },
	        emptyRules:{}
		},
        legalRegulationTypes:[]
	};

	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            afterInit: function () {
                var _this = this;
                _this.legalRegulationTypes = [];
                api.queryLegalTypes().then(function (res) {
                    _this.legalRegulationTypes = res.data.list;
                });
                if (this.mainModel.opType === 'create') {
                    api.getUUID().then(function (res) {
                        _this.mainModel.vo.id = res.data;
                    })
                }
            },
		},
	});
	return detail;
});