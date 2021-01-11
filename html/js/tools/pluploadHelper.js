define(["plupload"],function(){
	var BASE = require("base");
	var defaultOpts = {
	        runtimes: 'html5,flash',
		url: BASE.ctxpath + "/file/upload",
	        file_data_name: 'file',
	        multi_selection: true,
	        flash_swf_url: "html/js/libs/plupload-2.1.9/js/Moxie.swf",
	        filters: {
	            max_file_size: '5mb',
	            mime_types: [
	                { title: "图片", extensions: "jpg,png,bmp,jpeg" }
	            ]
	        }
	    }
	
	var page = {
			uploader : function(opts,callback){
				var _opts = {
						init: {
				            FilesAdded: function(up, files) {
			                    uploader.start();
				            },
				            FileUploaded: function(uploader, file, data) {
				            	var result = JSON.parse(data.response);
				            	if(result.error != '0'){
				            		alert(result.message);
				            		return ;
				            	}else if(callback){
			            			callback.call(uploader, file, data);
			            		}else{
			            			alert("上传成功");
			            		}
				            },
				            Error: function(up, err) {
				                alert("上传失败");
				            }
				        }
				}
				$.extend(true, _opts, defaultOpts);
				$.extend(_opts, opts);
				var uploader = new plupload.Uploader(_opts);
				uploader.init();
				return uploader;
			}
	};
	return page;
})