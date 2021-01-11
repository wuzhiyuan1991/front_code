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
function getUrlParam(name){
//构造一个含有目标参数的正则表达式对象
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    //匹配目标参数
    var r = window.location.search.substr(1).match(reg);
//返回参数值
    if (r!=null) return unescape(r[2]);
    return null;
}
var KISBPM = KISBPM || {};

KISBPM.URL = {

	//anson tag
	getBusinessCfg: function() {
	    return ACTIVITI.CONFIG.contextRoot + '/model/businessCfg?modelId='+getUrlParam("modelId");
	},
	    
    getModel: function(modelId) {
        return ACTIVITI.CONFIG.contextRoot + '/model/' + modelId + '/json';
    },

    getStencilSet: function() {
        return ACTIVITI.CONFIG.contextRoot + '/editor/stencilset?version=' + Date.now();
    },

    putModel: function(modelId) {
        return ACTIVITI.CONFIG.contextRoot + '/model/' + modelId + '/save';
    }
};