define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
    var Viewer = require("libs/viewer");

    //右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var taskDetail = require("./dialog/task-detail");


	var newVO = function() {
		return {
            //自评任务id
            id : null,
            //编码
            code : null,
            //结束时间
            endDate : null,
            //开始时间
            startDate : null,
            //公司id
            compId : null,
            //组织id
            orgId : null,
            //实际完成时间
            actualfinishDate : null,
            //评审结束时间
            auditEndDate : null,
            //评审来源：0系统到期提交, 1用户手动提交
            auditSource : null,
            //评审开始时间
            auditStartDate : null,
            //是否禁用 0启用，1禁用
            disable : null,
            //是否为抽检数据,即抽检人做的记录  0-否(默认) 1-是
            isRandom : null,
            //任务序号
            num : null,
            //重新自评结束时间
            reAstEndDate : null,
            //重新自评开始时间,驳回时间
            reAstStartDate : null,
            //备注
            remarks : null,
            //得分
            score : null,
            //任务状态 默认0待开始 1待自评 2待评审 3待修改 4已完成 5已过期 6已取消
            status : null,
            //自评任务提交时间
            submitDate : null,
            //类型 0自评任务
            type : null,
            //修改日期
            modifyDate : null,
            //创建日期
            createDate : null,
			//自评人
			user : {id:'', name:''},
			//自评表
			asmtTable : {id:'', name:''},
			//自评计划
			asmtPlan : {id:'', name:''},
            mbrea: {id: '', username: ''},
            taskResultList: []
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:""
		},
		tableModel: {
			columns: [
				// {
				// 	title: "",
				// 	render: function (q, w, e) {
				// 		var pageSize = _.get(e, "pageSize", 0);
				// 		var curPage = _.get(e, "curPage", 0);
				// 		if(pageSize && curPage) {
                 //            return pageSize * (curPage - 1) + w + 1;
                 //        }
                 //        return ''
                 //    },
				// 	width: 40
				// },
				{
					title: '自评项',
					fieldName: 'asmtItem.name',
					width: '260px'
				},
				{
					title: '标准分值',
					fieldName: 'asmtItem.score',
                    width: '90px'
				},
				{
					title: '自评结果',
					fieldName: 'result',
					render: function (data) {
						var res = '';
						switch (data.result) {
							case '1':
								res = '做到';
								break;
							case '5':
								res = '没做到';
								break;
							default :
								res = data.score;
						}
						return res;
                    },
                    width: '90px'
				},
				{
					title: '自评-简述',
					fieldName: 'remark',
					width: '180px'
				},
                {
                    title: '领导复评',
                    fieldName: 'isAccept',
                    render: function (data) {
                        var res = '';
                        if (data.asmtTask && data.asmtTask.status == 4) {//已经复评的判断
                        	if(data.attr2) {//attr2为复评分数，有值即为分数值模式
                        		res = data.attr2;
                        	} else {//attr2无值则为逻辑模式
                        		switch (data.isAccept) {
	                                case '0':
	                                    res = '不认可';
	                                    break;
	                                case '1':
	                                    res = '认可';
	                                    break;
	                            }
                        	}
                        }
						return res;
                    },
                    width: '90px'
                },
                {
                    title: '复评-分享',
                    fieldName: 'isShared',
                    width: '90px',
                    render: function (data) {
                        var res = '';
                        if (data.asmtTask && data.asmtTask.status == 4) {
                            switch (data.isShared) {
                                case '1':
                                    res = "已分享";
                                    break;
                                case '0':
                                    res = "未分享";
                                    break;
                            }
                        }
                        return res;
                    }
                },
                {
                    title: '最终得分',
                    fieldName: 'attr3',
                    width: '90px'
                },
                {
                    title: '领导复评-简述',
                    fieldName: 'feedback',
                    width: '190px'
                },
                {
                    title: '',
					render: function (data) {
						var str = '<div>';
						str += '<a href="javascript:void(0);" class="ls-table-detail">明细</a>';
						if(data.cloudFiles && data.cloudFiles.length > 0) {
							str += '<i class="ivu-icon ivu-icon-images" style="font-size: 14px;margin-left: 5px;position: relative;top: 1px;cursor: pointer;"></i>';
						}
						str += '</div>';
						return str;
                    },
					width: '80px',
                    event: true
                }
			]
		},
		cardModel : {
            showContent: true
		},
        detailModel: {
			visible: false
		}
	};
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
			"taskDetail": taskDetail
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            _viewImages: function (files) {
				if(!_.isArray(files) || files.length === 0) {
					return;
				}
				var _this = this;
				var ul = document.createElement('ul');
				var str = '';
				_.forEach(files, function (file) {
					str += '<li><img alt="" src="' + LIB.convertWatermarkPicPath(file.id) +'"></li>'
                });
				ul.innerHTML = str;
				ul.style.display = 'none';
				this.$els.imageSlot.appendChild(ul);

				var viewer = new Viewer(ul, {
                    navbar: false,
                    transition: false,
                    zoomRatio: 0.2,
                    minZoomRatio: 0.3,
                    maxZoomRatio: 5,
                    fullscreen: false,
                    hidden: function () {
						viewer.destroy();
                        _this.$els.imageSlot.innerHTML = '';
                    }
				});
				viewer.show();
            },
            doClickCell: function (item, event) {
				var target = event.target;
				if(target.classList.contains('ls-table-detail')) {
					this.detailModel.visible = true;
					this.$broadcast('ev_task_detail', item.id,item);
				} else if(target.classList.contains('ivu-icon-images')) {
					var files = _.get(item, "cloudFiles");
					this._viewImages(files)
				}
            },
            beforeInit: function () {
                this.mainModel.vo.taskResultList = null;
            },
            displayStatus: function (status) {
				return LIB.getDataDic("asmt_task_status", status);
            }
		},
		events : {
		},
        init: function(){
        	this.$api = api;
        }
	});

	return detail;
});