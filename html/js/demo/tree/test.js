
define(function(require) {
    var template = require("text!./test.html");
    var 
        BASE = require('base'),
        LIB = require('lib'),
        CONST = require('const');
    var Vue = require("vue");
   
    var data = {
		name: 'My Tree',
		children: [
			{ id:1, name: 'hello' },
			{ id:2, name: 'wat' },
			{ id:3,
				name: 'child folder',
				children: [
					{ id:31,
						name: 'child folder',
						children: [
							{ id:331, name: 'hello' },
							{ id:332, name: 'wat' }
						]
					},
					{ id:32, name: 'hello' },
					{ id:33, name: 'wat' },
					{
						id:34,
						name: 'child folder',
						children: [
							{ id:345, name: 'hello' },
							{ id:346, name: 'wat' }
						]
					}
				]
			}
		]
	};
	var data2 = [
		{ id:1, name: '111111' },
		{ id:2, name: '222222222' },
		{ id:3, name: '3333333333'},
		{ id:31,name: '3333333333----1', pid:3},
		{ id:331, name: '3333333333----1---1' , pid:31},
		{ id:332, name: '3333333333----1---2' , pid:31},
		{ id:32, name: '3333333333----2' , pid:3},
		{ id:33, name: '3333333333----3' , pid:3},
		{ id:34, name: '3333333333----4' , pid:3},
		{ id:345, name: '3333333333----4---1', pid:34 },
		{ id:346, name: '3333333333----4---2' , pid:34}
	];
	var treestar = [
		{ id:1, name: '测试1',star:false },
		{ id:2, name: '测试2',star:true },
		{ id:3, name: '测试3',star:false},
		{ id:31,name: '测试4', pid:3,star:false},
		{ id:331, name: '测试5' , pid:31,star:true},
		{ id:332, name: '测试6' , pid:31,star:false},
		{ id:32, name: '测试7' , pid:3,star:false},
		{ id:33, name: '测试8' , pid:3,star:false},
		{ id:34, name: '测试9' , pid:3,star:true},
		{ id:345, name: '测试10', pid:34,star:false },
		{ id:346, name: '测试11' , pid:34,star:true}
		]

    
    var dataModel = {
		treeData: data,
		treeData2: [],//data2,
		treestar:treestar,
		tree: {
			id:'id',
			pid:'pid',
			displayLabel:'name'
		},
		ttt:"",
		selectedTreeDatas:[
			{ id:2, name: 'hello' },
			{ id:331, name: 'wat' }
		],
	
		selectedTreeData:[
			{ id:1, name: 'hello' }
		],
		
		treeData:null
    };
    
    var opts = {
    	template : template,
    	data : function () {
			return dataModel;
		},
    	methods : {
			//tree事件处理
			printTreeSelectedData:function() {
				console.log(this.selectedDatas);

			},
			printComboTreeSelectedData:function() {
				console.log(this.ttt);
	
			},
			doAddNode:function(value, innerAddFun) {
				console.log(data);
//				data.children = data.children || [];
//				data.children.push({id:"123", name:"new node"});
				var obj = {id:"123",name: 'new stuff'}
				innerAddFun(obj);
			},
			doEditNode:function(value) {
				console.log(value);
				value.data.name += "modify"
			},
			doDelNode:function(value) {
				console.log(data);
			},
			doTreeDataReady:function(data){
				this.treeData = data;
			},
			doStar:function(data){
				console.log(data);
			},
			doTitleClick:function(){
				console.log("ads");
			},
			doDel:function(data){
				console.log(data);
			},
			
    	}
    	
    }
    
    
    
    setTimeout(function() {

		dataModel.ttt = dataModel.selectedTreeDatas[0].id;
		
		setTimeout(function() {
			dataModel.treeData2 = data2;
		}, 1000);
		
	}, 1000);


	return LIB.Vue.extend(opts);
});
