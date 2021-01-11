define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./configModel.html");
    var baseTransfer = require("./base-transfer")

    //初始化数据模型
    var newVO = function() {
        return {

        }
    };

    //Vue数据
    var dataModel = {
        modify:true,
        index:0,
        baseList: [],
        allList: [],
        transferShow : false,
        allList: [],
        allArr: [],
        mainModel : {
            vo : newVO(),
            opType : 'add',
            isReadOnly : false,
            title:"详情",

            //验证规则
            rules:{
                "code" : [LIB.formRuleMgr.length(255)],
                "name" : [LIB.formRuleMgr.require("字段名称"),
                    LIB.formRuleMgr.length(100)
                ],
                "isRequired" : [LIB.formRuleMgr.require("是否必填项")],
                "dataType" : [LIB.formRuleMgr.require("数据类型")],
                "isInherent" : [LIB.formRuleMgr.require("是否固化字段")],
                "oldName" : [LIB.formRuleMgr.require("字段原名称"),
                    LIB.formRuleMgr.length(100)
                ],
                "disable" :LIB.formRuleMgr.require("状态"),
                // "ptwCardTpl.id" : [LIB.formRuleMgr.allowStrEmpty],
            }
        },
    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components: {
          "baseTransfer":baseTransfer
        },
        props:{
            visible:{
                type:Boolean,
                default: false
            }
        },
        watch:{

        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            init: function (arr1, arr2) {
                var list  = _.map(arr1, function (item) {
                    return {
                        name: item.name,
                        color: item.color,
                        id: item.id,
                        value: item.value,
                        list: []
                    }
                });
                _.each(arr2, function (item) {
                    item.label = item.compName + ' ' + item.name;
                })
                _.each(arr2, function (item) {
                    var obj = _.find(list, function (listItem) {
                        return listItem.value == item.value;
                    }) ;
                    if(obj){
                        obj.list.push(item);
                    }
                });
                this.allList = arr2;
                this.baseList = list;
            },
            doSave:function () {
                var _this = this;
                this.visible = false;
            },
            removeItem: function (item) {
                var obj = _.find(this.allList, function (opt) {
                    return opt.id == item.id;
                });
                if(obj) obj.value = '';
            },
            cb: function (arr1, arr2, val) {
                var allArr = _.filter(this.allList, function (item) {
                    return arr2.indexOf(item.id) > -1;
                });
                _.each(allArr, function (item) {
                    if(arr1.indexOf(item.id)>-1) item.value = val;
                    else item.value = '';
                });
                this.init(this.baseList, this.allList);
            },
            showTransfer: function (val) {
                var selectArr = _.pluck(this.baseList[val].list, "id");

                var selectAll = [];
                var allArr = [];
                for(var i=0; i<this.baseList.length; i++){
                    if(i != val) selectAll = selectAll.concat(_.pluck(this.baseList[i].list, "id"))
                }
                for(var i=0; i<this.allList.length; i++){
                    if(selectAll.indexOf(this.allList[i].id) == -1){
                        allArr.push(this.allList[i]);
                    }
                }
                this.allArr = allArr;
                this.$refs.transfer.init(this.allArr, selectArr, this.cb, this.baseList[val].value);
            }
        }
    });

    return detail;
});