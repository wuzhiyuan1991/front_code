require.config({
	baseUrl: "js",
	urlArgs: 'ver=' + Math.round(Math.random() * 99999),
	shim: {
		"lodash": {
			exports: "_"
		},
		"underscoreDeepExtend" : {
			deps: ["lodash"]//, "css!../css/basic.css"]//,"css!../css/bootstrap.css", "css!../css/basic.css"]
		}
	},
	paths: {
		'jquery':'libs/jquery/jquery-1.9.1.min',
		"lodash": "libs/lodash/3.10.1/lodash.min",
		"underscoreDeepExtend": "libs/underscore-deep-extend",
		"text": "libs/text",
		'vue':"libs/vue/vue",
		'vueResource':"libs/vue/vue-resource.min",
		'vueX':"libs/vue/vuex",
		'vueRouter':"libs/vue/vue-router",
		"popper":"libs/popper"//iview ui组件依赖
	}
});

define(function(require) {
	var CONST = require("const");
	var ctxpath = CONST.url;
	//lodash  _
	var lodash = require("lodash");
	var Vue = require("vue");
	var resource = require("vueResource");
	//iview components
	require("components/layout/iviewRow");
	require("components/layout/iviewCol");
	require("components/iviewButton");
	require("components/iviewCheckbox");
	require("components/select/iviewTreeSelect");
	require("components/tree/iviewTreeNode");
	require("components/tree/iviewTree");
	
	Vue.use(resource);
	var buildServiceUrl = function(service){
		return ctxpath + service;
	};
	var dataModel = {
			qryModel:{
				orgId:null,
				//公司列表
				orgList:[],
				//防止重复提交按钮
				qryed:false
			},
			data:null,
			tableData:null,
			mergeCellLength:6,
			totalCellLength:6
	};
	//从指定位置开始遍历集合，当回调函数返回true时,循环break，返回false时，循环continue;
	var doEach = function(list,startRow,callback){
		for(var i = startRow; i<list.length; i++){
			if(callback(list[i],i))return;
		}
	}
	//构造单元格值对象
	var cellValue = function(column,value){
		return {
			column : column,
			value : value
		};
	}
	//递归单元格补空处理
	var zeroFillRiskType = function(row){
		//危害辨识分类单元格长度,TODO 暂固定为6位,后期可能改为动态获取
		var riskTypeCellLength = 6;
		//补零位-差值
		var dValue = (riskTypeCellLength - row.length) / 2;
		if(0 < dValue){
			for(var i = dValue, level = riskTypeCellLength/2; i > 0; i--,level--){
				row.push(new cellValue("riskType"+level+"Code",""));
				row.push(new cellValue("riskType"+level+"Name",""));
			}
		}
	}
	//递归危害分类,获取表格数据组织表格数据
	var recursion = function(level, riskType, arrs, row){
		var currentRow = _.clone(row);
		currentRow.push(new cellValue("riskType"+level+"Code",riskType.code));
		currentRow.push(new cellValue("riskType"+level+"Name",riskType.name));
		if(riskType.children && level < 3){
			//获取子危害分类数据
			_.each(riskType.children,function(rt){
				recursion(level+1, rt, arrs, currentRow);
			});
		}else{
			zeroFillRiskType(currentRow);
			if(riskType.rias && riskType.rias.length > 0){
				_.each(riskType.rias,function(ria){
					var cRow = _.clone(currentRow);
					putRiaRow(ria,cRow);
					arrs.push(cRow);
				});
			}else{
				putRiaRow({},currentRow);
				arrs.push(currentRow);
			}
		}
	}
	var checkItemTypeName = function(type){
		return type === "0" ? "行为类" : type === "1" ? "状态类" : type === "2" ? "管理类" : "";
	}
	var putRiaRow = function(ria,row){
		row.push(new cellValue("riaScene",ria.scene));
		//var hazardFactor = _.extend({code:null,name:null},ria.hazardFactor);
		//row.push(new cellValue("hFCode",hazardFactor.code));
		//row.push(new cellValue("hFName",hazardFactor.name));
		/**风险模型Begin**/
		row.push(new cellValue("riskModelName",ria.riskModel));
		row.push(new cellValue("riskLevel",ria.riskLevel));
		/**风险模型End**/
		row.push(new cellValue("controlMeasures",ria.controlMeasures));
		//row.push(new cellValue("checkFrequency",ria.checkFrequency));
		//row.push(new cellValue("positionId",ria.positionId));
		//row.push(new cellValue("controlHierarchy",ria.controlHierarchy));
		/**检查项Begin**/
		var checkItem = _.extend({code:null,type:null,name:null},ria.checkItem);
		row.push(new cellValue("checkItemCode",checkItem.code));
		row.push(new cellValue("checkItemType",checkItemTypeName(checkItem.type)));
		row.push(new cellValue("checkItemName",checkItem.name));
		/**检查项End**/
		/**专家支持Begin**/
		row.push(new cellValue("checkMethodList",_.reduce(checkItem.checkMethodList,function(memo,checkMethod, index){
			memo += (index +1)+'.' + checkMethod.name + ',' + checkMethod.content + '\n';
			return memo;
		},"").replace(/^\|\|/,"")));
		row.push(new cellValue("checkBasisList",_.reduce(checkItem.checkBasisList,function(memo,checkBasis, index){
			memo += (index +1)+'.' +  checkBasis.name + ',' + checkBasis.content + '\n';
			return memo;
		},"").replace(/^\|\|/,"")));
		row.push(new cellValue("accidentCasesList",_.reduce(checkItem.accidentCasesList,function(memo,accidentCases, index){
			memo += (index +1)+'.' + accidentCases.name + ',' + accidentCases.content + '\n';
			return memo;
		},"").replace(/^\|\|/,"")));
		/**专家支持End**/
	}
	var opts = {
			el: '#overview',
			data:dataModel,
			methods:{
				tdContentStyle:function(obj){
					return _.contains(["checkMethodList","checkBasisList","accidentCasesList"],obj.column)?{"text-align":"left"}:"";
				},
				conventData:function(jsonArray){
					var arrs = [];
					var level = 1;
					_.each(jsonArray,function(riskType){
						recursion(level, riskType, arrs, []);
					});
					return arrs;
				},
				getRowspan:function(rowIndex,cellIndex){
					var rowData = this.tableData[rowIndex];
					
					var realCellIndex = this.totalCellLength - rowData.length + cellIndex;
					if(realCellIndex >= this.mergeCellLength) return 1;
					//是否有同级长度单元格
					var hasLast = false;
					var cellRowspans = 1;
					var newLength = rowData.length - cellIndex;
					doEach(this.tableData,rowIndex+1,function(row,index){
						if(row.length >= newLength){
							hasLast = true;
							cellRowspans = index - rowIndex;
							return true;
						}
						return false;
					});
					if(!hasLast){
						cellRowspans = this.tableData.length - rowIndex;
					}
					return cellRowspans;
				},
				//将数据转换为数组格式
				getObjValue:function(obj){
					return _.propertyOf(obj)('value');
				},
				//数组对象交集
				intersection:function(list1,list2){
					if(list1 == null || list2 == null) return [];
					var list = [];
					// 把a数组转化成object 
					var hash = {}; 
					for(var i=0,max=list1.length; i<max; i++) {
						var obj = {}; 
						hash[this.getObjValue(list1[i])] = true; 
					}
					// 通过hash检测b数组中的元素 
					for(var i=0, max=list2.length; i<max; i++) {
						if(typeof hash[this.getObjValue(list2[i])] !== "undefined") { 
							//相同元素 
							list.push(list2[i]);
						}
					}
					return list;
				},
				//处理单元格合并行,从后往前检查，进行逐列检查合并
				doMergeRow:function(){
					var _this = this;
					//对tableData赋初值
					this.tableData = _.clone(this.data);
					var data = this.data;
					var tableData = this.tableData;
					for(var col = this.mergeCellLength-1; col >= 0; col--){
						var index = 0;
						for(var rowIndex = 1; rowIndex < data.length; rowIndex++){
							var rowA = data[rowIndex-1];
							var tableRowA = _.clone(data[rowIndex-1]);
							var rowB = data[rowIndex];
							var tableRowB = tableData[rowIndex];
							if(rowA.length === 0 || rowB.length === 0 || rowA[col].value === "" || rowB[col].value === ""){
							}else if(rowA[col].value === rowB[col].value &&
									(col == 0 || rowA[col-1].value === rowB[col-1].value)){
								tableData[rowIndex] = this.intersection(tableRowB,_.reject(rowB,function(r,i){return i === col;}))
							}
						}
					}
				},
				//Json对象转数组集合,并获取对应行的合并数
				setData:function(data){
					var _this = this;
					this.data = this.conventData(data);
					this.doMergeRow();
				},
				doQry:function(){
					var _this = this;
					var param = {
						orgId: this.qryModel.orgId
					};
					this.qryModel.qryed = false;
					//获取查询结果
					this.$resource(buildServiceUrl("/riskassessment/overview")).get(param).then(function(rs){
						_this.setData(rs.data.content);
						_this.qryModel.qryed = true;
					});
				}
			},
			ready:function(){
				this.tableData = [];
				var _this = this;
				//获取公司查询列表
				this.$resource(buildServiceUrl("/organization/list")).get().then(function(rs){
					_this.qryModel.orgList = rs.data.content;
				});
				this.doQry();
			}
	};
	
	new Vue(opts);
});