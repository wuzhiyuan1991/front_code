define(function (require) {
  var LIB = require("lib");
  var template = require("text!./table.html");
  var Vue = require("vue");
  var Message = require("components/iviewMessage");
  var Page = require("../page/iviewPage");
  var helper = require("./tableHelper");
  var cfg = helper.cfg();
  var tableCtrl = require("./tableCtrl");


  var LAST_CLOUMN_MIN_WIDTH = 150, // 最后一列的最小宽度
    MIN_WIDTH = 60,
    POPTIP_WIDTH = 240, // 默认过滤框宽度
    SCROLLBAR_WIDTH = helper.getScrollbarWidth();
  // OUT_TABLE_WIDTH = 261 + SCROLLBAR_WIDTH; // 计算表格宽度需要减去的宽度(左侧菜单: 240;padding: 20;元素间隔: 1)

  var sidebarDefaultState = false;
  var requestParams = null; // 缓存请求参数， 防止请求过快
  var requestUrl = null; // 缓存请求参数， 防止请求过快

  //todo 暂时的方案，以后需要用绝对定位解决
  var prefixCls = 'table-';
  var opts = {
    name: "VueBootstrapTable",
    template: template,
    props: {
      rowMergeCondition: {
        type: [Function, Boolean],
        default: false
      },
      rowMerge: { //todo 暂时只支持一列，行合并， 并且要吧这列设为固定列 eg columns:[{fieldName:'name',fixed:true}}]
        type: Boolean,
        default: false,
      },
      colMerge: {
        type: Boolean,
        default: false,
      },
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
        default: function () {
          return [10, 50, 100, 200]
        }
      },
      popFilterEnum: {
        type: Array,
        required: false,
      },
      //可选择列的默认宽度，可选择列包括  checkbox 和  radio
      selectColumnWidth: {
        type: Number,
        default: 60
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
      },
      // 表格单元格的宽度是否可以拖动
      resizeable: {
        type: Boolean,
        default: false
      },
      // 是否显示loading
      showLoading: {
        type: Boolean,
        default: false
      },
      // 搜索文本框的值
      filterKey: {
        type: String,
        default: ''
      },
      // 表格的宽度是否自适应， 如过为false，则表格的宽度为所有列的宽度， 最有一列不做处理
      autoWidth: {
        type: Boolean,
        default: true
      },
      cursor: {
        type: String,
        default: 'default'
      },
      showPageNumber: {
        type: Boolean,
        default: true
      },
      rowClass: {
        type: Function,
        default: null
      },
      pageSizeIndex: { //分页取数组的第几个为默认值
        type: Number,
        default: 0
      },
      // 是否启用本地数据搜索,若为true则数据检索时交由上一级组件 向上传递 do-filter事件，若为false则使用正常的请求数据检索
      isNativeData: {
        type: Boolean,
        default: function () {
          return false
        },
        required: false
      }
    },
    data: function () {
      return {
        showSpin: false,
        emptyRows: [],
        hoverIndex: null,
        scrollLeft: 0, // 表格X轴滚动的距离
        hidePopTipTrigger: 0,
        filteredSize: 0,
        sortKey: "",
        sortOrders: {},
        columnMenuOpen: false,
        //checkbox全选
        checkAll: false,
        //内部维护的数据源
        ds: [],
        //分页属性
        pageModel: {
          curPage: 1,
          pageSize: this.pageSizeOpts[this.pageSizeIndex],
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

        lastClickedRowIndex: "",

        //10毫秒之内的多次调用, 只执行最后一次的调用
        queryOnServerLazyFunc: _.debounce(function (_this, baseParam, callBack) {
          var resource = _this.$resource(_this.url),
            startHTTPTime = Date.now(),
            timer = null;
          if (_.isEqual(requestParams, baseParam) && _this.url === requestUrl) {
            return;
          }
          requestParams = baseParam;
          requestUrl = _this.url;
          /**
           *  请求时间小于600ms，不显示
           *  请求时间大于600ms小于800ms，显示到800ms
           *  请求事件大于800ms，显示到请求结束
           */
          if (_this.showLoading) {
            _this.queryCount++;
            timer = setTimeout(function () {
              _this.showSpin = true;
            }, 600)
          }
          resource.get(baseParam).then(
            function (res) {
              requestParams = null;
              requestUrl = null;
              _this.lastClickedRowIndex = -1;
              _this.hoverIndex = -1;
              var data = res.data;

              var pageSize = Number(data.pageSize);
              var pageNum = Number(data.pageNum);
              var total = Number(data.total);

              _this.pageModel.curPage = pageNum !== 0 ? pageNum : 1;
              // _this.pageModel.pageSize = pageSize;
              _this.pageModel.totalSize = total;
              _this.values = data.list || [];

              _this.$emit("on-data-loaded", this.values);

              if (_this.$el && _this.refreshMark !== 'noScrollToTop') {
                //table内容滚动到头部

                _this.$nextTick(function () {

                  var cc = _this.$el.querySelector(".table-scroll-main-body");
                  var ff = _this.$el.querySelector(".table-fixed-left-body");

                  cc && (cc.scrollTop = 0);
                  ff && (this.$els.fixedBodyTable.style.transform = "translateY(0)");
                });
              }

              _this.refreshMark = '';
              _this.queryCount--;
              var httpExpendTime = Date.now() - startHTTPTime;
              if (httpExpendTime < 600) {
                clearTimeout(timer);
              } else if (httpExpendTime < 800) {
                setTimeout(function () {
                  _this.showSpin = false;
                }, 800 - httpExpendTime)
              } else if (!_this.queryCount) {
                _this.showSpin = false;
              } else {
                _this.showSpin = false;
              }
              callBack && callBack();
            },
            function () {
              requestParams = null;
              requestUrl = null;
              _this.showSpin = false;
            }
          );
        }, 10),

        //设置点击事件的一些配置, 初始为null, 因为不需要绑定
        clickEventCfg: null,
        //todo 暂时的方案，以后需要用绝对定位解决
        //滚动的参数
        scrolled: 2,
        displayCols: [],
        fixedColumns: [],
        headRows: null, // 主体表格表头
        fixedHeadRows: null, // 左侧固定表头
        settingColumns: null
      };
    },
    watch: {
      resetTriggerFlag: function (val) {
        this.cleanAllStatus();
        //重置到第一页
        this.handleCurPageChanged(1);
      },
      url: function (val) {
        this.values = [];
        this.filterKey = '';
        if (!this.lazyLoad) {
          this.handleCurPageChanged(1);
        }
        requestParams = null;
        requestUrl = null;
      },
      values: {
        handler: function (val, oldVal) {
          var _this = this;
          this.lastClickedRowIndex = -1;
          this.hoverIndex = -1;
          //如果 values 是本地数据源的变化，则需要额外更新分页
          if (!this.isServerModel()) {
            //如果修改的数据长度一致 则不需要更新分页信息
            //只有数据更新的才更新翻页信息
            // if (val.length !== oldVal.length) {
            //     this.pageModel.curPage = 1;
            // }
            if (this.pageModel.curPage > 1) {
              if ((val.length % this.pageModel.pageSize) === 0) {
                this.pageModel.curPage = 1;
              }
            }
            this.pageModel.totalSize = this.values.length;
            this.$emit("on-data-loaded", this.values);
          }
          //初始化内部维护的DataSource
          this.initDataSource();
          this.setMergeData();

        },
        deep: true
      },

      columns: function (val) {
        this.customSetting = [];
        //column发生变化则重新渲染
        _.isArray(val) && this.refreshColumns();
      },

      showFilter: function () {
        this.filterKey = "";
      },
      showColumnPicker: function () {
        this.columnMenuOpen = true;

      },
      //checkbox全选的状态
      checkAll: function (val) {
        //如果不是全部选中的状态， 则不全选， 转为middle状态
        if (val && this.isHalfCheck) {
          this.$nextTick(function () {
            this.checkAll = false;
          });
        } else {
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
      filteredValues: function () {
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
          var curSelectedRows = _.filter(this.ds, function (item) {
            return item.rowCheck == true;
          });
          return curSelectedRows.length > 0 && curSelectedRows.length != this.ds.length;
        }
      },
      //todo 暂时的方案，以后需要用绝对定位解决
      tableClasses: function () {
        var obj = {};
        obj[prefixCls + 'scroll'] = this.showScroll;
        return [obj];
      }
    },
    methods: {
      setRowClass: function (rowIndex, entry) { //[{'selected-row' : rowIndex === lastClickedRowIndex, 'tr-mouseover':hoverIndex == rowIndex }]
        var cls = "";
        if (rowIndex === this.lastClickedRowIndex) {
          cls += 'selected-row ';
        }
        if (rowIndex === this.hoverIndex) {
          cls += 'tr-mouseover ';
        }
        if (this.rowClass && rowIndex !== this.lastClickedRowIndex) {
          cls += this.rowClass(entry.data);
        }
        return cls;
      },
      setMergeData: function () {
        var _this = this;
        if (_this.rowMerge || _this.colMerge) {
          if (!_this.values || !_this.values.length) {
            return
          }
          var mergeData = _this.values.map(function (item) {
            return {
              colsCount: 1,
              rowsCount: 1
            }
          });
          var mergeItem = null;
          for (var i = 1; i <= mergeData.length - 1; i++) {
            var pre = _this.values[i - 1];
            var next = _this.values[i];
            var conditionFun = _this.rowMergeCondition || _this._rowMergeCondition;
            if (conditionFun(pre, next)) {
              if (mergeItem == null) {
                mergeItem = mergeData[i - 1];
              }
              mergeItem.rowsCount++;
            } else if (mergeItem != null) {
              mergeItem = null;
            }
          }
          Vue.set(_this, 'mergeData', mergeData);
        }
      },
      _isMergeColumn: function (col) {
        return !("cb,sequence".indexOf(col.fieldType) > -1 || "code,title".indexOf(col.fieldName) > -1)
      },
      getRowMerge: function (rowIndex, colIndex) {
        //todo 现在是去不为code tile cb 列合并 所以和并列最好是一列
        if (this.rowMerge && this._isMergeColumn(this.fixedColumns[colIndex])) {
          return this.mergeData[rowIndex].rowsCount || 1;
        } else {
          return '';
        }
      },
      _rowMergeCondition: function (pre, next) {
        var _this = this;

        function getKey(i) { //暂时只支持一固定列合并 固定列必须有filedName 除非自定义 rowMergeCondition
          var col = _this.fixedColumns[i];
          if (!_this._isMergeColumn(col)) {
            return getKey(i + 1);
          } else {
            return col.fieldName;
          }
        }
        var key = getKey(0);
        return pre[key] === next[key];
      },
      tableHeaderStyles: function (column) {
        if (!column.width) {
          return "";
        }
        if (column.width.toString().indexOf('%') > 0 || column.width.toString().indexOf('px') > 0) {
          return "width:" + column.width;
        } else {
          return "width:" + column.width + 'px';
        }
      },
      //清空列过滤条件
      clearFilterColumns: function () {
        var _this = this;
        _.each(_this.filterColumn, function (filterName) {
          delete _this.dynamicQueryCriterias[filterName];
        });
      },

      renderHead: function (column) {
        if (_.isFunction(column.renderHead)) {
          return column.renderHead()
        }
        return column.title;
      },
      /*
       * 渲染Columns
       * 遍历数据，检查是否有fixed属性的项，存入fixedCloumns:Array[]中，其他存入srcollColumns:Array[]中
       * 计算固定表格宽度和滚动表格宽度
       * 计算是否出现滚动条
       *
       */
      refreshColumns: function () {
        this.pageModel.curPage = 1;
        this.displayCols = [];
        var self = this;



        // 复制传入的列配置
        var columns = _.cloneDeep(this.columns);

        // 设置显示序号列, TODO: 删除表格showSeq配置，将序号列放到lib.js中，有需要的地方加上序号列配置
        if (this.showSeq) {
          if (columns[0] && columns[0].fieldType === "cb") {
            columns.splice(1, 0, tableCtrl.sequenceColumn)
          } else {
            columns.unshift(tableCtrl.sequenceColumn);
          }
        }

        var _d = tableCtrl.buildColumns(columns, this.code, this.resizeable);

        // console.log(_d, columns, this.code, this.resizeable);
        this.headRows = _d.headRows; // 主体表格头部
        this.fixedHeadRows = _d.fixedHeadRows; // 固定表格头部
        this.bodyColumns = _d.bodyColumns; // 主体表格
        this.fixedColumns = _d.fixedColumns; // 固定表格
        this.settingColumns = _d.settingColumns; // 右上角设置

        this.customSetting = this.code ? helper.queryColumnSetting(this.code) : [];

        // 设置左侧固定表格宽度
        if (this.fixedColumns.length > 0) {
          var fixedTotalWidth = 0;
          this.fixedColumns.forEach(function (item) {
            fixedTotalWidth += item.width;
          });
          this.$els.fixedTable.style.width = fixedTotalWidth + 'px';
        }

        // 处理整个宽度，当单元格宽度和小于100%时最后一列填充宽度
        if (this.resizeable) {
          var totalWidth = tableCtrl.getTotalWidth(this.bodyColumns);
          // 表格是否在Modal里面
          // var isSelectModal = this.$el.parentNode.classList.contains('epc-content');
          // if (isSelectModal) {
          //     // TODO 替换jQuery的方法
          //     var _modalWidth = parseInt($(this.$el).parents('.ivu-modal')[0].style.width) || 860;
          //     this.containerClientWidth = _modalWidth - 43 - SCROLLBAR_WIDTH;
          // } else {
          //     this.containerClientWidth = document.body.clientWidth - this.OUT_TABLE_WIDTH;
          // }
          // 在弹窗中需要减去边框宽度
          var isInModal = this.$el.closest(".userSelectModal");
          var borderWidth = isInModal ? 3 : 0;

          this.containerClientWidth = this.$el.parentNode.offsetWidth - SCROLLBAR_WIDTH - borderWidth;
          var diffWidth = this.containerClientWidth - totalWidth;

          if (this.autoWidth) {
            if (diffWidth > 0) {
              var _lastCol = _.findLast(this.bodyColumns, function (col) {
                return col.visible;
              });
              if (_lastCol) {
                _lastCol.width += diffWidth;
              }

              this.setFixedBodyHeight(false);
            } else {
              this.setFixedBodyHeight(true);
            }
          }
        }

        //将_displayColsTmp赋值给双向绑定的displayCols
        this.bodyColumns.forEach(function (column) {
          self.displayCols.push(column);
        });


        this.targetCheckColumn = _.find(this.bodyColumns, function (col) {
          return col.fieldType === 'cb' || col.fieldType === 'radio';
        })
        this.setSortOrders();
        this.showScroll && this.tableWidth();

        this.$nextTick(function () {
          var header = this.$els.scrollHeader;
          var h = getComputedStyle(header, null).height;
          this.$els.settingIcon.style.height = h;
          this.$els.settingIcon.style.lineHeight = h;
        })
      },
      // 计算过滤框的位置 返回值： bottom-start || bottom-end
      popTipPlacement: function (index) {
        var fixedWidth = 0,
          columnsWidth = 0;

        // 不是固定表格
        if (this.fixedColumns.length === 0) {
          return 'bottom-end';
        }

        // 计算前(index+1)列的宽度
        for (var i = 0; i <= index; i++) {
          columnsWidth += this.displayCols[i].width;
        }

        // 计算左侧固定表格宽度
        this.fixedColumns.forEach(function (item) {
          fixedWidth += item.width;
        });


        if (columnsWidth > fixedWidth + POPTIP_WIDTH + this.scrollLeft) {
          return 'bottom-end';
        } else {
          return 'bottom-start';
        }
      },
      pickerPlacement: function (index) {
        var fixedWidth = 0,
          columnsWidth = 0;
        // 计算左侧固定表格宽度
        this.fixedColumns.forEach(function (item) {
          fixedWidth += item.width;
        });
        // 计算前(index+1)列的宽度
        for (var i = 0; i <= index; i++) {
          columnsWidth += this.displayCols[i].width;
        }

        if (columnsWidth > fixedWidth + 434 + this.scrollLeft) {
          return 'bottom-end';
        } else {
          return 'bottom-start';
        }
      },
      // 设置左侧固定表格的高度，有横向滚动条时减去SCROLLBAR_WIDTH(滚动条的高度)
      setFixedBodyHeight: function (hasScrollBar) {
        if (!this.fixedColumns.length || !this.$fixedTable) return;
        if (hasScrollBar) {
          this.$fixedTable.style.height = "calc(100% - " + SCROLLBAR_WIDTH + "px)";
        } else {
          this.$fixedTable.style.height = "100%";
        }
      },
      mousemove: function (event) {
        var diffWidth = event.pageX - this.resizeStartPageX;
        this.moveDistance = diffWidth;
        // if (diffWidth < 0 && ((resizeStartWidth + diffWidth) < columnMinWidth)) diffWidth = columnMinWidth - resizeStartWidth;
        var resizeWidth = this.resizeStartX + diffWidth;
        this.resizeEndWidth = this.resizeStartWidth + diffWidth;
        if (this.resizeEndWidth < MIN_WIDTH) {
          this.resizeEndWidth = MIN_WIDTH;
          return;
        }
        this.$resizeLine.style.left = resizeWidth + 'px'
      },
      mouseup: function (event) {

        this.$els.table.classList.remove("table-resizing");
        this.$resizeLine.style.left = 0;
        var title = this.$resizeTh.dataset.title,
          index = 0,
          totalWidth = 0;

        this.displayCols.some(function (item, idx) {
          if (item.title === title) {
            index = idx;
          }
          return item.title === title;
        });

        // 改变th的宽度，表格列数据更新
        this.displayCols[index].width = this.resizeEndWidth;
        var _column = this.displayCols[index];
        _column.width = this.resizeEndWidth;

        this.displayCols.splice(index, 1, _column);
        if (_.isPlainObject(this.customSetting[index])) {
          this.customSetting[index].width = this.resizeEndWidth;
        }
        this.displayCols.forEach(function (item) {
          totalWidth += item.width;
        });

        if (this.autoWidth) {
          // 表格父元素的宽度与单元格宽度和之差，当单元格宽度之和小于100%时填充最后一列宽度
          // 当最后一列的宽度小于设定最小宽度(LAST_CLOUMN_MIN_WIDTH)，且其他列宽度在增大时，减少最后一列的宽度
          var diffWidth = this.containerClientWidth - totalWidth;
          var lastIdx = _.findLastIndex(this.displayCols, function (col) {
            return col.visible;
          });
          // 设置左侧固定表格的高度
          if (this.fixedColumns.length > 0) {
            if (diffWidth > 0) {
              this.setFixedBodyHeight(false)
            } else {
              this.setFixedBodyHeight(true);
            }
          }
          if (diffWidth > 0) {
            this.displayCols[lastIdx].width += diffWidth;
            if (_.isArray(this.customSetting)) {
              this.customSetting[lastIdx].width += diffWidth;
            }
          } else if ((diffWidth + this.moveDistance) >= 0 && this.moveDistance > 0 && index !== lastIdx) {
            this.displayCols[lastIdx].width = Math.max(LAST_CLOUMN_MIN_WIDTH, this.displayCols[lastIdx].width - this.moveDistance);
          }
        }

        if (_.isArray(this.customSetting)) {
          helper.saveColumnSetting(this.code, this.customSetting);
        }

        // 计算左侧固定表格的宽度
        if (this.displayCols[index].fixed) {
          var fixedTotalWidth = 0;
          this.fixedColumns.forEach(function (item) {
            fixedTotalWidth += item.width;
          })
          this.$fixedTable.style.width = fixedTotalWidth + 'px';
        }

        //解绑事件
        document.removeEventListener("mousemove", this.mousemove);
        document.removeEventListener("mouseup", this.mouseup);

        this.showScroll && this.tableWidth();
      },
      resizeWidth: function (event) {
        // 如果设置不能resize单元格，直接返回
        if (!this.resizeable) return;
        var $el = event.target;
        if ($el.classList.contains("resize-handle")) {
          var $parent = $el.parentNode,
            index = $parent.dataset.index;

          this.resizeStartWidth = $parent.offsetWidth;

          // 判断是否是左侧固定表格的th
          if (this.displayCols[index].fixed) {
            this.resizeStartX = $parent.offsetLeft + this.resizeStartWidth;
          } else {
            this.resizeStartX = $parent.offsetLeft - this.$els.scrollBody.scrollLeft + this.resizeStartWidth;
          }

          this.$resizeLine.style.left = this.resizeStartX + 'px';
          this.resizeStartPageX = event.pageX;
          this.$resizeTh = $parent;

          // 消除用户选中
          this.$els.table.classList.add("table-resizing");

          // 绑定事件
          document.addEventListener("mousemove", this.mousemove);
          document.addEventListener("mouseup", this.mouseup);
        }
      },
      buildDefaultFilter: function (defaultFilterFieldName) {

        var _filterValue = this.defaultFilterValue;

        if (this.useDefaultGlobalFilter) {
          if (!_filterValue) {
            _filterValue = this.defaultGlobalFilterValue;
          } else {
            _.defaults(_filterValue, this.defaultGlobalFilterValue);
          }
        }

        if (!_.isEmpty(_filterValue)) {
          var _this = this;
          _.each(_filterValue, function (v, k) {
            if(k == defaultFilterFieldName || !defaultFilterFieldName) {
              var filterFieldName = k;
              var filterSelectedValues = v;
              if (!_this.dynamicQueryCriterias[filterFieldName]) {
                var criteriaParam = _this.initServerCriteriaPojo(filterFieldName, filterSelectedValues);
                _this.dynamicQueryCriterias[filterFieldName] = criteriaParam;
              }
            }
          });
        }
      },
      //todo 暂时的方案，以后需要用绝对定位解决
      doScroll: function () {
        this.hidePopTipTrigger++;
        this.scrolled = -(document.body.scrollTop - 2);
      },
      cleanAllStatus: function () {
        if (this.isCacheSelectedData) {
          this.selectedDatas = [];
        }

        var _this = this;
        _this.filterKey = "";
        //则删除默认搜索条件，查询所有
        if (!_.isEmpty(_this.filterColumn)) {
          _.each(_this.filterColumn, function (filterName) {
            delete _this.dynamicQueryCriterias[filterName];
          });
          // 修复 TASK 1301 引起的问题
          var keys = _.keys(_this.dynamicQueryCriterias);
          if (_.includes(keys, "criteria.strValue.keyWordValue_join_")) {
            _.each(keys, function (name) {
              if (_.startsWith(name, "criteria.strValue.keyWordValue")) {
                delete _this.dynamicQueryCriterias[name];
              }
            });
          }
        }
      },
      //清空table数据
      doClearData: function () {
        this.selectedDatas = this.values = this.ds = [];
        this.checkAll = false;
        this.pageModel.curPage = 1;
        // this.pageModel.pageSize = pageSize;
        this.pageModel.totalSize = 0;
      },
      //获取当前的搜索条件
      getCriteria: function () {
        //	    		return _.reduce(_.values(this.dynamicQueryCriterias), function(memo, obj){ _.extend(memo, obj); return memo}, {});
        return this.convertDynamicQueryCriteriasToQueryParam();
      },
      calDisplayLabel: function (entry, column, nbsp) {
        var dataDicValue;
        // 取值
        var fieldValue = _.propertyOf(entry.data)(column.fieldName);

        if (column.fieldType === 'enum' && column.dataDicKey) {
          dataDicValue = this.dataDic[column.dataDicKey];
        } else {
          // 从数据字典中查询， 是否由key为column.fieldName的数据字典
          dataDicValue = this.dataDic[column.fieldName];
        }

        /**
         * 判断数据字典中的值是否存在， 优先使用数据字典中的值,未来通过参数决定是否默认使用数据字典的值
         * 数据结构例子:
         * dataDic = {disable : {0:启用, 1:禁用}},
         * column.fieldName = 'disable',
         * =>
         * dataDicValue = {0:启用, 1:禁用},
         * entry.data[column.fieldName] = 0
         * =>
         * '启用'
         */
        if (dataDicValue && dataDicValue[fieldValue]) {
          return dataDicValue[fieldValue];
        }
        if (nbsp) {
          // return fieldValue.replace(/\s/g, '&nbsp;');
        }
        return fieldValue;

      },
      doUpdateRowData: function (data) {
        var _this = this;
        var rowDatas = [];
        if (data.value instanceof Array) {
          rowDatas = data.value;
        } else {
          rowDatas.push(data.value);
        }

        var opType = data.opType;
        if (opType === "update") {
          _.each(rowDatas, function (rowData) {
            var newData = rowData;
            if (newData && newData.id) {
              var rowData = _.findWhere(_this.values, {
                id: newData.id
              });
              if (rowData) {

                // //对象数组需要单独处理
                // Object.keys(newData).forEach(function (propName) {
                //     var oldProp = rowData[propName],
                //         newProp = newData[propName];
                //
                //     // 更新的属性是数组
                //     if (_.isArray(oldProp) && _.isArray(newProp)) {
                //         if (newProp.length === 0) {
                //             oldProp.length = 0; // 这里必须设置length = 0， 不能直接赋值 []， 否则会导致Obser属性 __ob__ 丢失
                //         } else if (_.isObject(newProp[0])) { //并且是对象数组
                //             oldProp.length = 0; // 这里必须设置length = 0， 不能直接赋值 []， 否则会导致Obser属性 __ob__ 丢失
                //             //去掉可能的get set方法
                //             _.deepExtend(oldProp, _.clone(newProp));
                //         }
                //     }
                // });

                _.deepExtend(rowData, newData);
              }
            }
          });
        } else if (opType === "create" || opType === "add" || opType === "remove") {
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
       *        value :
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

        //如果没有查询条件 使用custom默认搜索条件 或者 全局默认搜索条件
        if (_.isEmpty(extParam)) {
          extParam = this.convertDynamicQueryCriteriasToQueryParam();
        }
        if (!_.get(extParam, "criteria.orderValue.fieldName")) {
          this.buildDefaultFilter("criteria.orderValue");
          extParam = this.convertDynamicQueryCriteriasToQueryParam();
        }

        this.queryOnServer(1, extParam);

      },
      /**
       * 不修改任何参数，不触发分页，刷新当前页的数据
       */
      doRefresh: function (mark) {
        this.refreshMark = mark; // 请求结束后表格是否滚动到顶部
        var extParam = this.convertDynamicQueryCriteriasToQueryParam();
        this.queryOnServer(this.pageModel.curPage, extParam);
      },

      /**
       * 根据opts 决定是否删除了默认的全局过滤条件、 默认过滤条件， 以及其他的所有自定义过滤条件，并根据新的条件查询table数据
       *
       * data 可以是一个 data格式的对象或者， 包含了data格式元素的数据
       * data 参数格式：
       *        value :
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

        var opts = {
          keepCurPage: false,
          keepDefaultGlobalFilter: true,
          keepDefaultFilter: true
        };
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

        // 具体使用参考课程复培搜索
        var columnName = data.value["columnName"] || data.value["columnFilterName"];

        var columnFilterName = data.value["columnFilterName"];
        var columnFilterValue = data.value["columnFilterValue"];
        if (columnFilterName) {
          if (columnFilterValue != undefined && columnFilterValue != null) { //如果 columnFilterValue columnFilterName 都存在则判断type 进行相应处理
            if (data.type == "save") {

              var criteriaParam = this.initServerCriteriaPojo(columnFilterName, columnFilterValue);
              if (!_.isEmpty(criteriaParam)) {
                this.dynamicQueryCriterias[columnName] = criteriaParam;
              }
            }
            if (data.type == "remove" && this.dynamicQueryCriterias[columnName]) {
              delete this.dynamicQueryCriterias[columnName];
            }
          } else { //如果 columnFilterValue 不存在 则删除 columnFilterName 对应的值
            delete this.dynamicQueryCriterias[columnName];
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
        var baseParam = {
          curPage: curPage,
          pageSize: this.pageModel.pageSize
        };

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

      /**
       * 过滤提示框点击确认按钮后事件处理
       * @param {event} event
       * @param {object} column
       * @param {string} val 父组件传递的值 需求: task 1097
       */
      doOkActionInFilterPoptip: function (event, column, val) {
        var _this = this;
        //	    		var cityMap = _.indexBy(this.cityList,"id")

        var displayValue = "";

        //根据条件搜索后台数据
        //	    		var extParam = {};

        var filterFieldName = column.filterName || column.fieldName;
        //简单文本输入
        if (!column.filterType || column.filterType === "text" || column.filterType === "number") {
          if (val) {
            var param = val;
            displayValue = val;
          } else {
            var param = this.popTipFilterValue.strValue;
            displayValue = this.popTipFilterValue.strValue;
          }
          if (column.filterType === 'number' && param && param.length > 9) {
            return LIB.Msg.warning("该字段过滤参数最大长度为9");
          }
          //不为empty则  增加/更新 条件
          if (!_.isEmpty(param)) {
            // var criteriaParam = {};
            // criteriaParam[filterFieldName] = param;
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
        else if (column.filterType === "enum") {

          var enumMap = _.indexBy(column.popFilterEnum, "id");

          var filterSelectedValues = this.popTipFilterValue.strValues;

          // task 2310 页面设置初始过滤条件，枚举 val 需要设置是一个数组
          if (val) {
            filterSelectedValues = val;
          }
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
        else if (column.filterType === "date") {
          var filterSelectedValues = this.popTipFilterValue.dateValues;
          if (_.isArray(val)) {
            filterSelectedValues = val;
          }
          var isValid = !_.isEmpty(filterSelectedValues);

          //2019-05-06修改成支持时间字段开区间搜索
          isValid = isValid && _.some(filterSelectedValues, function (val) {
            return !!val;
          });
          if (isValid) {
            var filterFieldName = column.filterName || column.fieldName;
            var startDate = filterSelectedValues[0] && filterSelectedValues[0].Format();
            var endDate = filterSelectedValues[1] && filterSelectedValues[1].Format("yyyy-MM-dd 23:59:59");
            if (!!startDate && !!endDate) {
              displayValue = startDate && endDate && startDate + " - " + endDate;
            } else if (!!startDate && !endDate) {
              displayValue = ">=" + startDate;
            } else if (!startDate && !!endDate) {
              displayValue = "<=" + endDate;
            }

            var startDateKey = "start" + filterFieldName.firstUpperCase();
            var endDateKey = "end" + filterFieldName.firstUpperCase();

            var criteriaParam = {
              "criteria.dateValue": {}
            }; //this.initServerCriteriaPojo(filterFieldName, filterSelectedValues);
            if (!!startDate) {
              criteriaParam["criteria.dateValue"][startDateKey] = startDate;
            }
            if (!!endDate) {
              criteriaParam["criteria.dateValue"][endDateKey] = endDate;
            }

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
        if (column.filterCondition) {
          //自定义条件
          var b = column.filterCondition(param, extParam); //返回false只表示通过
          if (b) { //返回了字符串就提示报错
            return LIB.Msg.warning(b);
          }
        }
        if (column.filterCustom) { //可以用户自己添加自定义筛选条件  //todo 这个逻辑理论上应该覆盖原来的条件逻辑 litao
          delete extParam[filterFieldName];
          _.extend(extParam, column.filterCustom(param, extParam))
        };
        this.queryOnServer(1, extParam);


        //var columnValue = {};
        //columnValue.fieldName = column.fieldName;
        //columnValue.filterName = column.filterName

        var data = {};
        //条件 标题
        data.displayTitle = column.title;
        //条件 内容
        data.displayValue = displayValue;
        //条件 后台搜索的 属性
        data.columnFilterName = column.filterName || column.fieldName;
        //条件 后台搜索的 值
        data.columnFilterValue = this.popTipFilterValue.strValues;


        //this.$emit("on-click-poptip-filter-ok", {event:event, column:columnValue, displayValue: displayValue, value:this.popTipFilterValue, filterData : _this.dynamicQueryCriterias});
        this.$emit("on-click-poptip-filter-ok", data);
        //清空过滤条件数据
        this.popTipFilterValue.strValue = "";
        this.popTipFilterValue.strValues = [];
        this.popTipFilterValue.dateValues = [];
        //关闭PopTip
        this.hidePopTipTrigger++;

      },

      doOrderActionInFilterPoptip: function (event, column, orderType) {
        if (!column.sortable) {
          return;
        }

        var filterFieldName = "criteria.orderValue";
        var filterSelectedValues = {};
        filterSelectedValues.fieldName = column.orderName;
        filterSelectedValues.orderType = orderType;
        if (filterSelectedValues.fieldName == "modifyDate") {
          filterSelectedValues.primeFieldName = "modifyDate";
        }
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
               *    demo {critieria.strValue : {name:"123"},  critieria.strValue : {orgName:"123"}}
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
        // 当设置为isNativeData触发上级组件筛选；
        if (this.isNativeData) {
          return this.$emit('do-filter', this.filterKey)
        }

        //通过自定义搜索框输入的搜索条件时，如果输入条件为空，则删除默认搜索条件，查询所有
        if (_this.showFilter && !_.isEmpty(_this.filterColumn) && _.isEmpty(_this.filterKey)) {
          _.each(_this.filterColumn, function (filterName) {
            delete _this.dynamicQueryCriterias[filterName];
          });
          _.each(_this.dynamicQueryCriterias, function (v, k) {
            if (_.startsWith(k, "criteria.strValue.keyWordValue")) {
              delete _this.dynamicQueryCriterias[k];
            }
          });
          var extParam = this.convertDynamicQueryCriteriasToQueryParam();
          this.queryOnServer(1, extParam);

          return;
        }

        // 构建业务查询参数 start

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
        }
        var hasKeywordFilterName = _.some(this.displayCols, function (col) {
          return !!col.keywordFilterName
        });
        // Task 1301 系统中 非主列表界面的 列表Grid 需要提供搜索功能 - 前端开发
        if (hasKeywordFilterName) {
          var joinFieldName = 'criteria.strValue.keyWordValue_join_';

          // 获取有配置keywordFilterName属性的列
          var keywordFilterNames = _.compact(_.map(this.displayCols, function (col) {
            if (col.keywordFilterName) {
              return {
                type: col.filterType,
                name: col.keywordFilterName,
                key: col.dataDicKey
              }
            }
            return '';
          }));

          if (keywordFilterNames.length > 0) {
            if (this.filterKey) {
              var criteriaParam;

              // 遍历列设置查询参数, 枚举类型需要特殊处理
              _.each(keywordFilterNames, function (filter) {
                if (filter.type === 'enum' && filter.key) {
                  var res = _.compact(_.map(_this.dataDic[filter.key], function (v, k) {
                    if (v.indexOf(_this.filterKey) > -1) {
                      return k;
                    }
                    return '';
                  }));

                  if (res.length > 0) {
                    criteriaParam = _this.initServerCriteriaPojo(filter.name, res);
                  }

                } else {
                  criteriaParam = _this.initServerCriteriaPojo(filter.name, _this.filterKey);
                }
                _this.dynamicQueryCriterias[filter.name] = criteriaParam;
              });
              // 通用的过滤条件 criteria.strValue.keyWordValue_join_ = or
              this.dynamicQueryCriterias[joinFieldName] = this.initServerCriteriaPojo(joinFieldName, 'or');
            } else {
              _.each(keywordFilterNames, function (filter) {
                delete _this.dynamicQueryCriterias[filter.name];
              });
              delete this.dynamicQueryCriterias[joinFieldName];
            }
          }
        }

        var extParam = this.convertDynamicQueryCriteriasToQueryParam();

        this.queryOnServer(1, extParam);
      },
      //设置所有checkbox选中状态
      setAllCheckBoxValues: function (val) {
        if (this.isServerModel()) {
          _.each(this.ds, function (item) {
            item.rowCheck = val;
          });
        } else {
          _.each(this.filteredValues, function (item) {
            item.rowCheck = val;
          });
        }
        this.calcSelectedDatas();
      },
      //显示查看图标按钮
      enableToolColumn: function (type) {
        if (type) {
          return _.isEmpty(type);
        }
        return false;
      },
      //显示查看图标按钮
      enableViewIcon: function (type) {
        if (type) {
          return type.indexOf("view") !== -1;
        }
        return false;
      },
      //显示编辑图标按钮
      enableEditIcon: function (type) {
        if (type) {
          return type.indexOf("edit") !== -1;
        }
        return false;
      },
      //显示删除图标按钮
      enableDelIcon: function (type) {
        if (type) {
          return type.indexOf("del") !== -1;
        }
        return false;
      },

      //显示上移下移图标按钮
      enableMoveIcon: function (type) {
        if (type) {
          return type.indexOf("move") !== -1;
        }
        return false;
      },

      //初始化内部维护的DataSource
      initDataSource: function () {
        if (!this.isCacheSelectedData) {
          this.ds = [];
          // 首页工作任务跳转后选中过滤后的值
          if (this.selectedDatas.length === 1 && this.values.length === 1) {
            if (this.values[0].id === this.selectedDatas[0].id) {
              this.ds.push({
                rowCheck: true,
                data: this.values[0]
              });
              this.checkAll = true;
              this.selectedDatas = _.cloneDeep(this.values);
            }
          } else if (this.selectedDatas.length === 1 && this.values.length === 0) {
            this.selectedDatas = [];
          } else {
            for (var i = 0; i < this.values.length; i++) {
              var rowData = {
                data: this.values[i]
              };
              //增加checkbox选中的属性
              rowData.rowCheck = false;
              this.ds.push(rowData);
            }
          }

        } else {
          this.ds = [];
          var cachedSelectedIds = _.map(this.selectedDatas, "id");
          for (var i = 0; i < this.values.length; i++) {
            var rowData = {
              data: this.values[i]
            };
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
        return !!this.url;
      },
      //处理Page点击事件
      doPageChanged: function (curPage) {

        if (!this.isCacheSelectedData) {
          this.handleCurPageChanged(curPage);
          return;
        }

        //服务器处理
        if (this.isServerModel()) {

          this.$emit("change-page");


          //一般的业务查询查询参数
          var extParam = this.convertDynamicQueryCriteriasToQueryParam();

          curPage = curPage || 1;

          //查询参数，基础参数为分页参数
          var baseParam = {
            curPage: curPage,
            pageSize: this.pageModel.pageSize
          };

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
          this.pageModel.curPage = curPage;
          this.pageModel.totalSize = this.values.length;
        }
      },
      //处理当前页面修改
      handleCurPageChanged: function (curPage) {

        //服务器处理
        if (this.isServerModel()) {
          this.$emit("change-page");
          //一般的业务查询查询参数
          var extParam = this.convertDynamicQueryCriteriasToQueryParam();
          this.queryOnServer(curPage, extParam);

        }
        //本地处理
        else if (this.values) {
          this.pageModel.curPage = curPage;
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
        this.$emit("on-header-click", {
          event: event,
          column: column
        });
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
          // classes.push("cell-checkbox");
        } else if (col.fieldType == "radio") {
          classes.push("cell-radio");
        }
        // 如果列有配置pathCode 加上 text-link CSS类
        if (col.pathCode) {
          classes.push("text-link");
        }
        // 如果列有配置自定义的class
        if (col.class) {
          classes.push(col.class)
        } else if (col.renderClass === 'text-center') {
          classes.push("padding-normal")
        }
        return classes;
      },

      // 拖动结束
      doDragEndColumnSettingItem: function () {
        var result = [],
          self = this,
          titleArr = _.map(this.settingColumns, "title");

        var obj = _.indexBy(this.customSetting, "title");

        titleArr.forEach(function (title) {
          var column = obj[title];
          result.push(column);
          delete obj[title];
          if (column.isParent) {
            var _c = _.filter(self.customSetting, function (col) {
              return col.parentTitle === title;
            })

            result = result.concat(_c);
          }
        })

        helper.saveColumnSetting(this.code, result);
        this.customSetting = result;
        this.refreshColumns();
      },

      toggleColumn: function (column) {
        column.visible = !column.visible;
        var _this = this;
        //设置列的显示和隐藏

        var titles = _.pluck(this.customSetting, 'title')
        var idx = titles.indexOf(column.title);
        this.customSetting[idx]
        var settingColumn = this.customSetting[idx];
        settingColumn.visible = column.visible;

        // 如果隐藏的是父级，则该项的子级也要隐藏
        if (settingColumn.isParent) {
          _.forEach(this.customSetting, function (col) {
            if (col.parentTitle === column.title) {
              col.visible = column.visible;
            }
          })
        }

        helper.saveColumnSetting(this.code, this.customSetting);
        this.refreshColumns();
      },
      closeDropdown: function closeDropdown() {
        this.columnMenuOpen = false;
      },
      //checkbox选择框事件处理
      doCheckBoxChanged: function (event, entry, index) {
        //this.calcSelectedDatas();
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
          _.each(this.ds, function (item) {
            item.rowCheck = val;
          });
        } else {
          _.each(this.filteredValues, function (item) {
            item.rowCheck = val;
          });
        }

        //设置当前row选中
        entry.rowCheck = true;

        //计算selectedData
        this.calcSelectedDatas();
      },
      //查看icon事件处理
      doViewIconClicked: function (event, entry, rowId, colId, fieldName) {
        this.$emit("on-view-row", {
          event: event,
          entry: entry,
          cell: {
            "rowId": rowId,
            "colId": colId,
            "fieldName": fieldName
          }
        });
      },
      //编辑icon事件处理
      doEditIconClicked: function (event, entry, rowId, colId, fieldName) {
        this.$emit("on-edit-row", {
          event: event,
          entry: entry,
          cell: {
            "rowId": rowId,
            "colId": colId,
            "fieldName": fieldName
          }
        });
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

        var _this = this;
        if (this.urlDelete && this.urlDelete != '') {
          var resource = this.$resource(this.urlDelete);
          LIB.Modal.confirm({
            title: '确定删除数据?',
            onOk: function () {
              resource.delete({}, [entry.data.id]).then(function (res) {
                if (res.ok) {
                  Message.info("删除成功");
                  _this.$emit("on-del-row", {
                    event: event,
                    entry: entry,
                    cell: {
                      "rowId": rowId,
                      "colId": colId,
                      "fieldName": fieldName
                    }
                  });
                }
              });
            }
          });

        } else {
          this.$emit("on-del-row", {
            event: event,
            entry: entry,
            cell: {
              "rowId": rowId,
              "colId": colId,
              "fieldName": fieldName
            },
            refreshFuc: _.bind(this.doRefresh, this)
          });
        }
      },

      //编辑icon事件处理
      doMoveIconClicked: function (event, entry, rowId, colId, fieldName, offset) {
        var p = this.pageModel;
        var curIndex = (p.curPage - 1) * p.pageSize + rowId + 1;
        if (p.curPage === 1 && rowId === 0 && offset === -1) {
          return;
        }
        if (offset === 1 && curIndex === p.totalSize) {
          return;
        }
        this.$emit("on-move-row", {
          event: event,
          entry: entry,
          cell: {
            "rowId": rowId,
            "colId": colId,
            "fieldName": fieldName
          },
          offset: offset
        });
      },

      //单元格点击事件处理
      doCellClicked: function (event, entry, rowId, colId, col) {
        this.lastClickedRowIndex = rowId;
        // 如果有pathCode，则执行路由跳转，不在执行其他逻辑
        if (col.pathCode) {
          if (LIB.LIB_BASE.hasRouteAuth(col.pathCode)) {
            helper.emitJump({
              opt: {
                path: LIB.PathCode[col.pathCode]
              },
              vo: {
                id: entry.data.id,
                code: entry.data.code || entry.data.title
              }
            });
          }
          return;
        }


        this.$emit("on-click-cell", {
          event: event,
          entry: entry,
          cell: {
            "rowId": rowId,
            "colId": colId,
            "fieldName": col.fieldName
          },
          el: {
            id: event.target.id,
            name: event.target.getAttribute("name"),
            _el: event.target
          },
          page: {
            currentPage: this.pageModel.curPage,
            pageSize: this.pageModel.pageSize
          }
        });

        // if (col.fieldType !== 'link') {
        if (this.isSingleCheck) {
          var _id = entry.data.id;
          _.each(this.ds, function (item) {
            if (_id === item.data.id) {
              if (helper.isIE() && event.target.getAttribute("type") === 'checkbox') {
                item.rowCheck = entry.rowCheck;
              } else {
                item.rowCheck = !item.rowCheck;
              }
            } else {
              item.rowCheck = false;
            }
          });
        } else {
          entry['rowCheck'] = !entry['rowCheck'];
        }
        // }
        if (this.targetCheckColumn) {
          if (this.targetCheckColumn.fieldType === "cb") {

            this.calcSelectedDatas();

          } else if (this.targetCheckColumn.fieldType === "radio") {
            this.doRadioBtnChanged(event, entry, rowId);
          }
        } else if (col.fieldType === "link") { //是link列，并且不会触发行选中，则记录该列为最后点击的列
          this.lastClickedRowIndex = rowId;
        }
      },
      /*
       * 单元格双击事件处理
       */
      doCellDbClicked: function (event, entry, rowId, colId, col) {
        this.$emit("on-dbclick-cell", {
          event: event,
          entry: entry,
          cell: {
            "rowId": rowId,
            "colId": colId,
            "fieldName": col.fieldName
          }
        });
      },
      /*
       * 计算选择的数据
       */
      calcSelectedDatas: function () {
        if (!this.isCacheSelectedData) {
          this.selectedDatas = _.map(_.where(this.ds, {
            rowCheck: true
          }), function (item) {
            return item.data
          });
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
            } else if (item.rowCheck == true) { //不存在则新增
              _this.selectedDatas.push(item.data);
              curPageSelectedItems.push(item.data);
            }
          });

          if (!this.checkAll && curPageSelectedItems.length > 0 && curPageSelectedItems.length == this.ds.length) {
            this.checkAll = true;
          } else if (this.checkAll && curPageSelectedItems.length == 0) {
            this.checkAll = false;
          }
        }
      },
      _onResize: function () {
        this.tableWidth();
        var width = 0;

        //处理整个宽度，当单元格宽度和小于100%时最后一列填充宽度
        if (this.resizeable) {
          _.each(this.displayCols, function (data) {
            if (data.visible) {
              if (data.fieldType === 'cb' || data.fieldType === 'radio') {
                width += data.width ? parseInt(data.width) : 60;
              } else if (data.filterType === 'date') {
                width += data.width ? parseInt(data.width) : 156;
              } else if (data.filterType === 'enum') {
                width += data.width ? parseInt(data.width) : 100;
              } else {
                width += data.width ? parseInt(data.width) : 150;
              }
            }
          });
          var diffWidth = this.containerClientWidth - width;
          if (this.autoWidth) {
            if (diffWidth > 0) {
              this.setFixedBodyHeight(false);
            } else {
              this.setFixedBodyHeight(true);
            }
          }
        }
      },
      /*
       *  计算表格宽度
       */
      tableWidth: function () {
        var _this = this,
          width = 0;
        if (this.showScroll) {
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
          width = this.containerClientWidth > width ? this.containerClientWidth : width;
          width = this.showScroll ? (width + 'px') : '100%';
          return width;
        }
      },
      /*
       * 表格头部 排序图标样式控制
       * 在sortable为false时,禁用排序
       */
      orderActionClasses: function (column) {
        var res = 'order-btn';
        if (!column.sortable) {
          res += ' order-btn-disabled'
        }
        return res;
      },
      /*
       * 改变左侧菜单栏收起/展开状态时, 更新表格宽度
       */
      updateTableWidth: function (state) {
        var visiableColumns = this.displayCols.filter(function (item) {
          return item.visible;
        });
        if (state) {
          _.last(visiableColumns).width += 180;
        } else {
          _.last(visiableColumns).width -= 180;
        }
      },
      /*
       * 序号列内容
       */
      renderSequence: function (index) {
        return index + 1 + (this.pageModel.curPage - 1) * this.pageModel.pageSize
      },
      /*
       *  表格hover样式控制(固定与主体表格同步)
       */
      tableMouseover: function (e) {
        var $el = e.target;
        if ($el.tagName.toUpperCase() !== 'TD' || this.hoverIndex == $el.parentNode.dataset.index) {
          return;
        }
        this.hoverIndex = $el.parentNode.dataset.index;
      },
      /*
       * 单元格是否有宽度拖动标志线
       * 默认第一列(checkbox)没有
       * 在有序号列的情况下前两列(序号和checkbox)都没有
       * */
      showResizeHandle: function (column, index, type) {
        if (column.isParent) {
          return false;
        }
        if (!this.resizeable || !column.resizeable) {
          return false;
        }
        // 主体表格且列固定
        if (type === 'body' && column.fixed) {
          return false;
        }
        if (this.showSeq && index < 2) {
          return false;
        }
        // if (index < 1) {
        //     return false;
        // }
        if (column.fieldType === 'cb') {
          return false;
        }
        return true;
      },
      onTableBodyMouseLeave: function () {
        // this.lastClickedRowIndex = -1;
        this.hoverIndex = -1;
      }
    },
    events: {},
    init: function () {
      tableCtrl.setDataDic(helper.cfg().dataDic);
    },
    created: function () {
      if (this.setting) {
        // 详情页面统一配置
        if (_.isBoolean(this.setting.lazyLoad)) {
          this.lazyLoad = this.setting.lazyLoad;
        }
        if (_.isBoolean(this.setting.showEmptyRow)) {
          this.showEmptyRow = this.setting.showEmptyRow;
        }
        if (_.isBoolean(this.setting.useDefaultGlobalFilter)) {
          this.useDefaultGlobalFilter = this.setting.useDefaultGlobalFilter;
        }!this.code && this.setting.code && (this.code = this.setting.code);
        this.customSetting = this.code ? helper.queryColumnSetting(this.code) : [],

          !this.columns && this.setting.columns && (this.columns = this.setting.columns);
        !this.url && this.setting.url && (this.url = this.setting.url);
        !this.defaultFilterValue && this.setting.defaultFilterValue && (this.defaultFilterValue = this.setting.defaultFilterValue);
        !this.showColumnPicker && this.setting.showColumnPicker && (this.showColumnPicker = this.setting.showColumnPicker);
        this.setting.isSingleCheck && (this.isSingleCheck = this.setting.isSingleCheck);
      }
    },
    ready: function () {

      this.customSetting = null;

      // 请求的次数(防止多次请求后请求返回时间过长而导致bug)
      this.queryCount = 0;

      sidebarDefaultState = helper.getSidebarState();
      this.OUT_TABLE_WIDTH = sidebarDefaultState ? (81 + SCROLLBAR_WIDTH) : (261 + SCROLLBAR_WIDTH);

      // 此条件应用在工作流 “流程条件设置” 和 “流程节点设置”等 table占满全屏的情况下
      if (this.$el.clientWidth === document.body.clientWidth) {
        this.OUT_TABLE_WIDTH = SCROLLBAR_WIDTH + 1;
      }

      this.$on("do_query_by_filter", this.doQueryByFilter);
      this.$on("do_update_row_data", this.doUpdateRowData);

      this.buildDefaultFilter();

      var _this = this;

      // 监听左侧菜单栏"收起/展开"事件
      // 初始化单元格宽度拖动相关变量
      if (this.resizeable) {
        document.addEventListener("collapseSidebar", function (e) {
          _this.updateTableWidth(e.detail)
        });


        this.$resizeLine = this.$els.line; // 拖动时的标记线
        this.$resizeTh = null; // 拖动的目标th
        this.resizeStartX = 0; // 拖动开始时标记线的位置
        this.resizeStartPageX = 0; // 拖动开始时的鼠标位置
        this.resizeStartWidth = 0; // 拖动开始时th的宽度
        this.resizeEndWidth = 0; // 拖动结束后th的宽度
        this.moveDistance = 0; // 移动的距离

        // 固定列相关变量
        this.$fixedTable = this.$els.fixedTable;
      }

      // 左侧固定表格监听主体部分滚动事件

      var $scrollBody = this.$els.scrollBody,
        $scrollHeader = this.$els.scrollHeader,
        $fixedBody = this.$els.fixedBody,
        $fixedBodyTable = this.$els.fixedBodyTable;

      var mainBodyScroll = function (e) {
        e.stopPropagation();
        var $el = e.target,
          left = $el.scrollLeft,
          top = $el.scrollTop;
        _this.scrollLeft = left;
        if (left > 0) {
          _this.$els.fixedTable.classList.add("table-fixed-shadow");
        } else {
          _this.$els.fixedTable.classList.remove("table-fixed-shadow");
        }
        $scrollHeader.style.transform = "translateX(-" + left + "px)";
        $fixedBodyTable.style.transform = "translateY(-" + top + "px)";

        _this.doScroll();
      };
      $scrollBody.addEventListener("scroll", mainBodyScroll);

      this.buildDefaultFilter();

      this.refreshColumns();

      if (this.lazyLoad) {
        //初始化内部维护的DataSource
        //延时加载也许初始数据啊亲  litao Add 2019年12月19日
        this.initDataSource();
        this.setMergeData();
        this.pageModel.totalSize = this.values.length;
        return;
      }

      this.handleCurPageChanged(1);

      //初始化内部维护的DataSource
      this.initDataSource();
      this.setMergeData();
      //todo 暂时的方案，以后需要用绝对定位解决
      // window.addEventListener('scroll', this.doScroll);
      window.addEventListener('resize', this._onResize);

    },
    detached: function () {
      // 初始化滚动位置
      this.$els.scrollHeader && (this.$els.scrollHeader.style.transform = "translateX(0)");
      this.$els.fixedTable && this.$els.fixedTable.classList.remove("table-fixed-shadow");
    },

    compiled: function () {
      this.clickEventCfg = {};
      this.clickEventCfg.delIcon = {};
      this.clickEventCfg.delIcon.repeatCount = 0;
      this.clickEventCfg.delIcon.lastClickTime = 0;
      if (!_.isEmpty(this.code)) {
        if (!_.startsWith(this.code, "tb_code_")) {
          this.code = "tb_code_" + this.code;
        }
      } else {
        this.code = "tb_code_" + _.uniqueId() + "_memory_";
      }
    },
  };

  var component = Vue.extend(opts);
  Vue.component('vue-bootstrap-table', component);

});