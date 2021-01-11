//全局变量default布局中重新赋值
var baselocation = "";
var imagesPath="";
var keuploadSimpleUrl="";//kindeditor中使用的路径需要2个参数来区分项目和模块
var uploadSimpleUrl="";//单独的上传按钮使用的路径
var uploadServerUrl="";//上传服务用服务器地址
var fileServerContextPath="";//文件服务器地址
var mydomain =$("#mydomain").val();//主站域
var curUser = null;
var curUserCached = false;
/**
 * 验证前台学员是否已经登录 
 * @returns true登录 false未登录
 */
function isLogin(){
	var is = false;
	var user = getLoginUser();
	if(user!=null){
		is=true;
	}
	return is;
}

/**
 * 获取登录学员
 * @returns User
 */
function getLoginUser(){
	if(curUserCached || curUser) {return curUser;}
	var user = null;
	$.ajax({
		url:baselocation+'/user/logininfo',
		type:'get',
		async:false,
		dataType:'json',
		success:function(result){
			user = result;
		}
	});
	curUser = user;
	curUserCached = true;
	return user;
}

/**
 * 学员退出登录
 */
function exit(){
	$.ajax({
		url:baselocation+'/uc/exit',
		type:'post',
		dataType:'json',
		async:true,
		success:function(result){
			window.location.reload();
		}
	});
}

/**
 * 内容编辑器
 * @param id 文本域ID
 * @param width 编辑器的宽
 * @param height 编辑器的高
 * @param keImageUploadUrl 上传图片服务的URL
 */
function initKindEditor_addblog(id, width, height,param,pressText) {
	EditorObject = KindEditor.create('textarea[id=' + id + ']', {
		resizeType : 1,
		filterMode : false,// true时过滤HTML代码，false时允许输入任何代码。
		allowPreviewEmoticons : false,
		allowUpload : true,// 允许上传
		urlType : 'domain',// absolute
		newlineTag : 'br',// 回车换行br|p
		width : width,
		height : height,
		minWidth : '10px',
		minHeight : '10px',
		uploadJson : keuploadSimpleUrl+'&param='+param+'&fileType=jpg,gif,png,jpeg&pressText='+pressText,// 图片上传路径
		afterBlur : function() {
			this.sync();
		},
		allowFileManager : false,
		items : [ 'source','fontname', 'fontsize', '|', 'forecolor', 'hilitecolor',
				'bold', 'italic', 'underline','formatblock','lineheight', 'removeformat', '|',
				'justifyleft', 'justifycenter', 'justifyright',
				'insertorderedlist', 'insertunorderedlist', '|', 'emoticons',
				'image', 'link']
	});
}

/**
 * 后台专用图片上传
 * @param btnId 上传组件的ID
 * @param param 图片上传目录名
 * @param callback 上传成功后的回调函数，函数接收一个参数（上传图片的URL）
 * @param pressText 是否上水印 false或空 否 true是
 */
function initSimpleImageUpload(btnId,param,callback,pressText){
		KindEditor.create();
		var uploadbutton = KindEditor.uploadbutton({
			button : KindEditor('#'+btnId+'')[0],
			fieldName : "uploadfile",
			url : uploadSimpleUrl+'&param='+param+'&fileType=jpg,gif,png,jpeg,ico,JPG,JPEG&pressText='+pressText,
			afterUpload : function(data) {
				if (data.error == 0) {
					var url = KindEditor.formatUrl(data.url, 'absolute');//absolute,domain
					callback(url);
				} else {
					alert(data.message);
				}
			},
			afterError : function(str) {
				alert('自定义错误信息: ' + str);
			}
		});
		uploadbutton.fileBox.change(function(e) {
			uploadbutton.submit();
		});
}


/**
 * 前台专用图片上传
 * @param btnId 上传组件的ID
 * @param param 图片上传目录名
 * @param callback 上传成功后的回调函数，函数接收一个参数（上传图片的URL）
 */
function webImageUpload(btnId,param,callback){
		var uploadbutton = KindEditor.uploadbutton({
			button : KindEditor('#'+btnId+'')[0],
			fieldName : "uploadfile",
			url : uploadSimpleUrl+'&param='+param+'&fileType=jpg,gif,png,jpeg',
			afterUpload : function(data) {
				if (data.error ==0) {
					var url = KindEditor.formatUrl(data.url, 'absolute');//absolute,domain
					callback(url);
				} else {
					alert(data.message);
				}
			},
			afterError : function(str) {
				alert('自定义错误信息: ' + str);
			}
		});
		uploadbutton.fileBox.change(function(e) {
			uploadbutton.submit();
		});
}

/**
 * 删除文件
 * @param filePath
 */
function deleteFile(filePath){
	$.ajax({
		url:baselocation+'/image/deletefile',
		type:'post',
		data:{'filePath':filePath},
		dataType:'json',
		success:function(){}
	});
}

/**
 * 获取Cookie值
 * @param cookieName cookie名
 * @returns 返回Cookie值
 */
function getCookie(cookieName) {
	var cookieString = document.cookie;
	var start = cookieString.indexOf(cookieName+'=');
	if(start!=-1){
		var cookieValue='';
		var cookieArr = cookieString.split(";");
		for(var i=0;i<cookieArr.length;i++){
			var arr = cookieArr[i].split("=");
			if($.trim(cookieName)==$.trim(arr[0])){
				cookieValue=arr[1];
			}
		}
		return cookieValue;
	}
	return null;
}

/**
 * 设置Cookie值 
 * @param name 
 * @param value
 */
function setCookie(name,value){
	var Days = 2;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires="+ exp.toGMTString() + ";path=/";
}

//自定义方法-数组去重复
Array.prototype.unique = function(){
	var newArr = []; //一个新的临时数组
	for(var i = 0; i < this.length; i++){ //遍历当前数组
		if(this[i]==""){
			continue;
		}
		//如果当前数组的第i已经保存进了临时数组，那么跳过，否则把当前项push到临时数组里面
		if (newArr.indexOf(this[i]) == -1){
			newArr.push(this[i]);
		}
	}
	return newArr;

};

function isEmpty(str){
	if(str==null || str=="" || str.trim()==''){
		return true;
	}
	return false;
}

function isNotEmpty(str){
	return !isEmpty(str);
}

function isNotNull(object){
	return !isNull(object);
}

function isNull(object){
	if(typeof(object)=="undefined" || object==null ||  object==''){
		return true;
	}
	return false;
}


/**
 * 删除Cookies
 * @param name
 */
function DeleteCookie(name) {
	DeleteCookieDomain(name,mydomain);
}

/**
 * 删除指定域名下的共享cookie.二级域名可用
 * @param name
 * @param domain
 */
function DeleteCookieDomain(name,domain) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if(isNotEmpty(domain)){
		document.cookie = name + "=" + escape(cval) + ";expires="
			+ exp.toGMTString() + ";path=/"+";domain="+domain;
	}else{
		document.cookie = name + "=" + escape(cval) + ";expires="
			+ exp.toGMTString() + ";path=/";
	}
}

/**
 * 检查是否手机
 */
function checkIsMobile(){
	var sUserAgent = navigator.userAgent.toLowerCase();
	var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	var bIsAndroid = sUserAgent.match(/android/i) == "android";
	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	if (bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) { // 移动端环境下效果
		return true;
	}
	return false;
}