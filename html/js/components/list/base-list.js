define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./base-list.html");
    var component= Vue.extend({
        template: template,
        props:{
            contentField:{
                type:String,
                default:'name'
            },
            hasSave:{
                type:Boolean,
                default: false,
            },
            values:{
                type:Array,
                required:true,
            },
            autoClose: {//是否自动关闭
                type: Boolean,
                default: true,
            },
            mutHeight:{
                type:String,
                default:'220'
            },
            showTool:{
                type:Boolean,
                default: true
            }
        },
        data: function () {
            return {
                selectedIndex:0,
                modalAdd:{
                    title:"添加",
                    show:false,
                    form:{
                        itemsText:"",
                    },
                },
                modalEdit:{
                    title:"编辑",
                    show:false,
                    form:{name:""},
                    rules:{
                        name:[LIB.formRuleMgr.require("内容"),LIB.formRuleMgr.length(200)],
                    }
                },
            }
        },
        methods: {
            getStyleHeight:function () {
                return "max-height:calc(100vh - "+this.mutHeight+"px);overflow: auto"
            },
            init:function(){

            },
            getContent: function (item) {
                return  item[this.contentField];
            },
            contentClick:function(index){
                this.selectedIndex=index;
                this.$emit("on-selected",index);
            },
            movePrev:function () {
                var index=this.selectedIndex;
                var temp=this.values;
                var current=temp[index];
                var prev=temp[index-1];
                this.values.splice(index-1,2,current,prev);
                this.selectedIndex--;
                this.$emit("on-move-up",current);
                this.$emit("on-move-row",-1,current);
},
            moveNext:function () {
                var index=this.selectedIndex;
                var temp=this.values;
                var current=temp[index];
                var next=temp[index+1];
                this.values.splice(index,2,next,current);
                this.selectedIndex++;
                this.$emit("on-move-down",current);
                this.$emit("on-move-row",1,current);
            },
            delAll:function () {
                var _this=this;
                LIB.Modal.confirm({
                    title:"是否确认删除所有",
                    onOk:function () {
                        // var items=_this.values.splice(0);
                        // _this.selectedIndex=-1;
                        _this.$emit("on-del-all",_this.values,this);
                    }
                });
            },
            delItem:function () {
                var _this=this;
                LIB.Modal.confirm({
                   title:"是否确认删除当前项",
                    onOk:function () {
                        var index=_this.selectedIndex;
                        var item =_this.values[index];
                        _this.$emit("on-del",item,index,_this);
                        // _this.values.splice(index,1);  放在了父组件做
                        // if(_this.values.length===0){
                        //     _this.selectedIndex=-1;
                        // }
                        // else if(_this.values.length<_this.selectedIndex+1){
                        //     _this.selectedIndex=_this.values.length-1;
                        // }
                    }
                })
            },
            edit: function () {
                var item = this.values[this.selectedIndex];
                this.modalEdit.form.name = item[this.contentField];
                this.modalEdit.show = true;
            },
            add: function () {
                this.modalAdd.form.itemsText = "";
                var modal = this.modalAdd;
                modal.show = true;
            },
            save: function () {
                this.$emit("on-save",this.values);
            },
            //================下面是modal 的方法====================
            modalAddCancel: function () {
                this.modalAdd.show = false;
            },
            modalAddOk: function () {
                var _this = this;
                var modal = this.modalAdd;
                var text = modal.form.itemsText;
                var itemStemp = text.split(/\n|\n\r/g);
                var items = [];
                _.each(itemStemp,function (temp) {
                    if(temp && !_.find(items,function (item) {
                            return temp == item;
                        })){
                        items.push(temp);
                    }
                });

                if(items.length == 0){
                    LIB.Msg.error("请填写内容");
                    return ;
                }
                else{
                    for (var i=0;i<items.length;i++){
                        var content=items[i];
                        if(content.length>200){
                            LIB.Msg.error("每项请不要超过200个字符");
                            return ;
                        }
                    }
                }
                var valItems = items.map(function (name) {
                    var obj = {id: undefined};
                    obj[_this.contentField] = name;
                    return obj;
                });
                this.$emit("on-add-ok", valItems, this);
                if (this.autoClose) { //添加需要手动刷新values,并且关闭 (addItems,parent)=>{paretent.show=false}
                    modal.show = false;
                }
            },
            modalEditCancel: function () {
                this.modalEdit.show = false;
            },
            modalEditOk: function () {
                var _this = this;
                var item = this.values[this.selectedIndex];
                var name=this.modalEdit.form.name;
                if(name.length>200){
                    LIB.Msg.error("项内容请不要超过200个字符");
                    return ;
                }
                var modal = this.modalEdit;
                this.$refs.modaledit.validate(function (validate) {
                    if(validate){
                        _this.$emit("on-edit-ok",item,name,_this);
                        if (_this.autoClose) {   //编辑需要手动修改项值,并且关闭 (item,parent)=>{item[filed]=xx paretent.show=false}
                            modal.show = false;
                        }
                    }
                })

            }
        }
    });
    Vue.component("base-list",component);
    return component;
})