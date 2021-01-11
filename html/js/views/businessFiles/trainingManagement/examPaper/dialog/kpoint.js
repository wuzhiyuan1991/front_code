define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./kpoint.html");

    var newVO = function () {
        return {
            kpointList:[],
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            // rList: [],
            // rLength: 0,
            // roleLength: 0,
            // selectedDatas: []
        },
        selectedDatas:[],
        ds:[]

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
        data: function () {
            return dataModel;
        },
        methods: {
            doSave:function(){
                this.$dispatch("do-save-kpoint",this.selectedDatas);
            },
            //radioButton选择框事件处理
            doRadioBtnChanged: function(entry) {
                var _this = this;
                _.each(_this.ds, function(item){ item.rowCheck = false;});
                //设置当前row选中
                entry.rowCheck = true
                //计算selectedData
                this.calcSelectedDatas();
            },
            doRadioBtn:function(data){
                var _this = this;
                this.ds = [];
                _.each(data,function(item){
                    if(item.kpointList){
                        _.each(item.kpointList,function(kpoint){
                            kpoint.rowCheck = false;
                            _this.ds.push(kpoint);
                        })
                    }

                })
            },
            //计算选择的数据
            calcSelectedDatas: function() {
                this.selectedDatas = _.map(_.where(this.ds, { rowCheck: true }), function(item) {return item});
            },
            doPointClick: function (point) {

                _.forEach(this.ds, function(item){
                    item.rowCheck = false;
                });
                //设置当前row选中
                point.rowCheck = true;

                //计算selectedData
                this.calcSelectedDatas();
            },
            doPointDblClick: function (point) {
                this.selectedDatas = [point];
                this.$dispatch("do-save-kpoint", this.selectedDatas);
            }
        },
        events: {
            "ev_editReload":function(id){
                var _this = this;
                api.queryCourseKpoints({id:id}).then(function(res){
                    var data = res.data;
                    if(!data){
                        LIB.Msg.warning("当前课程没有目录，请重新选择！");
                        return;
                    }
                    _this.doRadioBtn(data);
                    _this.$set("mainModel.vo.kpointList", data);
                })
            },
        }
    });

    return detail;
});