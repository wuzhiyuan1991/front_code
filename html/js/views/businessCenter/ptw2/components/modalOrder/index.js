define(function (require) {
    var LIB=require("lib");
    var Vue = require("vue");
    var template = require("text!./index.html");
    var api=require("../../workCard/vuex/api");
    var commonApi=require("../../api");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    return Vue.extend({
        template: template,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        components:{
            "userSelectModal":userSelectModal,
        },
        props:{
            show:Boolean,
            auth:{
                type:Object,
            }
        },
        data: function () {
            return _.extend({
                load:false,
                showUserSelectModal: false,
                workCatalogList: [],
            },this._getInitData())
        },
        computed:{
            currentWorkCatalog: function () {
                return this.workCatalogList[this.selWorkCatalogIndex];
            }
        },
        methods: {
            _getInitData:function(){
               return {
                   dateRange:[],
                   selectedWorLevelId: "",
                   selWorkCatalogIndex:0,
                   formOrder: {
                       workStartTime: null,
                       workEndTime: null,
                       workLevel: {id: ''},
                       workCatalog: {id: ''},
                       workPlace: null,
                       workEquipment: null,
                       workContent: null,
                       enableReservation: "1",
                       auditor: {id: '', name: ''},
                       prodUnitId:null,
                   },
               }
            },
            doSaveUser: function (selectedDatas) {
                if (selectedDatas) {
                    var user = selectedDatas[0];
                    _.extend(this.formOrder.auditor, {
                        id: user.id,
                        name: user.name
                    })
                }
            },
            doFormOrderSubmit: _.debounce(function () {
                var _this = this;
                _this.formOrder.workCatalog.id = _this.currentWorkCatalog.id;
                _this.formOrder.workLevelId = _this.selectedWorLevelId;
                var data = _this.formOrder;
                if (!data.workStartTime) {
                    LIB.Msg.error("请选择作业开始时间", 4);
                    return;
                }
                if (!data.workEndTime) {
                    LIB.Msg.error("请选择作业结束时间", 4);
                    return;
                }
                if(data.workEndTime < data.workStartTime){
                    LIB.Msg.error("作业结束时间小于作业开始时间", 4);
                    return;
                }
                if (_this.currentWorkCatalog.levelList && _this.currentWorkCatalog.levelList.length > 1 && !data.workLevelId) {
                    LIB.Msg.error("请选择作业等级", 4);
                    return;
                }
                if(!data.prodUnitId){
                    LIB.Msg.error("请选择生产单位", 4);
                    return;
                }
                if (!data.workPlace || data.workPlace.length > 200) {
                    LIB.Msg.error("请填写作业地点,且不要超过200个字符", 4);
                    return;
                }
                if (data.workEquipment && data.workEquipment.length > 200) {
                    LIB.Msg.error("作业所在的设备不要超过200个字符", 4);
                    return;
                }
                if (!data.workContent || data.workContent.length > 500) {
                    LIB.Msg.error("请填作业内容,且不要超过500个字符", 4);
                    return;
                }
                if (!data.auditor.id) {
                    LIB.Msg.error("请选择审批人", 4);
                    return;
                }
                commonApi.getWorkCarTplList({
                    'workCatalog.id':_this.currentWorkCatalog.id,
                    'workLevelId':this.selectedWorLevelId,
                    'disable':'0',
                }).then(function (data) {
                    if(data.length===0){
                    LIB.Msg.error("选择的作业类型没有对应模板", 4);
                    return ;
                }
                LIB.globalLoader.show();
                api.create(_this.formOrder).then(function () {
                    LIB.Msg.success("预约成功", 1, function () {
                        LIB.globalLoader.hide();
                        _this.show=false;
                        _this.$emit("success");
                        //_this.$router.go("/ptw/businessCenter/ptwTodo");
                    });
                })
            })

            },300),
            cancel:function(){
                var _this=this;
                _this.show=false;

            }
        },
        created:function(){
            var _this=this;
            commonApi.getWorkCatalogLevelList().then(function (data) {
                if(!data||data.length===0){return}
                _this.workCatalogList = data;
                if(data[0].levelList&&data[0].levelList.length>0){
                    _this.selectedWorLevelId=data[0].levelList[0].id;
                }
                // _this.$nextTick(function () {
                //     _this.$refs.radioGroup.updateModel();
                // })
            });
        },
        watch:{
            show:function (val) {
                if(val&&!this.load){
                    this.load=true;
                }
                if(val&&this.load){
                    _.extend(this,this._getInitData());
                }
            },
            dateRange: function (val) {
                if (val[0]) {
                    _.extend(this.formOrder, {
                        workStartTime: val[0].Format("yyyy-MM-dd hh:mm:ss"),
                        workEndTime: val[1].Format("yyyy-MM-dd 23:59:59")
                    });
                }
            },
            selWorkCatalogIndex: function (val) {
                var item = this.workCatalogList[val];
                if (item.levelList && item.levelList.length > 0) {
                    this.selectedWorLevelId = item.levelList[0].id;
                } else {
                    this.selectedWorLevelId = undefined;
                }
            }
        }
    })
})