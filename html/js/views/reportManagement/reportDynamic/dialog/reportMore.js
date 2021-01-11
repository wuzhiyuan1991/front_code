define(function(require){
	var LIB = require('lib');
	var template = require("text!./reportMore.html");
	var reqUtils = require("../../tools/vuex/reqUtils");
	
	var buildTableData = function(res){
		var groups = res.groups;
		var data = res.data;
		return groups ? buildLineData(groups, data) : buildBarData(data);
	}
	var buildLineData = function(groups, data){
		var tableData = [];
		_.each(groups,function(g,i){
			var row = {
					name:g
			};
			_.each(data,function(v,k){
				row[k] = v[i].value;
			});
			tableData.push(row);
		});
		return tableData;
	}
	var buildBarData = function(data){
		var tableData = _.sortBy(_.map(data,function(v,k){
			return {
				"name":v.xName,
				"value":v.value
			};
		}),function(d){return Number(d.value) * -1; });

		return tableData;
	}
	var dataModel = {
			tableData:[],
			scroll:false
	};
	var opts = {
			template:template,
			props:{
				show:{
					type:Boolean,
					required:true
				},
				qryParam:{
					type:Object,
					required:true
				}
			},
			data:function(){
				return dataModel;
			},
			computed:{
				columns:function(){
					var columns = [];
					this.scroll = false;
					var method = this.qryParam.method;
					var dates = this.qryParam.dateRange;
					if("abs" === method){//绝对值-列配置
						columns.push({
							title: "统计对象个体名称",
							width:"180px",
							fieldName:"name",
							showTip:true

						});
						columns.push({
							title: "绝对值",
							fieldName:"value"

						});
					}else if("avg" === method){//平均值-列配置
						columns.push({
							title: "统计对象个体名称",
							width:"180px",
							fieldName:"name",
							showTip:true
						});
						columns.push({
							title: "平均值",
							fieldName:"value"
						});
					}else if("trend" === method && dates.length === 2){//趋势-列配置
						var ranges = reqUtils.buildRanges(dates[0],dates[1]);
						columns.push({
							title: "对象名称",
							width:"180px",
							fieldName:"name",
							showTip:true
						});
						var size = ranges.length - 1;
						if(size >= 9){
							this.scroll = true;
						}
						_.each(ranges,function(d,i){
							var x = {
								title: d,
								//width : "80px",
								fieldName:d
							};
							if(i <= size){
								x.width = "80px";
							}
							columns.push(x);
						});
					}
					return columns;
				}
			},
			watch:{
				show: function(v){
					if(v){
						var _this = this;
						reqUtils.get(this.qryParam).then(function(res){
							_this.tableData = buildTableData(res.data);
						});
					}else{//关闭时，清空table数据
						this.tableData = [];
					}
				}
			}
	};
    var comp = LIB.Vue.extend(opts);
    return comp;
});