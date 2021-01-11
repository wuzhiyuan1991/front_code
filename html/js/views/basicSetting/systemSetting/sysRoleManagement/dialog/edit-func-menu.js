define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit-func-menu.html");
    var linked=require("../../compRoleManagement/dialog/minix_linkedmodual");
    var newVO = function () {
        return {
            roleId: null,
            data: [],
            selectAll:true,
            menuList : [],
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            disabled: false,
            roleIds:[],
            type:null
        },
        batchDeleteMode: false,
        viewMode:"web",
        webAuthList:[],
        selLinked:{//联动模块 对象
            type:"web",
            contentHeight:0,//可视化窗体高度
            modualsHeight:[],//这个模块的高度
            currentModual:0,
            scrollMin:0,
            scrollMax:0,
        },
    };

    //声明detail组件
    /**
     *  请统一使用以下顺序配置Vue参数， 方便codeview
     *    el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        template: tpl,
        mixins:[linked],
        data: function () {
            return dataModel;
        },
        methods: {
            doSave: function () {
                var _this = this;
                var _vo  = this.mainModel.vo;
                var authList = [];
                _.each(_this.mainModel.vo.menuList,function(menu){
                    if(menu.isChecked && (menu.menuLevel == 3 || menu.attr1 == "/home/index")){
                        authList.push({type:0,relId:menu.id});
                    };
                    if(menu.menuLevel == 3 ){
                        _.each(menu.funcAuthList,function(auth){
                            if(auth.isChecked){
                                var funcAuth = {type:1,relId:auth.id};
                                authList.push(funcAuth);
                            }
                        });
                    }

                })
                var callback = function (res) {
                    _this.$emit("do-edit-func-and-menu-finshed");

                    LIB.Msg.info("保存成功");
                };
                api.distributionMenuAndFunc({id:_vo.roleId},{roleAuthorityRels:authList}).then(callback);
            },
            doSaveBacth:function () {
                var _this = this;
                var _vo  = this.mainModel.vo;
                var authList = [];
                _.each(_vo.menuList,function(menu){
                    if(menu.isChecked && (menu.menuLevel == 3 || menu.attr1 == "/home/index")){
                        authList.push({type:0,relId:menu.id});
                    };
                    if(menu.menuLevel == 3 ){
                        _.each(menu.funcAuthList,function(auth){
                            if(auth.isChecked){
                                var funcAuth = {type:1,relId:auth.id};
                                authList.push(funcAuth);
                            }
                        });
                    }
                });
                var callback = function (res) {
                    _this.$emit("do-edit-func-and-menu-finshed");
                    LIB.Msg.info("保存成功");
                };
                api.distributionMenuAndFuncs({type:dataModel.mainModel.type,roleIds: JSON.stringify(_this.mainModel.roleIds)}, authList).then(callback);
            },
            /**
             * 菜单的展开收起
             */
            doChangeModule : function(first){
                // add = !add;
                first.add = !first.add;
            },
            /**
             * allData 所有数据
            * type为1功能权限，type为0菜单权限 type为2表示最大范围全选
             * data 选择选框子菜单信息
             * firstChecked 菜单时第一级菜单，功能时为功能数据
             * secondChecked 第二级菜单
            */
            //
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
                }else if(type==1){
                    _.each(data.funcAuthList,function(item){
                        item.isChecked = !data.allChecked;
                    });
                   if(firstChecked){
                       if(data.isChecked){
                           firstChecked.allChecked = !data.isChecked;
                       }else{
                           var num =0;
                           _.each(firstChecked.funcAuthList,function(item){
                               if(item.isChecked){
                                   num++;
                               }
                           });
                           if(firstChecked.funcAuthList.length - num ==1){
                               firstChecked.allChecked = !data.isChecked;
                           }
                       }
                   }
                }else if(type==2){
                    _.each(_this.mainModel.vo.menuList,function(menu){
                        menu.isChecked = !_this.mainModel.vo.selectAll;
                        menu.allChecked = !_this.mainModel.vo.selectAll;
                        if(menu.menuLevel == 3){
                            _.each(menu.funcAuthList,function (auth) {
                                auth.isChecked = !_this.mainModel.vo.selectAll;
                            })
                        }
                    })
                };
            }
        },
        events: {
            //edit框数据加载
            "ev_editFuncAndMenuReload": function (nVal) {
                LIB.globalLoader.show();
                this.batchDeleteMode = false;
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _vo = dataModel.mainModel.vo;
                var _this = this;
                //清空数据
                _.extend(_vo, newVO());
                _vo.roleId = nVal;
                //存在nVal则是update
                var callback = function(data){
                    //获取角色权限列表
                    api.getFunc({roleId: nVal}).then(function (res) {
                        if(!(_.contains(res.body, null))){
                            var res1 = res.body;
                            //菜单权限 加入isChecked
                            _.each(data.body,function(items){
                                _.each(res1,function(item){
                                    if(items.id == item.relId){
                                        items.isChecked = true;
                                    }
                                });
                            });
                            _.each(data.body,function(items){
                                if(!items.isChecked){
                                    items.isChecked = false;
                                }
                            });
                            //功能权限 加入isChecked
                            _.each(data.body,function(items){
                                _.each(items.funcAuthList,function(auth){
                                    items.allChecked = false;
                                    _.each(res1,function(item){
                                        if(auth.id == item.relId){
                                            auth.isChecked = true;
                                        }
                                    });
                                })
                            });
                            _.each(data.body,function(items){
                                _.each(items.funcAuthList,function(auth){
                                    if(!auth.isChecked){
                                        auth.isChecked = false;
                                    }
                                })
                            });
                            var menuData = [];
                            var idMap = _.indexBy(data.body,'id');
                            //生成树结构
                            _.each(data.body,function(menu){
                                var parentMenu = idMap[menu['parentId']];
                                if(parentMenu){
                                    parentMenu['children'] = parentMenu['children'] || [];
                                    parentMenu['children'].push(menu)
                                }else if(menu.menuLevel ==1 ){
                                    menu= Object.assign({}, menu, { add : true});
                                    menuData.push(menu);
                                };
                                _this.mainModel.vo.menuList.push(menu)
                            });
                            _vo.data = menuData;
                            _this.webAuthList=menuData;
                            _this._computedHeight(_this.selLinked);
                            LIB.globalLoader.hide();
                            //二级菜单
                            _.each(_vo.data,function (items) {
                                //遍历二级的children，获取选中的
                                _.each(items.children,function(items1){
                                    var num = 0;
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
                            //功能权限
                            _.each(_this.mainModel.vo.menuList,function(menu){
                                if(menu.menuLevel == 2){
                                    _.each(menu.children,function(items){
                                        var num = 0;
                                        _.each(items.funcAuthList,function(auth){
                                            if(auth.isChecked){
                                                num++
                                            }
                                        });
                                        if(items.funcAuthList && items.funcAuthList.length == num){
                                            items.allChecked = true;
                                        }else{
                                            items.allChecked = false;
                                        }
                                    });
                                }
                            });
                            //全选
                            _.each(_vo.data,function(items){
                                if(!items.isChecked){
                                    _this.mainModel.vo.selectAll = false;
                                }
                            })
                        }
                    });
                };
                //获取菜单功能全部数据
                api.listMenu({roleId:_this.mainModel.vo.roleId}).then(function (data) {
                    if(!(_.contains(data.body, null))){
                        callback(data);
                    }
                });
                dataModel.mainModel.disabled = false;
            },
        }
    });

    return detail;
});