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
    LIB.registerDataDic("irf_wastewater_equi_record_run_flag", [
        ["1", "是"],
        ["0", "否"]
    ]);


    var initDataModel = function () {
        return {
            moduleCode: "sEew",
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
                    url: "wastewaterequirecord/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            title: "点位",
                            width: 150,
                            fieldName: "position",
                            filterType: "text"
                        },
                        {
                            title: "设备名称",
                            width: 150,
                            fieldName: "name",
                            filterType: "text"
                        },
                        {
                            title: "开启时间",
                            fieldName: "startDate",
                            filterType: "date"
                        },
                        {
                            title: "关闭时间",
                            fieldName: "closeDate",
                            filterType: "date"
                        },
                        {
                            title: "取样日期",
                            fieldName: "sampleDate",
                            filterType: "date"
                        },
                        {
                            //是否运行 1:是,0:否
                            title: "是否运行",
                            fieldName: "runFlag",
                            orderName: "runFlag",
                            filterName: "criteria.intsValue.runFlag",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("irf_wastewater_equi_record_run_flag"),
                            render: function (data) {
                                return LIB.getDataDic("irf_wastewater_equi_record_run_flag", data.runFlag);
                            }
                        },
                        {
                            title: "情况描述",

                            fieldName: "description",
                            filterType: "text"
                        },
                        {
                            title: "处理水量/t",
                            width: 120,
                            fieldName: "waterQuantity",
                            renderClass: "textarea text-center",
                            filterType: "number"
                        },
                        {
                            title: "加药量/kg",
                            filterType: "text",
                            render:function(){
                                return '请先配置指标'
                            },
                        },
                        {
                            title: "污泥排放量/kg",
                            width: 100,
                            fieldName: "sludgeQuantity",
                            renderClass: "textarea text-center",
                            filterType: "number"
                        },
                        {
                            title: "出水监测数据（mg/L，pH值无量纲）",
                           
                            filterType: "text",
                            render:function(){
                                return '请先配置指标'
                            },
                        },
                        {
                            title: "操作人",
                            width: 100,
                            fieldName: "operator",
                            filterType: "text"
                        },

                        {
                            title: "填报人",
                            width: 100,
                            fieldName: "reporter",
                            filterType: "text"
                        },

                        LIB.tableMgr.column.remark,
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        // LIB.tableMgr.column.disable,
                        // LIB.tableMgr.column.company,
                        // LIB.tableMgr.column.dept,
                        // LIB.tableMgr.column.modifyDate,
                        // LIB.tableMgr.column.createDate,
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            importModel: {
                url: "/wastewaterequirecord/importExcel",
                templeteUrl: "/wastewaterequirecord/importExcelTpl/down",
                importProgressShow: false
            },
            exportModel: {
                url: "/wastewaterequirecord/exportExcel",
                withColumnCfgParam: true
            },
            cmps:[],
            dosage:[],
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
                    this.importModel.templeteUrl ='/wastewaterequirecord/importExcelTpl/down?orgId='+this.compId
                }else{
                    this.importModel.templeteUrl ='/wastewaterequirecord/importExcelTpl/down'
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
            doCompanyChange: function (val) {
                var compId = ''
                // if (val.nodeVal == '所有公司') {
                //     compId = LIB.user.compId
                    
                // }else{
                    compId = val.nodeId
                
                this.compId =compId
                var query={}
                var _this = this
                query["criteria.intsValue"] =  JSON.stringify({"target":[1,3]});
                query['compId']=compId
               
                api.queryFieldName(query).then(function (res) {
                    _this.dosage=[]
                    _this.cmps=[]
                    var json =res.data.list
                    var children = []
                    var children1 = []
                    _.each(json, function (data) {
                        item= JSON.parse(data.detail) 
                        if (data.target==1) {
                            _.each(item,function(obj){
                                if (obj.status==1) {
                                    children.push({
                                        title: obj.title,
                                        fieldName: obj.fieldName,
                                        render:function(data){
                                            var strdata=""
                                            if (data[obj.fieldName]) {
                                                strdata=data[obj.fieldName]+'kg'
                                            }
                                            
                                            return strdata
                                        },
                                        width: 100,
                                       
                                    })
                                    _this.cmps.push(obj)
                                }
                           
                            })
                        }else{
                            
                            _.each(item,function(obj){
                                if (obj.status==1) {
                                    children1.push({
                                        title: obj.title,
                                        fieldName: obj.fieldName,
                                        render:function(data){
                                            var strdata=""
                                        if (data[obj.fieldName]) {
                                            strdata=data[obj.fieldName]
                                        }
                                            if (obj.title != 'PH'&&data[obj.fieldName]) {
                                                strdata+='mg/L'
                                            }
                                                
                                            if (obj.toplimit&&obj.botlimit) {
                                                if (obj.toplimit<data[obj.fieldName]||obj.botlimit>data[obj.fieldName]) {
                                                    return '<span style="color:red">'+strdata+'</span>'
                                                }else {
                                                    return strdata
                                                }
                                            }else if (!obj.toplimit) {
                                                if (obj.botlimit>data[obj.fieldName]) {
                                                    return '<span style="color:red">'+strdata+'</span>'
                                                }else {
                                                    return strdata
                                                }
                                            }else if (!obj.botlimit) {
                                                if (obj.toplimit<data[obj.fieldName]) {
                                                    return '<span style="color:red">'+strdata+'</span>'
                                                }else {
                                                    return strdata
                                                }
                                            }
                                        },
                                        renderTitle:'',
                                        width: 100,
                                        
                                    })
                                    _this.dosage.push(obj)
                                }
                           
                            }) 
                        }
                       
                       
                      
                    })
                    
                    if (children.length==0) {
                        delete  _this.tableModel.columns[10].children  
                         LIB.Msg.info('请先配置加药量指标')
                    }else{
                        _this.tableModel.columns[10].children = children
                    }
                    if (children1.length==0) {
                        delete  _this.tableModel.columns[12].children
                         LIB.Msg.info('请先配置出水监测指标')
                    }else{
                        _this.tableModel.columns[12].children = children1
                    }
                   
                    _this.$refs.mainTable.refreshColumns()
                    _this.$refs.mainTable.doQuery({orgId:compId})
                })
            },
            doImport: function () {
                this.importModel.importProgressShow = true;
            },
            doDownFile: function () {
                window.open(this.importModel.templeteUrl);
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
