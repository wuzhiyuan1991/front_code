define(function (require) {

    var Vue = require("vue");

    var customActions = {
        //业务中线 危害因素 业务档案 检查项
        risktype:{method:'GET',url:'risktype/list?criteria.orderValue.fieldName=name&criteria.orderValue.orderType=1'},
        //code值 新增的时候
        verifyCode:{method:'GET',url:'risktype/list?criteria.orderValue.fieldName=name&criteria.orderValue.orderType=1'},
        //新增
        createRiskType:{method:'POST',url:'risktype'},
        //修改
        updateRiskType:{method:'PUT',url:'risktype'},
        //删除
        deleteRiskType:{method:'DELETE',url:'risktype',contentType:"application/json;charset=UTF-8"},

        //业务档案 检查依据
        checkbasistype:{method:'GET',url:'checkbasistype/list?criteria.orderValue.fieldName=name&criteria.orderValue.orderType=1'},
        //code
        getCheckBasisType:{method:'GET',url:'checkbasistype/list?criteria.orderValue.fieldName=name&criteria.orderValue.orderType=1'},
        //add
        createCheckBasisType:{method:'POST',url:'checkbasistype'},
        //修改
        updateCheckBasisType:{method:'PUT',url:'checkbasistype'},
        //del
        deleteCheckBasisType:{method:'DELETE',url:'checkbasistype',contentType:"application/json;charset=UTF-8"},

        //检查表分类
        listTableType: {method: 'GET', url: 'tpachecktabletype/list?criteria.orderValue.fieldName=name&criteria.orderValue.orderType=1'},
        createTableType: {method: 'POST', url: 'tpachecktabletype'},
        updateTableType: {method: 'PUT', url: 'tpachecktabletype'},
        delTableType: {method: 'DELETE', url: 'tpachecktabletype'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},

        //检查表分类
        equipmentType: {method: 'GET', url: 'tpaequipmenttype/list?criteria.orderValue.fieldName=name&criteria.orderValue.orderType=1'},
        createEquipmentType: {method: 'POST', url: 'tpaequipmenttype'},
        updateEquipmentType: {method: 'PUT', url: 'tpaequipmenttype'},
        delEquipmentType: {method: 'DELETE', url: 'tpaequipmenttype'},
        
        //行业分类
        industryCategory:{method: 'GET', url: 'industrycategory/list?criteria.orderValue.fieldName=sort&criteria.orderValue.orderType=0'},
        createIndustryCategory: {method: 'POST', url: 'industrycategory'},
        updateIndustryCategory: {method: 'PUT', url: 'industrycategory'},
        delIndustryCategory: {method: 'DELETE', url: 'industrycategory'},
        
        //课程类型
        courseCategory:{method: 'GET', url: 'subject/category/list?criteria.orderValue.fieldName=sort&criteria.orderValue.orderType=0'},
        createCourseCategory: {method: 'POST', url: 'subject/category'},
        updateCourseCategory: {method: 'PUT', url: 'subject/category'},
        delCourseCategory: {method: 'DELETE', url: 'subject/category'},
        
        //取证类型
        certificationSubject:{method: 'GET', url: 'subject/certification/list?criteria.orderValue.fieldName=sort&criteria.orderValue.orderType=0'},
        createCertificationSubject: {method: 'POST', url: 'subject/certification'},
        updateCertificationSubject: {method: 'PUT', url: 'subject/certification'},
        delCertificationSubject: {method: 'DELETE', url: 'subject/certification'},
        //Tpa设备设施
        tpaEquipmentType: {method: 'GET', url: 'tpaequipmenttype/list'},
        createTpaEquipmentType: {method: 'POST', url: 'tpaequipmenttype'},
        updateTpaEquipmentType: {method: 'PUT', url: 'tpaequipmenttype'},
        delTpaEquipmentType: {method: 'DELETE', url: 'tpaequipmenttype'},
        //船舶设备设施
        cbEquipmentType: {method: 'GET', url: 'tpaboatequipmenttype/list'},
        createCbEquipmentType: {method: 'POST', url: 'tpaboatequipmenttype'},
        updateCbEquipmentType: {method: 'PUT', url: 'tpaboatequipmenttype'},
        delCbEquipmentType: {method: 'DELETE', url: 'tpaboatequipmenttype'},
        //tpa检查项分类
        tpaRiskType: {method: 'GET', url: 'tparisktype/list'},
        createTpaRiskType: {method: 'POST', url: 'tparisktype'},
        updateTpaRiskType: {method: 'PUT', url: 'tparisktype'},
        delTpaRiskType: {method: 'DELETE', url: 'tparisktype'},
    };

    var resource = Vue.resource(null, {}, customActions);
    return resource;
});