define(function(require){
	var LIB = require('lib');
 	//数据模型
	var api = require("../vuex/api");
	var tpl = require("text!./edit.html");
	
	var newVO = function() {
		return {
				id :null,
				code :null,
				name:null,
				disable:null,//默认禁用
				orgId:null,//组织机构id
				description : null
		}
	};
	//数据模型
	var dataModel = {
			mainModel : {
				vo : newVO(),
				//当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
				opType : ""
			},
			stateList : [{value: '0',label: '启用'},{value: '1',label: '禁用'}],
			orgList : []
	};
	
	var detail = LIB.Vue.extend({
		template: tpl,
		data:function(){
			return dataModel;
		},
		methods:{
			doSave:function(){
				var _this = this;
				var callback = function(res){
					//_this.$dispatch("ev_editFinshed");
					LIB.Msg.info("保存成功");
				}
				if(this.mainModel.opType == "create") {
					api.create(this.mainModel.vo).then(callback);
				} else {
					api.update(this.mainModel.vo).then(callback);
				}
			},
			//doCancel:function(){
			//	this.$dispatch("ev_editCanceled");
			//},
			doPrint:function(){
				// console.log(this.mainModel);
			},
			convertPicPath:LIB.convertPicPath
		},
		events : {
			//edit框数据加载
			"ev_editReload" : function(nVal){
				//注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
				var _data = dataModel.mainModel;
				var _vo = _data.vo;
				//清空数据
        		_.extend(_vo,newVO());
        		api.listOrg().then(function(res){
        			dataModel.orgList = res.data;
        			
        			//存在nVal则是update
        			if(nVal != null) {
        				_data.opType = "update";
        				api.get({id:nVal}).then(function(res){
        					//初始化数据
        					_.deepExtend(_vo, res.data);
        				});
        			}else{
        				_data.opType = "create";
        			}
        		});
			}
		}
	});
	return detail;
});