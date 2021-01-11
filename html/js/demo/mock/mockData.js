define(function(require) {

    // document.write("<script src='js/demo/mock/mock-min.js'><\/script>");

    var init = function (opts) {

        var callback = function () {

            var mockObj = function (data) {
                if (data.content) {
                    data.url = opts.baseUrl + data.url;
                    data.content.type = data.content.type || "get";
                    if (!data.error) {
                        data.content = {error: "0", content: data.content};
                    }
                }
                Mock.mock(data.url, data.type, data.content);
            }

            var mockObjList = function (dataArray) {
                dataArray.forEach(function (data) {
                    mockObj(data);
                });
            }

            // 1. 使用本地mock数据
            //具体使用请参考 http://mockjs.com/examples.html
            // var mockDataDemo = onlineCfg || {
            //     url: "/test",         //资源地址， url = baseUrl + 资源地址
            //     //type : "get",       //不写默认是get， 可选值： get、post、delete、put
            //     content: [{           //返回数据内容， 此处例子返回了一个数组对象
            //         'name': '@name',
            //         'age|1-100': 1002,
            //         'color': '@color'
            //     }]
            // };
            // var mockDataArray = [
            //     mockDataDemo
            // ];

            // 2. 使用服务器mock数据
            var mockDataArray = onlineCfg;

            mockObjList(mockDataArray);

        }

        var isMockLoaded;
        var onlineCfg = null;

        //方法 1 ： 使用服务器数据，使用jsonp, 默认jsonp全局mock对象为mockData
        var gist_path = "https://gitee.com/devsafeway/codes/btyojiv4shml9wuc7gr5z54/raw?blob_name=safeye_mock_data_001";
        var head= document.getElementsByTagName('body')[0];
        var script= document.createElement('script');
        script.type= 'text/javascript';
        script.src= gist_path;
        head.appendChild(script);
        script.onload = function () {
            onlineCfg = mockData;
            isMockLoaded && callback();
        }

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "js/demo/mock/mock.js", true);

        xhr.setRequestHeader("Content-type", "application/javascript;charset=UTF-8");
        xhr.onreadystatechange = function () {
            var XMLHttpReq = xhr;
            if (XMLHttpReq.readyState == 4) {
                if (XMLHttpReq.status == 200) {
                    eval(XMLHttpReq.responseText);
                    isMockLoaded = true;
                    !!onlineCfg && callback();

                    //方法 2 ： 使用服务器数据，需要服务器提供跨域功能
                    // {
                        // var xhr1 = new XMLHttpRequest();
                        // xhr1.cre
                        // xhr1.open("GET", "https://gist.coding.net/u/Nomi/8480392b77e5473796fb7fab707a22fe/raw/66e488f46f68f3a4631852a8adbe8f47688712c2/.json", true);
                        // xhr1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                        // xhr1.setRequestHeader("credentials", "true");
                        // xhr1.onreadystatechange = function () {
                        //     var XMLHttpReq = xhr1;
                        //     if (XMLHttpReq.readyState == 4) {
                        //         if (XMLHttpReq.status == 200) {
                        //
                        //             onlineCfg = JSON.parse(XMLHttpReq.responseText);
                        //
                        //             callback();
                        //         }
                        //     }
                        // }
                        //
                        // xhr1.send(null);
                    // }

                    //方法 3 ： 直接使用本地构造数据
                    // callback();
                }
            }
        };
        xhr.send(null);
    }

    return  {init : init};

});