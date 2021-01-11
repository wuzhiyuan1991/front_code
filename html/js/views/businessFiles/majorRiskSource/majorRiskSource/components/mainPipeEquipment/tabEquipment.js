define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./tabEquipment.html");
    var modalEquipment=require("../dialog/equipmentModal");
    var modalSafeAttachment=require("../dialog/modalSafeAttachment");
    var model=require("../../model");
    var api=require("../../vuex/api");
    return Vue.extend({
        template: template,
        mixins:[LIB.VueMixin.dataDic],
        components:{
            modalEquipment:modalEquipment,
            modalSafeAttachment:modalSafeAttachment,
        },
        props:{
            data:[Array,Object],
            model:Object,
        },
        computed:{
            tabData:function () {
                if(!this.data||this.data.length===0){return ['全部']};
                var items=this.data.map(function (item) {
                    return  item.name;
                })
                items.unshift('全部');
                return items;
            }
        },
        data: function () {
            return {
                tableModel:{
                    //extendDetailTableOpt
                    attachment: LIB.Opts.extendDetailTableOpt({
                        columns : [
                            {
                                title : "序号",
                                fieldType : "sequence",
                                width:70,
                            },
                            {
                                title : "安全附件名称",
                                fieldName : "name",
                            },
                           {
                                title: "数量",
                               fieldName : "quantity",
                               width:100,
                            },
                            {
                                title : "",
                                fieldType : "tool",
                                toolType : "move,edit,del"
                            }],
                        values:[],
                    }),
                },
                dialogModel:{
                    equipment:{
                        title:"",
                        show:false,
                        model:null,
                    }
                },
                tabCurrentIndex:0,
            }
        },
        methods: {
            doAddEquipment:function(){
                this.$refs.dialogEquipment.init("add",model.mrsEquipment({type:1,mrsId:this.model.id}))
            },
            doEditEquipment:function(item){
                var data=_.extend(model.mrsEquipment(),item);
                this.$refs.dialogEquipment.init("edit",JSON.parse(JSON.stringify(data)));
            },
            saveEquipmentSuccessAfter:function(data,type){
                // main==>simpcard==>detial
                if(type==="add"){
                    this.tabCurrentIndex=this.data?this.data.length+1:0;
                }
                this.$parent.$parent.$parent.$parent.loadEquipment();

            },
            doDelEquipment:function(item){
                var _this=this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function() {
                        api.removeMrsEquipments({id:_this.model.id},[{id:item.id}]).then(function () {
                            LIB.Msg.success("删除成功");
                            _this.saveEquipmentSuccessAfter();
                            if(_this.tabCurrentIndex>0){
                                _this.tabCurrentIndex=_this.tabCurrentIndex-1;
                            }
                        })
                    }
                });

            },
            doAddAttachment:function(item){
                this.$refs.dialogSafeAttachment.init("add",model.mrsSafeAttachment(
                    {
                        majorRiskSource:item.majorRiskSource,
                        mrsId:item.majorRiskSource.id}),item);
            },
            doEditAttachment:function(item){
                item=item.entry.data;
                this.$refs.dialogSafeAttachment.init("edit",JSON.parse(JSON.stringify(item)),item);
            },
            doDelAttachment:function(item){
                item=item.entry.data;
                var _this=this;
                LIB.Modal.confirm({
                    title: '是否确定删除当前安全附件?',
                    onOk: function() {
                        api.removeEquipmentItems({id:item.parentId},[{id:item.id}]).then(function () {
                            LIB.Msg.success("删除成功");
                            _this.saveEquipmentSuccessAfter();
                        })
                    }
                });
            },
            doMoveAttachment:function(item){
                var _this = this;
                var data = item.entry.data;
                var param = {
                    id: data.id,
                    mrsId:_this.model.id
                };
                _.set(param, "criteria.intValue.offset", item.offset);
                api.moveEquipmentItems({id: data.parentId}, param).then(function () {
                    LIB.Msg.success("移动成功");
                    _this.saveEquipmentSuccessAfter();
                });
            },


        },
    })
})