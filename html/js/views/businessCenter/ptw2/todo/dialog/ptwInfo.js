define(function (require) {
    var LIB=require("lib");
    var Vue = require("vue");
    var template = require("text!./ptwInfo.html");
    var api = require("../../workCard/vuex/api");
    var commonApi = require("../../api");
    var model = require("../../model");
    var ptwInfoView = require("../../components/ptwInfoView/pwt_base");
    var preview = require("./preview");

    return Vue.extend({
        template: template,
        components: {
            "ptwInfoView": ptwInfoView,
            "preview": preview
        },
        props: {
            permitId: String,
            workcard:Object,
        },
        data: function () {
            return {
                load: false,
                permitModel: model.permitDetail(),//这里面包含填报作业票的一些字段，不用管
                previewModel:{visible:false, vo:null}
            }
        },
        created: function () {

        },
        methods: {
            showPreview:function () {
                var obj = _.extend({},this.workcard.vo, this.permitModel);
                this.$refs.preview.init(this.workcard.vo, obj);
                this.previewModel.visible = true;
            },
            refresh:function(){
                // this.$refs.ptwInfoView.pwtInfoTypeSelectedIndex=0;
                if(!this.permitId){
                    return;
                }
                this.loadData();
            },
            init:function(){
                if(!this.permitId){
                    return;
                }
               if(!this.load){
                   this.load=true;
               }
               this.loadData();
            },
            loadData:function(){
                var _this=this;
                api.getWorkPermit(this.permitId, true).then(function (data) {
                    model.permitHandler(data);
                    _this.viewDataHandle(data);

                    commonApi.getCatalogList({  'criteria.intsValue':JSON.stringify({type:[6,7,8,9,10]})}).then(function (pro) {
                        var promise = {};

                        pro.forEach(function (item) {
                            promise[item.type] = item.content || item.name;
                        });
                        data.promiseList=promise;
                        _this.permitModel = data;
                        LIB.globalLoader.hide();
                    });
                })
            },
            viewDataHandle: function (data) {
                //1.处理时间
                data.permitStartTime = new Date(data.permitStartTime).Format("yyyy-MM-dd h:mm:ss");
                data.permitEndTime = new Date(data.permitEndTime).Format("yyyy-MM-dd h:mm:ss");
                if(data.validityEndTime){
                    data.validityStartTime = new Date(data.validityStartTime).Format("yyyy-MM-dd h:mm:ss");
                    data.validityEndTime = new Date(data.validityEndTime).Format("yyyy-MM-dd h:mm:ss");
                }
            }
        },

    })
});
