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
        listTableType: {method: 'GET', url: 'checktabletype/list?criteria.orderValue.fieldName=name&criteria.orderValue.orderType=1'},
        createTableType: {method: 'POST', url: 'checktabletype'},
        updateTableType: {method: 'PUT', url: 'checktabletype'},
        delTableType: {method: 'DELETE', url: 'checktabletype'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},

        //设备设施分类
        equipmentType: {method: 'GET', url: 'documentclassification/list?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0'},
        createEquipmentType: {method: 'POST', url: 'documentclassification'},
        updateEquipmentType: {method: 'PUT', url: 'documentclassification'},
        delEquipmentType: {method: 'DELETE', url: 'documentclassification'},
        
        //行业分类
        industryCategory:{method: 'GET', url: 'industrycategory/list?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0'},
        createIndustryCategory: {method: 'POST', url: 'industrycategory'},
        updateIndustryCategory: {method: 'PUT', url: 'industrycategory'},
        delIndustryCategory: {method: 'DELETE', url: 'industrycategory'},
        
        //课程类型
        courseCategory:{method: 'GET', url: 'subject/category/list?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0'},
        createCourseCategory: {method: 'POST', url: 'subject/category'},
        updateCourseCategory: {method: 'PUT', url: 'subject/category'},
        delCourseCategory: {method: 'DELETE', url: 'subject/category'},
        
        //取证类型
        certificationSubject:{method: 'GET', url: 'subject/certification/list?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0'},
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

        //危害因素分类
        listHazardFactor:{method: 'GET', url: 'hazardfactor/list'},
        createHazardFactor:{method: 'POST', url: 'hazardfactor'},
        updateHazardFactor:{method: 'PUT', url: 'hazardfactor'},
        delHazardFactor:{method: 'DELETE', url: 'hazardfactor'},
        createHazardFactorSystem:{method: 'POST', url: 'hazardfactorsystem'},
        updateHazardFactorSystem:{method: 'PUT', url: 'hazardfactorsystem'},
        queryHazardFactorSystemList: {method: 'GET', url: 'hazardfactorsystem/list/1/1000'},
        delHazardFactorSystem: {method: 'DELETE', url:'hazardfactorsystem'},
        queryHazardFactorCompanyList: {method: 'GET', url: "hazardfactorsystem/companies/list/1/1000"},
        createHazardFactorCompany: {method: 'POST', url: "hazardfactorsystem/{id}/companies"},
        delHazardFactorCompany: {method: 'DELETE', url: "hazardfactorsystem/{id}/companies"},



        //重点化学工艺类型
        listCheckObjectCatalog: {method: 'GET', url: 'checkobjectcatalog/majorChemicalProcess/list?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=1'},
        createCheckObjectCatalog: {method: 'POST', url: 'checkobjectcatalog/majorChemicalProcess'},
        updateCheckObjectCatalog: {method: 'PUT', url: 'checkobjectcatalog/majorChemicalProcess'},
        delCheckObjectCatalog: {method: 'DELETE', url: 'checkobjectcatalog/majorChemicalProcess'},

        //化学品类别
        listCheckObjectCatalogClassify: {method: 'GET', url: 'checkobjectcatalogclassify/list?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=1'},
        createCheckObjectCatalogClassify: {method: 'POST', url: 'checkobjectcatalogclassify'},
        updateCheckObjectCatalogClassify: {method: 'PUT', url: 'checkobjectcatalogclassify'},
        delCheckObjectCatalogClassify: {method: 'DELETE', url: 'checkobjectcatalogclassify'},


        // 证书类型
        listCertType: {method: 'GET', url: 'documentclassification/list?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0'},
        delCertType: {method: 'DELETE', url: 'documentclassification'},
        createCertType: {method: 'POST', url: 'documentclassification'},
        updateCertType: {method: 'PUT', url: 'documentclassification/disable'}
    };

    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        // 'create': '2410003001',
        // 'import': '2410003004',
        // 'edit': '2410003002',
        // 'delete': '2410003003',
        // 'export':'2410003005'
    };
    return resource;
});