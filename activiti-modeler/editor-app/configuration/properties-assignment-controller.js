
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
var KisBpmAssignmentCtrl = [ '$scope', '$modal', function($scope, $modal) {

    // Config for the modal window
    var opts = {
        template:  'editor-app/configuration/properties/assignment-popup.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    $modal(opts);

}];

// anson tag
var KisBpmAssignmentPopupCtrl = [ '$scope', function($scope) {
// //	debugger;
    // Put json representing assignment on scope
    if ($scope.property.value !== undefined && $scope.property.value !== null
        && $scope.property.value.assignment !== undefined
        && $scope.property.value.assignment !== null)
    {
        $scope.assignment = $scope.property.value.assignment;
    } else {
        $scope.assignment = {};
    }

    if ($scope.assignment.candidateUsers == undefined || $scope.assignment.candidateUsers.length == 0)
    {
    	$scope.assignment.candidateUsers = [{value: ''}];
    }

    // Click handler for + button after enum value
    var userValueIndex = 1;
    $scope.addCandidateUserValue = function(index) {

    	//新建的User value 默认为 站长审批, 这里未来需要根据需求调整修改
    	var defaultValue = 'zhan_zhang_shen_pi';
    	var candidateDisplayValueMap = $scope.candidateDisplayValueMap;
    	var newCandidateUser = {value:defaultValue, valueDisplay: candidateDisplayValueMap[defaultValue]};
        $scope.assignment.candidateUsers.splice(index + 1, 0, newCandidateUser);
//        $scope.assignment.candidateUsers.splice(index + 1, 0, {value: 'value ' + userValueIndex++});
    };

    // Click handler for - button after enum value
    $scope.removeCandidateUserValue = function(index) {
        $scope.assignment.candidateUsers.splice(index, 1);
    };

    if ($scope.assignment.candidateGroups == undefined || $scope.assignment.candidateGroups.length == 0)
    {
    	$scope.assignment.candidateGroups = [{value: ''}];
    }

    // anson tag (value是流程图使用的值，displayValue只是显示的值)

    //定义value和displayValue的映射
    var candidateDisplayValueMap = $scope.candidateDisplayValueMap;
    //将映射放入scope，在增加方法中使用
//    $scope.candidateDisplayValueMap = candidateDisplayValueMap;

    //给已存在的value匹配displayValue的映射
    var candidateGroups = $scope.assignment.candidateGroups;
    for (var i = 0; i < candidateGroups.length; i++) {
		candidateGroups[i].valueDisplay = candidateDisplayValueMap[candidateGroups[i].value] || candidateGroups[i].value;
    }
//    $scope.assignment.candidateGroups = candidateGroups;
//    $scope.candidateGroupsAll = [{value:'zhan_zhang_shen_pi', valueDisplay: candidateDisplayValueMap['zhan_zhang_shen_pi']},
//                                 {value:'qu_yu_jing_li_shen_pi',valueDisplay: candidateDisplayValueMap['qu_yu_jing_li_shen_pi']}
//    							];

    //根据映射构建一个集合，给下拉框使用
//    var candidateGroupsAll = [];
//    for(var key in candidateDisplayValueMap) {
//    	candidateGroupsAll.push({value:key, valueDisplay: candidateDisplayValueMap[key]});
//    }
//    $scope.candidateGroupsAll = candidateGroupsAll;

    var groupValueIndex = 1;
    $scope.addCandidateGroupValue = function(index) {
    	var newCandidateGroup = {value: 'value ' + groupValueIndex++};
//        $scope.assignment.candidateGroups.splice(index + 1, 0, {value: 'value ' + groupValueIndex++});
    	//新建的group value 默认为 站长审批
//    	var defaultValue = 'zhan_zhang_shen_pi';
    	if($scope.candidateGroupsAll && $scope.candidateGroupsAll.length > 0) {
    		//以$scope.candidateGroupsAll 数组中的第一个value元素为默认值
    		var firstCandidateGroup = $scope.candidateGroupsAll[0];
    		//为了防止双向绑定导致数据被直接修改，需要创建一个对象副本
    		newCandidateGroup = {value: firstCandidateGroup.value, valueDisplay: firstCandidateGroup.valueDisplay};
    	}
        $scope.assignment.candidateGroups.splice(index + 1, 0, newCandidateGroup);
    };

    // Click handler for - button after enum value
    $scope.removeCandidateGroupValue = function(index) {
        $scope.assignment.candidateGroups.splice(index, 1);
    };

    $scope.save = function() {//debugger

        $scope.property.value = {};
        handleAssignmentInput($scope);
        $scope.property.value.assignment = $scope.assignment;

        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    // Close button handler
    $scope.close = function() {//debugger
    	handleAssignmentInput($scope);
    	$scope.property.mode = 'read';
    	$scope.$hide();
    };

    var handleAssignmentInput = function($scope) {
    	if ($scope.assignment.candidateUsers)
    	{
	    	var emptyUsers = true;
	    	var toRemoveIndexes = [];
	        for (var i = 0; i < $scope.assignment.candidateUsers.length; i++)
	        {
	        	if ($scope.assignment.candidateUsers[i].value != '')
	        	{
	        		emptyUsers = false;
	        	}
	        	else
	        	{
	        		toRemoveIndexes[toRemoveIndexes.length] = i;
	        	}
	        }

	        for (var i = 0; i < toRemoveIndexes.length; i++)
	        {
	        	$scope.assignment.candidateUsers.splice(toRemoveIndexes[i], 1);
	        }

	        if (emptyUsers)
	        {
	        	$scope.assignment.candidateUsers = undefined;
	        }
    	}

    	if ($scope.assignment.candidateGroups)
    	{
	        var emptyGroups = true;
	        var toRemoveIndexes = [];
	        for (var i = 0; i < $scope.assignment.candidateGroups.length; i++)
	        {
	        	if ($scope.assignment.candidateGroups[i].value != '')
	        	{
	        		emptyGroups = false;
	        	}
	        	else
	        	{
	        		toRemoveIndexes[toRemoveIndexes.length] = i;
	        	}
	        }

	        for (var i = 0; i < toRemoveIndexes.length; i++)
	        {
	        	$scope.assignment.candidateGroups.splice(toRemoveIndexes[i], 1);
	        }

	        if (emptyGroups)
	        {
	        	$scope.assignment.candidateGroups = undefined;
	        }
    	}
    };
}];