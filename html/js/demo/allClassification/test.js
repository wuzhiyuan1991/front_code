
define(function(require) {
    var template = require("text!./test.html");
    var 
        BASE = require('base'),
        LIB = require('lib');
    var Vue = require("vue");
    var api = require("./vuex/api");
   
    //配置全部分类数据
   var categoryData={
    	//添加全部分类默认显示文字
    	title:"赛为集团V",
    	config:[{
    		//是否显示设置按钮
    		NodeEdit:false,
    		//左侧类别名称
    		title:"赛为集团",
			//数据源网址  请求优先
			url:"user/setting",
			type:"org"
    	},
//  	{
//  		//是否显示设置按钮
//  		NodeEdit:false,
//  		//左侧类别名称
//  		title:"赛为集团2",
//			//数据源网址
//			url:"",
//			//数据源
//  		data:[]
//  	},
    	{
    		NodeEdit:true,
    		title:"业务分类",
    		url:"risktype/list",
    		type:"business"
//  		data:[
//  			{"id":"id310","name":"数据趋势",
//        		"children":[
//          		{"id":"id311","name":"检查总次数",
//          		"children": [
//	                        {"id": "id3111","name": "检查总次数5555"}
//	                        ]
//          		},
//          		{"id":"id312","name":"人均检查次数"},
//          		{"id":"id313","name":"平均检查次数"},
//          		{"id":"id314","name":"整改率"}
//        		]
//  		}]
    	}]
  };
	
    var dataModel = {
		categoryData: categoryData,
		editResult:false
    };
    var opts = {
    	template : template,
    	data : function () {
			return dataModel;
		},
    	methods : {
			//添加类别事件
			doAddCategory:function(event){
				var _this=this;
				_this.editResult=false;
				console.log("文本内容:"+event.item+ " code:"+event.itemCode +" 父级ID:"+event.parentid+" 数据TYPE:"+event.parentType);
				//请求成功，修改状态
				api.createRiskType(null, {name : event.item,parentId : event.parentid,code :event.itemCode}).then(function(res) {
					_this.editResult = true;
				});
			},
			//修改类别事件
			doEditCategory:function(event){
				var _this=this;
				_this.editResult=false;
				console.log("修改内容:"+event.item+ " code:"+event.itemid +" 父级ID:"+event.parentid+" 数据TYPE:"+event.parentType);
				api.updateRiskType(null, {name : event.item,id : event.itemid}).then(function(res) {
					_this.editResult = true;
				});
			},
			//删除类别事件
			doDelCategory:function(event){
				var _this=this;
				_this.editResult=false;
				console.log("删除ID:"+event.itemid+" 数据TYPE:"+event.parentType);
				api.deleteRiskType(null, [ event.itemid ]).then(function(res) {
					_this.editResult = true;
				});				
			},
			//选中全部分类事件
			checkCategoryVal:function(event){
				
		      console.log("大类name: "+event.categorytitle+" 数据TYPE: "+event.parentType);
		      console.log("选择id: "+event.nodeId+" 选择name: "+event.nodeVal);
			}
    	}
    	
    }
    return LIB.Vue.extend(opts);
});
