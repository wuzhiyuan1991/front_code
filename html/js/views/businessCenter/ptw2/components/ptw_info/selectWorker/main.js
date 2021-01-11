define(function (require) {
    var LIB = require("lib");
    var Vue = require("vue");
    var template = require("text!./main.html");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    return Vue.extend({
        template: template,
        components: {
            userSelectModal:userSelectModal
        },
        props: {
            visible: Boolean,
            values:{
                type:Array,
                default:function () {
                    return [];
                }
            },
            selectUserIds:{
                type:Array,
                default:function () {
                    return [];
                }
            },
            fieldName:{
                type:String,
                default:"name"
            },
            valueName:{
                type:String,
                default:"id"
            },
        },
        data: function () {
            var _this = this;
            return {

                title:"选择人员",
                load: false,
                selectWorkerIndex:[],
                otherUserModel:{
                    show:false,
                }
            }
        },
        computed: {

        },
        methods: {

            init:function (users,selectdWorker) {
                if(users){
                    this.values=users;
                    this.visible=true;
                }

                if(selectdWorker){
                    var indexs=[];
                    var selectIds=selectdWorker.map(function (item) {
                        return item.user.id;
                    })
                    this.values.forEach(function(item,index){
                        if(selectIds.indexOf(item.user.id)>-1){
                            indexs.push(index);
                        }
                    })
                    this.selectWorkerIndex=indexs;
                }
                else{
                   this.selectWorkerIndex=[];
                }
            },
            getName:function(tag){
                var keys=this.fieldName.split('.');
                var name=tag;
                keys.forEach(function (item) {
                    name=name[item];
                });
                return name;
            },
            getItemId:function(tag){
                var keys=this.valueName.split('.');
                var name=tag;
                keys.forEach(function (item) {
                    name=name[item];
                });
                console.log("id",name);
                return name;

            },
            doSelOther:function(){
                this.otherUserModel.show=true;
            },
            doSave:function () {
                var _this=this;
                if(this.selectWorkerIndex.length===0){
                    LIB.Msg.error("请至少选择一个人员");
                    return ;
                }
                this.visible=false;
                var selectedWorker=this.selectWorkerIndex.map(function (index) {
                    return _this.values[index];
                })
                this.$emit("confirm",selectedWorker);
            },
            doSaveOtherUser:function (users) {
                this.visible=false;
                var _this=this;
                var selectedWorker=this.selectWorkerIndex.map(function (index) {
                    return _this.values[index];
                })
                if(users&&users.length>0){
                    var personals=users.map(function (item) {
                        return {user:item};
                    })
                    selectedWorker=selectedWorker.concat(personals);
                }
                if(selectedWorker.length===0){
                    LIB.Msg.error("请至少选择一个人员");
                    return ;
                }
                this.$emit("confirm",selectedWorker);

            }
        },
        created: function () {

        },
        watch: {
            visible: function (val) {
                if (val && !this.load) {
                    this.load = true;

                } else {
                    this.load = false;
                }
            },
        }
    })
})