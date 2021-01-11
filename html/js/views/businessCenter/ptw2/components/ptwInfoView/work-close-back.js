define(function (require) {
    var Vue = require("vue");
    var template = require("text!./work-close.html");
    var model = require("../../model");
    return Vue.extend({
        props: {
            model: {
                type: Object,
                required: true,
            },
            workcard:Object,//现在存的是detail-x 页面存的1个对象，现在存的是mainModel
        },
        template: template,
        computed: {
            reasonStr: function () {
                return this.model.workStuffs.filter(function (item) {
                    return item.type == 7&&item.checkResult==2;
                })[0].name;
            },
            reasonList: function () {
                var list  = this.model.workStuffs.filter(function (item) {
                    return item.type == 7;
                });
                return list;
            }

        },
        data: function () {
            return {
                workResultType: model.workResultType,
                currentWorkResult: "",
                isWorkClose: false,
                personnel:{
                    "1":null,
                    "7":null,
                    "8":null,
                },
                postponeTime:"",
                imageStyle:"height:20px;width:auto;"

            }
        },
        methods: {

            isApplyPerson:function(arr){
                var obj = null;
                if(arr.isArray){
                    arr.forEach(function (item) {
                        if(["1"].indexOf(item.signCatalog.signerType)>-1){
                            obj = item;
                        }
                    });
                    return obj;
                }
                return null;
            },

            _getPersonels:function(type){
                var m=this.model.workPersonnels.filter(function (item) {
                    return item.type==type;
                });
                var m=JSON.parse((JSON.stringify(m)));

                //没有ptw10 类型
                // m.forEach(function (item) {
                //     item.cloudFiles=item.cloudFiles.filter(function (item) {
                //         return item.dataType=="PTW10"
                //     })
                // });
                return m;
            },
            initData: function () {
                //状态 1:填报作业票,2:现场落实,3:作业会签,4:作业批准,
                // 5:作业监测,6:待关闭,7:作业取消,
                // 8:作业完成,9:作业续签,10:被否决

                //作业结果 1:作业完成,2:作业取消,3:作业续签
                var _this=this;
                this.isWorkClose =["6","7", "8", "9"].indexOf(this.model.status) > -1;
                //this.isWorkClose =["7", "8", "9"].indexOf(this.model.status) > -1;
                if (this.isWorkClose) {
                    //var typeObj = {"7": "cancel", "8": "success", "9": "postpone"};
                    var typeObj = {"1": "success", "2": "cancel", "3": "postpone"};
                    this.currentWorkResult =typeObj[this.model.result];
                    if("success,cancel".indexOf(this.currentWorkResult)>-1){
                        this.personnel["9"]=this._getPersonels("9"); // 取消签字人员
                        this.personnel["10"]=this._getPersonels("10"); // 作业续签或者延期
                        this.personnel["8"]=this._getPersonels("8"); //完成签字人员
                    }

                    console.log(this.personnel['8'],this.personnel['9'],this.personnel['10']);

                    if("postpone".indexOf(this.currentWorkResult)>-1){
                        var id=this.model.id;
                        var index=_.findIndex(this.workcard.versionPermitList,{id:id});
                        if(index!=undefined){
                            var item=this.workcard.versionPermitList[index+1];
                            this.postponeTime=item.permitStartTime+"到"+item.permitEndTime;
                        }
                    }
                }
            },
        },
        watch: {
            'model': function () {
                this.initData();
            }
        }
    })
})
