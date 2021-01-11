
define(function(require) {
    var template = require("text!./test.html");
    var 
        BASE = require('base'),
        LIB = require('lib'),
        CONST = require('const');
    var Vue = require("vue");
   
    var dataModel = {
		social: ['facebook', 'github'],
        fruit: [],
        aList:[]
	};
    
    var opts= {
		template:template,
		data:function () {
			return dataModel;
		},
		methods: {
		},
		watch : {
			fruit : function(val) {
				console.log("fruit " + val);
			}
		},
		ready:function () {
		}
	};
    

	setTimeout(function() {
		
		//这种情况绑定无效
		setTimeout(function() {
			dataModel.aList = ["苹果", "香蕉", "西瓜"];
		}, 1000);
		dataModel.fruit = ['香蕉','苹果'];

		

//		setTimeout(function() {
//			dataModel.fruit = ['西瓜'];
//		}, 1000);
//		dataModel.aList = ["苹果", "香蕉", "西瓜"];
		
	}, 1000);

	return LIB.Vue.extend(opts);
});
