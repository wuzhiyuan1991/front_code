define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	var videoHelper = require("tools/videoHelper");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	//var checkObjectSelectModal = require("componentsEx/selectTableModal/checkObjectSelectModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var equipmentSelectModal = require("componentsEx/selectTableModal/tpaEquipmentSelectModal");


	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//
			code : null,
			//内容
			content : null,
			//来源 0:手机检查  1：web录入 2 其他
			checkSource : 1,
			//状态   1:待审核 2:已转隐患 3:被否决
			status : 1,
			//
			compId : null,
			//组织id
			orgId : null,
			//审核时间
			auditDate : null,
			//检查时间
			checkDate : null,
			//关闭时间
			closeDate : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//点赞数
			praises : null,
			//发布者姓名
			publisherName : null,
			//备注
			remarks : null,
			//评论数
			reviews : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//受检对象
			checkObject : {id:'', name:''},
			//检查人
			user : {id:null, name:null},
			equipment:{id:null,name:null},
			equipmentId:null,
		}
	};
	//附件上传后回调方法声明
	var uploadEvents = {
		//附件 图片或视频
		pic:function(file, rs){
			dataModel.picFiles.push({fileId:rs.content.id});
		},
		video:function(file, rs){
			dataModel.videoFiles.push({fileId:rs.content.id});
		}
	}
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			//showCheckObjectSelectModal : false,
			showUserSelectModal : false,
			showEquipmentSelectModal:false,
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				compId: [
					{required: true, message: '请选择所属公司'},
				],
				orgId: [
						{required: true, message: '请选择所属部门'},
						],
				"content" : [LIB.formRuleMgr.require("描述"),
						  LIB.formRuleMgr.length(500)
				],
				"checkSource" : [LIB.formRuleMgr.require("来源"),
						  LIB.formRuleMgr.length()
				],
				"user.name" : [LIB.formRuleMgr.require("检查人"),
					LIB.formRuleMgr.length()
				],

				"createDate" : [LIB.formRuleMgr.require("检查时间"),
					LIB.formRuleMgr.length()
				],
				"status" : [LIB.formRuleMgr.require("状态"),
						  LIB.formRuleMgr.length()
				],
				/*"checkObject.name" : [LIB.formRuleMgr.require("受检对象"),
					LIB.formRuleMgr.length()
				],*/
				"auditDate" : [LIB.formRuleMgr.length()],
				"checkDate" : [LIB.formRuleMgr.require("检查时间"),
					LIB.formRuleMgr.length()],
				"closeDate" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"praises" : [LIB.formRuleMgr.length()],
				"publisherName" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"reviews" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
	        },
	        emptyRules:{}
		},
		tableModel : {
		},
		formModel : {
		},
		selectModel : {
			equipmentSelectModel : {
				filterData : {
					orgId : null
				}
			}
		},
		//图片配置
		picModel:{
			params:{
				recordId : null,
				fileType:"B",
				dataType:"B1"
			},
			filters:{
				max_file_size: '10mb',
				mime_types: [{ title: "files", extensions: "png,jpg,jpeg" }]
			},
			events:{
				onSuccessUpload:uploadEvents.pic
			}
		},
		//视频配置
		videoModel:{
			params:{
				recordId : null,
				fileType:"B",
				dataType:"B2"
			},
			filters:{
				max_file_size: '10mb',
				mime_types: [{ title: "video", extensions: "mp4" }]
			},
			events:{
				onSuccessUpload:uploadEvents.video
			}
		},
		playVideoModel:{
			title : "视频播放",
			show : false,
			id: null
		},
		showPicModel:{
			title : "图片显示",
			show : false,
			id: null
		},

		picFiles:[],
		videoFiles:[],
        isUploadPic:true,
	};

    //初始化上传组件RecordId参数
    var initUploadorRecordId = function(recordId){
        dataModel.picModel.params.recordId = recordId;
        dataModel.videoModel.params.recordId = recordId;
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
			//"checkobjectSelectModal":checkObjectSelectModal,
			"userSelectModal":userSelectModal,
			"equipmentSelectModal":equipmentSelectModal,

        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doClearInput:function(){
				this.mainModel.vo.equipmentId = null;
			},
			//附件 图片或视频
			pic:function(data){
				dataModel.picFiles.push({fileId:data.rs.content.id});
			},
			video:function(data){
				dataModel.videoFiles.push({fileId:data.rs.content.id});
			},
			doShowUserSelectModal:function(){
				this.mainModel.showUserSelectModal = true;
			},
			//doEdit:function(){
			//	this.mainModel.isReadOnly=false;
			//},
			/*doShowCheckObjectSelectModal:function(){
				this.mainModel.showCheckObjectSelectModal = true;
			},*/
			doShowEquipmentSelectModel:function(){
				this.mainModel.showEquipmentSelectModal = true;
				this.selectModel.equipmentSelectModel.filterData ={orgId : this.mainModel.vo.orgId};
			},
			/*doSaveCheckObject : function(selectedDatas) {
				if (selectedDatas) {
					var checkObject = selectedDatas[0];
                    this.mainModel.vo.checkObject.id = checkObject.id;
                    this.mainModel.vo.checkObject.name = checkObject.name;
				}
			},*/
			doSaveEquipment:function(selectedDatas){
				if(selectedDatas){
					var equipment = selectedDatas[0];
					this.mainModel.vo.equipmentId = equipment.id;
					this.mainModel.vo.equipment.name = equipment.name;
					this.mainModel.vo.equipment.id = equipment.id;
				}
			},
            beforeDoDelete:function(){
                if (this.mainModel.vo.status == 2 || this.mainModel.vo.status == 3){
                    LIB.Msg.warning("已转隐患/被否决的记录不可以删除!");
                    return false;
                }
            },
			//selectUser:function(){
			//	this.mainModel.showUserSelectModal = true;
			//},
			//selectCheckTable:function(){
			//	this.mainModel.showCheckObjectSelectModal = true;
			//},
			doSaveUser : function(selectedDatas) {
				if (selectedDatas) {
					 var user = selectedDatas[0];
                    this.mainModel.vo.user.id = user.id;
                    this.mainModel.vo.user.name = user.name;
                    this.mainModel.vo.user.username = user.name;
				}
			},
			doPlay:function(fileId){
				this.playVideoModel.show=true;
				setTimeout(function() {
					videoHelper.create("player",fileId);
				}, 50);
			},
			doPic:function(fileId){
				this.showPicModel.show=true;
				this.showPicModel.id=fileId;
			},
			doDown:function(fileId){
				api.downFile({id:fileId});
			},
			//删除文件
			doDeleteFile:function(fileId,array,index){

				api.deleteFile(null,[fileId]).then(function(data){
					array.splice(index,1);
					LIB.Msg.success("删除成功");
				})

			},
			afterInitData : function() {
				var id = this.mainModel.vo.id,
					_vo = this.mainModel.vo;
                this.picFiles=[];
                this.videoFiles=[];
				if(id){
					initUploadorRecordId(this.mainModel.vo.id);
				}
				// api.get({id:id}).then(function(res){
				// 	//初始化图片视频数据
				// 	_.each(res.data.fileList,function(pic){
				// 		if(pic.dataType == "B1"){//B1发现图片
				// 			dataModel.picFiles.push({fileId:pic.id});
				// 		}else if(pic.dataType == "B2"){//发现视频
				// 			dataModel.videoFiles.push({fileId:pic.id});
				// 		}
				// 	});
				// });
                //初始化图片
                api.listFile({recordId : _vo.id}).then(function(res){
                    dataModel.picFiles = [];
                    dataModel.videoFiles = [];

                    var fileData = res.data;
                    //初始化图片数据
                    _.each(fileData,function(pic){
                        if(pic.dataType == "B1"){
                            dataModel.picFiles.push({fileId:pic.id,fileExt:pic.ext});
                        }else if(pic.dataType == "B2"){
                            dataModel.videoFiles.push({fileId:pic.id,fileExt:pic.ext});
                        }
                    });
                });
			},
			afterDoSave:function(type){
				if(type.type == "C"){
					initUploadorRecordId(this.mainModel.vo.id);
				}
			},
			beforeInit : function(transferVo, opt) {
				this.picFiles=[];
				this.videoFiles=[];
			},
			afterInit : function(transferVo, opt) {
				if(opt.opType == "create"){
					this.mainModel.vo.compId = LIB.user.compId;
				}
			},
            //背景图片
            backgroundStyle : function(fileId){
                return "url("+this.convertPicPath(fileId,'watermark')+"),url("+LIB.ctxPath()+"/html/images/default.png)"
            },
			convertPicPath:LIB.convertPicPath,
			convertPath:LIB.convertPath
		},
        ready: function(){
        	this.$api = api;
        }
	});

	return detail;
});