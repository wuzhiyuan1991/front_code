
define(function(require){
	//基础js
	var LIB = require('lib');
	var api = require("./vuex/api");
	//vue数据
	var newVO = function () {
		return {
			id:null,
			name: null,
			parentId:null,
			disable:"0",
            menuCode:null,
			code:null,
            authority:{id:'',code:'',name:'',parentId:'',disable:''},
		}
	};

	//vue数据 配置url地址 拉取数据
	var dataModel = {
		mainModel: {
			vo: newVO(),
			flag:null,
			disableList:[{value:"0",name:"启用"},{value:"1",name:"停用"}]
		},

		rules:{
			"name" : [LIB.formRuleMgr.require("名称"),
				LIB.formRuleMgr.length(50,0)
			],
		},
	};
	var vm = LIB.VueEx.extend({
		template: require("text!./detail.html"),
		data:function(){
			return dataModel;
		},
		//引入html页面
		methods:{
			//保存
			doSave:function(){
				var _this=this;
                var _vo = _this.mainModel.vo;
                _vo.authority.name = _vo.name;
                _vo.authority.code = _vo.code;
                _vo.authority.disable = _vo.disable;
                if(this.mainModel.flag == "add"){
                    _vo.authority.id = _vo.code;
					var _vo = dataModel.mainModel.vo;
					var callback1 = function (res) {
						_vo.id = res.body.id;
						LIB.Msg.info("添加成功");
						_this.$emit("doupdata",dataModel.mainModel,"add")
					}
						api.add(null,{id:dataModel.mainModel.vo.authority.id,authority : dataModel.mainModel.vo.authority}).then(callback1)
				}else{
					var callback = function (res) {
						LIB.Msg.info("修改成功");
						_this.$emit("doupdata",dataModel.mainModel)
					};
                    _vo.authority.parentId = _vo.menuCode;
                    _vo.authority.id = _vo.id;
					api.update(_.pick(dataModel.mainModel.vo,"id","authority")).then(callback)
				}
			},
		},
		events:{
			//点击取得id跟name值 双向绑定
			"ev_detailReload" : function(data,nVal) {
				var _vo = dataModel.mainModel.vo;
				this.mainModel.flag = nVal;
				//清空数据
				_.extend(_vo, newVO());
				if(nVal!="add"){
					_.deepExtend(_vo, data.data);
				}else{
					dataModel.mainModel.vo.authority.parentId = data.data.code;
				}
			}
		}
	})
	return vm;
})