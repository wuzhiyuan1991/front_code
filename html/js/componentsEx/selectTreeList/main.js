define(function(require) {

	var Vue = require("vue");
	var template = '<set-select :model-type="modelType" :open-deep="openDeep" :placeholder="placeholder" :custom-ico="customIco" :show-fix-ico="showFixIco" :custom-func="customFunc" :model.sync="model" multiple :department="department" :mechanism-type="mechanismType" :transfer-data="transferData" :modal-title="modalTitle" :serch-filterable="serchFilterable" :data-query.sync="dataQuery" :parent-node="parentNode" :keydata="keydata" :selected-datas.sync="selectedDatas" :treedata="treedata" :subject-matter-type="subjectMatterType" @on-month="onClick"></set-select>';
	var opts = {
		template :  template,
		props: {
			//树的数据源
			treedata:{
				type:[Object,Array],
			},
			model:{
				type:Array,
				'default':function () {
					return []
				}
			},
			//右边的数据
			transferData:{
				type:Array,
				'default':function () {
					return []
				}
			},
			selectedDatas: {
				type: Array,
				'default':function () {
					return []
				}
			},
			//数据源的桥接变量 保存选中的数据
			keydata:{
				type: Array,
				'default':function () {
					return []
				}
			},
			parentNode:{
				type: Boolean,
				default:false
			},
			dataQuery:{
				type: String,
				default:''
			},
			serchFilterable:{
				type: Boolean,
				default: false
			},
			//为modal的title
			modalTitle:{
				type: String,
				default:'选择'
			},
			//2796的选中部门接口
			department:{
				type: Boolean,
				default:false
			},
			subjectMatterType:{
				type:Boolean,
				default:false
			},
			//机构的判断
			mechanismType:{
				type:Boolean,
				default:false
			},
            //显示自定义的图标 （公司跟部门）
            customIco:{
                type:Boolean,
                default:false
            },
            customFunc: {
                type: Function,
                default: function () {
                    return '';
                }
            },
            //右边框是否显示图标
            showFixIco:{
                type:Boolean,
                default:false
            },
            placeholder: {
                type: String,
                default: '请选择'
            },
            // 展开的层级，默认两级
            openDeep: {
                type: Number,
                default: 2
            },
            modelType: {
				type: String,
				default: ''
			}
		},
		methods:{
            onClick:function(){
				if(this.model.length>0){
					//深拷贝
					this.transferData =  JSON.parse(JSON.stringify(this.model));
					this.selectedDatas = JSON.parse(JSON.stringify(this.model));
					this.$broadcast('on-clear-rigthList');
				}else{
					this.transferData = [];
					this.selectedDatas = [];
					this.keydata = [];
					//this.transferData.length = 0;
					//this.selectedDatas.length = 0;
					//this.keydata.length = 0;
				}
			}
		},
		events:{
			"on-modeltree-selected":function(value){
				var _this = this;
				_this.transferData = value;
				_this.model = value;
			},
		}
	};


	var component = Vue.extend(opts);
	Vue.component('main-select', component);

});