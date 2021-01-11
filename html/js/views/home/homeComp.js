define(function(require) {
	var LIB = require('lib');
	var template = require("text!./homeComp.html");
	var actions = require("./vuex/actions");
	var api = require("./vuex/api");
	var dataModel = {
		compNotices:[],
		compRules:[]
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
            doDown:function(data){
                window.open("/file/down/"+data.cloudFileId);
            }
		},
		events : {
                "ev_homeReload":function(name){
                    var _this = this;
                    if(name=="公告通知"){
                        api.listMaterial({orgId:LIB.user.compId,"parent.code":"1"}).then(function(res){
                            _this.compNotices = res.data.list;
                        });
                    }else if(name=="公司制度"){
                        api.listMaterial({orgId:LIB.user.compId,"parent.code":"2"}).then(function(res){
                            _this.compRules = res.data.list;
                        });
                    }
                }
		},
		//初始化
		ready:function() {
			var _this = this;
			api.listMaterial({orgId:LIB.user.compId,"parent.code":"1"}).then(function(res){
				_this.compNotices = res.data.list;
			});
			api.listMaterial({orgId:LIB.user.compId,"parent.code":"2"}).then(function(res){
				_this.compRules = res.data.list;
			});
		}

	})
	return vm;
});
