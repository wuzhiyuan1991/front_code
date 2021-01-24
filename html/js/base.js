define(function() {
  var CONST = require("const");

  //   引入翻译
  var i18nLang,dataDicLang;
  var lang = window.localStorage.lang;
  window.localStorage.removeItem('dataDic');
  window.localStorage.removeItem('dataDic_ver');
  window.localStorage.removeItem('i18n_ver');
  window.localStorage.removeItem('i18n');
  if(window.localStorage.lang===undefined){
    lang="cn"
    window.localStorage.setItem('lang','cn')
  }

 
  if (lang === "cn") {
    i18nLang = require("lang/i18n_cn");
    dataDicLang = require("lang/dataDic_cn");
  } else if (lang === "en") {
    i18nLang = require("lang/i18n_en");
    dataDicLang = require("lang/dataDic_en");
  }
  //   引入翻译

  // 模拟请求数据
  // require(["demo/mock/mockData"], function (mockData) {
  //     mockData.init({baseUrl : CONST.url});
  // });

  //兼容测试环境域名的ip访问,条件时ip或域名访问
  if (CONST.url != this.location.origin) {
    function isValidIP(ip) {
      var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      return reg.test(ip);
    }
    if (isValidIP(this.location.hostname)) {
      CONST.url = this.location.origin;
    } else {
      // var url  = "http://192.168.88.14:8082"
      var url = window.localStorage.getItem("accessUrl");
      if (!!url) {
        CONST.url = url;
      }
    }
  }
  var base = {
    SwConfig: { url: CONST.url },
    ctxpath: CONST.url,
    user: null,
    i18nLang: i18nLang,
    setting: {
      orgList: [],
      menuList: [],
      funcList: [],
      dataDic: {},
      dataDicVer: null,
      i18nVer: null,
      fileServer: null,
      envBusinessConfig: {},
      cache: {
        i18n: {
          ver: null,
          name: "i18n",
          value: null
        },
        datadic: {
          ver: null,
          name: "datadic",
          value: null
        },
        companyList: {
          ver: null,
          name: "companyList",
          value: null
        }
      }
    },
    initCache: null
  };

  //base.setting.dataDic["pool_status"] = {
  //    "100": "验证合格",
  //    "200": "不存在",
  //    "0": "待提交",
  //    "1": "待审批",
  //    "2": "待整改",
  //    "3": "待验证",
  //    "11": "待指派"
  //};

  require(["components/base-table/tableHelper"], function(helper) {
    var cfg = {};
    cfg.dataDic = base.setting.dataDic;
    cfg.defaultGlobalFilterValue = {
      "criteria.orderValue": { fieldName: "modifyDate", orderType: "1" }
    };
    helper.registerCfg(cfg);
  });
  //配置上传组件app项目路径,解决组件的base依赖
  require(["components/file-upload/pluploadHelper"], function(helper) {
    helper.registerCtxpath(base.ctxpath);
  });

  var isInitFinish = false;

  var cacheVerInstancheMap = {
    i18n: "i18nCache",
    datadic: "dataDicCache"
  };
  window.businessCache = false;

  var cacheCfg = [
    { cacheName: "i18n", cacheReqUrl: "/i18n/list/all" },
    { cacheName: "dataDic", cacheReqUrl: "/lookup/list/dic" },
    { cacheName: "companyList", cacheReqUrl: "/organization/list?type=1" }
  ];

  var initCache = function(opts) {
    var reqCacheKeys = opts.cacheKeys;

    window.cache = window.cache || {};

    if (!!reqCacheKeys && reqCacheKeys.length > 0) {
      $.ajax({
        url: base.ctxpath + "/cache/version?keys=" + reqCacheKeys.join(","),
        xhrFields: {
          // withCredentials: true//表示发送凭证，但测试结果表示只会发送jsessionid，普通的cookie不会发送!
        },
        async: false,
        success: function(data) {
          if (data.error == "0") {
            var serverCacheVerObj = data.content;

            var pendingRefreshCacheKeys = [];

            _.each(cacheCfg, function(value) {
              //缓存名称
              var cacheName = value.cacheName;

              //没有请求的缓存不处理
              if (!_.contains(reqCacheKeys, cacheName)) {
                return false;
              }

              //缓存版本名称
              var cacheVerName = cacheName + "_ver";

              //缓存请求地址
              var cacheReqUrl = value.cacheReqUrl;

              //服务器缓存版本号
              var serverVer = serverCacheVerObj[cacheName] || -999;

              //本地旧的缓存版本号
              var localVer = window.localStorage.getItem(cacheVerName) || -100;

              //如果缓存版本号相同则设置缓存实例到window, 不相同则更新缓存版本号
              if (serverVer == localVer) {
                var cacheInstanceStr = window.localStorage.getItem(cacheName);
                if (cacheInstanceStr) {
                  window.cache[cacheName] = JSON.parse(cacheInstanceStr);
                  if (cacheName == "dataDic") {

                     

                    console.log(1111)
                    base.setting.dataDicOrigin = _.defaults(
                      base.setting.dataDic,
                      window.cache[cacheName]
                    );
                    var res = {};
                    _.forEach(base.setting.dataDicOrigin, function(item, key) {
                      if (_.isArray(item)) {
                        var r = {};
                        _.forEach(item, function(val) {
                          for (var k in val) {
                            if (val.hasOwnProperty(k)) {
                              r[k] = val[k];
                            }
                          }
                        });
                        res[key] = r;
                      } else {
                        res[key] = item;
                      }
                    });
                  
                    base.setting.dataDic = res;
                  }
                }
              } else {
                window.localStorage.setItem(cacheVerName, serverVer);

                // 清除风险地图配置数据
                var len = window.localStorage.length;
                var i;
                var cacheKey;
                for (i = len - 1; i >= 0; i--) {
                  cacheKey = window.localStorage.key(i);
                  if (cacheKey && cacheKey.startsWith("riskMap_")) {
                    window.localStorage.removeItem(cacheKey);
                  }
                }
                //
                pendingRefreshCacheKeys.push(cacheName);
              }

              //更新缓存版本号, 为下一步请求缓存时使用
              base.setting[cacheVerName] = serverVer;

              //if (!window.cache[cacheName]) {

              //    var versionParam = "?ver=" + serverVer;
              //    if (cacheReqUrl.indexOf("?") != -1) {
              //        versionParam = "&ver=" + serverVer;
              //    }

              //分批发送请求，性能低但是耦合性也低, 需要使用 cacheReqUrl
              //$.ajax({
              //    url: base.ctxpath + cacheReqUrl + versionParam,
              //    async: false,
              //    cache: true,
              //    success: function (res) {
              //        if (res && res.error == '0' && !!res.content) {
              //            window.localStorage.setItem(cacheName, JSON.stringify(res.content));
              //            window.cache[cacheName] = res.content;
              //        }
              //        isInitFinish = true;
              //    }
              //});
              //}
            });

            if (pendingRefreshCacheKeys.length > 0) {
              $.ajax({
                url:
                  base.ctxpath +
                  "/cache/value?keys=" +
                  pendingRefreshCacheKeys.join(","),
                async: false,
                xhrFields: {
                  // withCredentials: true//表示发送凭证，但测试结果表示只会发送jsessionid，普通的cookie不会发送!
                },
                cache: true,
                success: function(res) {
                  var body = null;
                  if (res && res.error == "0" && !!(body = res.content)) {
                    for (cacheKey in body) {
                      body.i18n = i18nLang; //覆盖接口返回的翻译
                      var cacheValue = body[cacheKey];
                      window.localStorage.setItem(
                        cacheKey,
                        JSON.stringify(cacheValue)
                      );
                      if (cacheKey == "i18n") {
                        window.cache[cacheKey] = cacheValue;
                      } else if (cacheKey == "dataDic") {
                        //base.setting.dataDic = cacheValue;
                        base.setting.dataDicOrigin = _.defaults(
                          base.setting.dataDic,
                          // cacheValue  勿删 接口返回
                          dataDicLang
                        );

                        var res = {};
                        _.forEach(base.setting.dataDicOrigin, function(
                          item,
                          key
                        ) {
                          if (_.isArray(item)) {
                            var r = {};
                            _.forEach(item, function(val) {
                              for (var k in val) {
                                if (val.hasOwnProperty(k)) {
                                  r[k] = val[k];
                                }
                              }
                            });
                            res[key] = r;
                          } else {
                            res[key] = item;
                          }
                        });
                        base.setting.dataDic = res;
                        window.localStorage.setItem(
                          "dataDic",
                          JSON.stringify(base.setting.dataDicOrigin)
                        );
                      }
                    }
                  }
                  isInitFinish = true;
                }
              });
            }
          }
        }
      });
    }
  };

  window.enableMajorRiskSource = true;
  $.ajax({
    url: base.ctxpath + "/user/loginUser",
    xhrFields: {
      withCredentials: true //表示发送凭证，但测试结果表示只会发送jsessionid，普通的cookie不会发送!
    },
    async: false,
    success: function(data) {
      if (data.error == "0") {
        window.localStorage.removeItem("logoutActionUrl");

        base.user = data.content.sessionUser.user;
        base.setting.menuList = data.content.sessionUser.menuList = JSON.parse(
          data.content.sessionUser.menuJsonList
        );
        base.setting.funcList = data.content.sessionUser.funcList;
        base.setting.menuConfig = data.content.menuConfig
          ? JSON.parse(data.content.menuConfig.objText)
          : null;
        base.setting.fileServer = data.content.fileServer;

        try {
          base.setting.menuConfig = data.content.menuConfig
            ? JSON.parse(data.content.menuConfig.objText)
            : null;
          base.setting.globalJsonCfg = data.content.globalJsonCfg
            ? JSON.parse(data.content.globalJsonCfg)
            : null;
          if (
            base.setting.globalJsonCfg &&
            base.setting.globalJsonCfg.logoutActionUrl
          ) {
            window.localStorage.setItem(
              "logoutActionUrl",
              base.setting.globalJsonCfg.logoutActionUrl
            );
          }
        } catch (e) {
          console.error(e);
        }
        var orgListDraft = data.content.orgList;
        window.enableMajorRiskSource =
          data.content.majordanger == 1 ? true : false;
        var orgIdMap = _.indexBy(orgListDraft, "id");

        var orgList = [];
        var orgDic = {};
        var orgMap = {};

        //50:全集团 40:公司及下属公司 30:本公司 20:部门及下属部门 10:本部门
        var orgDataLevel = data.content["select:organization:level"];
        orgDataLevel = orgDataLevel || "30";

        // 权限等级变更清空自定义表格宽度数据
        var cachedOrgDataLevel = window.localStorage.getItem("org_data_level");
        if (
          cachedOrgDataLevel !== orgDataLevel &&
          (orgDataLevel === "50" || cachedOrgDataLevel === "50")
        ) {
          var _len = window.localStorage.length;
          var _i;
          var _cacheKey;
          for (_i = _len - 1; _i >= 0; _i--) {
            _cacheKey = window.localStorage.key(_i);
            if (_cacheKey && _cacheKey.startsWith("tb_code_")) {
              window.localStorage.removeItem(_cacheKey);
            }
          }
        }
        window.localStorage.setItem("org_data_level", orgDataLevel);
        base.userEx = {
          //数据权限等级
          orgDataLevel: orgDataLevel,
          //是否数据权限只和部门相关
          isDeptDataAuth: orgDataLevel == 20 || orgDataLevel == 10,
          //只有本部门新增、更新权限的pojos列表, 会影响 所属公司和所属部门无法选择
          updateOwnDeptPojos: data.content["updateOwnDeptPojos"] || []
        };

        var orgIds = data.content["select:organization"];

        _.each(orgListDraft, function(data) {
          if (data.t == "1") {
            orgDic[data.id] = {
              id: data.id,
              pId: data.pId,
              compName: data.n,
              csn: data.csn || data.n,
              t: "1",
              disable: data.d,
              code: data.c
            };
          } else {
            var ownComp = orgIdMap[data.cId];
            if (ownComp) {
              orgDic[data.id] = {
                id: data.id,
                pId: data.pId,
                compName: ownComp.n,
                csn: ownComp.csn || data.n,
                deptName: data.n,
                t: "2",
                disable: data.d,
                code: data.c
              };
            } else {
              var errorData = {
                id: data.id,
                parentId: data.pId,
                name: data.n,
                companyId: data.cId,
                code: data.c
              };
              console.error(
                "组织机构数据错误,该组织机构的所属公司不存在 : " +
                  JSON.stringify(errorData)
              );
              console.error(data);
            }
          }

          var org = {
            id: data.id,
            name: data.n,
            parentId: data.pId,
            type: data.t,
            disable: data.d,
            code: data.c,
            compId: data.cId
          };
          orgMap[data.id] = org;

          //非本集团需要根据数据权限增加，本集团直接使用最大数据权限
          if (orgDataLevel < 50) {
            if (_.contains(orgIds, org.id)) {
              orgList.push(_.clone(org));
            }
          } else {
            orgList.push(_.clone(org));
          }
        });

        //部门相关权限需要将本公司增加到orgList中
        if (orgDataLevel < 30) {
          //此处增加所属公司到权限列表只是为了UI显示时确保有所属公司
          orgList.push(_.clone(orgMap[base.user.compId]));
        }

        base.setting.orgList = orgList;
        base.setting.dataDic["org"] = orgDic;

        base.setting.orgMap = orgMap;
        if (!orgMap[base.user.compId]) {
          base.user.compId = "";
        }
        base.setting.envBusinessConfig = JSON.parse(
          data.content.envBusinessConfig
        );
        base.setting.sysSpecialReports = data.content.sysSpecialReports;

        // var fieldSetting = {
        //     "BC_HaG_HazR": [
        //         {
        //             displayName: "gb.common.infoSource",
        //             fieldName: "infoSource",
        //             fieldType: "enum",
        //             dataDicCode: "info_source",
        //             formItemGroup : ""
        //         }
        //     ]
        // };
        var fieldSetting = {};
        _.each(data.content.customPageSetting, function(num, key) {
          try {
            fieldSetting[key] = JSON.parse(num.content);
          } catch (err) {
            console.error("页面配置相关json参数错误");
          }
        });

        base.setting.fieldSetting = fieldSetting;

        var links = document.getElementsByTagName("link");
        var link = {};
        for (var i = 0; i < links.length; i++) {
          link = links[i];
          if (link.rel === "icon") {
            link.href = data.content.envConfig.icon;
          }
        }
      } else {
        var logoutActionUrl = window.localStorage.getItem("logoutActionUrl");
        if (logoutActionUrl) {
          //自定义登录地址
          $.ajax({
            url: base.ctxpath + logoutActionUrl,
            async: false,
            success: function(res) {
              //如果自定义的登出逻辑异常了， 则返回的安全眼默认的登出页面 /logout, 则调用默认登出逻辑
              if (res.content == "/logout") {
                $.ajax({
                  url: base.ctxpath + "/user/logout",
                  async: false,
                  success: function() {
                    location.href = base.ctxpath;
                  },
                  error: function() {
                    location.href = base.ctxpath;
                  }
                });
              } else {
                //调用自定义的登出逻辑
                location.href = res.content;
              }
            },
            error: function() {
              location.href = base.ctxpath;
            }
          });
        } else {
          location.href = base.ctxpath;
        }
      }
    }
  });
  //todo 查看代码配置 应该配置在上面的
  $.ajax({
    url:
      base.ctxpath +
      "/systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=common.useCheckInsteadOfCodeAsLink",
    xhrFields: {
      // withCredentials: true//表示发送凭证，但测试结果表示只会发送jsessionid，普通的cookie不会发送!
    },
    success: function(data) {
      if (data.content) {
        base.setting.useCheckInsteadOfCodeAsLink = data.content.result == 2;
      }
    }
  });
  base.initCache = initCache;

  initCache({ cacheKeys: ["i18n", "dataDic", "compId"] });

  var curTime = new Date().getTime();

  while (window.cache["i18n"] || isInitFinish) {
    //请求超过100ms,则自动跳出循环自动加载
    if (new Date().getTime() - curTime > 100) {
      break;
    }
  }

  return base;
});
