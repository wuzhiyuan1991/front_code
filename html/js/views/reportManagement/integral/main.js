define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    //组件列表
    var components = {
        'user-report':require("./user/main"),
        'dept-report':require("./dept/main")
    };
    var specialQryInfos = [
                {id:'userReport',compName:'user-report',name:'个人积分'},
                {id:'deptReport',compName:'dept-report',name:'部门积分'},
            ];

    var dataModel = function(){
        return {
            qryInfoModel:{
                activeCompName:null,
                list:specialQryInfos
            },
            reportModel:{
                show:false
            }
        }
    };

    var opt = {
        template:template,
        components:components,
        data:function(){
            return new dataModel();
        },
        computed:{
            'reportCptName':function(){
                var _this = this;
                var specialComponent = _.find(specialQryInfos, function(info){
                    return info.compName == _this.qryInfoModel.activeCompName;
                });
                return specialComponent.compName;
            }
        },
        methods:{
            qryInfoClick:function(index){
                this.reportModel.show = false;
                var item = this.qryInfoModel.list[index];
                this.qryInfoModel.activeCompName = item.compName;
                this.reportModel.show = true;
            }
		},
        ready:function(){
            this.qryInfoClick(0);
        }
    };
    return LIB.Vue.extend(opt);
});