
define(function(require){
	//基础js
	var LIB = require('lib');
	var api = require("./vuex/api");
	//vue数据
	var newVO = function () {
		return {
			id : null,
			code : null,
            name : null,
			key : null,
            value : null,
			remarks : null,
			parentId : null,
			disable : "0"
		}
	};

	//vue数据 配置url地址 拉取数据
	var dataModel = {
		mainModel: {
			vo : newVO(),
			flag : null,
			disableList : [
				{value:"0",name:"启用"},
				{value:"1",name:"停用"}
			]
		},
        rules:{
			"code" : [
				LIB.formRuleMgr.require("编码"),
				LIB.formRuleMgr.length(100,0)
			],
			"name" : [
				LIB.formRuleMgr.require("名称"),
				LIB.formRuleMgr.length(100,0)
			],
            "key" : [
                LIB.formRuleMgr.require("键"),
                LIB.formRuleMgr.length(100,0)
            ],
            "value" : [
                LIB.formRuleMgr.require("值"),
                LIB.formRuleMgr.length(100,0)
            ]
    	}
	};
	var vm = LIB.VueEx.extend({
		template: require("text!./detail.html"),
        //mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
		data:function(){
			return dataModel;
		},
		//引入html页面
		methods:{
			//保存
			doSave:function(){
                var _this = this;
                this.$refs.ruleform.validate(function(valid) {
                    if (!valid) {
                        return;
                    }
                    if (_this.mainModel.flag == "add") {
                        var callback1 = function (res) {
                            _this.mainModel.vo.id = res.body.id;
                            LIB.Msg.info("添加成功");
                            _this.$emit("doupdate", dataModel.mainModel, "add")
                        }
                        api.add(null, {
                            name: _this.mainModel.vo.name,
                            parentId: _this.mainModel.vo.parentId,
                            code: _this.mainModel.vo.code,
                            key: _this.mainModel.vo.key,
                            value: _this.mainModel.vo.value,
                            disable: _this.mainModel.vo.disable,
                            remarks: _this.mainModel.vo.remarks
                        }).then(callback1)

                    } else {
                        var callback = function (res) {
                            LIB.Msg.info("修改成功");
                            _this.$emit("doupdate", dataModel.mainModel)
                        }
                        //api.update(dataModel.mainModel.vo).then(callback)
                        api.update(
                            _.pick(
                                dataModel.mainModel.vo,
                                "id",
                                "parentId",
                                "name",
                                "code",
                                "key",
                                "value",
                                "remarks",
                                "disable"
                            )
                        ).then(callback)
                    }
                });
			},
		},
		events:{
			//点击取得id跟name值 双向绑定
			"ev_detailReload" : function(data,nVal) {
				var _vo = dataModel.mainModel.vo;
				this.mainModel.flag = nVal;
				//清空数据
				_.extend(_vo, newVO());
				if(nVal!=="add"){
					_.deepExtend(_vo, data.data);
				}else{
					var _data = data.data;
					dataModel.mainModel.vo.parentId = _data == null ? null : _data.id;
				}
			}
		},
        /*ready: function() {
            this.$api = api;
        }*/
	})
	return vm;
})