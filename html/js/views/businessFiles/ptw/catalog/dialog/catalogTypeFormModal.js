define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./catalogTypeFormModal.html");
var api = require("../vuex/api");
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
            //编码
            code : null,
            //(级别/指标）名称/承诺岗位
            name : null,
            //启用/禁用 0:启用,1:禁用
            disable : "0",
            //字典类型 1:作业类型,2:作业分级,3:个人防护设备,4:气体检测指标,5:岗位会签承诺
            type : null,
            //分级依据/标准范围/承诺内容
            content : null,
            //作业级别
            level : null,
            //单位（气体检测指标）
            unit : null,
            //父级类型
            parent : {id:'', name:''},
		}
	};

	//Vue数据
	var dataModel = {
        modify:true,
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",

			//验证规则
	        rules:{
				"name" : [LIB.formRuleMgr.require("名称"),
						  LIB.formRuleMgr.length(50)
				],
	        },
	        emptyRules:{}
		},
	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,

		watch:{

		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			init:function (obj) {
				//  初始化数据
				this.mainModel.vo = this.newVO();
				if(obj && obj.id){
					var _this = this;
                    api.get({id:obj.id}).then(function (res) {
						console.log(res.data);
                        _this.mainModel.vo = res.data;
                    })
				}
            },
			beforeInit:function () {

            },
			afterInitData:function () {

            },
			doSaveType : function() {
				var _this = this;

                this.$refs.ruleform.validate(function(valid) {
                	if(valid){
                        _this.visible = false;
                        if(_this.mainModel.vo.id){
							_this.$emit('do-update', _this.mainModel.vo);
						}else{
                            _this.$emit('do-save', _this.mainModel.vo);
                        }
					}
				})
			},
		},
		init:function () {
            this.$api = api;
        }
	});
	
	return detail;
});