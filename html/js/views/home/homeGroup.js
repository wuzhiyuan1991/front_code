define(function(require) {
	var LIB = require('lib');
    var template = require("text!./homeGroup.html");
    var actions = require("./vuex/actions");
    var api = require("./vuex/api");
    var dataModel = {
    		notices:[],
    		groupStatistic:{}
    	}

//首页效果
var vm = LIB.Vue.extend({
	mixins : [LIB.VueMixin.dataDic],
	template: template,
	components : {

	},
	data:function(){
		return dataModel;
	},

	methods:{

	},
	events : {

	},
	//初始化
	ready:function() {
		var _this = this;
		api.listMaterial({"criteria.intValue":{isGroup:1},"parent.code":"1"}).then(function(res){
			_this.notices = res.data.list;
		});
		api.queryGroupStatistic().then(function(res){
			_this.groupStatistic = res.data;
		});
	}

})
	return vm;
});
