define(function (require) {

	var template = require("text!./table.html");
	var Vue = require("vue");
	var Message = require("components/iviewMessage");
	var Page = require("../page/iviewPage");
	var helper = require("./tableHelper");
	var cfg = helper.cfg();

	var buildEmptyCustomColumnSetting = function () { return { hiddenColumns: [], orderedColumns: [] } };
	//todo 暂时的方案，以后需要用绝对定位解决
	var prefixCls = 'table-';
	var opts = {
		name: "VueBootstrapTable",
		template: template,
		props: {
			/**
			 * The column titles, required
			 */
			columns: {
				type: Array,
			},
			/**
			 * The rows, an Array of objects
			 */
			values: {
				type: Array,
				required: false,
				//Array default 不能是[] ， 否则报错， 所以默认为 false
				default: false
			},
			/**
			 * Enable/disable table sorting, optional, default true
			 */
			sortable: {
				type: Boolean,
				required: false,
				default: false
			},
			/**
			 * Enable/disable input filter, optional, default false
			 */
			showFilter: {
				type: Boolean,
				required: false,
				default: false
			},
			//过滤列
			filterColumn: {
				type: Array,
				required: false,
			},
			/**
			 * Enable/disable column picker to show/hide table columns, optional, default false
			 */
			showColumnPicker: {
				type: Boolean,
				required: false,
				default: false
			},

			//增加是否显示分页属性
			showPager: {
				type: Boolean,
				required: false,
				default: true
			},

			//搜索列表的url值
			url: {
				type: String,
				required: false,
				default: ''
			},

			//搜索列表的url值
			urlDelete: {
				type: String,
				required: false,
				default: ''
			},

			//通过checkbox已选中的数据
			selectedDatas: {
				type: Array,
				required: false,
				default: function () {
					return [];
				}
			},
			//reset触发reset功能
			resetTriggerFlag: {
				type: Boolean,
				required: false,
				default: false
			},
			//分页配置
			pageSizeOpts: {
				type: Array,
				required: false,
				//				default: function(){ return [5,10,15,20]}
				default: function () { return [10, 50, 100] }
			},
			popFilterEnum: {
				type: Array,
				required: false,
			},
			//可选择列的默认宽度，可选择列包括  checkbox 和  radio
			selectColumnWidth: {
				type: String,
				default: "60px"
			},
			tableHeight: {
				type: String,
				default: "100%"
			},

			//自定义初始化过滤条件
			defaultFilterValue: {
				type: Object
			},


			//是否开启延迟查询,设置后table默认不会发搜索请求,需要手动调用发请求,默认开启
			lazyLoad: {
				type: Boolean,
				default: false
			},

			//是否开启全局默认过滤，默认开启
			useDefaultGlobalFilter: {
				type: Boolean,
				default: true
			},
			showEmptyRow: {
				type: Boolean,
				default: true
			},
			//用于缓存table的配置
			code: {
				type: String
			},
			//通过对象配置参数
			setting: {
				type: Object
			},
			//用于开启分页的已选项缓存，开启后，点击分页不会清空上一页的selectedDatas
			isCacheSelectedData: {
				type: Boolean,
				default: false
			},
			//是否启用全选功能
			isSingleCheck: {
				type: Boolean,
				default: false
			},
			//是否显示序列号
			showSeq: {
				type: Boolean,
				default: false
			},
			//todo 暂时的方案，以后需要用绝对定位解决
			//是否显示滚动条
			showScroll: {
				type: Boolean,
				default: false
			}
			//	        ,
			//            showSizer: {
			//                type: Boolean,
			//                default: false
			//            }
		},
		data: function () {
			return {
				emptyRows: [],
				hidePopTipTrigger: 0,
				//	        	cityList : [
				//							{
				//								id: 'beijing',
				//								value: '北京市'
				//							},
				//							{
				//								id: 'shanghai',
				//								value: '上海市'
				//							}
				//							],
				filteredSize: 0,
				filterKey: "",
				sortKey: "",
				sortOrders: {},
				columnMenuOpen: false,
				displayCols: [],
				//checkbox全选
				checkAll: false,
				//内部维护的数据源
				ds: [],
				//分页属性
				pageModel: {
					curPage: 1,
					pageSize: this.pageSizeOpts[0],
					totalSize: 10
				},
				//用户自定义渲染
				renderDisplayValue: null,
				//过滤提示框中输入的值

				popTipFilterValue: {
					strValue: "",
					strValues: []
				},

				dynamicQueryCriterias: {},

				//初始化table全局配置
				dataDic: cfg.dataDic || {},

				defaultGlobalFilterValue: cfg.defaultGlobalFilterValue || {},

				customSetting: this.code ? helper.queryColumnSetting(this.code) : buildEmptyCustomColumnSetting(),

				lastClickedLinkRowId: "",

				//10毫秒之内的多次调用, 只执行最后一次的调用
				queryOnServerLazyFunc:
					_.debounce(function (_this, baseParam, callBack) {
						var resource = _this.$resource(_this.url);
						resource.get(baseParam).then(function (res) {
							var data = res.data;

							var pageSize = Number(data.pageSize);
							var pageNum = Number(data.pageNum);
							var total = Number(data.total);

							_this.pageModel.curPage = pageNum != 0 ? pageNum : 1;
							_this.pageModel.pageSize = pageSize;
							_this.pageModel.totalSize = total;
							_this.values = data.list || [];

							_this.$emit("on-data-loaded", this.values);

							//table内容滚动到头部
							_this.$nextTick(function () {
								var cc = this.$el.querySelector(".vue-table-container");
								cc && (cc.scrollTop = 0);
							});

							callBack && callBack();
						});
					}, 10),

				//设置点击事件的一些配置, 初始为null, 因为不许要绑定
				clickEventCfg: null,
				//todo 暂时的方案，以后需要用绝对定位解决
				//滚动的参数
				scrolled: 2,
				screenWidth: document.body.clientWidth,//窗口的大小
			};
		},
		ready: function () {

			this.$on("do_query_by_filter", this.doQueryByFilter);
			this.$on("do_update_row_data", this.doUpdateRowData);

			if (this.setting) {
				!this.code && this.setting.code && (this.code = this.setting.code);
				this.customSetting = this.code ? helper.queryColumnSetting(this.code) : buildEmptyCustomColumnSetting(),

					!this.columns && this.setting.columns && (this.columns = this.setting.columns);
				!this.url && this.setting.url && (this.url = this.setting.url);
				!this.defaultFilterValue && this.setting.defaultFilterValue && (this.defaultFilterValue = this.setting.defaultFilterValue);
				!this.showColumnPicker && this.setting.showColumnPicker && (this.showColumnPicker = this.setting.showColumnPicker);
				this.setting.isSingleCheck && (this.isSingleCheck = this.setting.isSingleCheck);
			}

			this.buildDefaultGlobalFilter();

			var _this = this;

			if (_this.defaultFilterValue) {
				var _filterValue = _this.defaultFilterValue;
				_.each(_filterValue, function (v, k) {
					var filterFieldName = k;
					var filterSelectedValues = v;
					var criteriaParam = _this.initServerCriteriaPojo(filterFieldName, filterSelectedValues);
					_this.dynamicQueryCriterias[filterFieldName] = criteriaParam;
				});
			}

			this.refreshColumns();

			if (this.lazyLoad) {
				return;
			}

			this.handleCurPageChanged(1);
			window.onresize = _.debounce(function () {
				// window.screenWidth = document.body.clientWidth;
				_this.screenWidth = document.body.clientWidth;
				// _.debounce(function(){
				_this.showScroll && _this.tableWidth();
				// },10);
			}, 10);
			//	        this.setSortOrders();
			//	        var self = this;
			//	        this.columns.forEach(function (column) {
			//	            var obj = {};
			//	            obj.title = column.title;
			//	            obj.visible = true;
			//	            obj.fieldName = column.fieldName;
			//	            obj.fieldType = column.fieldType;
			//	            obj.renderClass = column.renderClass;
			//
			//	            //用户自定义列的渲染,需要配合obj.fieldType="custom"使用
			//	            if(column.render) {
			//	            	obj.renderDisplayValue = column.render;
			//	            }
			//	            if(column.toolType) {
			//	            	obj.toolType = column.toolType;
			//	            }
			//	            self.displayCols.push(obj);
			//	        });


			//增加checkbox选中的属性
			//        	for(var i = 0; i < this.values.length; i++) {
			////        		this.values[i].rowCheck = false;
			//        		Vue.set(this.values[i], 'rowCheck', false)
			//        	}
			//初始化内部维护的DataSource
			this.initDataSource();
			//todo 暂时的方案，以后需要用绝对定位解决
			window.addEventListener('scroll', this.doScroll);
		},
		compiled: function () {
			this.clickEventCfg = {};
			this.clickEventCfg.delIcon = {};
			this.clickEventCfg.delIcon.repeatCount = 0;
			this.clickEventCfg.delIcon.lastClickTime = 0;
			this.code = this.code || "tb_code_" + _.uniqueId();
		},
		watch: {
			// screenWidth : function(val){
			// var _this = this;
			// _.debounce(function(){
			//        _this.showScroll && _this.tableWidth();
			// 	},10);
			// },
			resetTriggerFlag: function (val) {
				//	    		if(this.isCacheSelectedData) {
				//	    			this.selectedDatas = [];
				//	    		}
				//	    		//清空全选
				////	    		this.checkAll = false;
				////	        	_.map(this.ds, function(item){item.rowCheck = false;});
				////	    		this.selectedDatas = [];
				//	    		var _this = this;
				//	    		_this.filterKey = "";
				//	    		//则删除默认搜索条件，查询所有
				//	    		if(!_.isEmpty(_this.filterColumn)) {
				//	    			_.each(_this.filterColumn, function(filterName) {
				//						delete _this.dynamicQueryCriterias[filterName];
				//	    			});
				//				}
				this.cleanAllStatus();

				//重置到第一页
				this.handleCurPageChanged(1);
			},
			url: function (val) {
				this.handleCurPageChanged(1);
			},
			values: function (val) {
				//增加checkbox选中的属性
				//	        	for(var i = 0; i < this.values.length; i++) {
				////	        		values[i].rowCheck = true;
				//	        		Vue.set(this.values[i], 'rowCheck', false)
				//	        	}

				//	    		//重置到第一页
				//		    	this.handleCurPageChanged(1);

				//如果 values 是本地数据源的变化，则需要额外更新分页
				if (!this.isServerModel()) {
					this.pageModel.curPage = 1,
						this.pageModel.totalSize = this.values.length;
					this.$emit("on-data-loaded", this.values);
				}

				//初始化内部维护的DataSource
				this.initDataSource();

			},
			//column发生变化则重新渲染
			columns: function () {
				//	            this.displayCols = [];
				//	            var self = this;
				//	            this.columns.forEach(function (column) {
				//	                var obj = {};
				//	                obj.title = column.title;
				//	                obj.visible = true;
				//	                self.displayCols.push(obj);
				//	            });
				//	            this.setSortOrders();
				this.refreshColumns();
			},
			showFilter: function () {
				this.filterKey = "";
			},
			showColumnPicker: function () {
				this.columnMenuOpen = true;

				//this.displayCols.forEach(function (column) {
				//    column.visible = true;
				//});
			},
			//checkbox全选的状态
			checkAll: function (val) {
				//如果不是全部选中的状态， 则不全选， 转为middle状态
				if (val && this.isHalfCheck) {
					this.$nextTick(function () {
						this.checkAll = false;
					});
				} else {
					//	        		if(_.every(this.ds, function(item){return item.rowCheck == false})) {
					//	        			this.$nextTick(function(){
					//		        			this.checkAll = false;
					//		        		});
					//	        		} else {
					//	        			this.setAllCheckBoxValues(val);
					//	        		}
					if (this.isCacheSelectedData) {
						if (this.fromPageClick) { //如果开启了缓存选择项的功能,并且是点击Page跳转页面的，则直接设置checkAll=false， 不去调用setAllCheckBoxValues，因为方法中会清空当前的selectedDates，导致缓存失败
							this.fromPageClick = false;
							this.checkAll = false;
							return;
						}
					}
					this.setAllCheckBoxValues(val);
				}
			}
		},
		computed: {
			tableContainerStyles: function () {
				return "height:" + this.tableHeight;
			},
			filteredValues: function () {
				//	            var result = this.$options.filters.filterBy(this.ds, this.filterKey);
				//	            var result = this.$options.filters.filterBy(this.values, this.filterKey);
				//	            result = this.$options.filters.orderBy(result, this.sortKey, this.sortOrders[this.sortKey]);
				var result = this.ds;
				//本地分页
				if (!this.isServerModel()) {
					var startInd = (this.pageModel.curPage - 1) * this.pageModel.pageSize;
					var endInd = startInd + this.pageModel.pageSize;
					result = result.slice(startInd, endInd);
				}
				this.filteredSize = result.length;

				if (this.showEmptyRow) {
					var emptyRowSize = this.pageModel.pageSize - this.filteredSize;

					this.emptyRows = [];
					while (emptyRowSize > 0) {
						this.emptyRows.push(emptyRowSize);
						emptyRowSize--;
					}
				}
				return result;
			},
			isHalfCheck: function () {
				if (!this.isCacheSelectedData) {
					return this.selectedDatas.length > 0 && this.selectedDatas.length != this.ds.length;
				} else {
					var curSelectedRows = _.filter(this.ds, function (item) { return item.rowCheck == true; });
					return curSelectedRows.length > 0 && curSelectedRows.length != this.ds.length;
				}
			},
			//todo 暂时的方案，以后需要用绝对定位解决
			tableClasses: function () {
				var obj = {};
				obj[prefixCls + 'scroll'] = this.showScroll;
				return [prefixCls, obj];
			}
		},
		methods: {
			buildDefaultGlobalFilter: function () {
				if (this.useDefaultGlobalFilter && !_.isEmpty(this.defaultGlobalFilterValue)) {
					var _this = this;
					var _filterValue = _this.defaultGlobalFilterValue;
					_.each(_filterValue, function (v, k) {
						var filterFieldName = k;
						var filterSelectedValues = v;
						var criteriaParam = _this.initServerCriteriaPojo(filterFieldName, filterSelectedValues);
						_this.dynamicQueryCriterias[filterFieldName] = criteriaParam;
					});
				}
			},
			//todo 暂时的方案，以后需要用绝对定位解决
			doScroll: function () {
				this.hidePopTipTrigger++;
				this.scrolled = - (document.body.scrollTop - 2);
			},
			cleanAllStatus: function () {
				if (this.isCacheSelectedData) {
					this.selectedDatas = [];
				}
				//清空全选
				//	    		this.checkAll = false;
				//	        	_.map(this.ds, function(item){item.rowCheck = false;});
				//	    		this.selectedDatas = [];
				var _this = this;
				_this.filterKey = "";
				//则删除默认搜索条件，查询所有
				if (!_.isEmpty(_this.filterColumn)) {
					_.each(_this.filterColumn, function (filterName) {
						delete _this.dynamicQueryCriterias[filterName];
					});
				}
			},
			//清空table数据
			doClearData: function () {
				this.selectedDatas = this.values = this.ds = [];
				this.pageModel.curPage = 1;
				// this.pageModel.pageSize = pageSize;
				this.pageModel.totalSize = 0;
			},
			//获取当前的搜索条件
			getCriteria: function () {
				//	    		return _.reduce(_.values(this.dynamicQueryCriterias), function(memo, obj){ _.extend(memo, obj); return memo}, {});
				return this.convertDynamicQueryCriteriasToQueryParam();
			},

			calDisplayLabel: function (entry, column) {

				var fieldValue = _.propertyOf(entry.data)(column.fieldName);
				var dataDicValue = this.dataDic[column.fieldName];
				/**
				 * 数据结构例子:  dataDic : {disable : {0:启用, 1:禁用}}
				 * 			   dataDicValue : {0:启用, 1:禁用}
				 * 			   entry.data[column.fieldName] : 0
				 */
				//判断数据字典中的值是否存在， 优先使用数据字典中的值,未来通过参数决定是否默认使用数据字典的值
				if (dataDicValue && dataDicValue[entry.data[column.fieldName]]) {
					//	    			return dataDicValue[entry.data[column.fieldName]];
					return dataDicValue[fieldValue];
				}
				//	    		return entry.data[column.fieldName];
				return fieldValue;
			},
			doUpdateRowData: function (data) {
				var _this = this;
				var rowDatas = [];
				if (data.value instanceof Array) {
					rowDatas = data.value;
				}
				else {
					rowDatas.push(data.value);
				}

				var opType = data.opType;
				if (opType == "update") {
					_.each(rowDatas, function (rowData) {
						var newData = rowData;
						if (newData && newData.id) {
							var rowData = _.findWhere(_this.values, { id: newData.id });
							if (rowData) {

								//对象数组需要单独处理
								Object.keys(newData).forEach(function (propName) {
									var oldProp = rowData[propName],
										newProp = newData[propName];

									// 更新的属性是数组
									if (_.isArray(oldProp) && _.isArray(newProp)) {
										if (newProp.length == 0) {
											oldProp.length = 0; // 这里必须设置length = 0， 不能直接赋值 []， 否则会导致Obser属性 __ob__ 丢失
										} else if (_.isObject(newProp[0])) { //并且是对象数组
											oldProp.length = 0; // 这里必须设置length = 0， 不能直接赋值 []， 否则会导致Obser属性 __ob__ 丢失
											//去掉可能的get set方法
											_.deepExtend(oldProp, _.clone(newProp));
										}
									}
								});

								_.deepExtend(rowData, newData);
							}
						}
					});
				}
				else if (opType == "create" || opType == "add" || opType == "remove") {
					_this.handleCurPageChanged(1);
				}
			},

			/**
			 * doQueryByFilter的封装方法，简化参数，只支持增加修改参数，不支持删除参数，方便调用
			 */
			doQuery: function (data) {
				var params = [];
				_.each(data, function (value, key) {
					var param = {};
					param.type = "save";
					param.value = {};
					param.value.columnFilterName = key;
					param.value.columnFilterValue = value;
					params.push(param);
				});
				this.doQueryByFilter(params);
			},
			/**
			 * data 参数：
			 * 		value :
							//条件 标题
							displayTitle
							//条件 内容
							displayValue
							//条件 后台搜索的 属性
							columnFilterName
							//条件 后台搜索的 值
							columnFilterValue
						type :
							save or remove
					e.g : {value : {columnFilterName : "xx", columnFilterValue : ""}, type : "save"}
			 **/
			doQueryByFilter: function (data) {
				//				if(this.dynamicQueryCriterias[data.value.fieldName] && data.type == "remove") {
				//					delete this.dynamicQueryCriterias[data.value.fieldName];
				if (data) {
					if (data instanceof Array) {
						var _this = this;
						_.each(data, function (item) {
							_this.buildDynamicQueryCriterias(item);
						});
					} else {
						this.buildDynamicQueryCriterias(data);
					}
				}


				var extParam = this.convertDynamicQueryCriteriasToQueryParam();

				//如果没有查询条件 使用全局默认搜索条件
				if (_.isEmpty(extParam)) {
					this.buildDefaultGlobalFilter();
					extParam = this.convertDynamicQueryCriteriasToQueryParam();
				}

				this.queryOnServer(1, extParam);

			},
			/**
			 * 不修改任何参数，不触发分页，刷新当前页的数据
			 */
			doRefresh: function () {
				var extParam = this.convertDynamicQueryCriteriasToQueryParam();
				this.queryOnServer(this.pageModel.curPage, extParam);
			},

			/**
			 * 根据opts 决定是否删除了默认的全局过滤条件、 默认过滤条件， 以及其他的所有自定义过滤条件，并根据新的条件查询table数据
			 *
			 * data 可以是一个 data格式的对象或者， 包含了data格式元素的数据
			 * data 参数格式：
			 * 		value :
							//条件 标题
							displayTitle
							//条件 内容
							displayValue
							//条件 后台搜索的 属性
							columnFilterName
							//条件 后台搜索的 值
							columnFilterValue
						type :
							save or remove
					e.g : {value : {columnFilterName : "xx", columnFilterValue : ""}, type : "save"}

					opts 默认参数:
						{keepCurPage : false, keepDefaultGlobalFilter : true, keepDefaultFilter : true}
			 **/
			doCleanRefresh: function (data, optsParam) {

				this.cleanAllStatus();

				var opts = { keepCurPage: false, keepDefaultGlobalFilter: true, keepDefaultFilter: true };
				var customOpts = _.defaults(optsParam || {}, opts);

				if (this.dynamicQueryCriterias) {

					var defaultGlobalFilterFieldNames = [];
					if (customOpts.keepDefaultGlobalFilter && this.useDefaultGlobalFilter && !_.isEmpty(this.defaultGlobalFilterValue)) {
						defaultGlobalFilterFieldNames = _.keys(this.defaultGlobalFilterValue);
					}

					var defaultFilterFieldNames = [];
					if (customOpts.keepDefaultFilter && this.defaultFilterValue) {
						defaultFilterFieldNames = _.keys(this.defaultFilterValue);
					}

					var allKeepFilterNames = _.union(defaultGlobalFilterFieldNames, defaultFilterFieldNames);

					for (key in this.dynamicQueryCriterias) {
						if (!_.contains(allKeepFilterNames, key)) {
							delete this.dynamicQueryCriterias[key];
						}
					}
				}

				if (data) {
					if (data instanceof Array) {
						var _this = this;
						_.each(data, function (item) {
							_this.buildDynamicQueryCriterias(item);
						});
					} else {
						this.buildDynamicQueryCriterias(data);
					}
				}

				var extParam = this.convertDynamicQueryCriteriasToQueryParam();

				this.pageModel.curPage = !!customOpts.keepCurPage ? this.pageModel.curPage : 1;
				this.queryOnServer(this.pageModel.curPage, extParam);
			},

			buildDynamicQueryCriterias: function (data) {
				var extParam = null;

				var columnFilterName = data.value["columnFilterName"];
				var columnFilterValue = data.value["columnFilterValue"];
				if (columnFilterName) {
					if (columnFilterValue != undefined && columnFilterValue != null) { //如果 columnFilterValue columnFilterName 都存在则判断type 进行相应处理
						if (data.type == "save") {

							var criteriaParam = this.initServerCriteriaPojo(columnFilterName, columnFilterValue);
							if (!_.isEmpty(criteriaParam)) {
								this.dynamicQueryCriterias[columnFilterName] = criteriaParam;
							}
						}
						if (data.type == "remove" && this.dynamicQueryCriterias[columnFilterName]) {
							delete this.dynamicQueryCriterias[columnFilterName];
						}
					} else { //如果 columnFilterValue 不存在 则删除 columnFilterName 对应的值
						delete this.dynamicQueryCriterias[columnFilterName];
					}
				}
			},
			queryOnServer: function (curPage, searchParam) {

				//清空checkbox全选
				if (this.checkAll) {
					this.checkAll = false;
				}
				//防止checkAll的上一次状态也是false，导致checkAll的watch事件不走
				else {
					this.setAllCheckBoxValues(false);
				}

				curPage = curPage || 1;

				//查询参数，基础参数为分页参数
				var baseParam = { curPage: curPage, pageSize: this.pageModel.pageSize };

				if (searchParam) {
					_.extend(baseParam, searchParam);
				}

				//避免外部通过filter参数短时间内多次调用
				this.queryOnServerLazyFunc(this, baseParam);

			},

			//输入："criteria.strValue.name", "检查表test11123"
			//输出：  {"criteria.strValue":{"name":"检查表test11123"}}
			initServerCriteriaPojo: function (criteriaFieldName, inputValue) {

				var _this = this;

				//特殊的critieria业务查询参数
				var criteriaParam = {};

				//	    		criteriaParam = _this.dynamicQueryCriterias;

				//特殊的critieria对象值，在构造完成之后， 需要转成String 赋值给 criteriaParam
				var criteriaValue = {};

				//排序特殊处理，因为后台排序对象是一个POJO，其他criteria是一个Map
				//需要将 criteria.orderValue:{fieldName:"name", orderType:"1"} 转化成两个查询对象
				//criteria.orderValue.fieldName:"name" , riteria.orderValue.orderType:"1"
				if (criteriaFieldName == "criteria.orderValue") {
					if (inputValue instanceof Object) {
						for (var prop in inputValue) {
							var criteriaFieldKey = criteriaFieldName + "." + prop;
							criteriaParam[criteriaFieldKey] = inputValue[prop];
						}
					}
				}
				//				else if(criteriaFieldName.startsWith("criteria.")) {
				else if (criteriaFieldName.indexOf("criteria.") == 0) {

					//去掉criteria.xxxValue前缀
					//demo --> criteria.strValue.name
					var strs = criteriaFieldName.split(".");
					if (strs.length > 2) {

						//demo --> criteria.strValue
						var criteriaKey = strs[0] + "." + strs[1];

						//demo --> name
						var criteriaFieldKey = strs.slice(2).join(".");

						//demo --> {"name": "检查表test11123"}
						criteriaValue[criteriaFieldKey] = inputValue;

						//demo --> {"criteria.strValue":{"name":"检查表test11123"}}
						if (!criteriaParam[criteriaKey]) {
							criteriaParam[criteriaKey] = criteriaValue;
							//	    					criteriaParam[criteriaKey] = JSON.stringify(criteriaValue);
						} else {

						}
					}
					//传进来得值已经是一个object了, 直接赋值
					else if (strs.length == 2) {
						criteriaParam[criteriaFieldName] = inputValue;
					}
				} else {
					criteriaParam[criteriaFieldName] = inputValue;
				}

				return criteriaParam;
			},

			//过滤提示框点击确认按钮后事件处理
			doOkActionInFilterPoptip: function (event, column) {

				var _this = this;
				//	    		var cityMap = _.indexBy(this.cityList,"id")

				var displayValue = "";

				//根据条件搜索后台数据
				//	    		var extParam = {};

				var filterFieldName = column.filterName || column.fieldName;
				//简单文本输入
				if (!column.filterType || column.filterType == "text" || column.filterType == "number") {
					var param = this.popTipFilterValue.strValue;
					//		    		extParam[column.filterName || column.fieldName] = param;
					displayValue = this.popTipFilterValue.strValue;
					//不为empty则  增加/更新 条件
					if (!_.isEmpty(param)) {
						//			    		var criteriaParam = {};
						//			    		criteriaParam[filterFieldName] = param;
						var criteriaParam = this.initServerCriteriaPojo(filterFieldName, param);
						/**
						 *
						 demo --> {	"criteria.strValue.name" : {
												"criteria.strValue" : \"{"name":"检查表test11123"}\",
									 },
									 "criteria.strsValue.name" : {
												"criteria.strsValue" : \"{"name":["检查表test11123"]}\",
									 },
									 "name" : "检查表test11123",
									 }
									}
						**/
						_this.dynamicQueryCriterias[filterFieldName] = criteriaParam;
					}
					//为empty 删除  条件
					else {
						delete _this.dynamicQueryCriterias[filterFieldName];
					}
				}
				//枚举类型
				else if (column.filterType == "enum") {

					var enumMap = _.indexBy(column.popFilterEnum, "id");

					var filterSelectedValues = this.popTipFilterValue.strValues;
					if (!_.isEmpty(filterSelectedValues)) {

						var selectedDisplayValues = [];

						_this.popTipFilterValue.strValues =
							_.map(filterSelectedValues, function (item) {
								var obj = {};
								obj.id = item;
								obj.value = enumMap[item].value;

								selectedDisplayValues.push(enumMap[item].value);
								return obj;
							});

						displayValue = selectedDisplayValues.join(",");


						var criteriaParam = this.initServerCriteriaPojo(filterFieldName, filterSelectedValues);

						//如果存在 critieria业务查询参数
						if (!_.isEmpty(criteriaParam)) {
							/**
							 *
							 demo --> {	"criteria.strValue.name" : {
													"criteria.strValue" : \"{"name":"检查表test11123"}\",
										 },
										 "criteria.strsValue.name" : {
													"criteria.strsValue" : \"{"name":["检查表test11123"]}\",
										 },
										 "name" : "检查表test11123",
										 }
										}
							**/
							_this.dynamicQueryCriterias[filterFieldName] = criteriaParam;
						}
					} else {
						delete _this.dynamicQueryCriterias[filterFieldName];
					}
				}
				//日期类型
				else if (column.filterType == "date") {
					var filterSelectedValues = this.popTipFilterValue.dateValues;

					var filterFieldName = column.filterName || column.fieldName;

					if (!_.isEmpty(filterSelectedValues)) {

						//保证startDate 和 endDate 不为空或空字符串
						var startDate = filterSelectedValues[0] && filterSelectedValues[0].Format();
						var endDate = filterSelectedValues[1] && filterSelectedValues[1].Format();
						displayValue = startDate && endDate && startDate + " - " + endDate;

						var startDateKey = "start" + filterFieldName.firstUpperCase();
						var endDateKey = "end" + filterFieldName.firstUpperCase();

						var criteriaParam = { "criteria.dateValue": {} };//this.initServerCriteriaPojo(filterFieldName, filterSelectedValues);
						criteriaParam["criteria.dateValue"][startDateKey] = startDate;
						criteriaParam["criteria.dateValue"][endDateKey] = endDate;

						//如果存在 critieria业务查询参数
						if (!_.isEmpty(criteriaParam)) {
							/**
							 *
							 demo --> {	"criteria.strValue.name" : {
													"criteria.strValue" : \"{"name":"检查表test11123"}\",
										 },
										 "criteria.strsValue.name" : {
													"criteria.strsValue" : \"{"name":["检查表test11123"]}\",
										 },
										 "name" : "检查表test11123",
										 }
										}
							**/
							_this.dynamicQueryCriterias[filterFieldName] = criteriaParam;
						}
					} else {
						delete _this.dynamicQueryCriterias[filterFieldName];
					}
				}

				var extParam = this.convertDynamicQueryCriteriasToQueryParam();
				this.queryOnServer(1, extParam);

				//	    		var columnValue = {};
				//	    		columnValue.fieldName = column.fieldName;
				//	    		columnValue.filterName = column.filterName

				var data = {};
				//条件 标题
				data.displayTitle = column.title;
				//条件 内容
				data.displayValue = displayValue;
				//条件 后台搜索的 属性
				data.columnFilterName = column.filterName || column.fieldName;
				//条件 后台搜索的 值
				data.columnFilterValue = this.popTipFilterValue.strValues;


				//	        	this.$emit("on-click-poptip-filter-ok", {event:event, column:columnValue, displayValue: displayValue, value:this.popTipFilterValue, filterData : _this.dynamicQueryCriterias});
				this.$emit("on-click-poptip-filter-ok", data);
				//清空过滤条件数据
				this.popTipFilterValue.strValue = "";
				this.popTipFilterValue.strValues = [];
				this.popTipFilterValue.dateValues = [];
				//关闭PopTip
				this.hidePopTipTrigger++;

			},

			doOrderActionInFilterPoptip: function (event, column, orderType) {

				var filterFieldName = "criteria.orderValue";
				var filterSelectedValues = {};
				filterSelectedValues.fieldName = column.orderName;
				filterSelectedValues.orderType = orderType;
				var criteriaParam = this.initServerCriteriaPojo(filterFieldName, filterSelectedValues);
				if (!_.isEmpty(criteriaParam)) {
					this.dynamicQueryCriterias[filterFieldName] = criteriaParam;
				}
				var extParam = this.convertDynamicQueryCriteriasToQueryParam();
				this.queryOnServer(1, extParam);



				var data = {};
				//条件 标题
				data.displayTitle = orderType == 0 ? "升序" : "降序";
				//条件 内容
				data.displayValue = column.title;
				//条件 后台搜索的 属性
				data.columnFilterName = filterFieldName;
				//条件 后台搜索的 值
				data.columnFilterValue = filterSelectedValues;


				//	        	this.$emit("on-click-poptip-filter-ok", {event:event, column:columnValue, displayValue: displayValue, value:this.popTipFilterValue, filterData : _this.dynamicQueryCriterias});
				this.$emit("on-click-poptip-filter-ok", data);

			},

			//把dynamicQueryCriterias的值格式化成string
			convertDynamicQueryCriteriasToQueryParam: function () {
				var _this = this;

				var extParam = {};

				//根据 dynamicQueryCriterias 生成一个新的queryCritiera, 新的queryCritiera中已经合并了相同key的不同object value， 并把 value 从object转为了string
				//queryCritiera中的value的值都是字符串格式的
				var queryCritiera = {};
				var criteria = {};
				_.each(_this.dynamicQueryCriterias, function (dqc, key) {
					var dqcKey = key;
					_.each(dqc, function (v, k) {
						if (v instanceof Object) {
							dqcKey = k;
							//	        	    		 criteria[k] = JSON.stringify(v);
							//如果同一个key存在不同的多个值， 则需要将多个 criteriaValue 合并成一个对象
							/**
							 *	demo {critieria.strValue : {name:"123"},  critieria.strValue : {orgName:"123"}}
							 *  --> {critieria.strValue : {name:"123", orgName:"123"}
							 **/
							if (criteria[k] && criteria[k] instanceof Object) {
								var criteriaValue = criteria[k];
								_.each(v, function (cv, ck) {
									criteriaValue[ck] = cv;
								})
							} else {
								criteria[k] = _.clone(v);
							}
						} else {
							criteria[k] = _.clone(v);
						}
					});
					queryCritiera[dqcKey] = criteria;
				});

				//value object --> string
				_.each(queryCritiera, function (v, k) {
					if (v instanceof Object) {
						_.each(v, function (cv, ck) {
							if (cv instanceof Object) {
								v[ck] = JSON.stringify(cv);
							}
						});
					}
				});

				//组装多个字符串格式的查询到 业务参数中
				_.each(queryCritiera, function (qsc) {
					_.extend(extParam, qsc);
				});

				return extParam;
			},

			doCancelActionInFilterPopTip: function () {
				this.popTipFilterValue.strValue = "";
				this.popTipFilterValue.strValues = [];
				this.hidePopTipTrigger++;
			},
			doFilter: function () {

				if (this.isCacheSelectedData) {
					this.selectedDatas = [];
				}

				var _this = this;

				//通过自定义搜索框输入的搜索条件时，如果输入条件为空，则删除默认搜索条件，查询所有
				if (_this.showFilter && !_.isEmpty(_this.filterColumn) && _.isEmpty(_this.filterKey)) {
					_.each(_this.filterColumn, function (filterName) {
						delete _this.dynamicQueryCriterias[filterName];
					});
					var extParam = this.convertDynamicQueryCriteriasToQueryParam();
					this.queryOnServer(1, extParam);
					return;
				}


				/**
				 * 构建业务查询参数
				 *
				 * start**/
				//一般的业务查询查询参数
				var extParam = {};

				//开启过滤输入框、设置了过滤列、输入了过滤内容才进行过滤参数的拼接
				if (_this.showFilter && !_.isEmpty(_this.filterColumn) && !_.isEmpty(_this.filterKey)) {
					//搜索的值
					var _filterKey = this.filterKey;

					var filterColumns = _this.filterColumn;
					var filterSelectedValues = _this.filterKey;

					//特殊的critieria业务查询参数
					_.each(filterColumns, function (filterFieldName) {
						var criteriaParam = _this.initServerCriteriaPojo(filterFieldName, filterSelectedValues);
						_this.dynamicQueryCriterias[filterFieldName] = criteriaParam;
					});

					//		    		var criteriaParam = {};
					//		    		//特殊的critieria对象值，在构造完成之后， 需要转成String 赋值给 criteriaParam
					//	    			var criteriaValue = {};
					//		    		_.each(_this.filterColumn, function(item){
					//
					//		    			//处理特殊的Criteria参数
					//		    			//demo  输入：filterColumn:["criteria.strValue.name"]
					//		    			//期望        输出：criteria.strValue:{"name":"检查表test11123"}
					//		    			if(item.startsWith("criteria.")) {
					//		    				//去掉criteria.xxxValue前缀
					//		    				var strs = item.split(".");
					//		    				if(strs.length > 2) {
					//			    				var criteriaKey = strs[0] + "." + strs[1];
					//			    				var criteriaFieldKey = strs.slice(2).join(".");
					//			    				criteriaValue[criteriaFieldKey] = _filterKey;
					//			    				var tmpCriteria = criteriaParam[criteriaKey];
					//			    				if(!criteriaParam[criteriaKey]) {
					//			    					criteriaParam[criteriaKey] = criteriaValue;
					//			    				}
					//		    				}
					//		    			} else {
					//			    			extParam[item] = _filterKey;
					//		    			}
					//		    		});

					//如果存在 critieria业务查询参数 ， 则转换参数值 object-->string， 并赋值给业务查询参数
					//		    		if(!_.isEmpty(criteriaParam)) {
					//	    	        	/**
					//	    				 *
					//	    				 demo --> {	"criteria.strValue.name" : {
					//	    				 					"criteria.strValue" : \"{"name":"检查表test11123"}\",
					//		    						 },
					//		    						 "criteria.strsValue.name" : {
					//	    				 					"criteria.strsValue" : \"{"name":["检查表test11123"]}\",
					//		    						 },
					//		    						 "name" : "检查表test11123",
					//		    						 }
					//		    					  }
					//		    			**/
					//			        	_this.dynamicQueryCriterias[filterFieldName] = criteriaParam;
					//	    			}
					//			    		_.extend(extParam, criteriaParam);
				}
				/**
				 * 构建业务查询参数
				 * end
				 * **/


				//	        	_.each(_this.dynamicQueryCriterias, function(dqc) {
				//	        		_.extend(extParam, dqc);
				//	        	});


				var extParam = this.convertDynamicQueryCriteriasToQueryParam();

				this.queryOnServer(1, extParam);
				//		    	this.handleCurPageChanged(1);
			},
			//渲染Columns
			refreshColumns: function () {
				this.displayCols = [];
				var self = this;
				self.targetCheckColumn = null;
				var customTargetCheckColumn = null;

				//临时存放显示列
				var displayColsTmp = [];

				this.columns.forEach(function (column) {
					var obj = {};
					obj.title = column.title;
					//自定义visible为false时， 优先级最高， 忽略customSetting的设置
					if (column.visible == false) {
						obj.visible = false;
					}
					//else if(self.customSetting && self.customSetting.hiddenColumns){
					//	obj.visible = self.customSetting.hiddenColumns.indexOf(obj.title) == -1;
					//}
					else {
						obj.visible = self.customSetting.hiddenColumns.indexOf(obj.title) == -1;
					}
					obj.width = column.width;
					obj.fieldName = column.fieldName;
					obj.orderName = column.orderName || column.fieldName;
					/***
					 * column.fieldType : custom(用户自定义) / link(超链接) / cb(多选框) / radio(单选框)
					 */
					obj.fieldType = column.fieldType;
					obj.showTip = column.showTip == undefined ? true : column.showTip;
					obj.tipRender = column.tipRender || null;

					obj.renderClass = column.renderClass;
					obj.filterType = column.filterType;
					obj.filterName = column.filterName;
					if (obj.fieldType == "link") {
						column.triggerRowSelected = false;
					}
					if (obj.fieldType == "cb" || obj.fieldType == "radio") {
						self.targetCheckColumn = column;
					}
					if (obj.checkColumn) {
						customTargetCheckColumn = column;
					}
					//点击是否选中当前行
					obj.triggerRowSelected = column.triggerRowSelected != false ? true : false;

					//如果存在过滤的枚举配置则优先使用用户的配置
					if (column.popFilterEnum) {
						obj.popFilterEnum = column.popFilterEnum;
					}
					//如果用户未配置过滤枚举值，则优先转换数据字典中fieldName对应的对象为枚举值
					else if (self.dataDic[column.fieldName]) {

						obj.popFilterEnum = [];
						_.each(self.dataDic[column.fieldName], function (v, k) {
							var item = {};
							item["id"] = k;
							item["value"] = v;
							obj.popFilterEnum.push(item);
						});
					}

					//用户自定义列的渲染,需要配合obj.fieldType="custom"使用
					if (column.render) {
						obj.renderDisplayValue = column.render;
					}
					if (column.toolType) {
						obj.toolType = column.toolType;
					}
					//self.displayCols.push(obj);
					displayColsTmp.push(obj);
				});


				//用户自己配置的显示列顺序
				var orderedColumns = self.customSetting.orderedColumns;
				//如果用户自定义过显示列顺序，则调整displayColsTmp
				if (orderedColumns && orderedColumns.length > 0) {
					displayColsTmp = _.sortBy(displayColsTmp, function (data) { var idx = orderedColumns.indexOf(data.title); return idx != -1 ? idx : 999 });
				}
				//将displayColsTmp赋值给双向绑定的displayCols
				displayColsTmp.forEach(function (column) {
					self.displayCols.push(column);
				});

				if (customTargetCheckColumn) {
					this.targetCheckColumn = customTargetCheckColumn;
				}

				this.setSortOrders();
				this.showScroll && this.tableWidth();
			},
			//设置所有checkbox选中状态
			setAllCheckBoxValues: function (val) {
				if (this.isServerModel()) {
					_.each(this.ds, function (item) { item.rowCheck = val; });
				} else {
					_.each(this.filteredValues, function (item) { item.rowCheck = val; });
				}
				this.calcSelectedDatas();
			},
			//显示查看图标按钮
			enableViewIcon: function (type) {
				if (type) {
					return type.indexOf("view") != -1;
				}
				return false;
			},
			//显示编辑图标按钮
			enableEditIcon: function (type) {
				if (type) {
					return type.indexOf("edit") != -1;
				}
				return false;
			},
			//显示删除图标按钮
			enableDelIcon: function (type) {
				if (type) {
					return type.indexOf("del") != -1;
				}
				return false;
			},
			//初始化内部维护的DataSource
			initDataSource: function () {
				if (!this.isCacheSelectedData) {
					this.ds = [];
					for (var i = 0; i < this.values.length; i++) {
						var rowData = { data: this.values[i] };
						//增加checkbox选中的属性
						rowData.rowCheck = false;
						this.ds.push(rowData);
					}
				} else {
					this.ds = [];
					var cachedSelectedIds = _.map(this.selectedDatas, "id");
					for (var i = 0; i < this.values.length; i++) {
						var rowData = { data: this.values[i] };
						//增加checkbox选中的属性
						rowData.rowCheck = false;

						if (this.isCacheSelectedData) {
							if (_.contains(cachedSelectedIds, rowData.data.id)) {
								rowData.rowCheck = true;
							};
						}

						this.ds.push(rowData);
					}
					this.calcSelectedDatas();
				}
			},

			//判断当前是否是服务器模式，服务器模式下，数据源和分页数据都来自服务器，否则数据来自本地设置，分页来自本地数据的计算结果
			//通过判断是否传递url值来计算当前是否是服务器模式
			isServerModel: function () {
				return this.url && this.url != '';
			},

			callBackAfterServerQueryFunc: function () {
				//清空checkbox全选
				if (this.checkAll) {
					this.checkAll = false;
				}
				//防止checkAll的上一次状态也是false，导致checkAll的watch事件不走
				else {
					this.setAllCheckBoxValues(false);
				}
			},
			//处理Page点击事件
			doPageChanged: function (curPage) {

				if (!this.isCacheSelectedData) {
					this.handleCurPageChanged(curPage);
					return;
				}

				//服务器处理
				if (this.isServerModel()) {
					//查询参数，基础参数为分页参数
					var baseParam = { curPage: curPage, pageSize: this.pageModel.pageSize };

					//一般的业务查询查询参数
					var extParam = this.convertDynamicQueryCriteriasToQueryParam();

					curPage = curPage || 1;

					//查询参数，基础参数为分页参数
					var baseParam = { curPage: curPage, pageSize: this.pageModel.pageSize };

					if (extParam) {
						_.extend(baseParam, extParam);
					}


					var _this = this;
					//避免外部通过filter参数短时间内多次调用
					this.queryOnServerLazyFunc(this, baseParam, function () {
						if (_this.checkAll) {
							_this.fromPageClick = true;
							_this.checkAll = false;
						}
					});

				}
				//本地处理
				else if (this.values) {
					this.pageModel.curPage = curPage,
						this.pageModel.totalSize = this.values.length;
				}
			},
			//处理当前页面修改
			handleCurPageChanged: function (curPage) {

				//服务器处理
				if (this.isServerModel()) {
					//查询参数，基础参数为分页参数
					var baseParam = { curPage: curPage, pageSize: this.pageModel.pageSize };

					//构建业务查询参数 start

					//一般的业务查询查询参数
					var extParam = {};

					//			    	//开启过滤输入框、设置了过滤列、输入了过滤内容才进行过滤参数的拼接
					//			    	if(this.showFilter && !_.isEmpty(this.filterColumn) && !_.isEmpty(this.filterKey)) {
					//			    		//搜索的值
					//			    		var _filterKey = this.filterKey;
					//
					//			    		//特殊的critieria业务查询参数
					//			    		var criteriaParam = {};
					//			    		//特殊的critieria对象值，在构造完成之后， 需要转成String 赋值给 criteriaParam
					//		    			var criteriaValue = {};
					//			    		_.each(this.filterColumn, function(item){
					//
					//			    			//处理特殊的Criteria参数
					//			    			//demo  输入：filterColumn:["criteria.strValue.name"]
					//			    			//期望        输出：criteria.strValue:{"name":"检查表test11123"}
					//			    			if(item.startsWith("criteria.")) {
					//			    				//去掉criteria.xxxValue前缀
					//			    				var strs = item.split(".");
					//			    				if(strs.length > 2) {
					//				    				var criteriaKey = strs[0] + "." + strs[1];
					//				    				var criteriaFieldKey = strs.slice(2).join(".");
					//				    				criteriaValue[criteriaFieldKey] = _filterKey;
					//				    				var tmpCriteria = criteriaParam[criteriaKey];
					//				    				if(!criteriaParam[criteriaKey]) {
					//				    					criteriaParam[criteriaKey] = criteriaValue;
					//				    				}
					//			    				}
					//			    			} else {
					//				    			extParam[item] = _filterKey;
					//			    			}
					//			    		});
					//
					//			    		//如果存在 critieria业务查询参数 ， 则转换参数值 object-->string， 并赋值给业务查询参数
					//			    		if(!_.isEmpty(criteriaParam)) {
					//			    			_.each(criteriaParam, function(v,k) {
					//			    				criteriaParam[k] = JSON.stringify(v);
					//			    			})
					//				    		_.extend(extParam, criteriaParam);
					//			    		}
					////			    		//如果存在 业务查询参数 ，赋值给基础查询参数
					////			    		_.extend(baseParam, extParam);
					//			    	}
					//			    	//构建业务查询参数 end



					//赋值popTipFilter的动态dynamicQueryCriterias
					//		        	_.each(this.dynamicQueryCriterias, function(dqc) {
					//		        		_.extend(extParam, dqc);
					//		        	});


					//			    	this.queryOnServer(curPage, extParam);

					var extParam = this.convertDynamicQueryCriteriasToQueryParam();
					this.queryOnServer(curPage, extParam);

				}
				//本地处理
				else if (this.values) {
					this.pageModel.curPage = curPage,
						this.pageModel.totalSize = this.values.length;
				}
			},
			setSortOrders: function () {
				this.sortKey = "";
				var sortOrders = {};
				this.columns.forEach(function (column) {
					sortOrders[column.title] = 0;
				});
				this.sortOrders = sortOrders;
			},
			sortBy: function (event, column) {
				this.$emit("on-header-click", { event: event, column: column });
				if (this.sortable) {
					var self = this;
					this.sortKey = key;
					this.columns.forEach(function (column) {
						if (column.title !== key) {
							self.sortOrders[column.title] = 0;
						}
					});
					if (this.sortOrders[key] === 0) {
						this.sortOrders[key] = 1;
					} else {
						this.sortOrders[key] = this.sortOrders[key] * -1;
					}
				}
			},
			tableHeaderStyles: function (column) {

				//用户自定义的with优先级最高
				if (column.width) {
					return "width:" + column.width;
				}
				//checkbox和radio的宽度单独统一设置
				else if (column.fieldType == "cb" || column.fieldType == "radio") {
					return "width:" + this.selectColumnWidth;
				}
				//工具列单独设置
				else if (column.fieldType == 'tool') {
					var typeCount = column.toolType.split(",").length;
					return typeCount == 1 ? "width:50px" : "width:" + 37 * typeCount + "px";
				}

				//默认日期宽度
				else if (column.filterType == "date") {
					return "width:156px;";
				}
				//默认枚举值宽度
				else if (column.filterType == "enum") {
					return "width:100px;";
				}
				// else if(this.showScroll) {
				// 	return "width:200px;";
				// }

				//最后一列width不设值,其他列计算宽度
				//	        	if(this.displayCols.indexOf(column) != this.displayCols.length - 1) {
				//					//如果第一列不是checkbox，则设置第一列宽度
				//					if(this.displayCols.indexOf(column) == 0) {
				//						return "width:" + Math.floor(100 / (this.displayCols.length))  + "%";
				//					}
				//
				////		        	return "width:25%";
				//		        	return "width:" + Math.floor(100 / (this.displayCols.length ))  + "%";
				//	        	}
				return "";
			},
			getClasses: function (col) {
				var classes = [];
				var key = col.title;
				if (key && this.sortable) {
					classes.push("arrow");
					if (this.sortKey === key) {
						classes.push("active");
					}
					if (this.sortOrders[key] === 1) {
						classes.push("asc");
					} else if (this.sortOrders[key] === -1) {
						classes.push("dsc");
					}
				}
				if (col.fieldType == "cb") {
					classes.push("cell-checkbox");
				}
				return classes;
			},

			doDragEndColumnSettingItem: function () {
				this.customSetting.orderedColumns = _.map(this.displayCols, "title");
				var orderedColumns = this.customSetting.orderedColumns;
				//确保第一个显示的列是单选框（title = ""）
				(orderedColumns[0] != "" && (orderedColumns = [""].concat(orderedColumns)));
				helper.saveColumnSetting(this.code, this.customSetting);
			},

			toggleColumn: function (column) {
				column.visible = !column.visible;

				//设置列的显示和隐藏
				var hiddenColumns = this.customSetting.hiddenColumns;
				var cInd = hiddenColumns.indexOf(column.title);
				if (!column.visible) {
					if (cInd == -1) {
						hiddenColumns.push(column.title);
					}
				} else if (cInd != -1) {
					hiddenColumns.splice(cInd, 1);
				}

				helper.saveColumnSetting(this.code, this.customSetting);
			},
			closeDropdown: function closeDropdown() {
				this.columnMenuOpen = false;
			},
			//checkbox选择框事件处理
			doCheckBoxChanged: function (event, entry, index) {
				this.calcSelectedDatas();
				//	        	if(!this.isCacheSelectedData) {
				//	        		this.calcSelectedDatas();
				//	        	} else {
				//		        	if(entry.rowCheck == false) {
				//		        		var _this = this;
				//		        		_.each(this.selectedDatas, function(item, index) {
				//		        			if(entry.data.id == item.id) {
				//		        				_this.selectedDatas.splice(index, 1);
				//		        				return;
				//		        			}
				//		        		});
				//		        	}
				//	        	}
			},
			//radioButton选择框事件处理
			doRadioBtnChanged: function (event, entry, index) {

				//清空所有选择row
				var val = false;
				if (this.isServerModel()) {
					_.each(this.ds, function (item) { item.rowCheck = val; });
				} else {
					_.each(this.filteredValues, function (item) { item.rowCheck = val; });
				}

				//设置当前row选中
				entry.rowCheck = true;

				//计算selectedData
				this.calcSelectedDatas();
			},
			//查看icon事件处理
			doViewIconClicked: function (event, entry, rowId, colId, fieldName) {
				this.$emit("on-view-row", { event: event, entry: entry, cell: { "rowId": rowId, "colId": colId, "fieldName": fieldName } });
			},
			//编辑icon事件处理
			doEditIconClicked: function (event, entry, rowId, colId, fieldName) {
				this.$emit("on-edit-row", { event: event, entry: entry, cell: { "rowId": rowId, "colId": colId, "fieldName": fieldName } });
			},
			//删除icon事件处理
			doDelIconClicked: function (event, entry, rowId, colId, fieldName) {
				var newTime = _.now();
				if (newTime - this.clickEventCfg.delIcon.lastClickTime < 200) {
					this.clickEventCfg.delIcon.lastClickTime = newTime;
					//连续间隔在200ms以内的3次点击不处理,超过3次则处理一次
					if (++this.clickEventCfg.delIcon.repeatCount < 3) {
						return;
					}
					this.clickEventCfg.delIcon.repeatCount = 0;
				}
				this.clickEventCfg.delIcon.lastClickTime = newTime;

				if (this.urlDelete && this.urlDelete != '') {
					var resource = this.$resource(this.urlDelete);
					resource.delete({}, [entry.data.id]).then(function (res) {
						if (res.ok) {
							Message.info("删除成功");
							this.$emit("on-del-row", { event: event, entry: entry, cell: { "rowId": rowId, "colId": colId, "fieldName": fieldName } });
						}
					});
				} else {
					this.$emit("on-del-row", { event: event, entry: entry, cell: { "rowId": rowId, "colId": colId, "fieldName": fieldName }, refreshFuc: _.bind(this.doRefresh, this) });
				}
			},
			//单元格点击事件处理
			doCellClicked: function (event, entry, rowId, colId, col) {

				this.$emit("on-click-cell", { event: event, entry: entry, cell: { "rowId": rowId, "colId": colId, "fieldName": col.fieldName } });

				//除了自己之外其，取消其他选择的项
				if (this.isSingleCheck == true && col.fieldType != "link") {
					var curRowCheckStatus = entry['rowCheck'];
					_.each(this.ds, function (item) { item.rowCheck = false; });
					entry['rowCheck'] = curRowCheckStatus;
				}

				if (this.targetCheckColumn && col.triggerRowSelected) {
					if (this.targetCheckColumn.fieldType == "cb") {

						entry['rowCheck'] = !entry['rowCheck'];
						//			        	if(this.isCacheSelectedData) {
						//			        		if(entry.rowCheck == false) {
						//				        		var _this = this;
						//
						//				        		_.each(this.selectedDatas, function(item, index) {
						//				        			if(item && item.id && entry.data.id && entry.data.id == item.id) {
						//				        				_this.selectedDatas.splice(index, 1);
						//				        				return;
						//				        			}
						//				        		});
						//				        	}
						//			        	}
						this.calcSelectedDatas();
					} else if (this.targetCheckColumn.fieldType == "radio") {
						this.doRadioBtnChanged(event, entry, rowId);
					}
				}
				else if (col.fieldType == "link") { //是link列，并且不会触发行选中，则记录该列为最后点击的列
					this.lastClickedLinkRowId = entry.data.id;
				}
			},
			//单元格点击事件处理
			doCellDbClicked: function (event, entry, rowId, colId, col) {
				this.$emit("on-dbclick-cell", { event: event, entry: entry, cell: { "rowId": rowId, "colId": colId, "fieldName": col.fieldName } });
			},
			//计算选择的数据
			calcSelectedDatas: function () {
				if (!this.isCacheSelectedData) {
					this.selectedDatas = _.map(_.where(this.ds, { rowCheck: true }), function (item) { return item.data });

					if (!this.checkAll && this.selectedDatas.length > 0 && this.selectedDatas.length == this.ds.length) {
						this.checkAll = true;
					}
					//解决在当前有数据源 但 没选择任何数据时, 全选按钮没重置问题
					else if (this.checkAll && this.selectedDatas.length == 0 && this.selectedDatas.length != this.ds.length) {
						this.checkAll = false;
					}
				} else {

					var cachedSelectedIds = _.map(this.selectedDatas, "id");
					var _this = this;

					var curPageSelectedItems = [];
					_.each(this.ds, function (item, index) {
						var curSelectedIndex = cachedSelectedIds.indexOf(item.data.id);
						if (curSelectedIndex > -1) {
							if (item.rowCheck == false) { //如果当前数据源中的对象在 所选的缓存行中存在， 并且item.rowCheck == false， 则在缓存行中删除该对象，同时删除方便计算的cachedSelectedIds
								_this.selectedDatas.splice(curSelectedIndex, 1);
								cachedSelectedIds.splice(curSelectedIndex, 1);
							} else {
								curPageSelectedItems.push(item.data);
							}
						}
						else if (item.rowCheck == true) { //不存在则新增
							_this.selectedDatas.push(item.data);
							curPageSelectedItems.push(item.data);
						}
					});

					if (!this.checkAll && curPageSelectedItems.length > 0 && curPageSelectedItems.length == this.ds.length) {
						this.checkAll = true;
					}
					else if (this.checkAll && curPageSelectedItems.length == 0) {
						this.checkAll = false;
					}
				}
			},
			scrollHeader: function (event) {
				this.hidePopTipTrigger++;
				this.$refs.tableHeader.$el.scrollLeft = event.target.scrollLeft;
			},
			tableWidth: function () {
				var _this = this,
					width = 0,
					containerWidth = _this.screenWidth - 277;
				_.each(_this.displayCols, function (data) {
					if (data.visible) {
						if (data.fieldType == 'cb' || data.fieldType == 'radio') {
							width += data.width ? parseInt(data.width) : 60;
						} else if (data.filterType == 'date') {
							width += data.width ? parseInt(data.width) : 156;
						} else if (data.filterType == 'enum') {
							width += data.width ? parseInt(data.width) : 100;
						} else {
							width += data.width ? parseInt(data.width) : 150;
						}
					}
				});
				width = containerWidth > width ? containerWidth : width;
				width = this.showScroll ? (width + 'px') : '100%';
				return width;
			},
		},
		events: {}
	};

	var component = Vue.extend(opts);
	Vue.component('vue-bootstrap-table', component);

});