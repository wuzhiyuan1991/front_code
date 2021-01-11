define(function (require) {
  var LIB = require('lib')
  var api = require('./vuex/api')
  //右侧滑出详细页
  var tpl = require('text!./detail.html')
 
  

  //初始化数据模型
  var newVO = function () {
    return {
			id : null,
			//编码
			code : null,
			//公司id
			compId : null,
			//部门id
			orgId : null,
			//停用标识 0:启用,1:停用
			disable : "0",
			//关键词
			keyword : null,
		}
  }
  //Vue数据
  var dataModel = {
    mainModel: {
      vo: newVO(),
      opType: 'view',
      isReadOnly: true,
      title: '',
      codeSure:'', // 编码
      // filterColumn:['compId'],
      // filterColumn:['orgId'],

      //验证规则
      //验证规则
      rules:{
				"code" : [LIB.formRuleMgr.length(50)],
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.require("部门"),
						  LIB.formRuleMgr.length(10)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"keyword" : [LIB.formRuleMgr.length(20),LIB.formRuleMgr.require('关键字')],
	        }
    }
  }
  //Vue组件
  /**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
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
  var detail = LIB.Vue.extend({
    mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
    template: tpl,
    components: {
      
    },
    watch: {
      
      'relpyModal.show': function (val) {
        if (val) {
          setTimeout(this.doLoadKindEditor, 0)
        }
      },
      'mainModel.vo.keywords': function (val) {},
    
    },
   

    data: function () {
      return dataModel
    },
    computed: {
      isCreator: function () {
        var createBy = this.mainModel.vo.createBy;
        return LIB.user.id === createBy
      },
      isSuper: function () {
        
        return LIB.user.id === '9999999999'
      },
    },
    methods: {
      getFaceid: function (val) {
        return LIB.convertPicPath(val)
      },
      getOrgName: function (val) {
        var org = this.getDataDic('org', val)
        // console.log(org)
        return org.deptName
      },
      getCompName: function (val) {
        return this.getDataDic('org', val).compName
      },
      
      newVO: newVO,
      // 新建保存关键字
      doSave: function() {
        if(this.mainModel.action === "copy") {
            this.doSave4Copy();
            return;
        }

        //当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
        if (this.beforeDoSave() === false) {
            return;
        }
        var _this = this;
        var _data = this.mainModel;
        if(_data.vo.keyword!=null||''){
          _data.vo.keyword= _data.vo.keyword.trim()
        }
      // if (this.mainModel.vo.keyword.length==0) {
      //   LIB.Msg.warning('关键字不能为空!')
      //   return
      // }

      // if (this.mainModel.vo.keyword.length >= 20) {
      //   LIB.Msg.warning('关键字长度在1到10字符')
      //   return
      // }

        this.$refs.ruleform.validate(function(valid) {
            if (valid) {
                if (_this.afterFormValidate && !_this.afterFormValidate()) {
                    return;
                }
                var _vo = _this.buildSaveData() || _data.vo;
                if (_data.vo.id == null || _this.mainModel.opType==='create') {
                    _this.$api.create(_vo).then(function(res) {
                        //清空数据
                        //_.deepExtend(_vo, _this.newVO());
                        //_this.opType = "view";
                        LIB.Msg.info("保存成功");
                        _data.vo.id = res.data.id;
                       _this.init('view',  _data.vo.id )
                       _this.$dispatch("ev_dtUpdate");
                    });
                } else {
                    _vo = _this._checkEmptyValue(_vo);
                    _this.$api.update(_vo).then(function(res) {
                        LIB.Msg.info("保存成功");
                        _this.afterDoSave({ type: "U" }, res.body);
                        _this.changeView("view");
                        _this.$dispatch("ev_dtUpdate");
                        _this.storeBeforeEditVo();
                    });
                }
            } else {
                //console.error('doSave error submit!!');
            }
        });
        this.afterInitData()
    },
  
      afterInit: function () {

        
      },
      afterInitData: function (param) {
       
      },
     
    },
    events: {
     
    },
    init: function () {
      this.$api = api
    }
  })

  return detail
})
