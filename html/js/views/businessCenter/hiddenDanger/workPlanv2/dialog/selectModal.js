define(function(require) {
    var template = require("text!./selectModal.html");
    var LIB = require('lib');

    var component = {
        template: template,
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
            },
            showCollect: {
                type: Boolean,
                default: false
            },
            removeColumns:{//需要去掉的列  这样可以共一个组件，通过这个prop控制显示列的不同 eg:['code']表示去掉code列
                type:Array,
            }

        },
        watch : {
            visible : function(val) {
                if(val){
                    this.filterKey = null;
                    this.doCleanFilter();
                }
            }
        },
        methods:{
            doFilter:function () {
                this.doCleanRefresh();
            },
            doCleanFilter:function () {
                var tableFilterDatas = [];
                this.$refs.table.doClearData()
                var tableFilterData = {
                    type :　"save",
                    value : {
                        columnFilterName : "criteria.strValue.keyWordValue_name",
                        columnFilterValue : this.filterKey
                    }
                };
                tableFilterDatas.push(tableFilterData);

                this.$refs.table.doQueryByFilter(tableFilterDatas);
            },
            doRemoveFilter:function() {
                var tableFilterDatas = [];
                this.$refs.table.doClearData()
                var tableFilterData = {
                    type :　"remove",
                    value : {
                        columnFilterName : "criteria.strValue.keyWordValue_name",
                        columnFilterValue : this.filterKey
                    }
                };
                console.log(tableFilterData)
                tableFilterDatas.push(tableFilterData);

                this.$refs.table.doQueryByFilter(tableFilterDatas);
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
        ready:function(){
            var _this=this;
            var columns=_this.tableModel.columns;
            if(_this.removeColumns&&columns){
                _this.tableModel.columns=columns.filter(function (item) {
                    return !_.includes(_this.removeColumns,item.fieldName);
                })
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
            // 必须深度克隆
            var checkColumnOpt = _.cloneDeep(this.tableModel.columns[0]);
            if(checkColumnOpt.fieldType !== selectType && (checkColumnOpt.fieldType === "cb" || checkColumnOpt.fieldType === "radio")) {
                checkColumnOpt.fieldType = selectType;
                this.tableModel.columns.splice(0, 1, checkColumnOpt)
            }

            //只有两列时，无需resize
            if(this.tableModel.columns.length != 2) {
                this.tableModel.resizeable = true;
            } else {
                this.tableModel.resizeable = false;
            }
        }
    }

    return component;
});