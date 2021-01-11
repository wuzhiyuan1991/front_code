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


    var initDataModel = function () {
        return {
            moduleCode: "sEdwater",
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
                    url: "wastewaterdectction/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        // {
                        // 	title: "设备名称",
                        //    width: 150,
                        // 	fieldName: "eqName",
                        // 	filterType: "text"
                        // },
                        {
                            //点位
                            title: "点位",
                            fieldName: "position",
                            filterType: "text"
                        },
                        {
                            //取样时间
                            title: "取样时间",
                            fieldName: "sampleDate",
                            filterType: "date"
                            //						fieldType: "custom",
                            //						render: function (data) {
                            //							return LIB.formatYMD(data.sampleDate);
                            //						}
                        },
                        // {
                        //     title: "开启时间",
                        //     fieldName: "startDate",
                        //     filterType: "text"
                        // },
                        // {
                        //     title: "关闭时间",
                        //     fieldName: "endDate",
                        //     filterType: "text"
                        // },
                        // {
                        //     title: "是否运行",
                        //     width: 100,
                        //     fieldName: "isWork",
                        //     filterType: "text"
                        // },
                        // {
                        //     title: "情况描述",
                        //     width: 100,
                        //     fieldName: "desc",
                        //     filterType: "text"
                        // },
                        // {
                        //     title: "处理水量/t",
                        //     width: 120,
                        //     fieldName: "waterAmount",
                        //     renderClass: "textarea text-center",
                        //     filterType: "text"
                        // },
                        // {
                        //     title: "加药量/kg",
                        //     filterType: "text",
                        //     "children": [
                        //         {
                        //             title: "高分子",
                        //             width: 100,
                        //             fieldName: "addMed1",
                        //             renderClass: "textarea text-center",
                        //             filterType: "text"
                        //         },
                        //         {
                        //             title: "氯化铝",
                        //             width: 100,
                        //             fieldName: "addMed2",
                        //             renderClass: "textarea text-center",
                        //             filterType: "text"
                        //         },
                        //         {
                        //             title: "氢氧化钠",
                        //             width: 100,
                        //             fieldName: "addMed3",
                        //             renderClass: "textarea text-center",
                        //             filterType: "text"
                        //         },
                        //     ]
                        // },
                        // {
                        //     title: "污泥排放量/kg",
                        //     width: 100,
                        //     fieldName: "mudAmount",
                        //     renderClass: "textarea text-center",
                        //     filterType: "text"
                        // },
                        {
                            title: "出水监测数据（mg/L，pH值无量纲）",
                            
                            filterType: "text",
                            render:function(){
                                return '请先配置指标'
                            },
                        },
                        // {
                        //     title: "操作人",
                        //     width: 100,
                        //     fieldName: "opUser",
                        //     filterType: "text"
                        // },

                    	{
                            //填报人
                            title: "填报人",
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
                url: "/wastewaterdectction/importExcel",
                templeteUrl: "/wastewaterdectction/importExcelTpl/down",
                importProgressShow: false
            },
            exportModel: {
                url: "/wastewaterdectction/exportExcel",
                withColumnCfgParam: true
            },
            json:[],
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
                    this.importModel.templeteUrl ='/wastewaterdectction/importExcelTpl/down?orgId='+this.compId
                }else{
                    this.importModel.templeteUrl ='/wastewaterdectction/importExcelTpl/down'
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
                // }
                this.compId=compId
                var query={}
                var _this = this
                query["criteria.intsValue"] =  JSON.stringify({"target":[3]});
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
                                    render:function(data){
                                        var strdata=""
                                        if (data[obj.fieldName]) {
                                            strdata=data[obj.fieldName]
                                        }
                                       
                                        if (obj.title!='PH'&&data[obj.fieldName]) {
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
                                _this.json.push(obj)
                            }
                       
                        })
                      
                    })
                    if (children.length==0) {
                        delete  _this.tableModel.columns[4].children
                         LIB.Msg.info('请先配置出水监测指标')
                    }else{
                        _this.tableModel.columns[4].children = children
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
