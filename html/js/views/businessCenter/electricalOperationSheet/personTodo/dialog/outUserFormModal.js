define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./outUserFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			users:[]
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
				"users":[{type:"array", required: true, validator:function (rule, value, callback) {
						if(value.length == 0){
                            return callback(new Error("请添加人员"))
						}
						if(value){
							var obj = _.find(value, function (item) {
								return item.content;
                            })
							if(!obj) callback(new Error("请添加人员"))
						}
						return callback();
                }}]
	        },
	        emptyRules:{}
		},
		selectModel : {
			exerciseSchemeSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
		},
		data:function(){
			return dataModel;
		},
		watch: {
			visible:function (val) {
				if(val){
					this.mainModel.vo.users = [{content:null}];
                    this.mainModel.opType = "create";
				}
            }
        },
		methods:{
			newVO : newVO,

			doSave:function () {
                var arr = [];
                var _this = this;
                if (this.mainModel.vo.users) {
                    for (var i = 0; i < this.mainModel.vo.users.length; i++) {
                        if (this.mainModel.vo.users[i].content) {
                            arr.push({name:this.mainModel.vo.users[i].content,type:2});
                        }
                    }
                }
                // this.mainModel.vo.users = [].concat(arr);
                this.$refs.ruleform.validate(function (valid) {
					if(valid){
						_this.visible = false;
						_this.$emit('do-save', arr);
					}
                })
            },

			afterDoSave:function () {
				LIB.Msg.info("保存成功");
            },

            doAddInputItem:function () {
                this.mainModel.vo.users.push({content:null});
            },
			beforeInit:function () {

            }
		}
	});
	
	return detail;
});