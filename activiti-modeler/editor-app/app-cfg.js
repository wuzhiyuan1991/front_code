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
'use strict';

var ACTIVITI = ACTIVITI || {};

ACTIVITI.CONFIG = {
	//'contextRoot' : '/activiti-explorer/service',
	'contextRoot' :   "${tsc.group.url}"
	/*
	 'contextRoot' : '/'
	 */
};

if(ACTIVITI.CONFIG.contextRoot != this.location.origin) {
	if(this.location.port.indexOf("232") == 0) {
		ACTIVITI.CONFIG.contextRoot = this.location.origin;
	} else {
		var url = window.localStorage.getItem("accessUrl");
		if(!!url) {
			ACTIVITI.CONFIG.contextRoot = url;
		}
	}
}

//兼容测试环境域名的ip访问,条件时ip或域名访问
if(ACTIVITI.CONFIG.contextRoot != this.location.origin) {
	var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
	if(reg.test(this.location.hostname)) {
		ACTIVITI.CONFIG.contextRoot = this.location.origin;
	} else {
		var url = window.localStorage.getItem("accessUrl");
		if(!!url) {
			ACTIVITI.CONFIG.contextRoot = url;
		}
	}
}
