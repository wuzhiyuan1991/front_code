define(function(require){
	var LIB = require('lib');
 	//数据模型
    var tpl = require("text!./editInfo.html");
    var api = require("../vuex/api");

	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
            // legalRegulation:{id: '', name: ''},
            firstLevel:null,
            secondLevel:null,
            lowOldBadLevel:null,
			checkBasis:null,
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
                "checkBasis": [LIB.formRuleMgr.require("检查依据"),
                    LIB.formRuleMgr.length(1000, 1)
                ],
	        },
	        emptyRules:{}
		},
		isShowXBGDField:false
	};


	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			
		},

		data:function(){
			return dataModel;
		},
		methods: {
            newVO: newVO,

            afterInitData: function (vo) {
                var _this = this;
                var _vo = _this.mainModel.vo;
                _.extend(_this.mainModel.vo, {
                    id : vo.id,
                    // legalRegulation:{id: '', name: ''},
                    firstLevel:vo.firstLevel,
                    secondLevel:vo.secondLevel,
                    lowOldBadLevel:vo.lowOldBadLevel,
					checkBasis:vo.checkBasis
                });
				this.isShowXBGDField = LIB.getBusinessSetStateByNamePath('poolGovern.isShowXBGDField');
            },
            doSave:function () {
				var _this = this;
				this.$refs.ruleform.validate(function (valid) {
					if (valid) {
						api.updateInfo(_this.mainModel.vo).then(function (res) {
							_this.visible = false;
							_this.$parent.initData(_this.mainModel.vo.id);
						});
					}
				});
			}
        }
	});
	
	return detail;
});