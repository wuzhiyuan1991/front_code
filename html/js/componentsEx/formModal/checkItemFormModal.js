define(function (require) {
  var LIB = require('lib');
  //数据模型
  var tpl = require("text!./checkItemFormModal.html");
  var api = require("views/businessFiles/hiddenDanger/checkList/vuex/api");
  // var risktypeSelectModal = require("componentsEx/selectTableModal/risktypeSelectModal");
  var riskModel = require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel");
  var equipmentSelectModal = require("componentsEx/selectTableModal/equipmentSelectModal");
  var equipmentTypeSelectModal = require("componentsEx/equipmentTypeSelectModal/equipmentTypeSelectModal");
  //初始化数据模型
  var newVO = function () {
    return {
      //ID
      id: null,
      //
      code: null,
      //检查项名称
      name: null,
      //类型 0 行为类   1 状态类  2 管理类
      type: null,
      //
      compId: null,
      //组织id
      orgId: null,
      //检查项来源标识 0转隐患生成 1危害辨识生成  2手动生成
      // category : null,
      //是否禁用，0启用，1禁用
      disable: "0",
      //是否被使用 0：未使用 1已使用
      isUse: null,
      //备注
      remarks: null,
      //修改日期
      modifyDate: null,
      //创建日期
      createDate: null,
      //检查分类
      riskType: {
        id: '',
        name: ''
      },
      //检查方法
      checkMethods: [],
      riskTypeId: null,
      isDigital: 0,
      digitalType: null,
      digitalUnit: null,
      equipment: {
        id: null,
        name: null,
        code: null
      },
      equipId: null,
      equipName: null,
      equipTypeId: null,
      equipTypeName: null,
      checkObjName: null,
      checkStd: null,
      tableItemRelId: null,
      maximum: null,
      minimum: null,
      equipmentType: {
        id: '',
        name: ''
      }
    }
  };

  //风险等级模型选择对象
  var newRiskModel = function () {
    return {
      id: null,
      opts: [],
      latId: null,
      result: null
    };
  };
  //Vue数据
  var dataModel = {
    mainModel: {
      vo: newVO(),
      opType: '',
      isReadOnly: false,
      title: "新增",
      showRisktypeSelectModal: false,
      riskModel: newRiskModel,
      //验证规则
      rules: {
        //"code":[LIB.formRuleMgr.require("编码")]
        "code": [LIB.formRuleMgr.require(""),
          LIB.formRuleMgr.length()
        ],
        "name": [
          LIB.formRuleMgr.require("检查项名称"),
          LIB.formRuleMgr.length(300, 0)
        ],
        "riskModel": [{
          required: true,
          validator: function (rule, value, callback) {
            var errors = [];
            var riskModel = JSON.parse(value);
            if (_.isNull(riskModel) || _.isNull(_.propertyOf(riskModel)("id"))) {
              errors.push("请选择风险等级");
            }
            callback(errors);
          }
        }],
        "type": [LIB.formRuleMgr.require("类型"),
          LIB.formRuleMgr.length()
        ],
        "compId": [{
            required: true,
            message: '请选择所属公司'
          },
          LIB.formRuleMgr.length()
        ],
        "equipId": [{
            required: true,
            message: '请选择设备设施'
          },
          LIB.formRuleMgr.length()
        ],
        "checkObjName": [{
            required: true,
            message: '请输入检查对象名称'
          },
          LIB.formRuleMgr.length()
        ],
        "checkStd": [{
            required: true,
            message: '请输入检查标准'
          },
          LIB.formRuleMgr.length()
        ],
        "isDigital": [{
            required: true,
            message: '请选择读数方式'
          },
          LIB.formRuleMgr.length()
        ],
        "digitalType": [{
            required: true,
            message: '请选择读数类型'
          },
          LIB.formRuleMgr.length()
        ],
        "maximum": [{
          required: true,
          validator: function (rule, value, callback) {
            if (value === '' || value == null) {
              return callback(new Error("请输入读数最大值"));
            } else if (value < 0) {
              return callback(new Error("请输入正数"));
            } else {
              return callback();
            }
          }
        }],
        "minimum": [{
          required: true,
          validator: function (rule, value, callback) {
            if (value === '' || value == null) {
              return callback(new Error("请输入读数最小值"));
            } else if (value < 0) {
              return callback(new Error("请输入正数"));
            } else {
              var maximum = dataModel.mainModel.vo.maximum;
              if (maximum != null) {
                if (maximum > value) {
                  return callback();
                } else {
                  return callback(new Error("最小值必须小于最大值"));
                }
              }
            }
          }
        }]
      },
      emptyRules: {},
      showEquipmentSelectModal: false,
      showDigitalFormItem: false,
      showEquipmentFormItem: false,
      isRelationEquiVal: "1",
      selectedDatas4Tree: null
    },
    selectModel: {
      equipmentTypeSelectModel: {
        visible: false
      }
    },
    riskTypeList: [],
    selectedDatas: [],
    riskTypeId: null,
    riskTypeName: null,
    isDigital: false,
    isRelationEquipment: false,
    typeList: null
  };

  var detail = LIB.Vue.extend({
    mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
    template: tpl,
    components: {
      'riskModel': riskModel,
      'equipmentSelectModal': equipmentSelectModal,
      'equipmentTypeSelectModal': equipmentTypeSelectModal,
    },
    props: {
      isShowEquipInspection: {
        type: Boolean,
        default: ''
      },
      asyncPlacement: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    computed: {
      displayTypeName: function () {
        var id = this.mainModel.vo.equipmentType.id;
        if (!id) {
          return ''
        }
        if (this.mainModel.vo.equipmentType.attr4) {
          return this.mainModel.vo.equipmentType.attr4;
        } else {
          return this.mainModel.vo.equipmentType.name;
        }
      },
      computerAsyncPlacement: function () {
        if (!this.asyncPlacement) {
          return 'bottom-start'
        }
        var dataLen = Array.isArray(this.getDataDicList('digital_type')) ? this.getDataDicList('digital_type').length : 0
        if (dataLen > 6) {
          return 'top-start'
        } else {
          return 'bottom-start'
        }
      }
    },
    watch: {
      'mainModel.vo.equipment.id': function (val) {
        if (val) {
          var equipment = this.mainModel.vo.equipment;
          if (equipment && equipment.code) {
            equipment.name = equipment.name + " - " + equipment.code;
          }
        }
      }
    },
    data: function () {
      return dataModel;
    },
    methods: {
      newVO: newVO,
      doShowEquipmentTypeModal: function () {
        this.selectModel.equipmentTypeSelectModel.visible = true;
      },
      doSaveEquipmentType: function (data) {
        this.mainModel.vo.equipmentType = data[0];
      },
      doShowEquipmentSelectModal: function () {
        this.mainModel.showEquipmentSelectModal = true;
      },
      doSaveEquipment: function (selectedDatas) {
        if (selectedDatas) {
          var equipment = selectedDatas[0];
          this.mainModel.vo.equipId = equipment.id;
          this.mainModel.vo.equipName = equipment.name;
          this.mainModel.vo.equipTypeId = equipment.equipmentType.id;
          this.mainModel.vo.equipTypeName = equipment.equipmentType.name;
          this.mainModel.vo.equipment.name = equipment.name;
          this.mainModel.vo.equipment.id = equipment.id;
          this.mainModel.vo.equipment.code = equipment.code;
        }
      },
      doChangeDigital: function () {
        if (this.mainModel.showDigitalFormItem) {
          this.mainModel.vo.isDigital = "0";
          this.mainModel.vo.digitalType = null;
          this.mainModel.vo.digitalUnit = null;
          this.mainModel.vo.maximum = null;
          this.mainModel.vo.minimum = null;
        } else {
          this.mainModel.vo.isDigital = "1";
        }
        this.mainModel.showDigitalFormItem = this.mainModel.showDigitalFormItem == true ? false : true;
      },
      doChangeRelationEquipment: function () {
        this.mainModel.isRelationEquiVal = "1";
        this.mainModel.vo.equipId = null;
        this.mainModel.vo.equipName = null;
        this.mainModel.vo.equipTypeId = null;
        this.mainModel.vo.equipTypeName = null;
        this.mainModel.vo.equipmentType = {
          id: '',
          name: ''
        };
        this.mainModel.vo.equipment = {
          id: null,
          name: null
        };
        this.mainModel.showEquipmentFormItem = this.mainModel.showEquipmentFormItem == true ? false : true;
      },
      beforeDoSave: function () {
        this.mainModel.vo.riskModel = JSON.stringify(this.mainModel.riskModel);
        if (this.selectedDatas.length > 0) {
          this.mainModel.vo.riskType.name = this.selectedDatas[0].name;
        }
        if (this.mainModel.vo.equipmentType && this.mainModel.vo.equipmentType.id) {
          this.mainModel.vo.equipTypeId = this.mainModel.vo.equipmentType.id;
        }
      },
      beforeInit: function () {
        this.selectedDatas = [];
        this.mainModel.riskModel = newRiskModel();
        this.mainModel.opType = 'create';

        this.isDigital = false;
        this.mainModel.showDigitalFormItem = false;

        this.isRelationEquipment = false;
        this.mainModel.showEquipmentFormItem = false;
        this.mainModel.isRelationEquiVal = "1";
      },
      afterInitData: function (data) {
        var _this = this;
        var _vo = this.mainModel.vo;
        if (_vo.riskModel) {
          this.mainModel.riskModel = JSON.parse(_vo.riskModel);
        }
        //判断设备设施Id
        if (_vo.equipTypeId) {
          this.mainModel.showEquipmentFormItem = true;
          this.isRelationEquipment = true;
        }
        if (_vo.equipId) {
          this.mainModel.isRelationEquiVal = 2;
        } else {
          if (_vo.equipTypeId) {
            var equipType = _.find(this.typeList, "id", _vo.equipTypeId);
            if (equipType) {
              _.extend(this.mainModel.vo.equipmentType, equipType);
            }
          }
          // this.mainModel.vo.equipmentType.name = _vo.equipTypeName;
          // this.mainModel.vo.equipmentType.id = _vo.equipTypeId;
          this.mainModel.isRelationEquiVal = 1;
        }
        if (_vo.isDigital) {
          if (this.mainModel.opType == "create") {
            this.isDigital = !!(_vo.isDigital === '0');
          } else {
            this.isDigital = (_vo.isDigital > '0');
            if (this.isDigital) {
              this.mainModel.showDigitalFormItem = this.mainModel.showDigitalFormItem == true ? false : true;
            }
          }
        }
      },
      doChangeDigitalType: function (digitalType) {
        var _digitalTypeUnit = this.getCascadeDataDic('digital_type', digitalType);
        this.mainModel.vo.digitalUnit = _digitalTypeUnit;
      },
      doChangeRelationEquiType: function () {
        this.mainModel.vo.equipId = null;
        this.mainModel.vo.equipName = null;
        this.mainModel.vo.equipTypeId = null;
        this.mainModel.vo.equipTypeName = null;
        this.mainModel.vo.equipmentType = {
          id: '',
          name: ''
        };
        this.mainModel.vo.equipment = {
          id: '',
          name: ''
        };
      },
      _getEquiTypeList: function () {
        var _this = this;
        api.getTypeList().then(function (res) {
          _this.typeList = res.data;
        })
      },
      _getItemTypeList: function () {
        api.checkItemType().then(function (res) {
          dataModel.riskTypeList = res.data;
        });
      }
    },
    ready: function () {},
    created: function () {
      this._getEquiTypeList();
      this._getItemTypeList();
    }
  });

  return detail;
});