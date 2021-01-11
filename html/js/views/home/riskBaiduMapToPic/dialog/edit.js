define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./edit.html");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");
	var api = require('../vuex/api')
    //初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//角色编码
			code : null,
			//分类名称
			name : null,
			compId:null,
			orgId:null,
            cloudFiles:[],
			x:'',
			y:'',
            drawOrgId:null
		}
	};

	function newTemp() {
		return {
            pictureId: "RiskMapLevel2a",
            areaId: "L1",
            areaName: "",
            drawOrgId: null,
            areaGroupId: null,
            orgId: null,
            dominationAreaIds: [

            ],
            orgName: "田寮第二工业区",
            points: [],
            imgSrc: "",
            areas: [

            ],
            isClick: 0
        }
    }
	function newBase() {
		return{
            compId: "",
			orgID:'',
            defalutLevel: '1',
            drawOrgId: "",
            id: "",
            name: "",
            riskLevel: "1",
            x: 113.909407,
            y: 22.722223,
			level:'3'
		}
    }
	//Vue数据
	var dataModel = {
		mainModel : {
			uuid:null,
			vo : newVO(),
			tempObj:newTemp(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",

			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.length()],
				"name" : [LIB.formRuleMgr.require("分类名称"),
						  LIB.formRuleMgr.length()
				],
				"compId" : [
						  LIB.formRuleMgr.length()
				],
				"orgId" : [LIB.formRuleMgr.length()],
				"level" : [LIB.formRuleMgr.length()],
	        },
	        emptyRules:{},
            dominationArea:null
		},
		// 属地弹框
        dominationAreaSelectModel: {
            visible: false,
            filterData: {}
        },
		//  文件上传参数
        uploadModel: {
            params: {
                recordId: null,
                dataType: 'AQCN0',
                fileType: 'AQCN'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "jpg,jpeg,png" }]
            }
        },

	};
	
	var detail = LIB.Vue.extend({
		// mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        mixins : [LIB.VueMixin.dataDic],
		template: tpl,
        components : {
            "dominationareaSelectModal":dominationAreaSelectModal,
		},
		data:function(){
			return dataModel;
		},
		props:{
			visible:{
				type:Boolean,
				default:false
			}
		},
		methods:{
			newVO : newVO,
			init:function (obj) {
				if(!obj){
                    this.mainModel.opType = 'create';
                    this.mainModel.vo = newVO();
                    this.getUUID();
				}else{
					this.mainModel.opType = 'update';
					var temp = _.cloneDeep(obj);
					this.mainModel.vo = {
						compId:temp.orgId,
						orgId:temp.areaGroupId,
                        name:temp.name,
						x:temp.x,
						y:temp.y,
						drawOrgId:temp.drawOrgId
					}
				}
            },

			doUpdate:function () {
                this.$emit("update-point", this.mainModel.vo)
            },

			getAllPoint:function () {

            },

            doSave1:function () {
				this.visible = false;
				if(this.mainModel.opType !== 'create'){
					return this.doUpdate();
				}

				if(this.mainModel.vo.orgId){
                    this.mainModel.vo.drawOrgId = this.mainModel.vo.orgId;
                }

				var oldItem = newTemp();
                oldItem.areaGroupId = this.mainModel.vo.orgId;
                oldItem.orgName = this.mainModel.vo.name;
                oldItem.orgId = this.mainModel.vo.compId;
                oldItem.drawOrgId = this.mainModel.vo.drawOrgId;

                var baseItem = newBase();
                baseItem.areaGroupId = this.mainModel.vo.orgId;
                baseItem.name = this.mainModel.vo.name;
                baseItem.orgId = this.mainModel.vo.compId;
                baseItem.drawOrgId = this.mainModel.vo.drawOrgId;
                baseItem.parentId = this.mainModel.vo.compId;
                LIB.Msg.info("点击地图插入");
				this.$emit("add-point", this.mainModel.vo,oldItem, baseItem);
            },
            doShowDominationAreaSelectModal: function () {
                this.dominationAreaSelectModel.filterData.orgId = this.mainModel.vo.orgId;
                this.dominationAreaSelectModel.filterData.compId = this.mainModel.vo.compId;
                this.dominationAreaSelectModel.visible = true;
            },
            doSaveDominationArea: function (items) {
                // var item = items[0];
                // this.mainModel.vo.dominationArea.id = item.id;
                // this.mainModel.vo.dominationArea.name = item.name;
                this.mainModel.vo.dominationArea = items;
            },


			/*************       文件先关    *******************/
            uploadClicked: function () {
                this.$refs.uploader.$el.firstElementChild.click();
            },
            doUploadBefore: function () {
                LIB.globalLoader.show();
            },
            doUploadSuccess: function (param) {
                var con = param.rs.content;
                this.mainModel.vo.cloudFiles.push(con);
                LIB.globalLoader.hide();
            },
            onUploadComplete: function () {
                LIB.globalLoader.hide();
            },
            removeFile: function (fileId, index) {
                var _this = this;
                LIB.Modal.confirm({
                    title: "确定删除文件？",
                    onOk: function() {
                        api.deleteFile(null, [fileId]).then(function () {
                            _this.mainModel.vo.cloudFiles.splice(index, 1);
                        })
                    }
                });
            },
            doViewImages: function (index) {
                var files = this.mainModel.vo.cloudFiles;
                var file = files[index];
                var _this = this;

                var images;
                // 如果是图片
                if (_.includes(['png', 'jpg', 'jpeg'], file.ext)) {
                    images = _.filter(files, function (item) {
                        return _.includes(['png', 'jpg', 'jpeg'], item.ext)
                    });
                    this.images = _.map(images, function (content) {
                        return {
                            fileId: content.id,
                            name: content.orginalName,
                            fileExt: content.ext
                        }
                    });

                    setTimeout(function () {
                        _this.$refs.imageViewer.view(_.findIndex(images, "id", file.id));
                    }, 100);
                } else {
                    window.open("/file/down/" + file.id)
                }
            },

			getUUID:function () {
            	var _this = this;
				api.getUUID().then(function (res) {
					_this.mainModel.uuid = res.data;
					_this.mainModel.vo.drawOrgId = res.data;
                })
            }

		},

	});
	
	return detail;
});