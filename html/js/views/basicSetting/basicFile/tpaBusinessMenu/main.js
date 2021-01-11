
define(function(require){
	//基础js
	var LIB = require('lib');
	var api = require("./vuex/api");
	//编辑弹框页面
	//var editComponent = require("./edit");
	var editComponent = require("./edit");
	//vue数据 配置url地址 拉取数据
	var dataModel = {
		//业务中心危害因素 业务档案 ---检查项
		risktype:{
			data:null,
			//selectedTreeDatas:[],
			showHide:false,
			selectedDatas: [],
		},
		innerAddFun:{
			type:Function
		},
		//业务档案 ---检查依据
		checkbasistype:{
			data:null,
			showHide:false,
			selectedDatas: [],
		},
		listTableType:{
			data:null,
			showHide:false,
			selectedDatas: [],
		},
        //tpa设备设施
        tpaEquipmentType:{
            data:null,
            showHide:false,
            selectedDatas: [],
        },
        //cb设备设施
        cbEquipmentType:{
            data:null,
            showHide:false,
            selectedDatas: [],
        },
        tpaRiskType:{
            data:null,
            showHide:false,
            selectedDatas: [],
        },
		addModel:{
			//显示弹框
			show : false,
			title:"修改",
			id: null
		},
        checkbasistype: {
            data: null,
            showHide: false,
            selectedDatas: []
        },
		showTrainingCategory:true,
		//行业分类 判断滚动条 用来动态添加class
		viewScllow:null,
        topParentMenu:0,
        topSubMenu:0,
	};
	var vm = LIB.VueEx.extend({
		//引入html页面
		template: require("text!./main.html"),
		components : {
			"editcomponent":editComponent
		},
		data : function() {
			return dataModel;
		},
        computed: {
            routeType: function () {
                var path = this.$route.path;
                if(_.startsWith(path, '/expertSupport')) {
                    return 'checkBase'
                }
                else if(_.startsWith(path, '/certificateCheck')) {
                    return 'checkTable'
                }
                else if(_.startsWith(path, '/basicSetting')) {
                    return 'basicSetting'
                }
                return 'default'
            }
        },
		methods:{
			doTabs:function(data){
                var _this = this;
                var key = data.key,
                    _t = this.routeType;
				if(_t === 'checkTable') {
					if(key === '2') {
                        api.tpaRiskType().then(function(res6){
                            _this.tpaRiskType.data = res6.data;
                        });
					}
				}
                else if(_t === 'basicSetting') {
					api.cbEquipmentType().then(function(res5){
						_this.cbEquipmentType.data = res5.data;
					});
                }
                else if(_t === 'checkBase') {
					api.checkbasistype().then(function (res1) {
						_this.checkbasistype.data = res1.data;
					});
                }
			},
			//全部显示
			treeShowList:function(){
				this.$refs.treegridrisk.$children[0].doShowNode(function(){
				})
			},
			//全部隐藏
			treeHide:function(){
				this.$refs.treegridrisk.$children[0].doHideNode(function(){
				})
			},
			//全部显示
			treeList:function(){
				this.$refs.treegridlist.$children[0].doShowNode(function(){
				})
			},
			//全部隐藏
			treeListHide:function(){
				this.$refs.treegridlist.$children[0].doHideNode(function(){
				})
			},
			//全部显示
			treeListEquipment:function(){
				this.$refs.equipment.$children[0].doShowNode(function(){
				})
			},
			//全部隐藏
			treeListHideTPAEquipment:function(){
				this.$refs.equipment.$children[0].doHideNode(function(){
				})
			},
            //全部显示
            treeListTPAEquipment:function(){
                this.$refs.tpaequipment.$children[0].doShowNode(function(){
                })
            },
            //全部隐藏
            treeListHideEquipment:function(){
                this.$refs.tpaequipment.$children[0].doHideNode(function(){
                })
            },
            //全部显示
            treeListCBEquipment:function(){
                this.$refs.cbequipment.$children[0].doShowNode(function(){
                })
            },
            //全部隐藏
            treeListHideCBEquipment:function(){
                this.$refs.cbequipment.$children[0].doHideNode(function(){
                })
            },
            //全部显示
            treeListTpaRiskType:function(){
                this.$refs.tparisktype.$children[0].doShowNode(function(){
                })
            },
            //全部隐藏
            treeListHideTpaRiskType:function(){
                this.$refs.tparisktype.$children[0].doHideNode(function(){
                })
            },
			//业务中心--风险评估---危害辨识    业务档案--隐患排查---检查项
			//新增
			treeAdd:function(val){
			    this.addModel.show = true;
				this.addModel.title = "新增"
				this.$broadcast('ev_detailrisktypeAdd',val);
			},

			risktypeDoAddNode:function(value, innerAddFun){
				this.innerAddFun = innerAddFun;
				this.addModel.title = "新增"
				this.$broadcast('ev_detailReload',value,"risktypeAdd","add");
				this.addModel.show = true;
			},
			//修改
			risktypeDoEditNode:function(value) {
				this.treeGridName = value;
				this.addModel.title="修改"
				//value.data.name += "modify"
				this.$broadcast('ev_detailReload',value,"risktypeUpdate","update");
				this.addModel.show = true;
			},
			//删除
			risktypeDoDelNode:function(value){
				var id = value.data.id;
				var _this = this;
				if(value.data.children && value.data.children.length > 0){
					LIB.Msg.error("该分类下面存在子分类，不可删除！");
					return
				}
				var callback = function (res) {
					if(res.status == 200){
						window.businessCache = true;
						LIB.Msg.info("删除成功");
						value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
					}
				}
				api.deleteRiskType(null,[id]).then(callback)
			},
			//业务档案---风险评估---检查依据
            checkBasisTypeDoAddNode: function (value, innerAddFun) {
                this.innerAddFun = innerAddFun;
                this.addModel.title = "新增";
                this.$broadcast('ev_detailReload', value, "checkBasisType", "add");
                this.addModel.show = true;
            },
            //修改
            checkBasisTypeDoEditNode: function (value) {
                this.treeGridName = value;
                this.addModel.title = "修改";
                this.$broadcast('ev_detailReload', value, "checkbasistypeUpdate", "update");
                this.addModel.show = true;
            },
            //删除
            checkBasisTypeDoDelNode: function (value) {
                var id = value.data.id;
                var _this = this;
                if (value.data.children && value.data.children.length > 0) {
                    LIB.Msg.error("该分类下面存在子分类，不可删除！");
                    return
                }
                var callback = function (res) {
                    // console.log(res.status);
                    if (res.status === 200) {
                        window.businessCache = true;
                        LIB.Msg.info("删除成功");
                        value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
                    }
                }
                api.deleteCheckBasisType(null, [id]).then(callback)
            },

			//业务档案--隐患排除---检查表
			listTableTypeDoAddNode:function(value, innerAddFun) {
				this.innerAddFun = innerAddFun;
				this.addModel.title = "新增"
				this.$broadcast('ev_detailReload',value,"listTableTypeAdd","add");
				this.addModel.show = true;
			},
			//修改
			listTableTypeDoEditNode:function(value) {
				this.treeGridName = value;
				this.addModel.title="修改"
				//value.data.name += "modify"
				this.$broadcast('ev_detailReload',value,"listTableTypeUpdate","update");
				this.addModel.show = true;
			},
			//删除
			listTableTypeDoDelNode:function(value){
				var id = value.data.id;
				var _this = this;
				if(value.data.children && value.data.children.length > 0){
					LIB.Msg.error("该分类下面存在子分类，不可删除！");
					return
				}
				var callback = function (res) {
					if(res.status == 200){
						window.businessCache = true;
						LIB.Msg.info("删除成功");
						value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
					}
				}
				api.delTableType(null,value.data).then(callback)
			},
			//设备设施类型
			equipmentTypeDoAddNode:function(value, innerAddFun) {
				this.innerAddFun = innerAddFun;
				this.addModel.title = "新增"
				this.$broadcast('ev_detailReload',value,"equipmentTypeAdd","add");
				this.addModel.show = true;
			},
			//修改
			equipmentTypeDoEditNode:function(value) {
				this.treeGridName = value;
				this.addModel.title="修改"
				//value.data.name += "modify"
				this.$broadcast('ev_detailReload',value,"equipmentTypeUpdate","update");
				this.addModel.show = true;
			},
			//删除
			equipmentTypeDoDelNode:function(value){
				var id = value.data.id;
				var _this = this;
				if(value.data.children && value.data.children.length > 0){
					LIB.Msg.error("该分类下面存在子分类，不可删除！");
					return
				}
				var callback = function (res) {
					if(res.status == 200){
						window.businessCache = true;
						LIB.Msg.info("删除成功");
						value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
					}
				}
				api.delEquipmentType(null,value.data).then(callback)
			},
            //TPA设备设施类型
            tpaEquipmentTypeDoAddNode:function(value, innerAddFun) {
                this.innerAddFun = innerAddFun;
                this.addModel.title = "新增";
                this.$broadcast('ev_detailReload',value,"tpaEquipmentTypeAdd","add");
                this.addModel.show = true;
            },
            //修改
            tpaEquipmentTypeDoEditNode:function(value) {
                this.treeGridName = value;
                this.addModel.title="修改"
                //value.data.name += "modify"
                this.$broadcast('ev_detailReload',value,"tpaEquipmentTypeUpdate","update");
                this.addModel.show = true;
            },
            //删除
            tpaEquipmentTypeDoDelNode:function(value){
                var id = value.data.id;
                var _this = this;
                if(value.data.children && value.data.children.length > 0){
                    LIB.Msg.error("该分类下面存在子分类，不可删除！");
                    return
                }
                var callback = function (res) {
                    if(res.status == 200){
                        window.businessCache = true;
                        LIB.Msg.info("删除成功");
                        value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
                    }
                }
                api.delTpaEquipmentType(null,value.data).then(callback)
            },
            //船舶设备设施类型
            cbEquipmentTypeDoAddNode:function(value, innerAddFun) {
                this.innerAddFun = innerAddFun;
                this.addModel.title = "新增"
                this.$broadcast('ev_detailReload',value,"cbEquipmentTypeAdd","add");
                this.addModel.show = true;
            },
            //修改
            cbEquipmentTypeDoEditNode:function(value) {
                this.treeGridName = value;
                this.addModel.title="修改"
                //value.data.name += "modify"
                this.$broadcast('ev_detailReload',value,"cbEquipmentTypeUpdate","update");
                this.addModel.show = true;
            },
            //删除
            cbEquipmentTypeDoDelNode:function(value){
                var id = value.data.id;
                var _this = this;
                if(value.data.children && value.data.children.length > 0){
                    LIB.Msg.error("该分类下面存在子分类，不可删除！");
                    return
                }
                var callback = function (res) {
                    if(res.status == 200){
                        window.businessCache = true;
                        LIB.Msg.info("删除成功");
                        value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
                    }
                }
                api.delCbEquipmentType(null,value.data).then(callback)
            },
            //tpa检查项分类
            tpaRiskTypeDoAddNode:function(value, innerAddFun) {
                this.innerAddFun = innerAddFun;
                this.addModel.title = "新增"
                this.$broadcast('ev_detailReload',value,"tpaRiskTypeAdd","add");
                this.addModel.show = true;
            },
            //修改
            tpaRiskTypeDoEditNode:function(value) {
                this.treeGridName = value;
                this.addModel.title="修改"
                //value.data.name += "modify"
                this.$broadcast('ev_detailReload',value,"tpaRiskTypeUpdate","update");
                this.addModel.show = true;
            },
            //删除
            tpaRiskTypeDoDelNode:function(value){
                var id = value.data.id;
                var _this = this;
                if(value.data.children && value.data.children.length > 0){
                    LIB.Msg.error("该分类下面存在子分类，不可删除！");
                    return
                }
                var callback = function (res) {
                    if(res.status == 200){
                        window.businessCache = true;
                        LIB.Msg.info("删除成功");
                        value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
                    }
                }
                api.delTpaRiskType(null,value.data).then(callback)
            },
			//获取数据
			retrieveData:function(){
                var _this = this,
                    _t = this.routeType;

                if(_t === 'checkTable') {
                    api.listTableType().then(function(res2) {
                        _this.listTableType.data = res2.data;
                    })
                }
                else if(_t === 'basicSetting') {
                    api.cbEquipmentType().then(function(res5){
                        _this.cbEquipmentType.data = res5.data;
                    });
                }
                else if(_t === 'checkBase') {
                    api.checkbasistype().then(function (res1) {
                        _this.checkbasistype.data = res1.data;
                    });
                }
			},
			doUpdate:function(value,flag,type){
				var _this = this;
				if(type=="risktypeUpdate" || type=="risktypeAdd"){
					api.risktype().then(function(res){
						_this.risktype.data = res.data;
					});
				}else if(type=="checkbasistypeAdd" || type=="checkbasistypeUpdate"){
					api.checkbasistype().then(function(res1){
						_this.checkbasistype.data = res1.data;
					});
				}else if(type=="listTableTypeAdd" || type=="listTableTypeUpdate"){
					api.listTableType().then(function(res2){
						_this.listTableType.data = res2.data;
					});
				}else if(type=="equipmentTypeAdd" || type=="equipmentTypeUpdate"){
					api.equipmentType().then(function(res3){
						_this.equipmentType.data = res3.data;
					});
				}else if(type=="tpaEquipmentTypeAdd" || type=="tpaEquipmentTypeUpdate"){
                    api.tpaEquipmentType().then(function(res4){
                        _this.tpaEquipmentType.data = res4.data;
                    });
                }else if(type=="cbEquipmentTypeAdd" || type=="cbEquipmentTypeUpdate"){
                    api.cbEquipmentType().then(function(res5){
                        _this.cbEquipmentType.data = res5.data;
                    });
                }else if(type=="tpaRiskTypeAdd" || type=="tpaRiskTypeUpdate"){
                    api.tpaRiskType().then(function(res6){
                        _this.tpaRiskType.data = res6.data;
                    });
                }
				window.businessCache = true;
				this.addModel.show = false;
			},
			doEditAdd:function(value,type){
				var _this = this;
				var obj = {
					id:value.vo.id,
					name:value.vo.name,
					code:value.vo.code,
					orderNo:value.vo.orderNo,
				}
				if(type == "risktype"){
					//this.risktype.data.push(obj);
					//this.retrieveData();
					api.risktype().then(function(res){
						_this.risktype.data = res.data;
					});
				}else if(type == "checkBasisType"){
					//this.checkbasistype.data.push(obj);
					//this.retrieveData();
					api.checkbasistype().then(function(res1){
						_this.checkbasistype.data = res1.data;
					});
				}else if(type =="listTableType"){
					//this.listTableType.data.push(obj);
					//this.retrieveData();
					api.listTableType().then(function(res2){
						_this.listTableType.data = res2.data;
					});
				}else if(type =="equipmentType"){
					//this.listTableType.data.push(obj);
					//this.retrieveData();
					api.equipmentType().then(function(res3){
						_this.equipmentType.data = res3.data;
					});
				}else if(type =="tpaEquipmentType"){
                    //this.listTableType.data.push(obj);
                    //this.retrieveData();
                    api.tpaEquipmentType().then(function(res3){
                        _this.tpaEquipmentType.data = res3.data;
                    });
                }else if(type =="cbEquipmentType"){
                    //this.listTableType.data.push(obj);
                    //this.retrieveData();
                    api.cbEquipmentType().then(function(res3){
                        _this.cbEquipmentType.data = res3.data;
                    });
                }else if(type =="tpaRiskType"){
                    //this.listTableType.data.push(obj);
                    //this.retrieveData();
                    api.tpaRiskType().then(function(res4){
                        _this.tpaRiskType.data = res4.data;
                    });
                }
				this.addModel.show = false;
			},


			doScroll:function(){
				setInterval(function(){
					if(this.viewMenu){
						if(this.viewMenu.scrollTop>0){
							this.viewScllow = true;
							this.topSubMenu = this.viewMenu.scrollTop;
						}else{
							this.viewScllow = false;
							this.topSubMenu = 0;
						}
					}
				},300)
			  }
		},

        attached:function(){
			this.retrieveData();
			//监听滚动条
			this.viewMenu = this.$els.viewbox;
			this.viewMenu.addEventListener('scroll',this.doScroll)
			}
		})
	return vm;
})