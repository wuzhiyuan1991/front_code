define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));

    var configModal = require("./dialog/configModel")
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");

    var checkTrue = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox ivu-checkbox-checked"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input  type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
    var checkFalse = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input  type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'


    var initDataModel = function () {
        return {
            moduleCode: "riskMapConfig2",
            modelList: [],
            showConfig:false,
            modelRiskModel: {
                list:[],
                id:null
            },
            baseTableModel:{
                list:[],
                columns: [
                    {
                        title: "名称",
                        fieldName: "name",
                        filterType: "text"
                    },
                    {
                        title: "颜色",
                        // fieldName: "colorMark",
                        filterType: "text",
                        render: function (data) {
                            return "<div style='width:20px;height: 20px;background:"+"#"+data.color+"'></div>"
                        }
                    },
                    {
                        title: "最低风险等级",
                        // fieldName: "colorMark",
                        filterType: "text",
                        render: function (data) {
                            if(data.attr1 == '1'){
                                return checkTrue;
                            }else{
                                return checkFalse;
                            }
                        },
                        event:true
                    }
                ],
            },
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
                    show: false,
                    list: [],
	                columns: [
                        // LIB.tableMgr.column.company,
                        {
                          title: "公司名称",
                            fieldName: "compName",
                            width:"200px"
                        },
                        {
							//名称
							title: "评估模型名称",
							fieldName: "modelName",
							// keywordFilterName: "criteria.strValue.keyWordValue_name",
							filterType: "text",
                            width:"200px"
						},
                        {
                            title: "名称",
                            fieldName: "name",
                            filterType: "text",
                            width:"120px"
                        },
                        {
                            title: "颜色",
                            // fieldName: "colorMark",
                            filterType: "text",
                            render: function (data) {
                                return "<div style='width:20px;height: 20px;background:"+"#"+data.color+"'></div>"
                            },
                            width:"50px"
                        },
                        {
                            event:true,
                            title: '',
                            render: function (data) {
                                
                            }
                        }
	                ]
	            }
            ),
            configModel:{
                show:false
            },
        };
    };

    var vm = LIB.VueEx.extend({
		// mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    	template: tpl,
        data: initDataModel,
        components: {
    	    "configModal":configModal
        },
        watch: {
    	    "modelRiskModel.id": function (val) {
    	        this.showConfig = false;
                this.queryRiskmodel(val);
                this.queryOtheerRiskModelList(val);
            }
        },
        methods: {
            onRowClicked:function (row, e, index, num) {
                var _this = this;
                if(index == 2){
                    _.each(this.baseTableModel.list, function (item) {
                        item.attr1 = '0';
                    })
                    this.baseTableModel.list[num].attr1 = '1';
                }
                this.$set("baseTableModel.list", this.baseTableModel.list);
            },
            getClickFn: function (data, e) {
                if(e.target && e.target.tagName == 'SPAN'){
                    var target = $(e.target).find('input')[0];
                    if(target){
                        var obj = _.find(this.tableModel.list, function (item) {
                            return item.latRangeId == target.name;
                        });
                        if(obj) {

                            obj.value = target.value;
                            var tem = _.find(this.baseTableModel.list, function (item) {
                                return item.value == obj.value;
                            });
                            if(tem){
                                debugger
                                obj.attr3 = tem.color;
                                obj.attr2 = tem.name;
                            }
                            target.click();
                        }
                    }
                }

                if(e.target && e.target.tagName == 'INPUT'){
                    var target = e.target;
                    var obj = _.find(this.tableModel.list, function (item) {
                       return item.latRangeId == target.name;
                    });
                    if(obj) {
                        obj.value = target.value;
                        var tem = _.find(this.baseTableModel.list, function (item) {
                            return item.value == obj.value;
                        });
                        if(tem){
                            obj.attr3 = tem.color;
                            obj.attr2 = tem.name;
                        }
                        target.click();
                    }
                }
            },
            gotoConfig: function () {
                this.$refs.configModal.init(this.baseTableModel.list, this.tableModel.list);
                this.configModel.show = true;
            },
            queryRiskList: function (val) {
                var _this = this;
                api.queryRiskList().then(function (res) {
                    if(res.data){
                        _this.modelRiskModel.list = res.data;
                        if(_this.modelRiskModel.list.length>0 && val){
                            _this.queryRiskmodel(_this.modelRiskModel.list[parseInt(val)].id);
                        }
                    }
                })
            },

            queryRiskmodel: function (id) {
                var _this = this;
                this.modelRiskModel.id = id;
                this.tableModel.show = false;
                api.queryRiskmodel({id:id}).then(function (res) {
                    _this.baseTableModel.list = [];
                    _this.tableModel.columns[4].render = null;
                    if(res.data){
                        var risks = res.data;
                        var compName = LIB.getDataDic("org", risks.compId)['compName'];
                        _this.baseTableModel.list = _.map(res.data.gradeLatRanges, function (item) {
                            return {
                                // id: item.id,
                                // value: item.attr1,
                                // name: item.level,
                                // type: '1',
                                // color:item.colorMark,
                                // latRangeId:item.id
                                attr1: '0',
                                color:item.colorMark,
                                modelName: risks.name,
                                compId: risks.compId,
                                compName: compName,
                                modelId: risks.id,
                                value: item.attr1,
                                type: '1',
                                name: item.level,
                                latRangeId:item.id
                            }
                        });

                        _this.updateColumns()
                        _this.tableModel.show = true;
                    }
                });
            },

            updateColumns: function () {
                var _this = this;
                _this.tableModel.columns[4].render = function (data) {
                    var str = '<div style="display: flex;align-items: center;flex-wrap: wrap;">';
                    for(var i=0; i<_this.baseTableModel.list.length; i++){
                        var item = _this.baseTableModel.list[i];
                        str += '<span style="margin-left:15px;display: inline-block;vertical-align: top;" class="input-span-wrap"><input style="vertical-align: bottom;margin-bottom: 5px;margin-right:3px;" type="radio" name="'+ data.latRangeId +'"'+(item.value == data.value?'checked':'')+' value="'+item.value+'" >' + item.name + '</input></span>'
                    }
                    str+="</div>"
                    return str;
                }
            },

            queryConfigList: function () {
                var _this = this;
                api.queryConfigList().then(function (res) {
                    if(res.data){
                        _this.showConfig = true;
                        _this.baseTableModel.list = _.filter(res.data, function (item) {
                            return item.type == '1'
                        });
                        _this.updateColumns();
                        _this.tableModel.list = _.filter(res.data, function (item) {
                            return item.type == '2'
                        });
                    }
                })
            },

            doSaveConfig: function () {
                var _this = this;

                var isTrue = true;
                var isSelect = false;
                _.each(this.tableModel.list, function (item) {
                    if(!item.value) isTrue = false;
                    if(item.attr1 == '1') isSelect = true;
                });
                _.each(this.baseTableModel.list, function (item) {
                    if(item.attr1 == '1') isSelect = true;
                });
                if(!isTrue) {LIB.Msg.info("请勾选相关配置"); return ;}
                if(!isSelect) {LIB.Msg.info("请勾选最低风险等级"); return ;}


                var tempList = [].concat(this.baseTableModel.list, this.tableModel.list);
                api.saveConfig(null, tempList).then(function (res) {
                    LIB.Msg.info("保存成功");
                    _this.queryConfigList();
                });
            },

            upDateSelect: function () {

            },

            queryOtheerRiskModelList: function (id) {
                var _this = this;
                LIB.globalLoader.show();
                api.queryOtherRiskModelList().then(function (res) {
                    _this.tableModel.list = [];
                    if(res.data && res.data.length>0){
                        _.each(res.data, function (risks) {
                            _.each(risks.gradeLatRanges, function (item) {
                                var compName = LIB.getDataDic("org", risks.compId)['compName'];
                                _this.tableModel.list.push({
                                    color:item.colorMark,
                                    modelName: risks.name,
                                    compId: risks.compId,
                                    compName: compName,
                                    modelId: risks.id,
                                    value: '',
                                    type: '2',
                                    name: item.level,
                                    latRangeId:item.id
                                });
                            });
                        });
                        LIB.globalLoader.hide();
                        _this.$set("tableModel.list",_this.tableModel.list);
                    }
                });
            }
        },
        events: {
        },
        init: function(){
        	this.$api = api;
        },
        ready: function () {
            this.queryRiskList();
            this.queryConfigList();
        }
    });

    return vm;
});
