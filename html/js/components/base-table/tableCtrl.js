define(function (require) {
  var helper = require("./tableHelper");
  var dataDic = {};

  var setDataDic = function (data) {
    dataDic = data || {};
  };

  // ==========================================================列配置相关=============================================================
  /**
   * 获取所有的列，
   * @param columns
   * @param forTableHead 为真表示获取的是表头的列，非表头列只需要需要显示的列， 表头列需要所有配置的列
   * @return {Array}
   */
  var getAllColumns = function (columns, forTableHead) {
    var result = [];
    _.forEach(columns, function (column) {
      if (column.children) {
        if (forTableHead) {
          result.push(column);
        }
        result.push.apply(result, getAllColumns(column.children, forTableHead));
      } else {
        result.push(column);
      }
    });
    return result;
  };

  /**
   * 将列配置转化成能表示表格行的数据， 暂时只考虑两层
   * @param columns
   * @return {Object}
   */
  var convertToRows = function (columns) {

    var originColumns = _.cloneDeep(columns);

    var maxLevel = 1;

    // 计算每列所占行数和所占列数
    _.forEach(originColumns, function (column) {
      column.rowSpan = 1;
      column.colSpan = 1;
      if (_.isArray(column.children)) {
        maxLevel = 2;
        column.colSpan = column.children.length;
      }
    });


    // 转换成行数据
    var rows = [];
    var fixedRows = [];
    for (var i = 0; i < maxLevel; i++) {
      rows.push([]);
      fixedRows.push([]);
    }

    _.forEach(originColumns, function (column) {
      if (maxLevel > 1) {
        if (!_.isArray(column.children)) {
          column.rowSpan = maxLevel;
        } else {
          rows[1] = rows[1].concat(column.children);
        }
      }
      rows[0].push(column);
      if (column.fixed) {
        fixedRows[0].push(column);
      }
    });

    originColumns = null;
    return {
      rows: rows,
      fixedRows: fixedRows
    }
  };

  /**
   * 根据列的类型给未设置宽度的列一个默认宽度
   * @param column
   * @return {number}
   */
  var setResizeDefaultWidth = function (column) {
    var width = 0;
    if (column.width) {
      width = parseInt(column.width);
    } else if (column.fieldType === "cb" || column.fieldType === "radio") {
      width = 60;
    }
    //工具列单独设置
    else if (column.fieldType === 'tool') {
      var typeCount = column.toolType.split(",").length;
      if (typeCount === 1) {
        width = 50;
      } else {
        width = 40 + (28 * (typeCount - 1));
      }
      // width = typeCount === 1 ? 50 : 32 * typeCount;
    }

    //默认日期宽度
    else if (column.filterType === "date") {
      width = 156;
    }
    //默认枚举值宽度
    else if (column.filterType === "enum") {
      width = 100;
    } else {
      width = 150;
    }
    return width;
  };

  var setDefaultWidth = function (column) {
    if (column.width) {
      return column.width;
    }
    //checkbox和radio的宽度单独统一设置
    else if (column.fieldType === "cb" || column.fieldType === "radio") {
      return 60;
    }
    //工具列单独设置
    else if (column.fieldType === 'tool') {
      var typeCount = column.toolType.split(",").length;
      //move 由up/down两个图标组成
      if (column.toolType.indexOf("move") !== -1) {
        typeCount++;
      }

      if (typeCount === 1) {
        return 50;
      } else {
        return 40 + (28 * (typeCount - 1));
      }

      // return typeCount === 1 ? 50 : 37 * typeCount;
    }

    //默认日期宽度
    else if (column.filterType === "date") {
      return 156;
    }
    //默认枚举值宽度
    else if (column.filterType === "enum") {
      return 100;
    }
    return "";
  };

  /**
   * 补全列配置信息
   * @param columns
   * @param hasStoraged
   * @param isResizeable
   */
  var complementColumnProperty = function (columns, hasStoraged, isResizeable) {

    var result = [];
    var storageArr = [];
    var obj;
    columns.forEach(function (column) {
      obj = {};
      _.extend(obj, column); //合并上column 的属性 litao add
      if (!column) {
        return false
      }
      obj.renderHead = column.hasOwnProperty('renderHead') ? column.renderHead : {};
      obj.title = column.title;

      // 配置visible为false时， 优先级最高， 忽略customSetting的设置
      if (column.visible === false) {
        obj.visible = false;
      } else {
        obj.visible = true;
      }

      obj.width = isResizeable ? setResizeDefaultWidth(column) : setDefaultWidth(column);

      // 默认单元格宽度可拖动
      obj.resizeable = column.resizeable !== undefined ? column.resizeable : true;

      // 除非明确设为false，默认字段可以排序
      obj.sortable = column.sortable !== false;
      obj.fixed = column.fixed; // 是否固定

      obj.fieldName = column.fieldName;
      obj.orderName = column.orderName || column.fieldName;
      /***
       * column.fieldType : custom(用户自定义) / link(超链接) / cb(多选框) / radio(单选框)
       */
      obj.fieldType = column.fieldType;
      if (column.fieldType === "link") {
        column.triggerRowSelected = false;
      }

      obj.pathCode = column.pathCode; // 点击后跳转到详情
      obj.showTip = column.showTip == undefined ? true : column.showTip;
      obj.tipRender = column.tipRender || null;

      // 自定义样式名称， 加在td标签上
      obj.class = column.class;
      // 自定义的样式名称, 加在td下的div标签上
      obj.renderClass = column.renderClass;
      // 过滤相关配置
      obj.filterType = column.filterType;
      obj.filterName = column.filterName;

      //点击是否选中当前行
      obj.triggerRowSelected = column.triggerRowSelected !== false;

      //如果存在过滤的枚举配置则优先使用用户的配置
      if (column.popFilterEnum) {
        obj.popFilterEnum = column.popFilterEnum;
      }
      //如果用户未配置过滤枚举值，则优先转换数据字典中fieldName对应的对象为枚举值
      else if (dataDic[column.fieldName]) {

        obj.popFilterEnum = [];
        _.each(dataDic[column.fieldName], function (v, k) {
          var item = {};
          item["id"] = k;
          item["value"] = v;
          obj.popFilterEnum.push(item);
        });
      }

      // 用于 keyword 过滤
      obj.keywordFilterName = column.keywordFilterName;

      // 数据字典的key，和fieldName结合用于计算枚举属性的显示值
      obj.dataDicKey = column.dataDicKey;

      //用户自定义列的渲染,需要配合obj.fieldType="custom"使用, 可不设置fieldType
      if (column.render) {
        obj.renderDisplayValue = column.render;
        obj.fieldType = obj.fieldType || "custom";

        //如果 未设置tipRender和showTip，并且render字段包含src="images的字符串则为图标，关闭showTip
        if (!obj.tipRender && obj.showTip && column.render("") && column.render("").indexOf("src=\"images")) {
          obj.showTip = false;
        }
      }
      if (column.toolType) {
        obj.toolType = _.result(column, "toolType");
      }
      if (_.isArray(column.children)) {
        _.forEach(column.children, function (child) {
          child.parentTitle = obj.title;
        });
        var children = complementColumnProperty(column.children);
        obj.children = children.result;
        obj.renderClass = 'text-center';
        obj.isParent = true;
        storageArr = storageArr.concat(children.storageArr);
      }
      if (column.parentTitle) {
        obj.parentTitle = column.parentTitle;
      }
      result.push(obj);
      if (!hasStoraged) {
        storageArr.push(buildStorageColumn(obj));
      }
    });
    return {
      storageArr: storageArr,
      result: result
    }
  };

  // 处理字段信息，返回格式化后的数据(存储在localStorage中的数据)
  var buildStorageColumn = function (column) {
    return {
      title: column.title,
      width: column.width,
      visible: column.visible,
      parentTitle: column.parentTitle,
      isParent: column.isParent
    }
  };

  // 根据localStorage中的数据排序
  var orderColumnsByStorage = function (columns, orderedColumns) {
    var _colsObj = _.indexBy(columns, 'title');
    var result = [];
    var title;
    _.forEach(orderedColumns, function (column) {
      title = column.title;
      if (_.isPlainObject(_colsObj[title])) {
        _colsObj[title].width = column.width; // NOTE： 这里将width重新赋值
        _colsObj[title].visible = (_colsObj[title].visible === false ? false : column.visible); // 这里将visible重新赋值

        result.push(_colsObj[title]);
        delete _colsObj[title];
      }

    });
    // 如果还有剩下的列， 放在最后
    if (!_.isEmpty(_colsObj)) {
      for (var k in _colsObj) {
        result.push(_colsObj[k]);
      }
    }
    return result;
  };

  var buildColumns = function (columns, code, isResizeable) {
    var storagedArr = null; // localStorage中保存的列配置
    var hasStoraged = true; // localStorage中是否有保存的列配置
    if (code) {
      storagedArr = code ? helper.queryColumnSetting(code) : null;
      hasStoraged = Boolean(_.isArray(storagedArr) && storagedArr[1] && storagedArr[1].title);
    }
    var _c = complementColumnProperty(columns, hasStoraged, isResizeable);
    var ret = _c.result;
    if (hasStoraged) {
      _.forEach(ret, function (item) {
        var _v = _.find(storagedArr, function (v) {
          return v.title === item.title
        });
        item.visible = _.get(_v, "visible", item.visible);
      })
    }
    var settingColumns = _c.result;

    var bodyColumns = getAllColumns(settingColumns); // 主体
    var rows = convertToRows(settingColumns);

    var headOrder,
      bodyOrder;

    if (code) {
      if (!hasStoraged) {
        storagedArr = _c.storageArr;
        helper.saveColumnSetting(code, storagedArr);
      } else {
        headOrder = _.filter(storagedArr, function (col) {
          return !col.parentTitle;
        });
        bodyOrder = _.filter(storagedArr, function (col) {
          return !col.isParent;
        });
        // 根据本地存储排序
        bodyColumns = orderColumnsByStorage(bodyColumns, bodyOrder);
        rows = convertToRows(orderColumnsByStorage(settingColumns, headOrder));
        settingColumns = orderColumnsByStorage(settingColumns, headOrder);
      }
    }
    // headOrder = _.reduce(storagedArr, function (result, col) {
    //     var r = col;
    //     var _cache;
    //     if (col.parentTitle) {
    //         _cache = _.find(result, function (res) {
    //             return res.title === col.parentTitle;
    //         });
    //         if (_cache) {
    //             _cache.width += col.width;
    //             return result;
    //         } else {
    //             r = {
    //                 title: col.parentTitle,
    //                 width: col.width,
    //                 visible: col.visible
    //             };
    //         }
    //     }
    //     result.push(r);
    //     return result;
    // }, []);

    var fixedColumns = _.filter(bodyColumns, function (column) {
      return column.fixed;
    });

    return {
      headRows: rows.rows,
      fixedHeadRows: rows.fixedRows,
      bodyColumns: bodyColumns,
      fixedColumns: fixedColumns,
      settingColumns: settingColumns
    }
  };

  var getTotalWidth = function (columns) {
    return _.reduce(columns, function (width, column) {
      return width + (column.visible ? column.width : 0);
    }, 0)
  };

  var sequenceColumn = {
    title: 'sequence',
    fieldName: "id",
    fieldType: "sequence",
    width: 50,
    visible: true,
    fixed: true,
    renderHead: function () {
      return '';
    }
  };

  // ==========================================================请求相关=============================================================
  // =======================================================================================================================

  return {
    sequenceColumn: sequenceColumn,
    buildColumns: buildColumns,
    getTotalWidth: getTotalWidth,
    setDataDic: setDataDic
  }
});