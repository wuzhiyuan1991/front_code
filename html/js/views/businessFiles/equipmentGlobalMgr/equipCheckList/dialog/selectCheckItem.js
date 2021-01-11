define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./selectCheckItem.html");

    var newVO = function () {
        return {
            id: null,
            itemOrderNo: null,
            groupOrderNo: null,
            groupId: null,
            groupName: null,
            checkItemId: null,
            checkTableId: null,
            itemList: [],
            checkItemList: [],//已经关联的检查项集合
            tirId: null//edit页面传过来的，保存分组信息，如果edit页面没有任何检查项，当前页面需删除后再关联checkItem
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO()
        },
        resetTriggerFlag: false,
        checkItemColumns: [
            {
                title: "checkbox",
                fieldName: "id",
                fieldType: "cb"
            },
            {
                title: "检查项内容",
                fieldName: "name",
                width: 480
            },
            {
                title: "分类",
                fieldType: "custom",
                render: function (data) {
                    if (data.riskType) {
                        return data.riskType.name;
                    }
                },
                width: 160
            },
            {
                title: "类型",
                fieldType: "custom",
                render: function (data) {
                    if (data.type == 2) {
                        return "管理类";
                    } else if (data.type == 1) {
                        return "状态类";
                    } else if (data.type == 0) {
                        return "行为类";
                    }
                },
                width: 80
            },
            {
                title: "风险点",
                fieldType: "custom",
                render: function (data) {
                	if(data.riskAssessments){
                        var riskPoints = "";
                        data.riskAssessments.forEach(function (e) {
                            if(e.riskPoint){
                            	riskPoints += (e.riskPoint + " , ");
                            }
                        });
                        riskPoints = riskPoints.substr(0, riskPoints.length - 2);
                        return riskPoints;

                    }
                	
                    
                }
            },
            {
                title: "风险点类型",
                fieldType: "custom",
                render: function (data) {
                	if(data.riskAssessments){
                        var checkObjTypeNames = "";
                        data.riskAssessments.forEach(function (e) {
                            if(e.checkObjType){
                            	var checkObjTypeName = LIB.getDataDic("check_obj_risk_type", e.checkObjType);
                            	if(checkObjTypeNames.indexOf(checkObjTypeName) == -1 )
                            	checkObjTypeNames += (LIB.getDataDic("check_obj_risk_type", e.checkObjType) + " , ");
                            }
                        });
                        checkObjTypeNames = checkObjTypeNames.substr(0, checkObjTypeNames.length - 2);
                        return checkObjTypeNames;

                    }
                }
            },
            {
                title: "重点关注类型",
                fieldType: "custom",
                render: function (data) {
                	if(data.riskAssessments){
                        var focusTypeNames = "";
                        data.riskAssessments.forEach(function (e) {
                            if(e.focusType){
                            	var focusTypeName = LIB.getDataDic("special_type", e.focusType);
                            	if(focusTypeNames.indexOf(focusTypeName) == -1 )
                            		focusTypeNames += (focusTypeName + " , ");
                            }
                        });
                        focusTypeNames = focusTypeNames.substr(0, focusTypeNames.length - 2);
                        return focusTypeNames;

                    }
                }
            },
        ],
        url: "checkitem/list{/curPage}{/pageSize}?_bizModule=selectModal",
        defaultFilterValue: {"disable": 0},
        selectedDatas: [],
        filterColumn: ["criteria.strValue.keyWordValue"]
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
    var selectDialog = LIB.Vue.extend({
    	mixins: [LIB.VueMixin.dataDic],
        template: tpl,
        data: function () {
            return dataModel;
        },
        methods: {
            doSave: function () {
                //	var _this = this;
                //	if(dataModel.selectedDatas){
                //		var arr = [];
                //		dataModel.selectedDatas.forEach(function(e){
                //			//判断是否已经关联
                //			var checkItemList = dataModel.mainModel.vo.checkItemList;
                //			var i = checkItemList.length;
                //			var exist = false;
                //			while(i--){
                //				if(e.id == checkItemList[i].id){
                //					exist = true;
                //					break;
                //				}
                //			}
                //			if(!exist){
                //				var _vo = {};
                //				_vo.itemOrderNo = 0;
                //				_vo.groupOrderNo = dataModel.mainModel.vo.groupOrderNo;
                //				_vo.groupName = dataModel.mainModel.vo.groupName;
                //				_vo.checkTableId = dataModel.mainModel.vo.checkTableId;
                //				_vo.itemOrderNo = 0;
                //				_vo.checkItemId = e.id;
                //				arr.push(_vo);
                //			}
                //		});
                //		if(arr.length >0){
                //			//如果是edit页面分组还没有任何项，删除保存的分组记录
                //			if(dataModel.mainModel.vo.itemList.length == 0){
                //				api.delTableItemRel(null,new Array(dataModel.mainModel.vo.tirId));
                //			}
                //			var callback = function(res){
                //				_this.$dispatch("ev_selectItemFinshed",dataModel.mainModel.vo.checkTableId);
                //				LIB.Msg.info("保存成功");
                //			}
                //			api.batchCreateTableItemRel(null,arr).then(callback);
                //		}else{
                //			_this.$dispatch("ev_selectItemCanceled");
                //		}
                //	}
                this.$dispatch("ev_selectItemFinshed", dataModel);
            }


        },
        events: {
            //select框数据加载
            "ev_selectItemReload": function (checkTable, tir) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _data = dataModel.mainModel;
                var _vo = dataModel.mainModel.vo;
                //清空数据
                _.extend(_vo, newVO());

                //初始化数据
                if (tir) {
                    _.deepExtend(_vo, tir);
                    //_vo.group = tir;
                }
                //赋值
                _vo.tirId = tir.id;
                _vo.groupId = tir.groupId;
                _vo.itemList = tir.itemList;
                _vo.checkTableId = checkTable.id;
                _vo.checkItemList = checkTable.checkItemList;
                var excludeIds = _.map(tir.itemList,function(item){
                	return item.id;
                });
                var params = [
                    {
                        type: "save",
                        value: {
                            columnFilterName : "disable",
                            columnFilterValue :  0
                        }
                    },
                    {
                        type: "save",
                        value: {
                            columnFilterName : "orgId",
                            columnFilterValue :  checkTable.compId
                        }
                    },
                    {
	                      type: "save",
	                      value: {
	                          columnFilterName : "criteria.strsValue",
	                          columnFilterValue :  {excludeIds: excludeIds}
	                      }
	                  }
//                    ,
//                    {
//                        type: "save",
//                        value: {
//                            columnFilterName : "criteria.intValue",
//                            columnFilterValue :  {checkObjType: checkTable.checkObjType}
//                        }
//                    }
                ];
//                if (checkTable.focusType) {
//                    params[2].value.columnFilterValue.focusType = checkTable.focusType;
//                }

                this.$refs.table.doCleanRefresh(params);
                //重置table
                // this.resetTriggerFlag = !this.resetTriggerFlag;
            }
        }
    });

    return selectDialog;
});