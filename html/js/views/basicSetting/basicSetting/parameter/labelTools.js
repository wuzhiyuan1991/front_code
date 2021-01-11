define(function () {
    var checkDisTrue = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox"><span style="background: #ddd;margin-right:0" class="ivu-checkbox-inner"></span><input disabled type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
    var checkDisFalse = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox dis-none-after"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input disabled type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
    var checkTrue = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox ivu-checkbox-checked"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input  type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
    var checkFalse = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input  type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'

    // function codeMap(obj, str) {
    //     var defArr = ['code', 'name', 'workCatalog', 'applUnitId', 'workUnitId', 'workPlace', 'workContent', 'worker', 'permitTime', 'createBy'];
    //     var disArr = ['code', 'name', 'workCatalog', 'applUnitId', 'workUnitId', 'workPlace', 'workContent', 'worker', 'permitTime', 'createBy',  'jsaMasterId', 'safetyEducator', 'supervisior', 'mainEquipment', 'specialWorker', 'operatingType'];
    //
    //     if(str == 'require'){
    //         if(disArr.indexOf(obj.code)>-1){
    //             return true;
    //         }else{
    //             return false;
    //         }
    //     }
    //     if(defArr.indexOf(obj.code)>-1){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }
    return {
        checkDisFalse: checkDisFalse,
        checkDisTrue: checkDisTrue,
        checkTrue: checkTrue,
        checkFalse: checkFalse
    }
})