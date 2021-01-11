define(function (require) {
  var Vue = require("vue");
  var template = require("text!./security-measures.html");
  var videoHelper = require("tools/videoHelper");
  var LIB = require("lib");
  var checkTrue = '<i style="font-size:16px;" class="ivu-icon ivu-icon-android-checkbox-outline"><span></span></i>';
  var checkFalse = '<i style="font-size:16px;" class="ivu-icon ivu-icon-android-checkbox-outline-blank"><span></span></i>';

  var getInputInfo = function (item) {
    var str = item.name;
    var instr = "<input class='on-input-value' />";
    str = str.replace("（", "(").replace("）", ")");
    var tempObj = _.find(this.list, function (obj) {
      if (obj.id == item.id) {
        return true
      }
    })
    if (tempObj && tempObj.name && tempObj.content) {
      tempObj.name = tempObj.name.replace("（", "(").replace("）", ")");
      tempObj.content = tempObj.content.replace("（", "(").replace("）", ")");
      str = tempObj.content || tempObj.name;
      var arr1 = getBracketContents1(tempObj.name);
      var arr2 = getBracketContents1(tempObj.content);

      if (arr1.length == arr2.length) {
        for (var i = 0; i < arr1.length; i++) {
          if (arr1[i] == "()" || arr1[i] == '( )' || arr1[i] == '(  )' || arr1[i] == '(  )') {
            var val = arr2[i].replace(")", "").replace("(", "");
            str = str.replace(arr2[i], "(<input class='on-input-value' value='" + (val || '') + "'/>)");
          }
        }
        return str;
      }
    }
    str = item.name;
    str = str.replace("（", "(").replace("）", ")");
    var arr = getBracketContents1(str);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == "()" || arr[i] == '( )' || arr[i] == '(  )' || arr[i] == '(  )') {
        str = str.replace(arr[i], "(<input class='on-input-value'/>)");
      }
    }
    return str;
  };
  var getBracketContents1 = function (context) {
    var bracketContents = []; //所有括号内容

    context = context.replace("（", "(").replace("）", ")");
    var leftBracket = "(";
    var rightBracket = ")";
    var head = context.indexOf(leftBracket); // 标记第一个使用左括号的位置
    if (head == -1) {
      return bracketContents; // 如果context中不存在括号，什么也不做，直接跑到函数底端返回初值
    } else {
      var next = head + 1; // 从head+1起检查每个字符
      var count = 1; // 记录括号情况
      for (; head != -1;) {
        if (leftBracket == context.charAt(next)) {
          count++;
        } else if (rightBracket == context.charAt(next)) {
          count--;
        }
        next++; // 更新即将读取的下一个字符的位置
        if (count == 0) { // 已经找到匹配的括号
          bracketContents.push(context.substring(head, next)); //记录括号内容
          if (context.substring(next).indexOf(leftBracket) != -1) {
            head = context.substring(next).indexOf(leftBracket) + next; // 找寻下一个左括号
            next = head + 1; // 标记下一个左括号后的字符位置
            count = 1; // count的值还原成1
          } else {
            head = -1;
          }
        }
      }
      return bracketContents;
    }
  };

  var getGroupModel = function () {
    return {
      show: false,
      list: [],
      index: null // 具体标记操作哪一个组
    }
  }

  var getColumns = function () {
    return [{
        title: "",
        width: "40px",
        render: function (data) {
          // return "<input disabled type='checkbox' />"
          if ((data.attr1 == '1' && data.checkResult == '0') || (data.checkResult == '2')) {
            return checkTrue;
          } else {
            return checkFalse;
          }
        },
      },
      {
        title: "措施内容",
        fieldName: "name",
        width: "600px",
        render: function (data) {
          return data.content;
        }
      },

    ]
  };

  return Vue.extend({
    template: template,
    props: {
      model: {
        type: Object,
        required: true,
      },
      vo: {
        type: Object,
        required: true,
      }
    },
    computed: {
      getStatusExt: function () {
        var temp = true;
        if (this.vo.workHistories && this.vo.workHistories.length > 0) {
          var obj = _.find(this.vo.workHistories, function (item) {
            return item.workStatus == '5'
          });
          var len = this.vo.workHistories.length;
          if (this.vo.workHistories[len - 1].workStatus == '4' && obj) {
            temp = false;
          }
        }
        return temp;
      }
    },

    methods: {
      convertPath: LIB.convertPath,
      displayFn: function (val) {
        return "#" + val.value;
      },
      initData: function () {
        var _this = this;
        this.initVersion();
        this.deelGroupItemModel();
        setTimeout(function () {
          _this.deelGroupList();
          _this.updateColumns();
        });

      },
      changeVersion: function (val) {
        var _this = this;
        this.deelGroupItemModel();
        this.$nextTick(function () {
          _this.deelGroupList();
        });

      },
      initVersion: function () {
        // var list = _.filter(this.model.workStuffs, function (item) {
        //     return item.stuffType == '4' && item.children;
        // }) || [];
        // var list = this.model.verificationVerList || [];
        // if(list.length > 0 && list[0].children[0].verList){
        //     this.verNumList = list[0].children[0].verList.sort(function (a, b) {
        //         return b.verNum - a.verNum;
        //     });
        //     this.selectVerNum = list[0].children[0].verNum || -1;
        // }else{
        //     this.verNumList = [];
        //     this.selectVerNum = -1;
        // }
        this.verNumList = [];
        var list = _.filter(this.model.verificationVerList, function (item) {
          return item.verifyType == '2';
        }) || [];
        var sortList = [];
        if (list.length > 0) {
            sortList = list.sort(function (a, b) {
            return b.verNum - a.verNum;
          });
          this.selectVerNum = sortList[0].verNum || -1;
            this.verNumList = sortList;
        } else {
            this.selectVerNum = -1;
            this.verNumList = [];
        }
      },

      deelGroupItemModel: function (version) {
        var _this = this;
        var tempList = [];
        // 获取所有分组
        var list = _.filter(this.model.workStuffs, function (item) {
          return item.stuffType == '4' && item.children;
        });
        // groupItemModel 初始化
        this.groupItemModel = getGroupModel();
        _.each(list, function (listItem) {
          var obj = {
            name: listItem.content ? listItem.content : (listItem.name ? listItem.name : ''),
            children: [],
            id: listItem.id
          };
          obj.children = _.map(listItem.children, function (item) {
            var vjson = item.verJson ? JSON.parse(item.verJson) : [];
            var findResult = _.find(vjson, function (v) {
              return v.verNum == _this.selectVerNum;
            });
            return {
              checkResult: findResult ? findResult.checkResult : item.checkResult,
              attr1: item.attr1,
              id: item.ptwStuff ? item.ptwStuff.id : '',
              stuffId: item.ptwStuff ? item.ptwStuff.id : (item.stuffId ? item.stuffId : null),
              stuffType: item.stuffType,
              ptwStuff: item.ptwStuff,
              name: item.ptwStuff ? item.ptwStuff.name : (item.name ? item.name : (item.content ? item.content : '')),
              content: item.ptwStuff ? item.ptwStuff.name : (item.name ? item.name : (item.content ? item.content : '')),
              attr2: item.attr2,
              remark: item.remark,
              cloudFiles: _.filter(item.cloudFiles, function (files) {
                return files.version == _this.selectVerNum || _this.selectVerNum == -1;
              }) || [],
              ptwWorkVerifiers: _.map(item.ptwWorkVerifiers ? item.ptwWorkVerifiers : item.ptwCardVerifiers, function (opt) {
                var verFiles = _.filter(opt.cloudFiles, function (files) {
                  return files.version == _this.selectVerNum || _this.selectVerNum == -1;
                });

                return {
                  name: opt.name,
                  cloudFiles: verFiles
                }
              }),
              verList: item.verList
            }
          });
            _this.groupItemModel.list.push(obj);
        });
        tempList = _this.groupItemModel.list;
        _this.groupItemModel.list = [];
        _this.$nextTick(function () {
          _this.groupItemModel.list = tempList;
        })

        // this.permitModel.groupItemModel = this.groupItemModel;
      },

      // 播放
      doPlay: function (file) {
        this.playModel.show = true;
        if (!file.fileId) file.fileId = file.id;
        setTimeout(function () {
          videoHelper.create("player", file);
        }, 50);
      },
      getItemName: function (item) {
        if (item.isExtra == '1') {
          if (this.getStatusExt)
            return "其他（" + item.content + "）";
          else return "其他";
        } else {
          return item.content || item.name + '';
        }
      },
      getFiles: function (data, type) {
        var _this = this;
        var files = data.filter(function (item) {
          if (item.version == _this.selectVerNum) {
            return true;
          }
          if (_this.selectVerNum == -1 && item.version == '1') {
            return true;
          }
          return false;
        });
        return files;
      },

      // 点击查看
      onRowClicked: function (row, index, showDetail) {
        // var enableCtrlMeasureVerifier = this.model.enableCtrlMeasureVerifier;
        this.securityModel.str = row.remark || '';
        this.securityModel.picList.splice(0);
        this.securityModel.picList = this.securityModel.picList.concat(_.filter(this.getFiles(row.cloudFiles), function (item) {
          return item.dataType == 'PTW23';
        }));

        this.securityModel.video.splice(0);
        this.securityModel.video = this.securityModel.video.concat(_.filter(this.getFiles(row.cloudFiles), function (item) {
          return item.dataType == 'PTW25';
        }));

        if (this.securityModel.str || this.securityModel.picList.length > 0 || this.securityModel.video.length > 0) {
          this.securityModel.show = true;
        }
      },

      // 点击查看
      isShowIcon: function (row) {
        // var enableCtrlMeasureVerifier = this.model.enableCtrlMeasureVerifier;
        var str = row.remark || '';
        var picList = (_.filter(this.getFiles(row.cloudFiles), function (item) {
          return item.dataType == 'PTW23';
        })) || [];
        var video = (_.filter(this.getFiles(row.cloudFiles), function (item) {
          return item.dataType == 'PTW25';
        })) || [];

        if (str || picList.length > 0 || video.length > 0) return true;
        else return false;
      },

      deelGroupList: function () {
        var _this = this;
        var list = [];
        _.each(this.groupItemModel.list, function (group) {
          _.each(group.children, function (item) {
            list.push(item);
          })
        });
        this.list = list;
        this.tableModel.list = [];
        this.$nextTick(function () {
          _this.tableModel.list = list;
        })
      },

      updateColumns: function () {
        var _this = this;
        this.tableModel.columns = getColumns();
        // 添加签名列
        if (this.model.enableCtrlMeasureVerifier == '1') {
          this.tableModel.columns.push({
            title: "核对人",
            width: "100px",
            render: function (data) {
              if (data && data.ptwWorkVerifiers) {
                var str = '';
                _.each(data.ptwWorkVerifiers, function (item) {
                  str += item.name + '，'
                });
                if (str.length > 0) {
                  str = str.substring(0, str.length - 1);
                }
                return str;
              }
            }
          });
        }
        //  PTW23:安全措施核对图片 PTW24:安全措施核对视频第一帧 PTW25:安全措施核对视频
        var enableCtrlMeasureVerifier = this.model.enableCtrlMeasureVerifier;

        if (_this.model.enableCtrlMeasureSign == '1') {
          this.tableModel.columns.push({
            title: "签名",
            width: "100px",
            render: function (data) {
              var arr = [];
              var str = '';
              // if( (!((data.attr1=='1' && data.checkResult=='0') || (data.checkResult=='2'))) && _this.model.enableUncheckedMeasureSign!='1' ) return '';
              if (data.verList && data.verList.length > 0) {
                var obj = _.find(data.verList, function (item) {
                  return item.verNum == _this.selectVerNum || (item.verNum == '1' && _this.selectVerNum == 1)
                });
                if (obj) {
                  if (data.ptwWorkVerifiers && data.ptwWorkVerifiers.length > 0 && enableCtrlMeasureVerifier == '1') {
                    var verfiersArr = data.ptwWorkVerifiers;
                    _.each(verfiersArr, function (verfier) {
                      if (verfier.cloudFiles) {
                        _.each(verfier.cloudFiles, function (file) {
                          if(file.version == _this.selectVerNum || (file.version == '1' && _this.selectVerNum == 1)) {
                            arr.push(file);
                          }
                        });
                      }
                    });
                    _.each(arr, function (file) {
                      file.fileId = file.id;
                      str += '<img style="height: 20px" src="' + LIB.convertImagePath(file) + '"/>';
                    })
                  } else {
                    arr = _.filter(obj.cloudFiles, function (file) {
                      return file.dataType == 'PTW18';
                    });
                    _.each(arr, function (file) {
                      if (!file.fileId) file.fileId = file.id;
                      str += '<img style="height: 20px" src="' + LIB.convertImagePath(file) + '"/>';
                    })
                  }
                }
              }
              return str;
            },
          });
        }
        // 添加查看
        if (this.model.enableCtrlMeasureRemark == '1') {
          Vue.set(this.tableModel.columns[1], 'width', '500px')
          this.tableModel.columns.push({
            title: "备注",
            width: "100px",
            render: function (data) {
              var str = '';
              if (_this.isShowIcon(data)) str = '<span style="color:#33a6ff;cursor: pointer;">查看</span>';
              return str;
            },
            event: true
          });
        }
      }
    },
    data: function () {
      return {
        list: [],
        securityModel: {
          show: false,
          picList: [],
          str: '',
          video: []
        },
        groupItemModel: null,
        tableModel: {
          columns: getColumns(),
          list: []
        },
        verNumList: [],
        selectVerNum: '1',
        playModel: {
          title: "视频播放",
          show: false,
          id: null
        },
      }
    },
    watch: {
      'model': function (val) {
        this.initData();
      }
    }
  })
})