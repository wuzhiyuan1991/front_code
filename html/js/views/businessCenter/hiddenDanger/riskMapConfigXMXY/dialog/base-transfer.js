define(function (require) {
    var Vue = require("vue");
    var LIB = require('lib');
    var template = require("text!./base-transfer.html");

    return Vue.extend({
        template: template,
        data: function () {
            return {
                load:false,
                oldList:[],
                modalTitle:"配置匹配",
                visible:false,
                keyword: '',
                data: [
                    { "key": "1", "label": "内容1", "disabled": false },
                    { "key": "2", "label": "内容2", "disabled": true },
                    { "key": "3", "label": "内容3", "disabled": false }
                ],
                settingValue: '',
                oldDataKey:[],
                targetKeys:[],
                targetData:[],
                listStyle:{
                    width:'300px'
                },
                renderFormat:function (item) {
                    return item.name+item.label;
                },
                callback:null,
                pm:{},//其他参数
            }
        },
        methods: {
            init:function(data,keys,cb,pms){
                if(!this.load){
                    this.load=true;
                }
                data=data.map(function (item) {
                    item.key=item.id;
                    item.label=item.compName + " " + item.name;
                    return item;
                });
                this.oldDataKey = _.cloneDeep(keys);
                this.visible=true;
                this.data=data;
                this.targetKeys=keys;
                this.callback=cb;
                this.pms=pms;
                // 调用方法设置滚动条起始位置
                // var _this = this;
                // this.$nextTick(function () {
                //     _this.$refs.transfer.gotoTop();
                // })
            },

            doFilterLeft:function () {

            },

            doClose:function () {
                this.visible=false;
            },
            doSave:function () {
                 var _this=this;
                 var items=this.data.filter(function (item) {
                     return _this.targetKeys.indexOf(item.key)>-1;
                 });
                 if(this.targetKeys.length==0){
                     LIB.Modal.confirm({
                         title:'已选数据为空，是否离开',
                         onOk:function () {
                             _this.callback(items);
                             _this.doClose();
                         }
                     });
                     return ;
                 }
                 this.callback.call(this.$parent, _this.targetKeys, _.pluck(this.data, 'id'), this.pms);
                 this.doClose();
            },
            handleChange:function(newTargetKeys, direction, moveKeys) {
                this.targetKeys = newTargetKeys;
            }
        }
    });
});
