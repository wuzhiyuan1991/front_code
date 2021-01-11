/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

/*
 * Assignment
 */
var KisBpmIdCtrl = [ '$scope', '$modal', function($scope, $modal) {

    //Config for the modal window
    var opts = {
        template:  'editor-app/configuration/properties/id-popup.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    $modal(opts);

}];

// anson tag
var KisBpmIdPopupCtrl = [ '$scope', function($scope) {
//	debugger;
    // Put json representing assignment on scope
    // $scope.save = function() {
    //     $scope.updatePropertyInModel($scope.property);
    //     $scope.close();
    // };
    //
    // $scope.close = function() {
    //     $scope.property.mode = 'read';
    //     $scope.$hide();
    // };
    //生成随机字符串
    // $scope.randomString =  function(len) {
    //     len = len || 32;
    //     var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    //     var maxPos = $chars.length;
    //     var pwd = '';
    //     for (i = 0; i < len; i++) {
    //         pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    //     }
    //     return pwd;
    // };
    //增加一个选择项
    $scope.processDisplayValueMap = [{value:'请选择Id',name:''}];
    for(var i= 0;i<$scope.processGroupAll.length;i++){
        $scope.processDisplayValueMap.push($scope.processGroupAll[i])
    }
    // $scope.processDisplayValueMap = $scope.processGroupAll;debugger
    //初始化
    if($scope.property.value == ''){
        $scope.property.value = ''
    }
    // else{
    //     $scope.property.value  = $scope.property.value.substring(6,$scope.property.value.length);
    // };
    var selectNow='';//现在select选择的值
    var selectBefore = $scope.property.value;//弹框刚出来的select的值
    $scope.selectChange = function(assignValue){
        selectNum = assignValue;
    };
    $scope.save = function() {
    	// var randomNumber = $scope.randomString(5);
        if($scope.property.value == ""){
            $scope.property.value = "";
        }
        // if($scope.property.value){
        //     $scope.property.value = ''+$scope.property.value;
        // }
        $scope.property.mode = 'read';
        $scope.$hide();
        $scope.updatePropertyInModel($scope.property);
    };

    $scope.close = function() {

        if(selectBefore != selectNow ){
            $scope.property.value = selectBefore;
        }
        // if($scope.property.value){
        //     $scope.property.value = ''+$scope.property.value;
        // }
        $scope.property.mode = 'read';
        $scope.$hide();
    };
}];