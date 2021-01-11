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
 * Condition expression
 */

var KisBpmConditionExpressionCtrl = [ '$scope', '$modal', function($scope, $modal) {

    // Config for the modal window
    var opts = {
        template:  'editor-app/configuration/properties/condition-expression-popup.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    $modal(opts);
}];

//anson tag
var KisBpmConditionExpressionPopupCtrl = [ '$scope', '$translate', '$http', function($scope, $translate, $http) {

	// Put json representing condition on scope
    if ($scope.property.value !== undefined && $scope.property.value !== null) {

        $scope.conditionExpression = {value: $scope.property.value};
        
    } else {
        $scope.conditionExpression = {value: ''};
    }
    
    
    //定义value和displayValue的映射
    var condExpDisplayValueMap = $scope.condExpDisplayValueMap;
    //给已存在的value匹配displayValue的映射
    var condExp = $scope.conditionExpression;
    $scope.conditionExpression.valueDisplay = condExpDisplayValueMap[condExp.value] || condExp.value;

    //根据映射构建一个集合，给下拉框使用
    var conditionExpressionsAll = [];
    for(var key in condExpDisplayValueMap) {
    	conditionExpressionsAll.push({value:key, valueDisplay: condExpDisplayValueMap[key]});
    }//debugger;
    $scope.conditionExpressionsAll = conditionExpressionsAll;
    
    $scope.save = function() {
        $scope.property.value = $scope.conditionExpression.value;
        //anson tag
        $scope.property.valueDisplay = condExpDisplayValueMap[$scope.property.value] || $scope.property.value;
        
        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    // Close button handler
    $scope.close = function() {//debugger;
    	$scope.property.mode = 'read';
    	$scope.$hide();
    };
}];