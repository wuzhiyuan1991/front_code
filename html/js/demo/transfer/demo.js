define(function(require) {
	var LIB = require('lib');
	var template = require("text!./demo.html");
	var transfer = require("components/transfer/iviewTransfer");
	var getMockData = function(){
		var mockData = [];
        for (var i = 1; i <= 6; i++) {
            mockData.push({
                key: i.toString(),
                label: '内容' + i,
                description: '内容' + i + '的描述信息',
                disabled: Math.random() * 3 < 1
            });
        }
        return mockData;
	}
	var getTargetKeys = function() {
        return getMockData()
                .filter(function(){return Math.random() * 2 > 1;})
                .map(function(item){return item.key;});
    }
	var dataModel = {
			data1: getMockData(),
            targetKeys1: getTargetKeys()
	}
	var opts = {
			template:template,
			components:{
				transfer:transfer
			},
			data : function(){
				return dataModel;
			},
			methods:{
				render1 :function(item) {
	                return item.label;
	            },
	            handleChange1 :function(newTargetKeys, direction, moveKeys) {
	                console.log(newTargetKeys);
	                console.log(direction);
	                console.log(moveKeys);
	                this.targetKeys1 = newTargetKeys;
	            }
			}
	}
	var demo = LIB.Vue.extend(opts);
	return demo;
});