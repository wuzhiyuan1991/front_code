define(function (require) {
    var LIB = require("lib");
    var Vue = require("vue");
    var template = require("text!./security-measures.html");
    var formItemRow=require("./form-item-row");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var multiInputSelect = require("componentsEx/multiInputSelector/main");
    var api=require("../../cardTpl/vuex/api");
    var checkTrue = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox ivu-checkbox-checked"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input  type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
    var checkFalse = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input  type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'

    var getGroupModel = function () {
        return {
            show:false,
            title:"添加组名",
            list:[],
            vo:{name: ''},
            rules:{
                "name" : [
                    // LIB.formRuleMgr.require("组名"),
                    LIB.formRuleMgr.length(100)
                ],
            },
            index:null // 具体标记操作哪一个组
        }
    }

    var  getColumns = function () {
        return [
            {
                title : "措施内容",
                fieldName : "name",
                width:"650px",
                render: function (data) {
                    if(data.name){
                        return data.name;
                    }
                    if(data.ptwStuff){
                        return data.ptwStuff.name;
                    }
                    return '';

                }
            },

        ]
    };

    return Vue.extend({
        template: template,
        components:{
            "formItemRow":formItemRow,
            "userSelectModal":userSelectModal,
            "multiInputSelect":multiInputSelect,
        },
        props:{
            model:{
                type:Object,
                required:true,
                default:function () {
                }
            }
        },
        computed:{
            kongzhicsList:function () {
                var list =this.model.ptwCardStuffs.filter(function (item) {
                    return  item.type==4&&!item.gasType&&item.children;
                });
                return  list;
            },
            tableTools: function () {
                return ['del', 'update', 'move'];
            },
            disTrue: function () {
                return   '<label class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox"><span style="background: #ddd;margin-right:0" class="ivu-checkbox-inner"></span><input disabled type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
            }
        },
        watch:{
            "model.enableCtrlMeasureRemark": function () {
                this.updateColumns()
            }  ,
            "model.enableCtrlMeasureVerifier" : function () {
                this.updateColumns()
            }
        },
        data: function () {
            return {
                stuffMap:null,
                tableModel:{
                    columns:[
                        {
                            title : "措施内容",
                            fieldName : "name",
                            width:"600px",
                            render: function (data) {
                                if(data.name){
                                    return data.name;
                                }
                                if(data.ptwStuff){
                                    return data.ptwStuff.name;
                                }
                                return '';
                            }
                        },
                        {
                            title: "核对人",
                            width:"100px",
                            render: function (data) {
                                if(data && data.ptwCardVerifiers){
                                    var str = '';
                                    _.each(data.ptwCardVerifiers, function (item) {
                                        str += item.name + ','
                                    });
                                    if(str.length>0){
                                        str = str.substring(0,str.length-1);
                                    }
                                    return str;
                                }
                            }
                        },
                        {
                            title: "必须附录照片",
                            width:"100px",
                            render: function (data) {
                                if(data.requireImg == '1'){
                                    return checkTrue;
                                }
                                return  checkFalse;
                            },
                            event:true
                        }
                    ]
                },
                groupItemModel: {
                    show:false,
                    title:"添加组名",
                    list:[],
                    vo:{name: ''},
                    rules:{
                        "name" : [LIB.formRuleMgr.require("组名"),
                            LIB.formRuleMgr.length(100)
                        ],
                    },
                    index:null // 具体标记操作哪一个组
                },
                itemsModel: {
                    title:'控制措施',
                    show: false,
                    vo:{name: null, ptwCardVerifiers:[], stuffId: null, requireImg:'0'},
                    rules:{
                        "name" : [LIB.formRuleMgr.require("措施内容"),
                            LIB.formRuleMgr.length(200)
                        ],
                        "ptwCardVerifiers" : [{type:'array',required:true, validator: function (rule, value, callback) {
                            if(!value || value.length==0){
                                return callback(new Error("选择核对人"));
                            }
                            if(!_.find(value, function (item) {
                                    return item.name
                                })){
                                return callback(new Error("填写核对人"));
                            }
                            return callback();
                        }}]
                    },
                    index: -1,
                    option: 'add',
                },
                verifierModel: {
                    show: false,
                    name: null,
                    vo:{
                        ptwCardVerifiers: null
                    },
                    index: null,
                    rules:{
                        "ptwCardVerifiers" : [LIB.formRuleMgr.require("核对人"),
                            LIB.formRuleMgr.length(100)
                        ],
                    },
                },
                userModel: {
                    show: false,
                    option: 'add',
                    index: 0,
                }
            }
        },
        created:function(){

        },
        methods: {
            // 通过 cardTpl afterInitData  方法触发
            deelGroupItemModel: function () {
                var _this = this;
                this.updateColumns();
                // 获取所有分组
                var list =this.model.ptwCardStuffs.filter(function (item) {
                    return  item.type==4&&!item.gasType&&item.children;
                });

                var text = this.model.ptwCardStuffs.filter(function (item) {
                    return  item.type==4;
                });
                // groupItemModel 初始化
                this.groupItemModel = getGroupModel();
                _.each(list,function (listItem) {
                    var obj = {name: listItem.name?listItem.name: '', children:[], id: listItem.id};
                    obj.children = obj.children.concat(_.map(listItem.children, function (item) {
                        return {
                            id: item.ptwStuff?item.ptwStuff.id:'',
                            stuffId: item.ptwStuff?item.ptwStuff.id:'',
                            stuffType:item.stuffType,
                            ptwStuff: item.ptwStuff,
                            name: item.ptwStuff ? item.ptwStuff.name : (item.name?item.name:null),
                            ptwCardVerifiers: _.map(item.ptwCardVerifiers, function (opt) {
                              return {name: opt.name, id: opt.id}
                            }),
                            requireImg:item.requireImg
                        }
                    }));
                    _this.groupItemModel.list.push(obj);
                });
            },
            doUpdateGroupItemModelIndex: function (index) {
                this.groupItemModel.index = index;
            },
            onRowMove: function (obj) {
                var _this = this;
                var tempItem = obj;
                setTimeout(function () {

                    var children = _this.groupItemModel.list[_this.groupItemModel.index].children;
                    if(children[tempItem.listIndex + parseInt(tempItem.offset)]){
                        var temp = children[tempItem.listIndex + parseInt(tempItem.offset)];
                        children[tempItem.listIndex + parseInt(tempItem.offset)] = tempItem.item;
                        children[tempItem.listIndex] = temp;
                        var list = _this.groupItemModel.list;
                        _this.groupItemModel.list = [];
                        _this.$nextTick(function () {
                            _this.$set('groupItemModel.list', list);
                            _this.updateCardStuffs(_this.groupItemModel.list[_this.groupItemModel.index].id);
                        })

                    }
                }, 100)
            },

            onRowClicked: function (row, index) {
                var _this = this;
                if(row.requireImg == '1'){
                    row.requireImg = '0';
                }else row.requireImg = '1';

                setTimeout(function () {
                    var obj = _.find(_this.groupItemModel.list[_this.groupItemModel.index].children, function (item) {
                        return item.id == row.id;
                    });
                    if(obj) obj.requireImg = row.requireImg;
                    Vue.set(_this.groupItemModel.list, _this.groupItemModel.index, _this.groupItemModel.list[_this.groupItemModel.index]);
                    _this.updateCardStuffs(_this.groupItemModel.list[_this.groupItemModel.index].id);

                }, 200)
            },
            doSaveBatchVerifier: function () {
                var _this = this;
                this.$refs.verifierform.validate(function (valid) {
                    if(valid){
                        var group = _this.groupItemModel.list[_this.groupItemModel.index];
                        _.each(group.children, function (item) {
                            var obj = [{name:_.clone(_this.verifierModel.vo.ptwCardVerifiers)}];
                            item.ptwCardVerifiers = obj;
                        });
                        Vue.set(_this.groupItemModel.list, _this.groupItemModel.index + '', _this.groupItemModel.list[_this.groupItemModel.index]);
                        // _this.$set("groupItemModel.list", _this.groupItemModel.index, _this.groupItemModel.list[_this.groupItemModel.index]);
                        _this.updateCardStuffs(_this.groupItemModel.list[_this.groupItemModel.index].id)
                        _this.doCloseVerifierBatch();
                    }
                });
            },

            deDeleteItem: function (row, ind) {
                var index = '';
                var _this = this;
                setTimeout(function () {
                    var children = _this.groupItemModel.list[_this.groupItemModel.index].children;
                    for(var i=0; i<children.length; i++){
                        if(children[i].stuffId == row.stuffId){
                            index = i;
                        }
                    }

                    _this.groupItemModel.list[_this.groupItemModel.index].children.splice(index, 1);
                    _this.updateCardStuffs(_this.groupItemModel.list[_this.groupItemModel.index].id);
                },200)
            },

            doCloseVerifierBatch: function () {
                this.verifierModel.show = false;
            },
            doAddVerifierBatch: function (index) {
                this.verifierModel.show = true;
                this.verifierModel.vo.ptwCardVerifiers = null;
                this.groupItemModel.index = index;
            },
            addVerifier: function () {
                this.itemsModel.vo.ptwCardVerifiers.push({id: null, name:null});
            },

            // 批量添加
            updateGroupChildrenList: function (groupId, arr) {
                var type = -1;
                for(var i=0; i<this.groupItemModel.list.length; i++){
                    if(this.groupItemModel.list[i].id == groupId){
                        type = i;
                        break;
                    }
                }

                // var children = this.groupItemModel.list[parseInt(type)].children;
                // this.groupItemModel.list[parseInt(type)].children = _.reject(children, function (item) {
                //     return item.groupIndex == groupId;
                // });

                var temp = _.map(arr, function (item) {
                    return {
                        ptwCardVerifiers:[{name:''}],
                        id: item.id,
                        name: item.name,
                        stuffId: item.id,
                        requireImg: '0',
                    }
                });
                for(var i=0; i<temp.length; i++){
                    if(_.find(this.groupItemModel.list[parseInt(type)].children, function (item) {
                        return temp[i].id == item.stuffId;
                    })){
                        if(i>=0)
                        temp.splice(i, 1);
                        if(i>=0) i--;
                        if(temp.length == 0) break;
                    }
                }
                // this.groupItemModel.list[parseInt(type)].children = this.groupItemModel.list[parseInt(type)].children.concat(temp);
                this.groupItemModel.list[parseInt(type)].children = this.groupItemModel.list[parseInt(type)].children.concat(temp);
                var children = this.groupItemModel.list[parseInt(type)].children;

                var list = this.groupItemModel.list;

                // _.each(temp, function (item) {
                //     // if(children.length == 0)
                //     //     children.push(item)
                //     // else
                //     //     children.splice(children.length-1, 0, item);
                //     children.push(item)
                // });

                this.updateCardStuffs(groupId)
            },

            updateCardStuffs: function (groupId) {
                var type = '';
                var index = 0;
                for(var i=0; i<this.model.ptwCardStuffs.length; i++){
                    if(this.model.ptwCardStuffs[i].id == groupId){
                        index = i;
                    }
                }

                this.model.ptwCardStuffs = _.reject(this.model.ptwCardStuffs, function (item) {
                    return item.id == groupId;
                });
                for(var i=0; i<this.groupItemModel.list.length; i++){
                    if(this.groupItemModel.list[i].id == groupId){
                        type = i;
                        break;
                    }
                }
                var group = this.groupItemModel.list[type];
                if(this.model.ptwCardStuffs.length !=0)
                    this.model.ptwCardStuffs.splice(index, 0, {
                        type:4,
                        name:group.name,
                        id:group.id,
                        children: getChildren(group)
                    });
                else
                    this.model.ptwCardStuffs.push({
                        type:4,
                        name:group.name,
                        id:group.id,
                        children: getChildren(group)
                    });

                function getChildren(group) {
                    var children = [];
                    children = _.map(group.children, function (item) {
                        return {
                            stuffType:4,
                            ptwCardVerifiers:_.map(item.ptwCardVerifiers, function (opt) {
                                return {name: opt.name}
                            }),
                            type: 4,
                            stuffId:item.id,
                            requireImg: item.requireImg
                            // id:item.id
                        }
                    });

                    return children;
                }
            },

            // doAdduserMore: function (index) {
            //     this.userModel.show = true;
            //     this.userModel.option = 'batch';
            //     this.userModel.index = index;
            // },
            // doAddUser: function () {
            //     this.userModel.show = true;
            //     this.userModel.option = 'add';
            // },
            // doSaveUser: function (datas) {
            //     var _this = this;
            //     if(this.userModel.option == 'add'){
            //         _.each(datas,function (item) {
            //             var obj = _.find(_this.itemsModel.vo.ptwCardVerifiers, function (user) {
            //                 return user.id == item.id;
            //             });
            //             if(!obj) _this.itemsModel.vo.ptwCardVerifiers.push({id:item.id, name:item.name});
            //         })
            //     }
            // },

            doSaveItemApi: function () {

            },

            updateColumns: function () {
                this.tableModel.columns = getColumns();
                var len = 650;
                if(this.model.enableCtrlMeasureVerifier=='1') len -= 100;
                if(this.model.enableCtrlMeasureRemark=='1') len -= 100;
                this.tableModel.columns[0].width = len+"px";

                if(this.model.enableCtrlMeasureVerifier=='1'){
                    this.tableModel.columns.push( {
                        title: "核对人",
                        width:"100px",
                        render: function (data) {
                            if(data && data.ptwCardVerifiers){
                                var str = '';
                                _.each(data.ptwCardVerifiers, function (item) {
                                    str += item.name + '，'
                                });
                                if(str.length>0){
                                    str = str.substring(0,str.length-1);
                                }
                                return str;
                            }
                        }
                    });
                }
                if(this.model.enableCtrlMeasureRemark=='1'){
                    this.tableModel.columns.push(
                        {
                            title: "必须附录照片",
                            width:"100px",
                            render: function (data) {
                                if(data.requireImg == '1'){
                                    return checkTrue;
                                }
                                return  checkFalse;
                            },
                            event:true
                        }
                    );
                }
            },

            saveWorkStuff: function () {
                var _this = this;
                this.$refs.itemform.validate(function (valid) {
                    if(valid){
                        if(_this.itemsModel.option == 'add'){
                            api.saveWorkStuff({
                                name: _this.itemsModel.vo.name,
                                type: '4',
                                workCatalog:{id: _this.model.workCatalog.id},
                                requireImg: '0'
                            }).then(function (res) {
                                _this.doSaveItem(res.data.id)
                            })
                        }
                        else{
                            api.updateWorkStuff({
                                name: _this.itemsModel.vo.name,
                                type: '4',
                                workCatalog:{id: _this.model.workCatalog.id},
                                requireImg: '0',
                                id: _this.itemsModel.vo.id,
                                workCatalogId:_this.model.workCatalog.id,
                                orgId: LIB.user.orgId
                            }).then(function (res) {
                                LIB.Msg.info("保存成");
                                _this.doSaveItem()
                            })

                        }
                    }
                });
            },

            doSaveItem: function (id) {
                var _this = this;
                this.$refs.itemform.validate(function (valid) {
                    if(valid){
                        _this.itemsModel.vo.ptwCardVerifiers = _.filter(_this.itemsModel.vo.ptwCardVerifiers, function (item) {
                            return item.name;
                        });
                        if(_this.itemsModel.option == 'add'){
                            _this.itemsModel.vo.id = id;
                            _this.itemsModel.vo.stuffId = id;
                            _this.itemsModel.vo.requireImg = '0';
                            var children = _this.groupItemModel.list[_this.groupItemModel.index].children;
                            // children.splice(children.length-1, 0, _this.itemsModel.vo);
                            children.push(_.clone(_this.itemsModel.vo));
                        }else{
                            var vo = _this.groupItemModel.list[_this.groupItemModel.index].children[_this.itemsModel.index];
                            vo.name = '';
                            vo.ptwCardVerifiers = [];
                            delete _this.itemsModel.vo.stuffId
                             _.extend(vo, _this.itemsModel.vo);
                            // _this.$set("groupItemModel.list",_this.groupItemModel.list);
                        }
                        _this.doCloseAddItem();
                        _this.updateCardStuffs( _this.groupItemModel.list[_this.groupItemModel.index].id);
                    }
                });
            },
            doCloseAddItem: function () {
                this.itemsModel.show = false;
            },
            doAddItem: function (item, index) {
                debugger
                var _this = this;
                if(item){
                    this.itemsModel.index = index - 1;
                    this.itemsModel.vo = {name: null, ptwCardVerifiers:[], id:item.id};
                }
                else{
                    this.groupItemModel.index = index;
                    this.itemsModel.vo = {name: null, ptwCardVerifiers:[]};
                }


                if(!item){
                    _.extend(this.itemsModel.vo, {
                        id:null,
                        name: '',
                        ptwCardVerifiers:[{
                            id: null,
                            name: "申请人",
                        }],
                        requireImg: '0'
                    });
                    this.itemsModel.option = "add";
                }else{
                    _.extend(this.itemsModel.vo, {
                        name: item.name,
                        ptwCardVerifiers: (item&&item.ptwCardVerifiers&&item.ptwCardVerifiers.length>0)?_.map(item.ptwCardVerifiers, function (item) {
                            return {name:item.name}
                        }):[{id: null, name: "申请人",}]
                    });
                    this.itemsModel.option = "update";
                }
                setTimeout(function () {
                    _this.itemsModel.show = true;
                }, 200)
            },
            getStuffList: function (id) {

            },
            doCustomContent:function(type, index){
                this.$emit("on-custom-content",{type:type, groupIndex: index});
            },
            doUpdateGroupName: function (index) {
                this.groupItemModel.vo.name = this.groupItemModel.list[index].name;
                this.groupItemModel.index = index;
                this.groupItemModel.title = '编辑组名';
                this.groupItemModel.show = true;
            },
            doAddGroup: function () {
                this.groupItemModel.vo.name = '';
                this.groupItemModel.index = null;
                this.groupItemModel.title = "添加组名";
                // this.groupItemModel.show = true;
                this.doSaveGroupName();
            },
            doCloseGroupName:function () {
                this.groupItemModel.show =  false;
            },
            doDeleteGroup: function (index) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前组?',
                    onOk: function () {

                        var obj = _this.groupItemModel.list.splice(index, 1);
                        // _this.model.ptwCardStuffs = _.reject(_this.model.ptwCardStuffs, function (item) {
                        //     if(obj[0].id == item.id){
                        //         return true;
                        //     }return false;
                        // });
                        var list = [];

                        _.each(_this.model.ptwCardStuffs, function (item) {
                            if(obj[0].id != item.id){
                                list.push(item)
                            }
                        });
                        _this.model.ptwCardStuffs = list;
                        // _this.updateCardStuffs(obj.id);

                    }
                })
            },

            getUUId: function (str) {
                var _this = this;
                api.getUUID().then(function (res) {
                   if(str == 'group'){
                       _this.doSaveGroupName(res.data);
                   }
                })
            },

            doSaveGroupName: function (id) {
                var _this = this;
                this.$refs.groupitemform.validate(function (valid) {
                  if(valid){
                      if(_this.groupItemModel.index==0 || _this.groupItemModel.index){
                          _this.groupItemModel.list[_this.groupItemModel.index].name = _this.groupItemModel.vo.name;
                          _this.groupItemModel.show =  false;
                          _this.updateCardStuffs(_this.groupItemModel.list[_this.groupItemModel.index].id);
                          return ;
                      }

                      if(!id){
                          return _this.getUUId('group')
                      }
                      _this.groupItemModel.list.push({id: id, name:_this.groupItemModel.vo.name, children:[]});
                      // _this.groupItemModel.list.push({id: id, name:_this.groupItemModel.vo.name, children:[{stuffType:4,isExtra:1, name:'其他',id:'qita', stuffId:'qita',ptwCardVerifiers:[{id: null, name: "",}]}]});
                      _this.groupItemModel.index = _this.groupItemModel.list.length -1;
                      _this.groupItemModel.show =  false;
                      _this.model.ptwCardStuffs.push({type:4, id: id, name:_this.groupItemModel.vo.name, children:[]})
                      // _this.updateCardStuffs(id);
                  }
                });
            }
        },
        events: {
            "change-stuff" : function (val, arr) {
                this.updateGroupChildrenList(val, arr);
            },
            "initData": function () {
                this.deelGroupItemModel();
            }
        }
    })
})
