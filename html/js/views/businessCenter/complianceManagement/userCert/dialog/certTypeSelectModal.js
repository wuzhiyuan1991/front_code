define(function(require){
	var LIB = require('lib');
	var api = require("../vuex/api");
 	//数据模型
	var tpl = require("text!./certTypeSelectModal.html");

	//初始化数据模型


	//Vue数据
	var dataModel = {
        treeSelectData:[],
        legalTypes:[]
	};
	
	var detail = LIB.Vue.extend({
        watch: {
            visible: function (val) {
                val && this.initData();
            },
        },
		template: tpl,
		components : {},
		data:function(){
			return dataModel;
        },
        props: {

            visible: {
                type: Boolean,
                default: false
            },


        },
		methods:{
            initData: function () {
                var _this = this
                api.listCertType().then(function (res) {
                    
                    if (res.data.length > 0) {
                        _this.legalTypes = res.data;
                       
                    } else {
                        _this.legalTypes = []
                       
                    }
                    _this.treeSelectData = []
                });

            },
            doClose:function(){
                this.visible=false
            },
            doSave:function(){
                var _this = this
                if (_this.treeSelectData.length>0) {
                    this.$emit('do-save',_this.treeSelectData)
                    this.visible=false
                }else{
                    LIB.Msg.info('请选择证件')
                }
            }
		}
	});
	
	return detail;
});