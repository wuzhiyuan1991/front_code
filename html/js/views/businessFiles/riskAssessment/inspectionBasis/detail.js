   define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
    var videoHelper = require("tools/videoHelper");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var checkBasisTypeSelectModal = require("componentsEx/selectTableModal/checkBasisTypeSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//
			code : null,
			//章节名称
			name : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//内容
			content : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查依据分类
			checkBasisType : {id:'', name:''},
            checkBasisTypeId:null,

		}
	};
	//图片上传后回调方法声明
	var uploadEvents = {
		//正确图片
		rightPic:function(file, rs){
			dataModel.rightPictures.push({fileId:rs.content.id,fileExt:rs.content.ext});
		},
		//视频
		wrongPic:function(file, rs){
			dataModel.wrongPictures.push({fileId:rs.content.id,fileExt:rs.content.ext});
		},
		//参考资料
		referMater:function(file, rs){
			dataModel.referenceMaterials.push({fileId:rs.content.id,orginalName:rs.content.orginalName});
		}
	}
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			showCheckBasisTypeSelectModal : false,
			
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.require("章节名称"),
						  LIB.formRuleMgr.length()
				],
				//[{ required: true, message: '请选择所属公司'}],
				"compId" : [{required: true, message: '请选择所属公司'},
					LIB.formRuleMgr.length()
				],

				"checkBasisType.id" : [{required: true, message: '请选择法律法规'},
				LIB.formRuleMgr.length()
				],
				"content" : [LIB.formRuleMgr.require("内容"),
					LIB.formRuleMgr.length(500,1)
				],
				"disable" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		tableModel : {
		},
		formModel : {
		},
		//正确图片配置
		rightPicModel:{
			params:{
				recordId : null,
				dataType : 'I3',//事故案例数据来源标识（正确）
				fileType : 'I',
			},
			events:{
				onSuccessUpload:uploadEvents.rightPic
			}
		},
		//视频配置
		wrongPicModel:{
			params:{
				recordId : null,
				dataType : 'I4',//事故案例数据来源标识（错误）
				fileType : 'I',
			},
			filters:{
				max_file_size: '10mb',
				mime_types: [{ title: "video", extensions: "mp4" }]
			},
			events:{
				onSuccessUpload:uploadEvents.wrongPic
			}
		},
		//参考资料配置
		referMaterModel:{
			params:{
				recordId : null,
				dataType : 'I5',
				fileType : 'I',
			},
			filters:{
				max_file_size: '10mb',
				mime_types: [{ title: "file", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt" }]
			},
			events:{
				onSuccessUpload:uploadEvents.referMater
			}
		},
		playModel:{
			title : "视频播放",
			show : false,
			id: null
		},
		picModel:{
			title : "图片显示",
			show : false,
			id: null
		},
		rightPictures : [],
		wrongPictures : [],
		referenceMaterials : [],
		isSave:false,
		typeList:[],
		checkBasisTypeName:null,

	};
	//初始化上传组件RecordId参数
	var initUploadorRecordId = function(recordId){
		dataModel.rightPicModel.params.recordId = recordId;
		dataModel.wrongPicModel.params.recordId = recordId;
		dataModel.referMaterModel.params.recordId = recordId;
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
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			"checkbasistypeSelectModal":checkBasisTypeSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			//正确图片
			rightPic:function(data){
				LIB.Msg.info("上传成功");
				dataModel.rightPictures.push({fileId:data.rs.content.id,fileExt:data.rs.content.ext});
			},
			//视频
			wrongPic:function(data){
				LIB.Msg.info("上传成功");
				dataModel.wrongPictures.push({fileId:data.rs.content.id,fileExt:data.rs.content.ext});
			},
			//参考资料
			referMater:function(data){
				LIB.Msg.info("上传成功");
				dataModel.referenceMaterials.push({fileId:data.rs.content.id,orginalName:data.rs.content.orginalName});
			},
			doSaveCheckBasisType : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.checkBasisType = selectedDatas[0];
				}
			},
			afterInitData : function() {
				var _vo = dataModel.mainModel.vo;
                this.rightPictures = [];
                this.wrongPictures=[];
                this.referenceMaterials = [];
                if(this.mainModel.vo.id){
                    initUploadorRecordId(this.mainModel.vo.id);
                }
				var _this = this;
				// api.getCheckBasisType().then(function (res) {
				// 	_this.typeList = res.data;
					_.each(_this.typeList,function(item){
						if(_this.mainModel.vo.checkBasisType.id==item.id){
							_this.checkBasisTypeName = item.name;
						}
					});
				// });
				//初始化图片
				api.listFile({recordId : _vo.id}).then(function(res){
                    dataModel.rightPictures = [];
                    dataModel.wrongPictures = [];
                    dataModel.referenceMaterials = [];

                    var fileData = res.data;
					//初始化图片数据
					// _.each(fileData,function(pic){
					// 	if(pic.dataType == "I1"){
					// 		dataModel.rightPictures.push({fileId:pic.id,fileExt:pic.ext});
					// 	}else if(pic.dataType == "I2"){
					// 		dataModel.wrongPictures.push({fileId:pic.id,fileExt:pic.ext});
					// 	}else if(pic.dataType == "I5"){
					// 		dataModel.referenceMaterials.push({fileId:pic.id,orginalName:pic.orginalName});
					// 	}
					// });
                    _.each(fileData, function (pic) {
                        if (pic.dataType === "I3") {
                            dataModel.rightPictures.push({fileId: pic.id,fileExt:pic.ext, fullSrc: pic.ctxPath, attr5: pic.attr5});
                        } else if (pic.dataType === "I4") {
                            dataModel.wrongPictures.push({fileId: pic.id,fileExt:pic.ext});
                        } else if (pic.dataType === "I5") {
                            dataModel.referenceMaterials.push({fileId: pic.id, orginalName: pic.orginalName});
                        }
                    });
				});
			},
			doEdit:function(){
				this.mainModel.opType = "update";
				this.mainModel.isReadOnly = false;
                initUploadorRecordId(this.mainModel.vo.id);
			},
			doCancel:function(){
				var _this = this;
				if(_this.mainModel.vo.id) {
					api.get({id : _this.mainModel.vo.id}).then(function(res){
						var data = res.data;
						_this.mainModel.vo = newVO();
						_.deepExtend(_this.mainModel.vo, data);
					});
				}
				_this.mainModel.isReadOnly = true;
				_this.afterInitData && _this.afterInitData();
			},
			beforeDoSave:function(){
				this.mainModel.vo.orgId = this.mainModel.vo.compId;
				this.mainModel.vo.checkBasisTypeId= this.mainModel.vo.checkBasisType.id;
			},
			afterDoSave:function(type){
				if(type.type === "C"){
					initUploadorRecordId(this.mainModel.vo.id);
					var _this = this;
					_.each(_this.typeList,function(item){
						if(_this.mainModel.vo.checkBasisType.id==item.id){
							_this.checkBasisTypeName = item.name;
						}
					});
				}
			},

			doDeleteFile:function(fileId,index,array){
				var _this = this;
				LIB.Modal.confirm({
					title:'确定删除?',
					onOk:function(){
						api.deleteFile(null,[fileId]).then(function(data){
							if (data.data && data.error != '0') {
								return;
							} else {
								array.splice(index,1);
								LIB.Msg.success("删除成功");
							}
						})
					}
				});
			},
			doPic:function(fileId,fileExt){
				if(fileExt==='mp4'){
					this.playModel.show=true;
					setTimeout(function() {
						videoHelper.create("player",fileId);
					}, 50);
					return;
				}
				this.picModel.show=true;
				this.picModel.id=fileId;
			},
			beforeInit : function() {
				api.getCheckBasisType().then(function (res) {
					dataModel.typeList = res.data;
				});
				this.rightPictures = [];
				this.wrongPictures=[];
				this.referenceMaterials = [];
			},
			convertPicPath:LIB.convertPicPath,
			convertPath:LIB.convertPath,
            //背景图片
            backgroundStyle : function(fileId){
                return "url("+this.convertPicPath(fileId,'watermark')+"),url("+LIB.ctxPath()+"/html/images/default.png)"
            },

		},
        init: function () {
            this.$api = api;
        }
	});

	return detail;
});