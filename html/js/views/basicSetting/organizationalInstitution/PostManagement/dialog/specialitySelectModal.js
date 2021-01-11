define(function (require) {
  // var template = require("text!./specialitySelectModal.html");
  var LIB = require('lib');
  var initDataModel = function () {
    return {
      // singleSelect: true,
      mainModel: {
        title: "选择",
        // selectedDatas: []
      },
      tableModel: {
        // url: "position/speciality/list/{curPage}/{pageSize}",
        selectedDatas: [],
        lazyLoad: false,
        isNativeData: true,
        columns: [{
            title: "",
            fieldName: "id",
            fieldType: "cb",
            width: 80
            // filterType: "text",
          },
          {
            title: "专业",
            filterType: "text",
            fieldName: "name",
            width: 240,
            render: function (row, index) {
              return row.name
            }
          },
        ],
        resetTriggerFlag: false,
        values: [{
            id: "电气专业",
            name: "电气专业"
          },
          {
            id: "防腐专业",
            name: "防腐专业"
          },
          {
            id: "固定消防专业",
            name: "固定消防专业"
          },
          {
            id: "机械设备专业",
            name: "机械设备专业"
          },
          {
            id: "通信专业",
            name: "通信专业"
          },
          {
            id: "信息专业",
            name: "信息专业"
          },
          {
            id: "仪表自动化专业",
            name: "仪表自动化专业"
          },
          {
            id: "移动消防专业",
            name: "移动消防专业"
          },
          {
            id: "站外管道专业",
            name: "站外管道专业"
          },
          {
            id: "其它专业",
            name: "其它专业"
          },
        ]
      }
    };
  }

  var opts = {
    mixins: [LIB.VueMixin.selectorTableModal],
    // template: template,
    data: function () {
      return initDataModel();
    },
    name: "specialitySelectModal",
    methods: {
      nativeSearchFilter: function (searchValue) {
        // 去除空字符串
        searchValue = searchValue ? searchValue.trim() : null
        if (!searchValue || !searchValue.length) {
          return this.$refs.table.values = this.tableModel.values;
        }
        var filterAfter = []
        this.tableModel.values && this.tableModel.values.forEach(function (row) {
          row.name.indexOf(searchValue) !== -1 ? filterAfter.push(row) : null
        })
        this.$refs.table.values = filterAfter
      }
    }
  };

  var component = LIB.Vue.extend(opts);
  return component;
  //	var component = LIB.Vue.extend(opts);
  //	LIB.Vue.component('checkplan-select-modal', component);
});