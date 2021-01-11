define(function(require){
	var LIB = require("lib");
	var echarts = require("charts");
	//柱状矢量小图标
	var barIcon = "path://M6.7,22.9h10V48h-10V22.9zM24.9,13h10v35h-10V13zM43.2,2h10v46h-10V2zM3.1,58h53.7";
	//饼状矢量小图标
	var pieIcon = "M113.66,73.506c0.22,0.99,0.962,1.677,1.98,1.677c0.66,0,1.32-0.302,1.87-0.825l26.485-25.357c0.797-0.77,1.265-1.843,1.265-2.86c0-0.825-0.33-1.567-0.907-2.145c-7.014-6.683-16.446-10.836-26.567-11.716c-1.925-0.165-4.236,1.32-4.236,3.355l0,0l0,0v37.348l0,0l0,0C113.577,73.176,113.604,73.341,113.66,73.506M113.082,81.234c-1.292-1.293-2.613-2.063-2.613-4.125l0.138-39.851c0.137-0.77,0.055-1.348-0.248-1.733c-0.22-0.248-0.522-0.413-0.853-0.413c-23.652,0-42.876,20.104-42.876,44.829c0,24.092,19.747,43.701,44.031,43.701c10.918,0,21.37-4.098,29.428-11.551c0.688-0.633,1.1-1.513,1.1-2.476c0.027-0.963-0.357-1.843-1.018-2.53L113.082,81.234M150.237,52.247c-1.183-1.458-3.548-1.541-4.923-0.22l-26.182,25.357c-0.688,0.66-1.045,1.54-1.072,2.475c0,0.936,0.357,1.815,1.018,2.503l25.879,25.88c0.798,0.77,1.513,1.018,2.421,1.018c0.962,0,1.87-0.413,2.502-1.155c6.601-7.865,10.259-17.849,10.259-28.107C160.166,69.876,156.618,60.03,150.237,52.247";
	var person = require("./statsPerson-api");
	//var checker = require("./statsChecker-api");
	var equip = require("./statsEquip-api");
	var checkItem = require("./statsCheckItem-api");
	var checkReform = require("./statsCheckReform-api");
	var getIdsRange = function(ranges){
		var arry = _.map(ranges,function(r){return r.key;});
		return arry.join(",");
	};
	var apiMap = {
			/********************检查人********************/
			'person-frw-abs':person.orgAbs,//检查人-公司-绝对值
			'person-frw-avg':person.orgAvg,//检查人-公司-平均值
			'person-frw-trend':person.orgTrend,//检查人-公司-趋势
			'person-dep-abs':person.orgAbs,//检查人-部门-绝对值
			'person-dep-avg':person.orgAvg,//检查人-部门-平均值
			'person-dep-trend':person.orgTrend,//检查人-部门-趋势
			'person-per-abs':person.checkerAbs,//检查人-人员-绝对值
			'person-per-avg':person.checkerAbs,//检查人-人员-平均值
			'person-per-trend':person.checkerTrend,//检查人-人员-趋势
			/********************检查对象********************/
			//'checker-frw-abs':checker.orgAbs,//检查对象-公司-绝对值
			//'checker-frw-avg':checker.orgAvg,//检查对象-公司-平均值
			//'checker-frw-trend':checker.orgTrend,//检查对象-公司-趋势
			//'checker-dep-abs':checker.orgAbs,//检查对象-部门-绝对值
			//'checker-dep-avg':checker.orgAvg,//检查对象-部门-平均值
			//'checker-dep-trend':checker.orgTrend,//检查对象-部门-趋势
			//'checker-obj-abs':checker.checkerAbs,//检查对象-人员-绝对值
			//'checker-obj-avg':checker.checkerAbs,//检查对象-人员-平均值
			//'checker-obj-trend':checker.checkerTrend,//检查对象-人员-趋势
			/********************区域设施********************/
			'equip-frw-abs':equip.orgAbs,//区域设施-公司-绝对值
			'equip-frw-avg':equip.orgAvg,//区域设施-公司-平均值
			'equip-frw-trend':equip.orgTrend,//区域设施-公司-趋势
			'equip-dep-abs':equip.orgAbs,//区域设施-部门-绝对值
			'equip-dep-avg':equip.orgAvg,//区域设施-部门-平均值
			'equip-dep-trend':equip.orgTrend,//区域设施-部门-趋势
			'equip-equip-abs':equip.equipAbs,//区域设施-设备设施-绝对值
			'equip-equip-avg':equip.equipAbs,//区域设施-设备设施-平均值
			'equip-equip-trend':equip.equipTrend,//区域设施-设备设施-趋势
			/********************检查项********************/
			'checkItem-frw-abs-1':checkItem.invalidOrgAbs,//检查项-公司-不合格项-绝对值
			'checkItem-frw-avg-1':checkItem.invalidOrgAvg,//检查项-公司-不合格项-平均值
			'checkItem-frw-trend-1':checkItem.invalidOrgTrend,//检查项-公司-不合格项-趋势
			'checkItem-dep-abs-1':checkItem.invalidOrgAbs,//检查项-部门-不合格项-绝对值
			'checkItem-dep-avg-1':checkItem.invalidOrgAvg,//检查项-部门-不合格项-平均值
			'checkItem-dep-trend-1':checkItem.invalidOrgTrend,//检查项-部门-不合格项-趋势
			'checkItem-equip-abs-1':checkItem.invalidEquipAbs,//检查项-设备设施-不合格项-绝对值
			'checkItem-equip-avg-1':checkItem.invalidEquipAvg,//检查项-设备设施-不合格项-平均值
			'checkItem-equip-trend-1':checkItem.invalidEquipTrend,//检查项-设备设施-不合格项-趋势
			
			'checkItem-frw-abs-2':checkItem.passrateOrgAbs,//检查项-公司-合格率-绝对值
			'checkItem-frw-trend-2':checkItem.passrateOrgTrend,//检查项-公司-合格率-趋势
			'checkItem-dep-abs-2':checkItem.passrateOrgAbs,//检查项-部门-合格率-绝对值
			'checkItem-dep-trend-2':checkItem.passrateOrgTrend,//检查项-部门-合格率-趋势
			'checkItem-equip-abs-2':checkItem.passrateEquipAbs,//检查项-设备设施-合格率-绝对值
			'checkItem-equip-trend-2':checkItem.passrateEquipTrend,//检查项-设备设施-合格率-趋势

			/********************整改情况********************/
			'rectification-frw-abs-1':checkReform.reformrateOrgAbs,//整改情况-公司-日期范围-整改率-绝对值
			'rectification-frw-avg-1':checkReform.reformrateOrgAbs,//整改情况-公司-日期范围-整改率-平均值
			'rectification-frw-trend-1':checkReform.reformrateOrgTrend,//整改情况-公司-日期范围-整改率-趋势
			'rectification-dep-abs-1':checkReform.reformrateOrgAbs,//整改情况-部门-日期范围-整改率-绝对值
			'rectification-dep-avg-1':checkReform.reformrateOrgAbs,//整改情况-部门-日期范围-整改率-平均值
			'rectification-dep-trend-1':checkReform.reformrateOrgTrend,//整改情况-部门-日期范围-整改率-趋势
			'rectification-equip-abs-1':checkReform.reformrateEquipAbs,//整改情况-设备设施-日期范围-整改率-绝对值
			'rectification-equip-avg-1':checkReform.reformrateEquipAbs,//整改情况-设备设施-日期范围-整改率-平均值
			'rectification-equip-trend-1':checkReform.reformrateEquipTrend,//整改情况-设备设施-日期范围-整改率-趋势
			
			'rectification-frw-abs-2':checkReform.overduerectOrgAbs,//整改情况-公司-日期范围-超期未整改-绝对值
			'rectification-frw-avg-2':checkReform.overduerectOrgAbs,//整改情况-公司-日期范围-超期未整改-平均值
			'rectification-frw-trend-2':checkReform.overduerectOrgTrend,//整改情况-公司-日期范围-超期未整改-趋势
			'rectification-dep-abs-2':checkReform.overduerectOrgAbs,//整改情况-部门-日期范围-超期未整改-绝对值
			'rectification-dep-avg-2':checkReform.overduerectOrgAbs,//整改情况-部门-日期范围-超期未整改-平均值
			'rectification-dep-trend-2':checkReform.overduerectOrgTrend,//整改情况-部门-日期范围-超期未整改-趋势
			'rectification-equip-abs-2':checkReform.overduerectEquipAbs,//整改情况-设备设施-日期范围-超期未整改-绝对值
			'rectification-equip-avg-2':checkReform.overduerectEquipAbs,//整改情况-设备设施-日期范围-超期未整改-平均值
			'rectification-equip-trend-2':checkReform.overduerectEquipTrend//整改情况-设备设施-日期范围-超期未整改-趋势
	};
	var getApi = function(item,typeOfRange,method){
		var key = item[0]+'-'+typeOfRange+'-'+method;
		if(_.contains(['checkItem','rectification'],item[0])){
			key += '-' + item[1];
		}
		return apiMap[key];
	}
	
	var buildBaseData = function(data){
		var rs = {
				data:_.map(data,function(d){
					return {
						xId:d.xId,
						xName:d.xValue,
						value:d.yValue
				};
			})
		};
		
		return rs;
	}
	var createZeroArray = function(size){
		var arr = [];
		for(var i = 0; i < size; i++){
			arr[i] = 0;
		}
		return arr;
	}
	var isDateType = function(value){
		return value == null ? false : typeof value.getTime === 'function' &&
		typeof value.getMonth === 'function' &&
		typeof value.getYear === 'function';
	}
	var buildRanges = function(begin,end){
		var beginDate = isDateType(begin) ? _.clone(begin) : new Date(begin);
		var endDate = isDateType(end) ? _.clone(end) : new Date(end);
		var ranges = [];
		for(var date = beginDate; date.Format("yyyy-MM") <= endDate.Format("yyyy-MM");){
			ranges.push(date.Format("yyyy-MM"));
			var month = date.getMonth();
			if(month == 11){
				date.setFullYear(date.getFullYear()+1);
				date.setMonth(0);
			}else{
				date.setMonth(month+1);
			}
		}
		return ranges;
	}
	var buildGroupData = function(data,ranges){
		
		var chartData = {};
		//保存分组数据
		var rangeDatas = _.groupBy(data,'xValue');
		//保存分组名称
		var group = [];
		//对象数组去重
		_.each(_.map(_.sortBy(data,"yName"),function(d){
			return {
				yId:d.yId,
				yName:d.yName,
				xValue:d.xValue
			};
		}),function(g){
			var isContains = _.some(group,function(v){ return v.yId === g.yId;});
			if(!isContains){
				group.push(g);
			}
		});
		_.each(ranges,function(r){
			chartData[r] = [];
			var ds = rangeDatas[r];
			_.each(group,function(g){
				var gg = _.find(ds,function(d){return d.yName === g.yName;});// || {yId: g.yId,yValue: 0,xValue: g.xValue};
				var v = _.propertyOf(gg);
				chartData[r].push({
					yId:v("yId"),
					yName:v("yName"),
					value:v("yValue"),
					xValue:v("xValue")
				});
			});
		});
		return {
			groups : _.map(group,function(g){return g.yName;}),
			data : chartData
		};
	}
	//构造柱状图配置项
	var buildBarChars = function(data, dataLimit){
		var limited = dataLimit !== undefined;
		//排序
		data = _.sortBy(data, function(d){return Number(d.value) * -1; });
		var opt = {
			    tooltip: [{
			        trigger: 'axis',
					formatter:'{b}:{c}'
			    }],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ]
		};
		var series = [{
            name:'检查次数',
            type:'bar',
            barWidth:'20%',
			label:{
				normal:{
					show:true,
					//position:'insideTop'
					position:'top'
				}
			},
            itemStyle: {
                normal: {
                    //color: '#2BA6FF',
					barBorderRadius :[5, 5, 0, 0]
                }
            },
            data:[]
        }];
		if(limited && _.keys(data).length < dataLimit){
			series[0].barWidth = 70;
		}
		var xAxis = [{
            type : 'category',
            data : []
        }];
		var index = 0;
		_.find(data,function(v,k){
			if(!limited || ++index <= dataLimit){
				xAxis[0].data.push(v.xName);
				series[0].data.push(v);
				return false;
			}else{
				return true;
			}
		});
		opt.xAxis = xAxis;
		opt.series = series;
		buildToolBox(opt);
		return opt;
	}
	//构造柱状图与饼图转换工具栏 TODO 只处理柱状图与饼图互换
	var buildToolBox = function (opt){
		var _opt = _.clone(opt);
		var seriesType = "bar";
		var radioType = ['bar', 'pie'];
		var _covertBarData2PieData = function(barData){
			return _.map(barData, function(dd){
				return {
					value:dd.value,
					xId:dd.xId,
					name:dd.xName
				}
			});
		}
		var seriesOptGenreator = {
			'bar': function(option, instance, ecModel, api){
				if("pie" == seriesType){
					instance.setOption(option, true);
				}
			},
			'pie': function(option, instance, ecModel, api){
				if("bar" == seriesType){
					var newOption = _.deepExtend(option,{
										tooltip: [{
											trigger: 'item',
											formatter:'{b}:{c}'
										}]
									});
					//删除坐标轴
					delete newOption.xAxis;
					delete newOption.yAxis;

					var data = newOption.series[0].data;
					newOption.series[0] = {
						type:'pie',
						radius : '55%',
						center: ['50%', '50%'],
						data:_covertBarData2PieData(data)
					};
					instance.setOption(newOption, true);
				}
			}
		}
		var toolboxOption = {
					show: true,
					right: '5%',
					feature: {
						myTool:{
							show: true,
							type: [],
							// Icon group
	        				icon: {
								bar:barIcon,
								pie:pieIcon
							},
							title:{
								bar: '切换为柱状图',
								pie:'切换为饼图'
							},
							option: {},
							seriesIndex: {},
							onclick: function(ecModel, api, type){
								// Not supported magicType
								if (!seriesOptGenreator[type]) {
									// console.warn("不支持的图标类型操作. type : " + type);
									return;
								}
								var _this = this;
								var echartsInstance = echarts.getInstanceByDom(api.getDom());
								var newOption = _.deepExtend({}, echartsInstance.getOption(), _opt);
								seriesOptGenreator[type](newOption, echartsInstance, ecModel, api);
								seriesType = type;
								echartsInstance.setOption(newOption, true);
								_.each(radioType, function(radio){
									_this.model.setIconStatus(radio, 'normal');
								})
								_this.model.setIconStatus(type, 'emphasis');
							}
						}
					}
				};
		opt.toolbox = toolboxOption;
	}
	//构造折线图配置项
	var buildLineChars = function(groups, data, dataLimit){
		var limited = dataLimit !== undefined;
		var gs = _.filter(groups, function(g,i){
			return !limited || i < dataLimit;
		});
		var opt = {
			    tooltip: {
			        trigger: 'axis'
			    },
				toolbox:{
					feature :{
						magicType:{
							type:['line', 'bar']
						}
					}
				},
				legend: {
			        data:gs,
					top:55
			    },
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ]
		};
		var series = _.map(gs,function(group){
			return {
	            name:group,
	            type:'line',
				label:{
					normal:{
						show:true,
						position:'top'
					}
				},
	            data:[]
	        };
		});
		var xAxis = [{
            type : 'category',
			boundaryGap:false,
            data : []
        }];
		_.each(data,function(v,k){
			xAxis[0].data.push(k);
			_.each(series,function(s,i){
				var dd = _.find(v,function(d){
					return d.yName === s.name;
				});
				s.data.push(dd);
			});
		});
		
		opt.xAxis = xAxis;
		opt.series = series;
		return opt;
	}
	
	var buildCharsOpt = function(res,dataLimit){
		//报表数据个数限制
		var limit = dataLimit;
		var groups = res.groups;
		var data = res.data;
		return groups ? buildLineChars(groups, data, limit) : buildBarChars(data, limit);
	}
	
	var utils = {
			buildRanges:buildRanges,
			buildCharsOpt:buildCharsOpt,
			get:function(opt){
				var paramOpt = _.propertyOf(opt);
				var dateRange = paramOpt("dateRange");
				var beginDate = dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
				var endDate = dateRange[1].Format("yyyy-MM-dd hh:mm:ss");
				var param = {
						"idsRange":getIdsRange(paramOpt("objRange")),
						"startDateRange":beginDate,
						"endDateRange":endDate
				};
				var item = opt.item;
				var typeOfRange = opt.typeOfRange;
				var method = opt.method;
				var api = getApi(item,typeOfRange,method);
				
				return {
					then:function(callback){
						if(api == null){
							LIB.Msg.error("查询失败");
							return;
						}
						api(param).then(function(res){
							//转换后端数据格式
							var data = [];
							if(_.contains(["abs","avg"],method)){//柱状
								data = buildBaseData(res.data);
							}else if("trend" === method){//折线
								data = buildGroupData(res.data,buildRanges(beginDate,endDate));
							}
							res.data = data;
							callback(res);
						});
					}
				};
			}
	}
	return utils;
});