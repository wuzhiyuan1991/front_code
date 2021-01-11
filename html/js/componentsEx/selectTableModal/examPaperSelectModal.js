define(function(require) {
    var LIB = require('lib');
    var template = require("text!./examPaperSelectModal.html");

    var initDataModel = function () {
        return {
            mainModel:{
                title:"选择",
                selectedDatas:[]
            },
            tableModel: (
                {
                    url: "exampaper/simplelist{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    },
                        // {
                        // 	//唯一标识
                        // 	title: "编码",
                        // 	fieldName: "code",
                        //    width: 160
                        // },
                        {
                            //试卷名称
                            title: "试卷名称",
                            fieldName: "name",
                            width: 240
                        },
                        _.omit(LIB.tableMgr.column.company, "filterType"),
                        {
                            title:"组卷方式",
                            fieldType : "custom",
                            render : function(data){
                                return LIB.getDataDic("paper_create_type",data.attr2);
                            },
                        },
                        //LIB.tableMgr.column.company,
//					 LIB.tableMgr.column.company,
////					{
//						//禁用标识， 1:已禁用，0：未禁用，null:未禁用
//						title: "禁用标识，",
//						fieldName: "disable",
//					},
//					{
//						//试卷描述
//						title: "试卷描述",
//						fieldName: "info",
//					},
//					{
//						//试题总数
//						title: "试题总数",
//						fieldName: "qstCount",
//					},
                        {
                            //限制答题的时间 单位分钟
                            title: "考试时长",
                            fieldName: "replyTime",
                            fieldType: "custom",
                            render: function (data) {
                                return data.replyTime + "分钟";
                            },
                        },
                        {
                            //试卷总分
                            title: "试卷总分",
                            fieldName: "score",
                            fieldType: "custom",
                            render: function (data) {
                                return data.score + "分";
                            },
                        },

//					{
//						//修改日期
//						title: "修改日期",
//						fieldName: "modifyDate",
//					},
                        {
                            //创建日期
                            title: "创建日期",
                            fieldName: "createDate",
                        },
                      /*  {
                            //创建日期
                            title: "更多",
                            fieldName: "id",
                            render: function (data) {
                                return "<span style='text-decoration: underline;' class='tableCustomIco_View'>"+ "预览" + "</span>"
                            },
                        },*/
                    ],

                    defaultFilterValue : {"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"}},
                    resetTriggerFlag:false
                }
            )
        };
    }

    var opts = {
        template: template,
        name: "examPaperSelectModal",
        props: {
            showModelTable:{
                type: Boolean,
                default: false
            },
            //单选跟多选
            singleSelect:{
                type: Boolean,
                default:false
            },
            visible:{
                type: Boolean,
                default:false
            },
//			columns:{
//				type: Array,
//				default: function(){
//					return tableModel.columns
//				}
//			},
            dataModel:{
                type:String,
            },
            //自定义初始化过滤条件
            defaultFilterValue : {
                type: Object
            },
            isCacheSelectedData:{
                type: Boolean,
                default:true
            },
            filterData: {
                type:Object
            }
        },
        data: initDataModel,
        watch : {
            visible : function(val) {
                val && this.doCleanRefresh();
            }
        },
        methods: {
            doCleanRefresh:function() {
                var tableFilterDatas = [];
                var filterData = this.filterData;
                if(filterData) {
                    for(key in filterData) {
                        var value = filterData[key];
                        if(value != undefined && value != null && value.toString().trim() != "" ) {
                            var tableFilterData = {
                                type :　"save",
                                value : {
                                    columnFilterName : key,
                                    columnFilterValue : value
                                }
                            };
                            tableFilterDatas.push(tableFilterData);
                        }
                    }
                }
                this.$refs.table.doCleanRefresh(tableFilterDatas);
            },
            doShowModel:function(){
                this.visible = true;
                // this.resetTriggerFlag = !this.resetTriggerFlag;
            },

            //双击关闭modal
            onDbClickCell:function(){
                if(this.singleSelect){
                    this.visible=false;
                    // this.resetTriggerFlag=!this.resetTriggerFlag;
                    this.$emit('do-save',this.mainModel.selectedDatas);
                }
            },
            doPreview:function(){
                if(this.mainModel.selectedDatas.length ==0){
                    LIB.Msg.warning("请选择数据");
                    return
                }
                //this.visible=false;
                this.$emit('do-preview',this.mainModel.selectedDatas);
			},
            doSave:function(){
                if(this.mainModel.selectedDatas.length ==0){
                    LIB.Msg.warning("请选择数据");
                    return
                }
                this.visible=false;
                // this.resetTriggerFlag=!this.resetTriggerFlag;
                this.$emit('do-save',this.mainModel.selectedDatas);
            }
        },
        beforeCompile:function() {
            if(!!this.tableModel) {
                //增加弹窗列表选择框的默认过滤列查询条件criteria.strValue.keyWordValue
                this.tableModel.filterColumn = this.tableModel.filterColumn || [];
                this.tableModel.filterColumn = _.union(this.tableModel.filterColumn, ["criteria.strValue.keyWordValue"]);
            }
        },
        created:function(){
            var selectType = "cb";
            if(this.singleSelect) {
                this.isCacheSelectedData = false;
                selectType = "radio";
            } else {
                this.isCacheSelectedData = true;
            }
            var checkColumnOpt = this.tableModel.columns[0];
            if(checkColumnOpt.fieldType != selectType && (checkColumnOpt.fieldType == "cb" || checkColumnOpt.fieldType == "radio")) {
                checkColumnOpt.fieldType = selectType;
            }
        }
    };
    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('exam-paper-select-modal', component);
})
