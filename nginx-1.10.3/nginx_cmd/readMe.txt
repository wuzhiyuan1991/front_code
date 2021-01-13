1. 解压nginx-1.10.3.zip

2. 修改本目录下的nginx.conf文件
	修改{LOCAL_STATIC_FILE}，{SERVER_ADDR}为对应的地址

	参考：
	http://blog.csdn.net/tdcqfyl/article/details/51992758
	http://www.tuicool.com/articles/7r2Uze
	http://www.tuicool.com/articles/6JZNjuu
	http://blog.csdn.net/zhangliangzi/article/details/52143358
	http://www.cnblogs.com/souvenir/p/5647504.html

2. 用本录下修改后的nginx.conf替换掉nginx原来的配置文件nginx-1.10.3\conf\nginx.conf

3. 替换所有nginx_cmd下所有bat文件中{NGINX_ROOT}为自己NGINX的根路径
   替换完毕后可以通过run.bat启动， reload.bat来重新加载修改后的配置文件， quit.bat进行安全退出， stop进行强制退出
   参考：http://blog.csdn.net/ppby2002/article/details/38681345
   
4. 设置js中访问的api接口路径为配置的{SERVER_ADDR}, 启动ngnix后进行测试访问

注意：
	#前端ajax请求需要设置跨域，后端需要设置允许跨域请求,
	
	1. jquery请求需要设置如下：
	 $.ajax({
        // ... 其他代码
        xhrFields: {  
            withCredentials: true//表示发送凭证，但测试结果表示只会发送jsessionid，普通的cookie不会发送!  
        },
		// ... 其他代码
	});
	参考：http://blog.csdn.net/liangklfang/article/details/48247691
	
	
	2. vue的vue-resource请求需要设置如下：
	Vue.http.interceptors.push(function(req, next){
	
		// ... 其他代码
		
		//解决跨域无法传递cookies问题 ， 
			req.credentials=true;
		}
		
		// ... 其他代码
	)
	参考：https://github.com/pagekit/vue-resource/issues/323

			
