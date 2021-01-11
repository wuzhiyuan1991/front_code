define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./organization.html");


    var newVO = function () {
        return {
            flowChartUrl:null,
            showChart:true
        }
    };

    //数据模型
    var dataModel = function(){
        return{
            mainModel: {
                vo: newVO(),
            },
            resetTriggerFlag:false,
            url: "organization/list{/curPage}{/pageSize}?type=1",
            filterColumn:["name"],
            selectedDatas: [],
            columns: [{
                title: "",
                fieldName: "id",
                fieldType: "cb",
            }, {
                title: this.$t("gb.common.code"),
                fieldName: "code",
                width:'160px',
                filterType: "text"
            },{
                title: this.$t("ori.perm.compName"),
                fieldName: "name",
                filterType: "text"
            },{
                title: this.$t("ori.perm.abbreviat"),
                fieldName: "attr5",
                filterType: "text"
            }, {
                title: this.$t("gb.common.ownedComp"),
                fieldType: "custom",
                filterType: "text",
                filterName: "criteria.strValue.parentName",
                render: function (data) {
                    if (data.parent) {
                        return data.parent.name;
                    }
                }
            },{
                title: this.$t("ori.perm.detailAddr"),
                fieldName: "address",
                filterType: "text"
            },{
                title: this.$t("ori.perm.introduct"),
                fieldName: "remarks",
                filterType: "text"
            }]
        }

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
        data: dataModel,
        methods: {
            doSave: function () {
                this.$dispatch("ev_detailOrg",this.selectedDatas);
                this.resetTriggerFlag = !this.resetTriggerFlag;
            },
            doClose:function(){
                this.resetTriggerFlag = !this.resetTriggerFlag;
            }
        },
        events: {
            //edit框数据加载
            "ev_orgReload":function() {
                this.resetTriggerFlag = !this.resetTriggerFlag;
            }
        }
    });

    return detail;
});