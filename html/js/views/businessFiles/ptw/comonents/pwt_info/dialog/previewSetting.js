define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./previewSetting.html");

    //Vue数据
    var dataModel = {
        modify:true,
        index:0,
        mainModel : {
            isReadOnly : false,
            title:"详情",
        },
        arr:[],
        visible: false,
        baseList: [],
        oldList: []
    };

    var detail = LIB.Vue.extend({
        name:"preview-setting",
        mixins : [LIB.VueMixin.dataDic],
        template: tpl,
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
            codeMap : function (obj, str) {
                var defArr = ['createBy', 'code', 'name', 'workCatalog', 'applUnitId', 'workUnitId', 'workPlace', 'workContent', 'worker', 'permitTime'];
                var disArr = ['createBy', 'code', 'name', 'workCatalog', 'applUnitId', 'workUnitId', 'workPlace', 'workContent', 'worker', 'permitTime','jsaMasterId', 'safetyEducator', 'supervisior', 'mainEquipment', 'specialWorker', 'operatingType'];
                var filesArr = ['workPlan', 'emerScheme', 'attachedPicture', 'otherAttachment'];
                if(str == 'require'){
                    if(disArr.indexOf(obj.code)>-1){
                        return true;
                    }else{
                        return false;
                    }
                }

                if(str == 'files'){
                    if(filesArr.indexOf(obj.code)>-1){
                        return true;
                    }else{
                        return false;
                    }
                }

                if(defArr.indexOf(obj.code)>-1){
                    return true;
                }else{
                    return false;
                }
            },

            init: function (baseList) {
                var _this = this;
                this.arr = [];

                this.oldList = _.filter(baseList, function (item) {
                    return item.disable == '0';
                });
                this.baseList = _.filter(baseList, function (item) {
                    return item.disable == '0' && !item.config && !_this.codeMap(item, 'files');
                });

                for(var i=0; i<15; i++){
                    var tempArr = [];
                    for(var j=0; j<6; j++){
                        tempArr.push({
                            x:i,
                            y:j,
                            name:null,
                            rowspan: null,
                            isShow: false
                        });
                    }
                    this.arr.push(tempArr);
                }

                _.each(this.oldList, function (item) {
                    if(item.config){
                        _this.arr[item.config.x][item.config.y].name = item.config.name;
                    }
                });

                this.$set("arr", this.arr);

                this.visible = true;
            },

            deelDoSaveSetting: function () {
                var _this = this;
                _.each(_this.oldList, function (item) {
                    item.config = null;
                });
                _.each(_this.arr, function (rows) {
                    _.each(rows, function (col) {
                        if(col.name){
                            var obj = _.find(_this.oldList, function (item) {
                                return item.name == col.name;
                            });
                            if(obj){
                                obj.config = _.clone(col);
                            }
                        }

                    })
                })
            },

            doSave:function () {
                var _this = this;
                if(_this.baseList.length>0){
                    var str = '';
                    str = _.pluck(this.baseList, "name").join('， ');
                    LIB.Modal.confirm({
                        title: '当前还有 ' + str + '未配置, 确定离开?',
                        onOk: function () {
                            _this.deelDoSaveSetting();
                            _this.visible = false;
                        }
                    });
                }else{
                    _this.deelDoSaveSetting();
                    _this.visible = false;
                }
            },

            outSideClick: function () {
                var _this = this;
                _.each(this.arr, function (arrItem) {
                    var obj = _.find(arrItem, function (item) {
                        return item.isShow;
                    });
                    if(obj){
                        _this.doInputBlur(obj);
                    }
                })
            },

            doInputBlur: function (option) {
                if(!option.name) return option.isShow = false;
                option.name = option.name.replace(/\s+/g,"");
                if(option.name){
                    var obj = _.find(this.baseList, function (item) {
                        return item.name == option.name;
                    });
                    if(!obj){
                        var isExit = false;
                        _.each(this.arr, function (row) {
                           var col = _.find(row, function (col) {
                               return col.name == option.name && (col.x!=option.x || col.y!=option.y);
                           });
                           if(col){
                               col.name = '';
                               isExit = true;
                               option.isShow = false;
                           }
                        });
                        if(!isExit) {LIB.Msg.info("不存在名称"); option.name = '';}
                    }
                    if(obj){
                        this.baseList = _.filter(this.baseList, function (item) {
                            return item.name != obj.name;
                        });
                        option.isShow = false;
                    }
                }
            },
            doShowInput: function (option) {
                var _this = this;
                _.each(this.arr, function (item1) {
                    _.each(item1, function (item2) {
                        if(item2.isShow){
                            _this.doInputBlur(item2);
                        }
                        item2.isShow = false;
                    })
                });
                var obj = _.find(this.oldList, function (item) {
                    return item.name == option.name;
                });
                if(obj){
                    this.baseList.push(obj);
                }
                option.isShow = true;
            }
        }
    });

    return detail;
});