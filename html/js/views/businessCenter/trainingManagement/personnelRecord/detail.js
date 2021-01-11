define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var workTable=require("./work_table");

    //初始化数据模型
    var newVO = function() {
        return {
            username:"",
            age:"",
            mobile:"",
            sexText:"",
            positionText:"",
        }
    };
    //Vue数据
    function  initDataModel() {
        var dataModel = {
            mainModel: {
                vo: newVO(),
                opType: 'view',
                isReadOnly: true,
                title: "",
                detailPanelClass: "large-info-aside",
                rules: {},
                useMainData: true,//是否使用mainPange上面的data ，不调用接口
            },
            tableModel: {
                training: LIB.Opts.extendMainTableOpt({
                    url: 'traintask/personnelRecord/trainRecord/list/{curPage}/{pageSize}',
                    columns: [{
                        title: "课程名称",
                        //fieldName : "course.name",
                        fieldType: "custom",
                        render: function (data) {
                            return "<span style='color: #00CFFF'>" + data.course.name + "</span>";
                        },
                        tipRender: function (data) {
                            return data.course.name;
                        },
                        width: 200
                    }, {
                        title: "培训结果",
                        fieldType: "custom",
                        render: function (data) {
                            var status = data.status;
                            if (data.course.type == 1 && data.status == 2 && data.endTime < data.trainDate) {
                                status = '7';
                            }
                            if(data.course.type == 1 && data.status == 0 && new Date(data.endTime).getTime() < new Date().getTime()) {
                                status = '6';
                            }

                            var item = LIB.getDataDic('train_task_result', status);

                            if (status == 2 || status == 7) {
                                return "<span style='color:#009900'>" + item + "</span>"
                            } else if (status == 1 || status == 3) {
                                return "<span style='color:red'>" + item + "</span>"
                            } else {
                                return "<span style='color:#8c6666'>" + item + "</span>"
                            }

                        },
                        tipRender: function (data) {
                            var item = LIB.getDataDic('train_task_result', data.status);
                            return item
                        },
                        width: 150
                    }, {
                        title: "通过时间",
                        fieldName: "trainDate",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.status == 2 || data.status == 3) {
                                //return data.examSchedule.startTime;
                                return data.trainDate
                            }
                        },
                        width: 140
                    }, {
                        title: "培训方式",
                        //fieldName : "course.type",
                        fieldType: "custom",
                        render: function (data) {
                            return LIB.getDataDic("course_type", _.propertyOf(data.course)("type"));
                        },
                        width: 100
                    }, {
                        title: "课程类型",
                        fieldName: "course.attr1",
                        width: 180
                    }, {
                        title: "学习课时",
                        fieldName: "course.trainHour",
                    }, {
                        title: "培训开始时间",
                        fieldName: "startTime",
                        width: 120,
                        render: function (data) {
                            if(data.startTime){
                                return data.startTime.slice(0,11);
                            }
                        },
                    }, {
                        title: "培训结束时间",
                        fieldName: "endTime",
                        width: 120,
                        render: function (data) {
                            if(data.endTime){
                                return data.endTime.slice(0,11);
                            }
                        },
                    }, {
                        title: "完成进度",
                        fieldType: "custom",
                        render: function (data) {
                            return data.percent + "%";
                        },
                        width: 100
                    }, {
                        title: "考试交卷时间",
                        fieldName: "examSchedule.startTime",
                        width: 140
                    }, {
                        title: "考试得分",
                        fieldName: "custom",
                        render: function (data) {
                            if (data.score) {
                                return parseInt(data.score) + "分";
                            } else if (!!data.examSchedule && data.examSchedule.status == 2) {
                                return "0分";
                            }
                        },
                        width: 100
                    }, 
                    ]

                }),
                work:{
                    data:[],
                    query:{
                        year:'',
                        userId:undefined,
                    }
                }
            },
            queryYear:new Date().getFullYear()+"",
        };
        return dataModel;
    }
    //Vue组件
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
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        components:{
            'work-table':workTable
        },
        template: tpl,
        data:initDataModel,
        watch:{
            'queryYear':function (val,old) {
                if(val!==old){
                    this.tableModel.work.query.year=val.getFullYear();
                    this.queryWorkTable()
                }
            }
        },
        methods: {
            newVO: newVO,
            afterInitData: function() {
                var vo=this.mainModel.vo;
                this.tableModel.work.query.userId=vo.id;
                this.tableModel.work.query.year=this.queryYear=(new Date().getFullYear()).toString();
                vo.sexText=LIB.getDataDic("sex",vo.sex);
                var _positionText="";
                if(vo.positionList){
                    _positionTextList=vo.positionList.map(function (item) {
                        return   item.name;
                    });
                    _positionText=_positionTextList.join(',');
                }
                vo.positionText=_positionText;
                this.$refs.trainingTable.doQuery({userId:vo.id});
                this.queryWorkTable();
            },
            queryWorkTable:function (){
                var _this=this;
                var query=this.tableModel.work.query;
                var year = query.year;
                this.$api.getWork(query).then(function (result) {
                    // var sortdata=result.data.personnelPoolRecordBeans.sort(function (a,b) {
                    //     return  a.time.match(/(\d+)月/)[1]-b.time.match(/(\d+)月/)[1];
                    // });
                    var data = {};
                    result.data.personnelPoolRecordBeans.forEach(function(item){
                        data[item.time] = item;
                    });
                    var sortdata = [];
                    for (var i = 1; i < 13; i++) {
                        if(data[year + '年' + i + '月']){
                            sortdata.push(data[year + '年' + i + '月']);
                        }else{
                            sortdata.push({total:'0',done:'0',time:year + '年' + i + "月"})
                        }
                    }
                    result.data.personnelPoolRecordBeans=sortdata;
                    _this.tableModel.work.data=result.data;
                })
            }
        },

        init: function(){
            this.$api = api;
        },

        created: function () {

        },

    });

    return detail;
});