define(function(require){

	require("components/list/base-list");
	require("components/according/base-accordion");
	require("components/iviewInput");

	require("components/iviewIcon");
	require("components/iviewButton");
	require("components/iviewBreadcrumb");
	require("components/iviewBreadcrumbItem");
	require("components/iviewTag");
	require("components/iviewCard");
	require("components/iviewCheckbox");
	require("components/iviewCheckBoxGroup");
	require("components/iviewProgress");
	require("components/iviewBadge");
	require("components/iviewPoptip");
	require("components/iviewTooltip");
	require("components/datePicker/iviewDatepicker");
	require("components/tabs/iviewTabs");
	require("components/iviewRadio");
	require("components/iviewRadioGroup");

	require("components/steps/Steps");
	require("components/iviewCircle");
	require("components/iviewAffix");
	require("components/iviewInputNumber");
	require("components/page/iviewPage");
    require("components/transfer/iviewTransfer");
    require("components/file-icon/file-icon");

    require("components/rate/main"); // 评价星星组件
	require("components/audioPlayer/main"); // 音频播放组件

	require("components/tree/iviewTreeNode");
	require("components/tree/iviewTree");
	require("components/select/iviewTreeSelect");
	require("components/layout/iviewCol");
	require("components/layout/iviewRow");
	require("components/fullCalendar/fullCalendar");
	//vue 图表 
	require("components/charts");
	//公司部门
	require("componentsEx/companyTreeSelect/companyTreeSelect");
	require("componentsEx/userTreeSelect/userTreeSelect");
	require("componentsEx/departmentTreeSelect/departmentTreeSelect");
	require("componentsEx/childInputSelect/childInputSelect");
	//require("componentsEx/userSelect/userSelectModal");
	//require("componentsEx/userSelect/userSelect");
	//菜单管理业务树组件
	require("components/treegrid/iviewTreeGrid");
	require("components/treegrid/iviewTreeGridNode");
	//业务组件
	require("componentsEx/selectTreeList/selectTreeList");
	require("componentsEx/selectTreeList/select");
	require("componentsEx/selectTreeList/main");
	require("componentsEx/selectTreeList/selectTree");
	require("componentsEx/selectTreeList/selectTreeNode");
	require("componentsEx/businessRadio/businessRadio");
	//算测试吧
	// require("componentsEx/selectTreeList/selectTree");
	// require("componentsEx/selectTreeList/selectTreeNode");
	//星星树
	require("componentsEx/treeStar/treeStar");
	require("componentsEx/treeStar/treeNodeStar");
	//检查表
	// require("componentsEx/userSelect/checkListSelectModal");
	//检查计划
	// require("componentsEx/userSelect/checkPlanSelectModal");
	// require("componentsEx/userSelect/checkObjectSelectModal");
	require("components/dropdown/iviewDropdown");
	require("components/dropdown/iviewDropdownItem");
	require("components/dropdown/iviewDropdownMenu");
	require("components/picker/picker/time-picker");
	require("components/picker/picker/date-picker");
	//输入选择框组件，需要结合Modal组件联合使用
	require("componentsEx/inputSelector/inputSelect");
	require("componentsEx/multipleInputSelector/main");

	//输入搜索组件 通过关键词检索
	require("componentsEx/inputSearch/main");

	//spin组件
	require("components/iviewSpin");
	require("componentsEx/importProgress/main");
	require("componentsEx/importProgress/import");
	require("componentsEx/importProgress/importing");

    require("componentsEx/fileListSimpleCard/fileListSimpleCard");
	require("componentsEx/imageListSimpleCard/imageListSimpleCard");
	require("componentsEx/videoListSimpleCard/videoListSimpleCard");

	require("componentsEx/fileListSimpleFormItem/fileListSimpleFormItem");

    // require("components/customNotice/notification");
    require("components/customNotice/notice");
	//Vue组件
	var LIB = require('lib');

	//测试引入拖拽组件
	LIB.Vue.use(require("components/vuedragging"))

	var setting = LIB.setting;
	
	var vueAllClassificationDefaultCfg = {};

	
	if(LIB.user && setting.orgList && setting.orgList.length > 0) {

		var orgList;

		//如果权限只和部门相关，则去除公司
        if(LIB.userEx.isDeptDataAuth) {
            orgList = _.filter(setting.orgList, function (data) {
				return data.type == "2";
            });
		} else {
            orgList = setting.orgList;
		}
        
		//先查找没有parentId的组织机构
		var topOrg = _.find(orgList, function(item){return !item.parentId;})
		if(!topOrg) {
			
			//如果不存在则查找当前组织结构中不存在的parentId
			var allOrgIds = _.uniq(_.map(orgList, "id"));
			/*var parentIdMap = _.groupBy(orgList, "parentId");
			_.some(parentIdMap, function(value, key) {
				//如果当前组织机构的没有包含此parentId,则默认设置此parent组织机构下的第一个子组织机构为最大组织机构
				//e.g
				// 1.A
				//    -- 1.1.A
				//    -- 1.2.A
				// 如果存在 1.1.A  1.2.A 不存在 1.A, 则默认人为 1.1.A为最大组织机构
				if(!_.contains(allOrgIds, key)) {
					topOrg = value[0];
					return true;
				}
			})*/
			var topOrgs = _.filter(orgList, function(org){
				return !_.contains(allOrgIds, org.parentId);
			});
			if (topOrgs.length > 1) {
				topOrg = {};
				topOrg.code = '虚拟节点';
				topOrg.disable = '0';
				topOrg.id = topOrgs[0].parentId;
				topOrg.name = '所有公司';
				topOrg.type = '1';
				orgList.push(topOrg);
				for (var i = 0; i < topOrgs.length; i++) {
					topOrgs[i].parentId = topOrg.id;
				}
			} else if (topOrgs.length == 1){
				topOrg = topOrgs[0];
			}
		}
		
		if(topOrg) {
			vueAllClassificationDefaultCfg = 
			{
				//添加全部分类默认显示文字
		        title: topOrg.name,
		        config:[{
		            //是否显示设置按钮
		            NodeEdit:false,
		            //左侧类别名称
		            title:"组织机构",
		            //数据源网址  请求优先
	//	            url:"user/setting",
		            data : {orgList : orgList},
		            type:"org"
		        }]
			}
            LIB.user.dataAuthIds = _.map(orgList, function(org){return org.id;});
		} else {
			//alert("您的所属组织机构出现异常,初始化失败!请联系系统管理员解除异常状态");
			console.error("您的所属组织机构出现异常,初始化失败!请联系系统管理员解除异常状态");
		}
	}
	
	require("componentsEx/vueAllClassification").initDefaultCfg(vueAllClassificationDefaultCfg);
	require("components/base-table/table");
	require("components/lite-table/table");
// 	require("vueTable");
// 	require("./base/notification/notification");
	var Message = require("components/iviewMessage");
	document.vMsg = {
		info : function () {
            Message.info.apply(Message, arguments);
        },
        warning : function () {
            Message.warning.apply(Message, arguments);
        },
        error : function () {
            Message.error.apply(Message, arguments);
        }
    };
	var Notice = require("components/base/notification/notice");
	var Modal = require("components/modal/Modal");
	var Aside = require("components/iviewAside");
	var Timeline = require("components/timeline/Timeline");
	var Select = require("components/select/Select");
	require("components/calendar/iviewCalendar");
	//vue封装plupload组件
	require("components/file-upload/plupload-vue");
	/*****************************************************************/

	require("components/form2/elForm");
	require("components/form2/elFormItem");

    require("componentsEx/custFilterCondtionGroup");
    require("componentsEx/simpleCard");
    require("componentsEx/liteBox");
	require("componentsEx/memberSelectModal/memberSelectModal");
	require("components/lTreeRTableModal/index");

	require("components/color-picker/color");
	require("components/textarea/textarea");

	require("componentsEx/imageView/main");
	require("componentsEx/disableSelect/main");
	require("componentsEx/formItemCode/formItemCode");

	require("componentsEx/confirmButton/confirmButton");

    LIB.Vue.component('group-partial', function (resolve) {
        require(['componentsEx/groupPartial/groupPartial'], resolve);
    });

});