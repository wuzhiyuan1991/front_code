define(function (require) {
    var Vue = require("vue");
    var LIB = require('lib');
    var template = require("text!./base-transfer.html");
    return Vue.extend({
        template: template,
        data: function () {
            return {
                load:false,
                modalTitle:"定制内容",
                visible:false,
                data: [
                    { "key": "1", "label": "内容1", "disabled": false },
                    { "key": "2", "label": "内容2", "disabled": true },
                    { "key": "3", "label": "内容3", "disabled": false }
                ],
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
                    item.label=item.name;
                    return item;
                });
                this.oldDataKey = _.cloneDeep(keys);
                this.visible=true;
                this.data=data;
                this.targetKeys=keys;
                this.callback=cb;
                this.pms=pms;

                // 调用方法设置滚动条起始位置
                var _this = this;
                this.$nextTick(function () {
                    _this.$refs.transfer.gotoTop();
                })

            },

            refleshStuffInfo:function (data,keys,cb,pms) {
                this.init(data, [], cb, pms);
            },

            doRefleshStuff:function () {
                this.$emit("reflesh-stuff", this.pms, true);
            },

            gotoStuff:function () {
                var router = LIB.ctxPath("/html/main.html#!");
                var routerPart="/ptw/stuff?id=" + this.pms.catlogId + "&type=" + this.pms.type;
                if(this.pms.ppeCatalogId){
                    routerPart += '&ppeType=' + this.pms.ppeCatalogId;
                }
                if(this.pms&&this.pms.type=="7"){//作业取消原因
                    routerPart="/ptw/shutoff?type=2";
                }
                if(this.pms.type == '4' && this.pms.gasType){
                    routerPart="/ptw/catalog?type=3&gastype="+this.pms.gasType;
                }
                window.open(router + routerPart);
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

                 this.callback(items);
                 this.doClose();
            },
            handleChange:function(newTargetKeys, direction, moveKeys) {
                this.targetKeys = newTargetKeys;
            }
        }
    })
})
