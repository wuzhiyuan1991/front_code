define(function(require){
	var LIB = require('lib');

 	//数据模型
	var tpl = require("text!./menuConfigModal.html");
	var api = null;

	//初始化数据模型
	var newVO = function() {
		return {
			data:[],
			selectAll:true,
			menuCache:[],
            menuList:[]
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			selectedDatas:[],
		},
        numSeq:1,
        numLay:8
	};
	
	var detail = LIB.Vue.extend({
		template: tpl,
		components : {
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doSave: function () {
				var _this = this;
				var _vo  = this.mainModel.vo;
				var authList = [];
				_.each(_this.mainModel.vo.menuList,function(menu){
					if(menu.isChecked && menu.menuLevel == 3){
                        authList.push(menu.id);
					}
				})
                if(authList.length > _this.numLay){
                    LIB.Msg.warning("最多只能选择"+(_this.numLay) +"个子菜单");
                    return;
                }
				// _.each(this.mainModel.vo.data,function(item){//一级菜单
				// 	_.each(item.children,function(item1){//二级菜单
				// 		//对默认首页处理，因为其没有子级
				// 		if(item1.isChecked && item1.name =="默认首页"){
				// 			authList.push(item1.id);
				// 		}
				// 		//遍历整个数结构，取出勾选数据
				// 		_.each(item1.children,function(item2){//三级菜单
				// 			if(item2.isChecked){
				// 				authList.push(item2.id);
				// 			};
				// 		});
				// 	})
				// });
				var callback = function (res) {
					_this.$emit("do-menu-finshed");
					//如果菜单设置成功 更新本地缓存信息
					LIB.user.homeMenu =authList.join(",");
					LIB.Msg.info("保存成功");
					window.location.reload(true);
				};
				api.menuCreate(authList).then(callback);
			},
            /**
             * allData 所有数据
             * type为1功能权限，type为0菜单权限 type为2表示最大范围全选
             * data 选择选框子菜单信息
             * firstChecked 菜单时第一级菜单，功能时为功能数据
             * secondChecked 第二级菜单
             */
			toggle : function(allData,type,data,firstChecked,secondChecked){
				//first,0,second,first
				//first,0,second,first
				//first,0,third,first,second
				var _this = this;
				if(type==0){
					_.each(data.children,function(item){
						item.isChecked = !data.isChecked;
						_.each(item.children,function(item1){
							item1.isChecked = !data.isChecked;
						})
					});
					//二级菜单反选
					if(secondChecked){
						if(data.isChecked){
							// secondChecked.isChecked = !data.isChecked;
						}else{
							var num =0;
							_.each(secondChecked.children,function(item){
								if(item.isChecked){
									num++;
								}
							});
							if(secondChecked.children.length - num == 1){
								secondChecked.isChecked = !data.isChecked;
							}
						}
					};
					//一级菜单反选
					if(firstChecked){
						if(data.isChecked){
							// firstChecked.isChecked = !data.isChecked;
						}else{
							var num =0;
							_.each(firstChecked.children,function(item){
								if(item.isChecked){
									num++;
								}
							});
							if(secondChecked && firstChecked.children.length == num){
								//点击三级菜单
								firstChecked.isChecked = !data.isChecked;
							}else if(!secondChecked && firstChecked.children.length - num ==1 ){
								//点击二级菜单
								firstChecked.isChecked = !data.isChecked;
							}
						}
					};
				}else if(type==2){
					_.each(_this.mainModel.vo.menuList,function(menu){
						menu.isChecked = !_this.mainModel.vo.selectAll;
						menu.allChecked = !_this.mainModel.vo.selectAll;
					})
					// _.each(data,function(items){
					// 	items.isChecked = !_this.mainModel.vo.selectAll;
					// 	_.each(items.children,function(items1){
					// 		items1.isChecked = !_this.mainModel.vo.selectAll;
					// 		_.each(items1.children,function (items2) {
					// 			items2.isChecked = !_this.mainModel.vo.selectAll;
					// 			items2.allChecked = !_this.mainModel.vo.selectAll;
					// 			_.each(items2.funcAuthList,function (auth) {
					// 				auth.isChecked = !_this.mainModel.vo.selectAll;
					// 			})
					// 		})
					// 	})
					// })
				};
			}
		},
		ready: function () {
			var _this = this;
			_this.mainModel.selectedDatas = [];
			require(["./vuex/api"], function (data) {
				api = data;
			});
		},
		events:{
		"ev_editMenuReload": function () {
			//注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
			var _vo = dataModel.mainModel.vo;
			var _this = this;

			//清空数据
			_.extend(_vo, newVO());
			//存在nVal则是update
			var callback = function(data){
				////获取角色权限列表
				if(LIB.user.homeMenu){
					_this.mainModel.vo.menuCache = LIB.user.homeMenu.split(",");
				};
				var arr = [];
				 //菜单权限 加入isChecked
				_.each(data,function(menu){
					if(_this.mainModel.vo.menuCache.indexOf(menu.id) != -1){
						menu= Object.assign({}, menu, { isChecked : true})
					}else{
						menu= Object.assign({}, menu, { isChecked : false})
					}
					arr.push(menu)
				});
                var menuData = [];
				var idMap = _.indexBy(arr,'id');
				//生成树结构
				_.each(arr,function(menu){
					var parentMenu = idMap[menu['parentId']];
					if(parentMenu){
						parentMenu['children'] = parentMenu['children'] || [];
						parentMenu['children'].push(menu)
					}else if(menu.menuLevel ==1 && menu.attr1 != '/home'){
						menu= Object.assign({}, menu, { add : true});
						menuData.push(menu);
					};
					if(menu.name != '主页' && menu.name != '个人主页' && menu.name != '公司主页' && menu.name != '集团主页'){
                        _this.mainModel.vo.menuList.push(menu);
					};
				});
				_vo.data = menuData;
				//二级菜单
				_.each(_vo.data,function (items) {
					_.each(items.children,function(items1){
						var num = 0;
						//遍历二级的children，获取选中的
						_.each(items1.children,function(items2){
							if(items2.isChecked){
								num++;
							}
						});
						//判断children是否有选中，从而判断二级菜单是否选中
						if(items1.children &&  num >0){
							items1.isChecked = true;
							_this.mainModel.vo.selectAll = true;
						}
					})
				});
				//一级菜单
				_.each(_vo.data,function (items) {
					var num = 0;
					_.each(items.children,function(items1){
						if(items1.isChecked){
							num++;
						}
					});
					if(num > 0){
						items.isChecked = true;
					}
				});
				//全选
				_.each(_vo.data,function(items){
					if(!items.isChecked){
						_this.mainModel.vo.selectAll = false;
					}
				});
			}
			//获取菜单功能全部数据
			// api.listMenu().then(function (data) {
				if(!(_.contains(LIB.LIB_BASE.setting.menuList, null))){
					var menuList = []
					_.each(LIB.LIB_BASE.setting.menuList,function (menu) {
						var obj = _.extend({},menu);
						if(obj.children){
                            obj.children = [];
						};
						menuList.push(obj)
                    });
					callback(menuList);
				}
			// });
		}
		},
	});
	
	return detail;
});