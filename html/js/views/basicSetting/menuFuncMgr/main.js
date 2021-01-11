
define(function(require){
	//基础js
	var LIB = require('lib');
	var api = require("./vuex/api");
	// require("components/iviewTreeGrid");
	var detailComponent = require("./detail");
	//vue数据 配置url地址 拉取数据
	var dataModel = {
		moduleCode : LIB.ModuleCode.BS_BaC_MenM,
			//table组件的写法
		  updataModel:{
				//显示弹框
				show : false,
				title:"修改",
				id: null
			},
		addModel:{
			//显示弹框
			show : false,
			title:"修改",
			id: null
		},
        mainModel:{
            data:null,
            selectedDatas: [],
            //控制展开
            showHide:false,
            //修改name
            treeGridName:null,
            innerAddFun:{
                type:Function
            },
            treedata:null,
            assistFunc: function (item) {
            	if(item.code || item.disable) {
					return '<span style="display: inline-block;width: 180px;cursor: default;">' + item.code + '</span><span style="cursor: default;display: inline-block;">' + (item.disable === '0' ? '启用' : '停用') + '</span>';
				}
				return '';
            }
		},
	};
	var vm = LIB.VueEx.extend({
		//引入html页面
		template: require("text!./main.html"),
		components : {
			"detailcomponent":detailComponent
		},
		data : function() {
			return dataModel;
		},
		methods:{
			//全部显示
			treeShowList:function(){
				//this.showHide=true;
				this.$refs.treegrid.$children[0].doShowNode(function(){
				})
			},
			//全部隐藏
			treeHide:function(){
				this.$refs.treegrid.$children[0].doHideNode(function(){
				})
			},
			//新增
			doAddNode:function(value, innerAddFun) {
				this.mainModel.innerAddFun = innerAddFun;
				this.addModel.title = "新增"
				this.$broadcast('ev_detailReload',value,"add");
				this.addModel.show = true;
			},
			//修改
			doEditNode:function(value) {
				this.addModel.title="修改";
				this.mainModel.treeGridName = value;
				//value.data.name += "modify"
				this.$broadcast('ev_detailReload',value,"updata");
				this.addModel.show = true;
			},
			//删除
			doDelNode:function(value){
				var id = value.data.id;
				var _this = this;
				var callback = function (res) {
					LIB.Msg.info("删除成功");
					value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
				};
				api.del(null,[id]).then(callback)
			},

			doTreeDataReady:function(data){
				this.mainModel.treedata = data;
			},
			//获取数据
			retrieveData:function(){
				var _this = this;
				api.list().then(function(res){
					_.each(res.data, function(menu){
                        if (menu.funcAuthList) {
                            _.each(menu.funcAuthList, function(auth){
                            	auth.menuCode = auth.parentId;
                                auth.parentId = menu.id;
                                auth.optsMgr = true;
                                res.data.push(auth);
                            });
                            menu.funcAuthList.clean;
                        }

					});
					_this.mainModel.data =res.data;
				})
			},
			doupdata:function(value,flag){
				if(flag =="add"){
					var obj ={
						id:value.vo.id,
						name:value.vo.name,
						code:value.vo.code,
						disable:value.vo.disable
						//attr2:value.vo.attr2,
						//attr1:value.vo.attr1,
						//remarks:value.vo.remarks
					}
					this.mainModel.innerAddFun(obj);
				}else{
					//this.addModel.show = false;
					this.mainModel.treeGridName.data.name = value.vo.name;
					//this.mainModel.treeGridName.data.attr2 = value.vo.attr2;
					//this.mainModel.treeGridName.data.attr1 = value.vo.attr1;
					//this.mainModel.treeGridName.data.remarks = value.vo.remarks;
					this.mainModel.treeGridName.data.code = value.vo.code,
					this.mainModel.treeGridName.data.disable = value.vo.disable;
				}
				this.addModel.show = false;
			},

		},
		ready:function(){
			this.retrieveData();
		},
		})
	return vm;
})