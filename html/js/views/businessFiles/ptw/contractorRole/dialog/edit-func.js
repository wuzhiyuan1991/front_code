define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit-func.html");
    var List = require('../../../../../components/transfer/iviewList');
    var prefixCls = 'ivu-transfer';
    var newVO = function () {
        return {
            roleList: [],
            roleId: null,
            list: [],
            keys: [],
            data: [],
            authList:[],
            type:'1',
            ckList:[],
            menuId:null
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            rList: [],
            rLength: 0,
            roleLength: 0,
            checkboxGrou: '111111111',
            selectedDatas: [],
            checkedList: [],
        },
        titles:["功能选择"],
        CheckedKeys: [],
        prefixCls:prefixCls

    };

    //声明detail组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
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
        components: { "List":List },
        props:{
            renderFormat: {
                type: Function,
                'default':function (item) {
                    return item.label || item.key;
                }
            },
            filterMethod:{
                type: Function,
                'default' :function(data, query) {
//                    var type = ('label' in data) ? 'label' : 'key';
                    var type = _.findKey(data,'label') ? 'label' : 'key';
                    return data[type].indexOf(query) > -1;
                }
            },
            selectedKeys: {
                type: Array,
                'default':function () {
                    return []
                }
            },
            targetKeys: {
                type: Array,
                'default':function () {
                    return []
                }
            },
        },
        data: function () {
            return dataModel

        },
        watch:{
        },
        computed: {
            classes :function() {
                return [
                    dataModel.prefixCls
                ]
            },
            validKeysCount :function(){
                return this.getValidKeys().length;

            }
        },
        methods: {
            getValidKeys :function() {
                //数组去重
                var arrayData=[];
                var _this = this;
                if(_this.mainModel.vo.list.length > 0){
                        var ret = [];
                        //单数组去重 去掉多次选择出现重复的数据
                        _.each(_this.mainModel.vo.authList,function(item){
                            if(ret.indexOf(item) === -1){
                                ret.push(item);
                            }
                        })
                    //判断右边的数据跟选中的数据是否相同项长度  长度跟数据是否相同 相同则全选
                    _.each(_this.mainModel.vo.list,function(item){
                        //选择的数据项
                        _.each(ret,function(auth){
                            if(item.key==auth){
                                arrayData.push(auth);
                            }
                        })
                    })
                    return arrayData
                }else{
                    return 0
                }
            },
            doSave: function () {
                var _this = this;
                var ret = [];
                //单数组去重 去掉多次选择出现重复的数据
                _.each(_this.mainModel.vo.authList,function(item){
                    if(ret.indexOf(item) === -1){
                        ret.push(item);
                    }
                })
                this.mainModel.vo.authList = ret;
                this.mainModel.vo.menuId = dataModel.mainModel.selectedDatas[0].code;
                var callback = function (res) {
//                    _this.$dispatch("ev_editRoleFinshed",_this.mainModel.vo);
                    LIB.Msg.info("保存成功");
                };
                _.each(_this.mainModel.vo.roleList, function (r) {
                    _this.mainModel.vo.list.push(r.id);
                });
                api.distributionFunc(_.pick(this.mainModel.vo, "authList","roleId","type","menuId")).then(callback);
            },
            //doCancel: function () {
            //    this.$dispatch("ev_editFuncFinshed");
            //},
            doChangeGroup: function () {
                var _this=this;
                var selectedKeys = _this.selectedKeys;
                var _vo = dataModel.mainModel.vo;
                var menuId = dataModel.mainModel.selectedDatas[0].code;
                var _model = dataModel.mainModel;
                var dataLeft=[], userDataLeft=[];

                api.listFunc({parentId:menuId}).then(function (data){
                    _.each(data.body,function(item){
                        dataLeft={
                            key:item.id,
                            label: item.name
                        }
                        userDataLeft.push(dataLeft)
                    })
                    _vo.list = userDataLeft;
                });
                //清空数据
                //_model.checkedList=[];
                //authList 为选中的按钮 checkedList为一个桥接变量 用来存放数据
               //_model.authList=[];
                //获取获取功能权限
                if(menuId && menuId != null && menuId != "") {
	                api.getFunc({roleId: _vo.roleId,type:"1",menuId:menuId}).then(function (res) {
	                    _.each(res.data,function (func){
	                        _model.checkedList.push(func.relId);
	                    });
	                    _vo.authList = _model.checkedList;
	                });
                }else{
                	_vo.authList = [];
                }
            },
            //doAddData: function (value,args) {
            //    var arrays = this.mainModel.vo.authList;
            //    if(value){
            //        arrays.push(args);
            //    }else{
            //        var index = arrays.indexOf(args);
            //        arrays.splice(index,1);
            //    }
            //}
            //切換的時候 把全選的數據保存
            doToggleSelectAll:function(data,status){
                var _vo = dataModel.mainModel.vo;
               if(status){
                   _.each(data,function(item){
                       dataModel.mainModel.checkedList.push(item);
                   })
               }else{
                   _.each(dataModel.mainModel.checkedList,function(i,index){
                       _.each(_vo.list,function(item,j){
                           if(i==_vo.list[j].key){
                               dataModel.mainModel.checkedList.splice(index,i);
                           }
                       })
                   })
               }
            }
        },
        events: {
            //edit框数据加载
            "ev_editFuncReload": function (nVal) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _vo = dataModel.mainModel.vo;
                var _model = dataModel.mainModel;
                //清空数据
                _.extend(_vo, newVO());
                this.mainModel.selectedDatas= [];
               // arrays = [];
                _vo.roleId = nVal;
                //存在nVal则是update
                api.listMenu({disable:0}).then(function (data) {
                    _vo.data = data.body;
                });
            },
            "ev_editFuncEmptied":function(){
                var _vo = dataModel.mainModel.vo;
                _vo.authList = [];
                dataModel.mainModel.checkedList=[]
            }
        }
    });

    return detail;
});