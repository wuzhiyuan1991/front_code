define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
    //	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
    //  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"

    //Legacy模式
    //	var ltLpSupFormModal = require("componentsEx/formModal/ltLpSupFormModal");
    LIB.registerDataDic("risk_scop", [
        ["1", "排放点"],
        ["2", "本地区"],
        ["3", "区域外"]
    ]);
    LIB.registerDataDic("risk_frequency", [
        ["1", "每周以上一次"],
        ["2", "每天"],
        ["3", "连续"]
    ]);
    LIB.registerDataDic("risk_sustain", [
        ["1", "8小时以下"],
        ["2", "8至24小时"],
        ["3", "24小时"]
    ]);
    LIB.registerDataDic("risk_score", [
        ["1", "重大"],
        ["0", "一般"]
    ]);
    var date = new Date()
    var year = date.getFullYear() + ''

    var initDataModel = function () {
        return {
            moduleCode: "sMRISK",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
                //				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "envirfactor/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            title: "单位",
                            width: 100,
                            fieldName: "office",
                            filterType: "text"
                        },
                        {
                            title: "作业名称",
                            fieldName: "name",
                            width: 150,
                            filterType: "text"
                        },
                        {
                            //环境因素
                            title: "环境因素",
                            fieldName: "envFactor",
                            filterType: "text"
                        },
                        {
                            title: "环境影响",
                            filterType: "text",
                            render:function(){
                                return '请先配置指标'
                            },
                            
                        },
                        {
                            //污染物成分
                            title: "污染物成分",
                            fieldName: "composition",
                            filterType: "text"
                        },

                        {
                            //持续时间,3：24小时，2：8至24小时，1：8小时以下
                            title: "持续时间",
                            fieldName: "sustain",
                            render: function (data) {
                                return LIB.getDataDic("risk_sustain", data.sustain)

                            },
                            filterType: "enum",
                            fieldType: "custom",
                            filterName: "criteria.intsValue.sustain",
                            popFilterEnum: LIB.getDataDicList("risk_sustain"),
                        },
                        {
                            //发生频率，3.连续，2.每天，3.每周以上一次
                            title: "发生频率",
                            fieldName: "frequency",
                            render: function (data) {
                                return LIB.getDataDic("risk_frequency", data.frequency)

                            },
                            filterType: "enum",
                            fieldType: "custom",
                            filterName: "criteria.intsValue.frequency",
                            popFilterEnum: LIB.getDataDicList("risk_frequency"),
                        },
                        {
                            //影响规模，3.区域外,2.本地区,1排放点
                            title: "影响规模",
                            fieldName: "scop",
                            render: function (data) {
                                return LIB.getDataDic("risk_scop", data.scop)

                            },
                            filterType: "enum",
                            fieldType: "custom",
                            filterName: "criteria.intsValue.scop",
                            popFilterEnum: LIB.getDataDicList("risk_scop"),
                        },
                        {
                            //评价,一般：1-12分;重大：12分以上
                            title: "评价",
                            fieldName: "score",
                            render: function (data) {
                                return LIB.getDataDic("risk_score", data.score)

                            },
                            filterType: "enum",
                            fieldType: "custom",
                            filterName: "criteria.intsValue.score",
                            popFilterEnum: LIB.getDataDicList("risk_score"),
                        },
                        {
                            //目前控制措施
                            title: "目前控制措施",
                            fieldName: "measures",
                            filterType: "text",
                            renderClass: 'textarea'
                        },

                        // LIB.tableMgr.column.disable,
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        // LIB.tableMgr.column.modifyDate,
                        // LIB.tableMgr.column.createDate,
                    ],
                    defaultFilterValue: {
                        year: year
                    }
                }
            ),
            detailModel: {
                show: false
            },
            importModel: {
                url: "/envirfactor/importExcel",
                templeteUrl: "/envirfactor/importExcelTpl/down",
                importProgressShow: false
            },
            exportModel: {
                url: "/envirfactor/exportExcel",
                withColumnCfgParam: true
            },
            year: year,
            json:[] ,
            compId:''

            //Legacy模式
            //			formModel : {
            //				ltLpSupFormModel : {
            //					show : false,
            //				}
            //			}

        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        //Legacy模式
        //		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            //Legacy模式
            //			"ltlpsupFormModal":ltLpSupFormModal,

        },
        watch:{
            'importModel.importProgressShow':function(val){
                if (val) {
                    this.importModel.templeteUrl ='/envirfactor/importExcelTpl/down?orgId='+this.compId
                }else{
                    this.importModel.templeteUrl ='/envirfactor/importExcelTpl/down'
                }
                
            }
        },
        methods: {
            //Legacy模式
            //			doAdd : function(data) {
            //				this.formModel.ltLpSupFormModel.show = true;
            //				this.$refs.ltlpsupFormModal.init("create");
            //			},
            //			doSaveLtLpSup : function(data) {
            //				this.doSave(data);
            //			}
            changeQryYear: function (val) {
                this.$refs.mainTable.doQuery({ year: val })
            },
            doImport: function () {
                this.importModel.importProgressShow = true;
                
            },
            doDownFile: function () {
                window.open(this.importModel.templeteUrl);
            },
            doCompanyChange: function (val) {
                var compId = ''
                // if (val.nodeVal == '所有公司') {
                //     compId = LIB.user.compId
                    
                // }else{
                    compId = val.nodeId
                // }
                this.compId=compId
                var query={}
                var _this = this
                query["criteria.intsValue"] =  JSON.stringify({"target":[0]});
                query['compId']=compId
               
                api.queryFieldName(query).then(function (res) {
                    _this.json=[]
                    var json =res.data.list
                   
                    var children = []
                    _.each(json, function (data) {
                        
                        item= JSON.parse(data.detail) 
                        _.each(item,function(obj){
                            if (obj.status==1) {
                                children.push({
                                    title: obj.title,
                                    fieldName: obj.fieldName,
                                    renderClass: "textarea text-center",
                                    width: 100,
                                    render: function (data) {
                                        if (data[obj.fieldName] == 1) {
                                            return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span></span><span></span></label>'
                                        } else {
                                            return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                                        }
                                    },
                                })
                                _this.json.push(obj)
                            }
                       
                        })
                      
                    })
                    if (json.length==0) {
                       
                        delete  _this.tableModel.columns[5].children  
                         LIB.Msg.info('请先配置指标')
                    }else{
                        _this.tableModel.columns[5].children = children
                    }
                    
                    _this.$refs.mainTable.refreshColumns()
                    _this.$refs.mainTable.doQuery({orgId:compId})
                   
                })
            },
        },
        events: {
        },
        init: function () {
            this.$api = api;
        },
     

    });

    return vm;
});
