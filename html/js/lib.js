define(function (require) {

    // 是否开启两重大以重点
    // window.enableMajorRiskSource = true;

    var BASE = require('base');
    var Vue = require("vue");
    var VueRouter = require("vueRouter");
    //上传工具类
    var uploaderHelper = require("pluploadHelper");

    var Vuex = require("vueX");
    var Modal = require("components/modal/Modal");
    var Msg = require("components/iviewMessage");

    var asideHelper = require("components/iviewAsideHelper");
    //加载
    var spinHelper = require("components/iviewSpinHelper");

    var artTemplate = require('artTempalte');
    
    var lang = require('./tools/lang')



    //配置上传组件app项目路径,解决组件的base依赖
    require(["components/file-upload/pluploadHelper"], function (helper) {
        helper.defaultErrorFunc = _.throttle(function (up, rs) {
            if (rs.error == "-601") {
                Msg.error("上传文件类型错误");
            } else if (rs.error == "-600") {
                Msg.error("上传文件大小错误,最大为:" + up.settings.filters.max_file_size + ".");
            } else if (rs.error != "E200105") {
                Msg.error("上传失败");
            }
        }, 3000, { 'trailing': false })

    });

    var formRuleMgr = {
        require: function (_name) {

            if(window.localStorage.lang==='en'){
                return { required: true, message: lang('gb.common.pleaseInput')+' ' + _name };
            }else{
                return { required: true, message: lang('gb.common.pleaseInput') + _name };
            }

        },
        rangePositiveDecimal: function (_scale, _max, min) {
            var re = /(^$)|(^-?[1-9](\d+)?(\.\d{1,2})?$)|(^[0]$)|(^-?\d\.\d{1,2}?$)/;
            var validates = [];
            _scale = _scale || 2;
            _msg = "请输入大于0" + (_max ? "且小于" + _max : "") + "的整数或" + _scale + "位小数";
            validates.push({ type: "string", pattern: re, message: _msg });
            validates.push({
                validator: function (rule, val, cb) {
                    _max = _max || Math.pow(10, 9) - 1;
                    if (val <= 0) {
                        cb(_msg);
                        return;
                    }
                    else if (val > _max) {
                        cb("输入的数字不要大于" + (_max));
                        return;
                    }
                    cb();
                }
            })
            return validates;
        },
        range: function (_min, _max, _scale) {
            _min = _min || 0;
            var _msg = "请输入大于等于" + _min + "的整数";
            if (_max) {
                _msg = "请输入" + _min + "~" + _max + "之间的整数";
            }
            _msg = !_scale ? _msg : _msg + "或" + _scale + "位小数";
            var _type = !_scale ? "integer" : "number";
            var regStr = '/(^$)|(^-?[1-9](\\d+)?(\\.\\d{1,' + _scale + '})?$)|(^[0]$)|(^-?\\d\\.\\d{1,' + _scale + '}?$)/'
            var re = eval(regStr)
            var valitors = [
                { type: "string", pattern: re, message: _msg },
                { type: _type, min: _min, message: _msg }
            ]
            if (_max) {
                valitors.push({ type: _type, min: _min, max: _max, message: _msg })
            }
            else {
                _max = Math.pow(10, 9) - 1;
                valitors.push({ type: _type, max: _max, message: '输入的数字不要大于' + _max })
            }
            return valitors;
            // var re0 = /^0$|^[1-9]\d*$/,
            //     re1 = /^(0|[1-9]\d*)(\.\d)?$/,
            //     re2 = /^(0|[1-9]\d*)(\.\d{2})?$|^(0|[1-9]\d*)(\.\d)?$/;
            // var re;
            //
            // if(_scale === 2) {
            //     re = re2;
            // } else if(_scale === 1) {
            //     re = re1
            // } else {
            //     re =re0;
            // }
            //
            //
            // return {
            //     validator: function (rule, value, callback) {
            //         if(!value) {
            //             return callback();
            //         }
            //         if(!re.test(value)) {
            //             return callback(new Error(_msg))
            //         }
            //         var v = parseFloat(value);
            //         if(v < _min || v > _max) {
            //             return callback(new Error(_msg))
            //         }
            //         return callback();
            //     }
            // }
        },
        length: function (_max, _min) {
            _min = isNaN(_min) ? 1 : _min;
            _max = isNaN(_max) ? 50 : _max;
            var s = { min: _min, max: _max, message: '长度在 ' + _min + ' 到 ' + _max + ' 个字符' };
            return s;
        },
        code: function (_name, _max, _min) {
            _name = _name ? _name : "编码";
            _min = isNaN(_min) ? 1 : _min;
            _max = isNaN(_max) ? 50 : _max;
            return [{ required: true, message: '请输入' + _name }, { min: _min, max: _max, message: '长度在 ' + _min + ' 到 ' + _max + ' 个字符' }]
        },
        codeRule: function (isRequired, name, max, min) {
            isRequired = _.isBoolean(isRequired) ? isRequired : true;
            name = name || '编码';
            max = max || 50;
            min = min || 1;

            var res = [];

            if (isRequired) {
                res.push({ required: true, message: '请输入' + name })
                res.push({ min: min, max: max, message: '长度在 ' + min + ' 到 ' + max + ' 个字符' });
            }

            return res;
        },
        allowIntEmpty: { allowEmptyType: 'int' },
        allowStrEmpty: { allowEmptyType: 'str' },

        // 必填时 数字校验 正、负数字最多2位小数
        checkNumPot2: function (rule, val, cb) {
            var reg = /(^-?[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
            msg = "请输入数字";
            if (!val) {
                return cb(msg);
            } else if (!reg.test(val)) {
                return cb(msg + "，最多2位小数");
            } else {
                cb();
            }
        },

        // 非必填时 数字校验 正、负数字最多2位小数
        checkNumPot2NotReq: function (rule, val, cb) {
            var reg = /(^-?[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
            msg = "请输入数字";
            if (!val) {
                return cb();
            } else if (!reg.test(val)) {
                return cb(msg + "，最多2位小数");
            } else {
                cb();
            }
        },

        // 必填时 数字校验 正、负数字最多1位小数
        checkNumPot: function (rule, val, cb) {
            var reg = /(^-?[1-9]([0-9]+)?(\.[0-9]{1,1})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
            msg = "请输入数字";
            if (!val) {
                return cb(msg);
            } else if (!reg.test(val)) {
                return cb(msg + "，最多1位小数");
            } else {
                cb();
            }
        },

        // 非必填时 数字校验 正、负数字最多1位小数
        checkNumPotNotReq: function (rule, val, cb) {
            var reg = /(^-?[1-9]([0-9]+)?(\.[0-9]{1,1})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
            msg = "请输入数字";
            if (!val) {
                return cb();
            } else if (!reg.test(val)) {
                return cb(msg + "，最多1位小数");
            } else {
                cb();
            }
        }
    };

    var getDataDicList = function (key) {
        var dataDicList = [];
        var dataDicValue = BASE.setting.dataDicOrigin[key] || {};
        if (!_.isEmpty(dataDicValue)) {
            _.each(dataDicValue, function (val) {
                _.each(val, function (v, k) {
                    var item = {};
                    item["id"] = k;
                    item["value"] = v;
                    dataDicList.push(item);
                });
            })
        }
        return dataDicList;
    };

    var getCascadeDataDicList = function (type, key) {
        var cascadeKey = type + key;
        var dataDicValue = BASE.setting.dataDicOrigin['cascade_rel_setting'] || {};
        if (!_.isEmpty(dataDicValue)) {
            var even = _.find(dataDicValue, function (val) {
                if (val[cascadeKey]) {
                    return val;
                }
            });
            if (even) {
                return getDataDicList(even[cascadeKey]);
            }
        }
    };

    //一对一级联显示
    var getCascadeDataDic = function (type, key) {
        var cascadeKey = type + key;
        var dataDicValue = BASE.setting.dataDicOrigin['cascade_rel_setting'] || {};
        if (!_.isEmpty(dataDicValue)) {
            var even = _.find(dataDicValue, function (val) {
                if (val[cascadeKey]) {
                    return val;
                }
            });
            if (even) {
                return even[cascadeKey];
            }
        }
    };

    var formatYMD = function (obj) {
        if (obj) {
            return (new Date(obj)).Format("yyyy-MM-dd");
        } else {
            return "";
        }
    }
    var numberAdd = function (arg1, arg2) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2))
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m + arg2 * m) / m).toFixed(n);
    }
    var numberSub = function (arg1, arg2) {
        var re1, re2, m, n;
        try {
            re1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            re1 = 0;
        }
        try {
            re2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            re2 = 0;
        }
        m = Math.pow(10, Math.max(re1, re2));
        n = (re1 >= re2) ? re1 : re2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    }
    var numberMul = function (arg1, arg2) {
        var m = 0;
        var s1 = arg1.toString();
        var s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) { }
        try {
            m += s2.split(".")[1].length;
        } catch (e) { }

        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    }
    var numberDiv = function (arg1, arg2, digit) {
        var t1 = 0, t2 = 0, r1, r2;
        try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
        try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        //获取小数点后的计算值
        var result = ((r1 / r2) * Math.pow(10, t2 - t1)).toString()
        var result2 = result.split(".")[1];
        result2 = result2.substring(0, digit > result2.length ? result2.length : digit);

        return Number(result.split(".")[0] + "." + result2);
    }
    var initTableMgr = function () {

        //重构组织机构名称，格式为 :
        //公司 ：顶级公司,子级公司,子集公司,..., 当前所属公司
        //部门 ：顶级部门,子级部门,子集部门,..., 当前所属部门
        var rebuildOrgName = function (id, type, name) {

            var spliteChar = " / ";

            var curOrgName = name || '';

            //if(type == 'comp') {
            //	return LIB.getDataDic("org", id)["compName"];
            //} else if(type == 'dept') {
            //	return LIB.getDataDic("org", id)["deptName"];
            //}

            //var orgFieldName = type == "comp" ? "compName" :"deptName";
            //使用公司简称csn(company short name)代替compName
            var orgFieldName = type == "comp" ? "csn" : "deptName";

            if (BASE.setting.orgMap[id]) {

                if (curOrgName != '') {
                    var orgName = LIB.getDataDic("org", id)[orgFieldName]

                    //如果渲染的组织结构是部门, 通过DataDic获取的值为undefine，则表示父级是公司了，则当前是顶级部门, 直接返回即可
                    if (orgName != undefined) {
                        curOrgName = orgName + spliteChar + curOrgName;
                    } else {
                        return curOrgName;
                    }
                } else {
                    curOrgName = LIB.getDataDic("org", id)[orgFieldName];
                }

                var parentId = BASE.setting.orgMap[id]["parentId"];

                //不存在父级组织机构了,则表示是顶级组织机构
                if (!!parentId) {

                    //部门的 id==parentId 时表示是顶级部门
                    if (id == parentId) {
                        return curOrgName;
                    }
                    curOrgName = rebuildOrgName(parentId, type, curOrgName);
                }
            }
            return curOrgName;
        };

        var mgr = {
            rebuildOrgName: rebuildOrgName
        };
        mgr.column = {};

        mgr.column.compByParentId = {
            title: 'this.$t("gb.common.ownedComp")',
            fieldType: "custom",
            render: function (data) {
                if (data.parentId) {
                    return rebuildOrgName(data.parentId, 'comp');
                }
            },
            showTip: true,
            filterType: "text",
            filterName: "criteria.strValue.compName",
            fieldName: "parentId",
            width: 240
        };

        mgr.column.deptByParentId = {
            title: 'this.$t("gb.common.ownedDept")',
            fieldType: "custom",
            render: function (data) {
                if (data.parentId) {
                    return rebuildOrgName(data.parentId, 'dept');
                }
            },
            showTip: true,
            filterType: "text",
            filterName: "criteria.strValue.deptName",
            fieldName: "parentId",
            width: 160
        };

        mgr.column.company = {
            title: 'this.$t("gb.common.ownedComp")',
            fieldType: "custom",
            render: function (data) {
                if (data.compId) {
                    return rebuildOrgName(data.compId, 'comp');
                }
            },
            filterType: "text",
            filterName: "criteria.strValue.compName",
            fieldName: "compId",
            width: 240
        };
        mgr.column.dept = {
            title: 'this.$t("gb.common.ownedDept")',
            fieldType: "custom",
            render: function (data) {
                if (data.orgId) {
                    return rebuildOrgName(data.orgId, 'dept');
                }
            },
            filterType: "text",
            filterName: "criteria.strValue.deptName",
            fieldName: "orgId",
            width: 160
        };
        mgr.column.modifyDate = {
            title: 'this.$t("gb.common.modifyTime")',
            fieldName: "modifyDate",
            filterType: "date"
        };
        mgr.column.createDate = {
            title: 'this.$t("gb.common.createTime")',
            fieldName: "createDate",
            filterType: "date"
        };
        //状态，启用、禁用
        mgr.column.disable = {
            title: 'this.$t("gb.common.state")',
            width: 80,
            fieldName: "disable",
            filterName: "criteria.intsValue.disable",
            filterType: "enum",
            popFilterEnum: getDataDicList("disable"),
            render: function (data) {
                var text = LIB.getDataDic("disable", data.disable);
                if (data.disable === '0') {
                    return '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>' + text
                } else {
                    return '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>' + text
                }
            }
        };

        //编码
        mgr.column.code = {
            title: 'this.$t("gb.common.code")',
            fieldName: "code",
            width: 180,
            orderName: "code",
            fieldType: "link",
            filterType: "text"
        };

        //备注
        mgr.column.remark = {
            title: 'this.$t("gb.common.remarks")',
            fieldName: "remark",
            filterType: "text"
        };

        mgr.column.cb = {
            title: "cb",
            fieldName: "id",
            fieldType: "cb",
        };

        _.forEach(mgr.column, function (val) {
            val.build = function (arg) {
                //基本类型默认为宽度
                if (!_.isObject()) {
                    return _.defaults({ width: arg }, this);
                }
                return _.defaults(arg, this);
            }
        });

        //keyword search column define
        mgr.ksColumn = {};
        _.forEach(mgr.column, function (val, key) {
            mgr.ksColumn[key] = _.defaults({}, _.pick(val, "title", "fieldName", "fieldType", "width", "render", "build"));
            var fieldName = val["fieldName"];
            if (fieldName && fieldName.indexOf(".") === -1) {
                mgr.ksColumn[key]["keywordFilterName"] = "criteria.strValue.keyWordValue_" + val["fieldName"];
            }
        });
        delete mgr.ksColumn.code.fieldType;
        delete mgr.ksColumn.cb.keywordFilterName;
        mgr.ksColumn.company.keywordFilterName = "criteria.strValue.keyWordValue_compName";
        mgr.ksColumn.dept.keywordFilterName = "criteria.strValue.keyWordValue_deptName";

        return mgr;
    }

    var calcDate = function (val1, val2) {
        var dateInterval = new Date(val1).getTime() - new Date(val2).getTime();   //时间差的毫秒数
        if (dateInterval > 0) {
            //计算出相差天数
            var days = Math.floor(dateInterval / (24 * 60 * 60 * 1000));
            //计算小时数
            var hourLevel = dateInterval % (24 * 60 * 60 * 1000);
            var hours = Math.floor(hourLevel / (60 * 60 * 1000))
            //计算分钟数
            var minutesLevel = hourLevel % (60 * 60 * 1000);
            var minutes = Math.floor(minutesLevel / (60 * 1000));

            //计算秒数
            var seconds = Math.round((minutesLevel % (60 * 1000)) / 1000);
            return (days * 24 * 60 + hours * 60 + minutes) + "分" + seconds + "秒";
            // alert('天数 ' + days + ' 小时数 ' + hours + ' 分钟数 ' + minutes + ' 秒数 ' + seconds)
        } else {
            return "";
        }
    }

    var LIB_BASE = {
        tableMgr: initTableMgr(),
        user: BASE.user,
        userEx: BASE.userEx,
        setting: BASE.setting,
        initCache: BASE.initCache,
        //			reloadI18nCache : function() {
        //				BASE.initCache({cacheKeys : ["i18n"]);
        //			},
        updateOrgCache: function (orgBean, opts) {

            if (!orgBean.type) {
                throw new Error("组织机构缺少类型，无法判断是公司还是部门");
            }

            if (opts && opts.type == "delete") {

                //更新 LIB.setting.orgList
                var deleteIndex = undefined;
                _.each(BASE.setting.orgList, function (item, index) {
                    if (item.id == orgBean.id) {
                        deleteIndex = index;
                        return;
                    }
                });

                if (deleteIndex) {
                    BASE.setting.orgList.splice(deleteIndex, 1);
                }

                //更新 LIB.setting.dataDic
                //更新 LIB.setting.orgMap
                delete BASE.setting.dataDic.org[orgBean.id];
                delete BASE.setting.orgMap[orgBean.id];

                //更新 主页面分类控件组织机构数据源版本信息
                window.allClassificationOrgListVersion++;

                return;
            }

            var currentComp = {
                id: orgBean.id,
                name: orgBean.name,
                parentId: orgBean.parentId,
                attr5: orgBean.attr5, //简称
                type: orgBean.type //type , 1:公司, 2：部门
            };
            //更新 LIB.setting.orgList

            var cachedComp = _.find(BASE.setting.orgList, function (data) { return data.id == currentComp.id });
            if (cachedComp) {
                cachedComp.name = currentComp.name;
                cachedComp.parentId = currentComp.parentId;
            } else {
                BASE.setting.orgList.push(currentComp);
            }

            //更新 LIB.setting.dataDic
            if (currentComp.type.toString() == "1") {
                BASE.setting.dataDic.org[currentComp.id] = {
                    "compName": currentComp.name, //名称
                    "csn": currentComp.attr5, //简称
                    "pId": currentComp.parentId, //parentId
                    "t": currentComp.type + "" //type , 1:公司, 2：部门
                };
            } else {
                BASE.setting.dataDic.org[currentComp.id] = {
                    "deptName": currentComp.name, //名称
                    "pId": currentComp.parentId, //parentId
                    "t": currentComp.type + "" //type , 1:公司, 2：部门
                };
            }
            //更新 LIB.setting.orgMap
            BASE.setting.orgMap[currentComp.id] = currentComp;

            //更新 主页面分类控件组织机构数据源版本信息
            window.allClassificationOrgListVersion++;

        },
        getDataDic: function (type, key) {
            var result = BASE.setting.dataDic[type] || {};
            if (!_.isEmpty(result) && key) {
                result = result[key] || "";
            }
            //异步绑定时，key可能是null
            if (!key) {
                return "";
            }
            return result;
        },
        getDataDicList: getDataDicList,
        getCascadeDataDicList: getCascadeDataDicList,
        getCascadeDataDic: getCascadeDataDic,
        formatYMD: formatYMD,
        numberAdd: numberAdd,
        numberSub: numberSub,
        numberMul: numberMul,
        numberDiv: numberDiv,
        calcDate: calcDate,
        /**
         * 向 dataDic 和 dataDicOrigin添加数据
         * @param {String} key
         * @param {Array<Array>} val
         */
        registerDataDic: function (key, val) {
            BASE.setting.dataDic[key] = _.zipObject(val);

            var res = [], ite;
            _.forEach(val, function (item) {
                ite = {};
                ite[item[0]] = item[1];
                res.push(ite)
            });
            BASE.setting.dataDicOrigin[key] = res;
        },
        registerFilterdataDic: function (key, val) {
            var newDataDic = _.pick(BASE.setting.dataDic[key], val);
            BASE.setting.dataDic[key + '_filter'] = newDataDic;
            var res = [], ite;
            for (k in newDataDic) {
                ite = {};
                ite[k] = newDataDic[k];
                res.push(ite)
            }
            BASE.setting.dataDicOrigin[key + '_filter'] = res;
        },
        //将后端返回的文件数据转换成前端可使用数据
        convertFileData: function (file) {
            return { fileId: file.id, fileExt: file.ext, ctxPath: file.ctxPath, fullSrc: file.ctxPath, attr5: file.attr5, orginalName: file.orginalName };
        },
        //对图片地址处理
        convertPicPath: function (fileId, type) {
            type = type || 'scale'
            return BASE.SwConfig.url + "/file/image/" + fileId + "/" + type;
        },
        //对图片地址处理  attr5 = ‘5’ 时， 通过 ctxPath获取， 并支持不同的略缩图策略
        // suffix： scale | watermark 旧的处理方式
        // param: width x height 图片的宽高
        convertImagePath: function (image, suffix, param) {
            if (image.attr5 === '5') {

                // return image.fullSrc + '!m100x100.' + image.fileExt
                param = param || "100x100";
                var s = image.fullSrc.split("//");
                return s[0] + "//" + s[1].replace('/', "/resize_" + param + "/");
            }
            suffix = suffix || 'scale';

            if (image.attr5 === 'OSS') {
                if (suffix == 'watermark') {
                    return image.fullSrc + "?x-oss-process=image/watermark,image_d2F0ZXJtYXJrLnBuZw==,t_50,g_south";
                } else if (suffix == 'scale') {
                    param = param || "100x100";
                    var arr = param.split("x");
                    return image.fullSrc + "?x-oss-process=image/resize,h_" + arr[0] + ",w_" + arr[1];
                } else {
                    return image.fullSrc;
                }
            }
            // BASE.SwConfig.url +  去掉ip地址
            return "/file/image/" + image.fileId + "/" + suffix;
        },
        //图片水印地址
        convertWatermarkPicPath: function (fileId) {
            return BASE.SwConfig.url + "/file/image/" + fileId + "/watermark";
        },
        convertPath: function () {
            return BASE.SwConfig.url + "/html/images/player.png";
        },
        convertFilePath: function (file) {
            var urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            if (!!file.ctxPath && urlPattern.test(file.ctxPath)) {
                return file.ctxPath;
            } else {
                return BASE.SwConfig.url + "/file/down/" + file.fileId
            }
        },
        //抽取服务端请求路径
        ctxPath: function (uri) {
            if (uri) {
                return BASE.SwConfig.url + uri;
            }
            return BASE.SwConfig.url;
        },
        hasRouteAuth: function (pathCode) {
            if (LIB.PathCode[pathCode] === undefined) {
                return false;
            }
            return BASE.setting.menuList.some(function (menu, index) {
                return menu.attr1 === LIB.PathCode[pathCode]
            })
        },
        getCheckbox: function (checked) {
            checked = checked || false
            if (checked) {
                return '<span style="color: #fff;width: 16px;height: 16px;display: block;border: 1px solid #d9d9d9;border-radius: 3px;background-color: #aacd03;text-align: center;padding: 2px;font-size: xx-small;" class="ivu-icon ivu-icon-checkmark-round"></span>'
            }
            else {
                return '<span class="" style="width: 16px;height: 16px;display: block;border: 1px solid #d9d9d9;border-radius: 3px;background-color: #fff;box-sizing: border-box;"></span>'
            }
        },
        isURL: function (str) {
            if (!str) return false;
            var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            return pattern.test(str);
        },
        authMixin: {
            methods: {
                hasPermission: function () {
                    for (var per in arguments) {
                        if (!_.contains(BASE.setting.funcList, arguments[per])) {
                            return false;
                        }
                    }
                    return true;
                },
                findAuth: function (param, callback) {
                    var resource = this.$resource("role/auth");
                    var _this = this;
                    resource.get(param).then(function (res) {
                        callback && callback.call(this, res);
                    });
                },
                hasAuth: function () {
                    var _this = this;
                    // 没有设置权限码对象时为true
                    if (!this.__auth__) {
                        return true;
                    }
                    var args = Array.prototype.slice.call(arguments);
                    return _.some(args, function (item) {
                        var code = _this.__auth__[item];
                        if (!code) {
                            return true;
                        }
                        var codes = code.split(',');
                        return _.some(codes, function (c) {
                            return _this.hasPermission(c)
                        });
                    })
                },
                hasDataAuth: function (authId, showError) {
                    if (_.contains(LIB.user.dataAuthIds, authId)) {
                        return true;
                    } else {
                        if (showError == undefined || showError == true) {
                            LIB.Msg.error("无权限操作");
                        }
                        return false;
                    }
                },
                isOwnDeptDataAuth: function (pojoName) {
                    var result = _.propertyOf(BASE.userEx)("updateOwnDeptPojos")
                    return _.contains(result, pojoName);
                }
            }
        },
        /**
         * @Description 获取系统参数设置
         * @param name 数据库attr1字段，compId公司ID，为空默认9999999999
         **/
        getBusinessSetByNamePath: function (name, compId) {
            var result = {};
            $.ajax({
                url: "/systembusinessset/getBusinessSetByNamePath/compId?compId=" + (compId ? compId : '9999999999') + "&namePath=" + name,
                async: false,
                success: function (res) {
                    if (res.content) {
                        result = res.content;
                    }
                }
            });
            return result;
        },

        getBusinessSetStateByNamePath: function (name, compId) {
            var businessSet = this.getBusinessSetByNamePath(name, compId);
            return businessSet.result === '2';
        },
        getCompanyBusinessSetState: function (compId) {
            return this.getCompanyBusinessSet(compId);
        },
        getCompanyBusinessSet: function (compId) {
            var result = {};
            $.ajax({
                url: "/systembusinessset/company/getBusinessSet?compId=" + (compId ? compId : '9999999999'),
                async: false,
                success: function (res) {
                    if (res.content) {
                        result = res.content;
                    }
                }
            });
            return result;
        },
    };

    var globalLoader = {
        loader: null,
        show: function () {
            if (!this.loader) {
                this.loader = document.querySelector('.request-loading-box')
            }
            this.loader.style.display = 'block';
        },
        hide: function (that) {
            var _this = this;
            if (!this.loader) {
                this.loader = document.querySelector('.request-loading-box')
            }
            if (that && _.isFunction(that.$nextTick)) {
                that.$nextTick(function () {
                    _this.loader.style.display = 'none';
                })
            } else {
                this.loader.style.display = 'none';
            }
        }
    };

    // 同步请求
    var syncHTTPRequest = function (config, callback) {
        var xhr = new XMLHttpRequest();
        var method = config.method || 'GET';
        xhr.open(method, config.url, false);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function () {
            var XMLHttpReq = xhr;
            if (XMLHttpReq.readyState === 4) {
                if (XMLHttpReq.status === 200) {
                    var res = JSON.parse(xhr.responseText);
                    if (res.error === '0') {
                        callback(res.content);
                    } else {
                        Msg.error("请求出错");
                    }
                } else {
                    Msg.error("请求出错");
                }
            }
        };
        xhr.send(null);
    };
    //同一公司下部门名相同时，显示该部门上级部门
    function reNameOrg(d, name) {
        var result = _.filter(LIB.setting.orgList, function (data) {
            return data.compId == d.compId
        });
        var arr = _.filter(result, function (data) {

            return data.name == d[name] && data.id != d.xId


        });
        if (arr.length > 0) {
            function orgname(result, arr, compId) {
                var parr = _.filter(result, function (data) {
                    return data.id == arr[0].parentId
                });
                if (parr.length > 0) {
                    if (parr[0].id == compId) {
                        return
                    }
                    d[name] = parr[0].name + '/' + d[name]

                    if (parr[0].id != compId) {
                        orgname(result, parr, compId)
                    }


                }

            }
            orgname(result, arr, d.compId)
        }
    }
    var LIB = {
        syncHTTPRequest: syncHTTPRequest,
        globalLoader: globalLoader,
        LIB_BASE: LIB_BASE,
        reNameOrg: reNameOrg,
        formRuleMgr: formRuleMgr,

        asideMgr: asideHelper,
        //请求全局加载方法
        spinMgr: spinHelper,

        //模块Code, 用于全局搜索和国际化key
        ModuleCode: {
            BC_RiA_Hazl: 'BC_RiA_Hazl', //危害辨识
            BC_Hal_InsP: 'BC_Hal_InsP', //检查计划
            BC_Hal_InsT: 'BC_Hal_InsT', //检查任务
            BC_Hal_RanO: 'BC_Hal_RanO', //随机观察
            BC_Hal_InsR: 'BC_Hal_InsR', //检查记录
            BC_HaT_HazR: 'BC_HaT_HazR', //隐患登记
            BC_HaT_TasA: 'BC_HaT_TasA', //任务分配
            BC_HaT_HazT: 'BC_HaT_HazT', //隐患整改
            BC_HaT_HazV: 'BC_HaT_HazV', //隐患验证
            BC_HaG_HazT: 'BC_HaG_HazT', //隐患总表
            BC_HaT_ProS: 'BC_HaT_ProS', //流程设置
            BC_TrM_MytR: 'BC_TrM_MytR', //我的培训
            BC_TrM_MatT: 'BC_TrM_MatT', //矩阵大表
            BC_TrM_TraS: 'BC_TrM_TraS', //培训状态
            BC_TrM_TraR: 'BC_TrM_TraR', //培训记录
            BC_TrM_TraP: 'BC_TrM_TraP', //培训计划
            BC_TrM_TraE: 'BC_TrM_TraE', //培训报名
            BC_TrM_PerM: 'BC_TrM_PerM', //个人矩阵

            BD_RiA_HazF: 'BD_RiA_HazF', // 危害因素
            BD_RiA_EvaM: 'BD_RiA_EvaM', // 评估模型
            BD_RiA_InsM: 'BD_RiA_InsM', // 检查方法
            BD_RiA_InsB: 'BD_RiA_InsB', // 检查依据
            BD_RiA_IncC: 'BD_RiA_IncC', // 事故案例
            BD_HaI_InsO: 'BD_HaI_InsO', //受检对象
            BD_HaI_CheI: 'BD_HaI_CheI', //检查项
            BD_HaI_CheL: 'BD_HaI_CheL', //检查表
            BD_TrM_CouM: 'BD_TrM_CouM', //课程管理
            BD_TrM_ExPM: 'BD_TrM_ExPM', //试卷管理
            BD_TrM_ExQM: 'BD_TrM_ExQM', //试题管理
            BD_TrM_InrM: 'BD_TrM_InrM', //讲师管理

            BS_BaC_RemS: 'BS_BaC_RemS', //提醒设置
            BS_BaC_SofL: 'BS_BaC_SofL', //软件授权
            BS_BaC_MaiC: 'BS_BaC_MaiC', //邮箱配置
            BS_BaC_MenM: 'BS_BaC_MenM', //菜单管理
            BS_BaC_ComI: 'BS_BaC_ComI', //公司信息
            BS_OrI_ComD: 'BS_OrI_ComD', //公司档案
            BS_OrI_DepD: 'BS_OrI_DepD', //部门档案
            BS_OrI_PerM: 'BS_OrI_PerM', //人员维护
            BS_OrI_PosM: 'BS_OrI_PosM', //岗位管理
            BS_OrI_RolM: 'BS_OrI_RolM', //角色管理
            BS_OrI_AutM: 'BS_OrI_AutM', //权限管理
            BS_DaS_OnlU: 'BS_DaS_OnlU', //在线用户
            BS_DaS_LogL: 'BS_DaS_LogL', //登录日志
            BS_DaS_OpeL: 'BS_DaS_OpeL', //操作日志
            BS_DaS_MaiL: 'BS_DaS_MaiL', //邮件日志

            MC_SyM_InbX: 'MC_SyM_InbX', //收件箱
            MC_EmM_InbX: 'MC_EmM_InbX', //收件箱
            MC_EmM_SenM: 'MC_EmM_SenM', //发消息
            MC_EmM_HavS: 'MC_EmM_HavS', //已发送
        },
        // 路由Code，用于路由跳转
        PathCode: {
            'BS_OrI_AutM': '/basicSetting/organizationalInstitution/RoleManagement', //权限管理
            'BS_OrI_PerM': '/basicSetting/organizationalInstitution/PersonnelFi', //人员维护
            'BS_BaS_EqU': '/basicSetting/basicFile/equipment', // 设备设施
            'BS_OrI_PosM': '/basicSetting/organizationalInstitution/PostManagement', //岗位管理
            'BS_OrI_RolM': '/basicSetting/organizationalInstitution/HseRole', //角色管理
            'BS_OrI_ComD': '/basicSetting/organizationalInstitution/CompanyFi', //公司档案
            'BS_OrI_DepD': '/basicSetting/organizationalInstitution/DepartmentalFi', //部门档案
            'BC_HD_RO': '/randomObserve/businessCenter/total', // 随手拍记录
            'BC_RO_TD': '/randomObserve/businessCenter/todo', // 随手拍待处理
            'BC_HD_IT': '/hiddenDanger/businessCenter/inspectionTask', // 检查任务
            'BC_HG_T': '/hiddenGovernance/businessCenter/total', // 隐患总表
            'BC_HG_RG': '/hiddenGovernance/businessCenter/regist', // 隐患登记
            'BC_HG_AG': '/hiddenGovernance/businessCenter/assign', // 任务分配
            'BC_HG_RF': '/hiddenGovernance/businessCenter/reform', // 隐患整改
            'BC_HG_VF': '/hiddenGovernance/businessCenter/verify', // 隐患验证
            'BC_TM_MT': '/trainingManagement/businessCenter/myTraining', // 我的训练
            'BC_TM_TC': '/trainingManagement/businessCenter/testCenter', // 我的考试
            'BC_SA_AS': '/safetyAudit/businessCenter/auditScore', // 审查评分
            'BC_LS_AT': '/leadership/businessCenter/asmtTask', // 自评任务
            'BD_HaI_CheL': '/hiddenDanger/businessFiles/checkList', // 检查表
            'BC_RI_RcT': '/routingInspection/businessCenter/riCheckTask', // 巡检任务
            'BC_RI_TiT': '/routingInspection/businessCenter/tmpInspectionTask', // 临时工作任务
            'BC_JsE_JM': '/jse/businessCenter/jsaMasterNew', // 票卡任务
            'BC_SA_IAS': '/isaSafetyAudit/businessCenter/auditScore', // 票卡任务,
            'BF_JsE_OsC': '/jse/businessFiles/opStdCard',
            'BF_JsE_OmC': '/jse/businessFiles/opMaintCard',
            'BF_JsE_OeC': '/jse/businessFiles/opEmerCard',
            "BC_ISA_RJT": '/riskJudgment/businessFiles/personRiskJudgTask',
            'BC_HD_IT_INSPECTION': '/hiddenDanger/businessCenter/inspectionTask?bizType=inspect&keepUrlParam=true', // 巡检任务
            'BC_HD_IT_JOB': '/periodicWork/mgr/periodicask?bizType=job&keepUrlParam=true', // 周期性工作任务
            'BD_RiA_InsM': '/expertSupport/businessFiles/checkMethod',
            'BD_RiA_IncC': '/expertSupport/businessFiles/accidentCase',
            'BD_RiA_InsB': '/expertSupport/businessFiles/legalRegulation',
            'S_METTING': '/secureMeeting/businessFiles/Meeting'
        },
        Vue: Vue,
        VueRouter: VueRouter,

        //扩展Vue全局对象,添加方法处理
        VueEx: {
            extend: function (opts) {
                //Vue权限配置
                var authMixin = LIB_BASE.authMixin;

                //抽取main模块配置项
                var mainMixin = LIB.VueMixin.mainPanel || {};

                /**权限模块END**/
                var _opts = {
                    mixins: [authMixin, mainMixin]
                }
                _.extend(_opts, opts);
                return Vue.extend(_opts);
            }
        },
        Vuex: Vuex,
        Modal: Modal,
        Msg: Msg,
        uploaderHelper: uploaderHelper,
        getBusinessSetStateByNamePath: LIB_BASE.getBusinessSetStateByNamePath,
        getCompanyBusinessSetState: LIB_BASE.getCompanyBusinessSetState,
        /**
         * 获取指定命名空间下的setting配置属性
         * @param namePath 为空时，默认返回setting对象
         * 例如： LIB.getSettingByNamePath("envBusinessConfig.reportFunction.isDataContain")
         * 获取 envBusinessConfig.reportFunction.isDataContain 系统参数属性。
         * 此方法解决 若 reportFunction 属性为空，前端JS报错导致问题
         */
        getSettingByNamePath: function (namePath) {
            if (_.isNull(namePath)) return BASE.setting;
            //校验参数合法性
            if (typeof namePath != "string" || !/^[a-zA-Z\d]+(\.[a-zA-Z\d]+)*$/.test(namePath)) throw "namePath 参数不合法";
            var attrs = namePath.split(".");
            var val = BASE.setting;
            for (var i in attrs) {
                val = _.propertyOf(val)(attrs[i])
            }
            return val;
        },
        // 一些页面无法使用$t,所以用这个方法
        lang: function (val) {
            var i18n = BASE.i18nLang
            return i18n[_.findIndex(i18n, function (o) { return o.code == val; })].zhValue
        }
        // 一些页面无法使用$t,所以用这个方法
    };

    _.extend(LIB, LIB_BASE);

    var LIBX = {
        LIB_BASE: LIB_BASE,
        VueMixin: {
            dataDic: {
                methods: {
                    getDataDic: function (type, key) {
                        return LIB.getDataDic(type, key);
                    },
                    getDataDicList: function (type) {
                        return LIB.getDataDicList(type);
                    },
                    getCascadeDataDicList: function (type, key) {
                        return LIB.getCascadeDataDicList(type, key);
                    },
                    getCascadeDataDic: function (type, key) {
                        return LIB.getCascadeDataDic(type, key);
                    },
                    formatYMD: function (obj) {
                        return LIB.formatYMD(obj);
                    }
                }
            },
            auth: LIB_BASE.authMixin
            //				detailPanel : require("common/framework/mixin/detailPanel"),
            //				detailTabXlPanel : require("common/framework/mixin/detailTabXlPanel"),
            //				selectorTableModal : require("componentsEx/selectTableModal/base/modal"),
            //                formModal : require("componentsEx/formModal/base/modal")
        }
    };

    _.extend(LIB, LIBX);

    var commonLIB = {

        urlEncode: function (param, key, encode) {
            if (param == null) return '';
            var paramStr = '';
            var t = typeof (param);
            if (t == 'string' || t == 'number' || t == 'boolean') {
                paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
            } else {
                for (var i in param) {
                    var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                    paramStr += commonLIB.urlEncode(param[i], k, encode);
                }
            }
            return paramStr;
        },
        html: {
            render: function (tpl, data) {
                for (var key in data) {
                    tpl.replace(key, data[key]);
                }
            }
        },
        renderHTML: function (tpl, data) {
            data = data || {};
            /**
             * 命名规范为 : 
             * 
             * $pageType--pagePosition-renderTarget-renderType-function-status
             * 
             * pageType : {
             * 		main : 主页面,
             * 		detail : 详情页面
             * }
             * 
             * pagePosition : {
             * 		header:头部,
             * 		center:中间,
             * 		footer:尾部
             * }
             * 
             * 
             * renderTarget : {
             *		table:定义的标签名称,
             * 		row:定义的标签名称
             * }
             * 
             * renderType : {
             *		attr:属性,
             * 		tag:标签
             * }
             * 
             * function : {
             * 		default:默认功能,当同一个页面出现多个类似的属性或者标签需要替换时,根据不同function设置不同值
             * 		xxx:自定义值
             * }
             * 
             * status : {
             *		display:显示,
             * 		hidden:隐藏
             * }
             * 
             * main-center-table-attr-default
             * main-header-row-attr-default-display
             * main-header-row-attr-default-hidden
             * 
             */
            var dfCfg = {
                '$main-center-table-attr-default': ':selected-datas.sync="tableModel.selectedDatas" :setting="tableModel" :page-size-opts="[20,50,100]" :code="moduleCode" :resizeable="true" show-loading :show-scroll="true" @on-click-cell="doTableCellClick" v-ref:main-table',
                '$main-header-row-attr-default-display': 'type="flex" align="middle" class="mp-header-item" v-show="tableModel.selectedDatas.length == 0" transition="slide"',
                '$main-header-row-attr-default-hidden': 'type="flex" align="middle" class="mp-header-item" v-show="tableModel.selectedDatas.length != 0"',
                '$main-header-classification-attr-default': 'id-attr="id" pid-attr="parentId" v-ref:category-selector',
                '$main-header-classification-attr-mixBusiness': 'id-attr="id" pid-attr="parentId" :data-config="categoryModel" @on-change="doCategoryChange" v-ref:category-selector',
                '$main-header-fileupload-tag-excel': '<vue-file-upload :url="uploadModel.url" file-ext="xls,xlsx" @on-success-upload="doSuccessUpload" custom-style=""><div class="uploadAport"><a style="display: block;">{{$t(&quot;gb.common.import&quot;)}}</a></div></vue-file-upload>',
                '$main-header-div-tag-download-excel': '<div class="uploadAport" @click="doExportExcel"><a>{{$t("gb.common.export")}}</a></div>',
                '$main-header-condition-div-attr-default': 'span="20"',
                '$main-header-func-div-attr-default': 'span="4"',
                '$main-header-dropdown-item-tag-common-display': '<iv-dropdown-item><div class="uploadAport" @click="refreshMainTableData"><a>{{this.$t("bc.ria.refresh")}}</a></div></iv-dropdown-item>',
                '$main-header-refresh-button': '<Icon @click="refreshMainTableData" class="main-refresh-icon" type="refresh"></Icon>'
            };
            _.extend(data, dfCfg);
            var result = tpl;

            var regStr = _.keys(dfCfg).join("|");
            regStr = regStr.replace(new RegExp("\\$", "g"), "\\$");
            result = result.replace(new RegExp(regStr, "g"), function (matchStr) {
                return data[matchStr];
            });
            return result;
        }
    };

    var optsLIB = {

        Opts: {
            extendMainTableOpt: function (opt) {
                _.defaults(opt, {
                    allowMultiDelete: false,
                    showColumnPicker: true,
                    isSingleCheck: true
                });

                // 判断第一列是否是id，第二列是否是编码，如果是，则固定在表格左侧
                if (opt.columns) {
                    if (opt.columns[0].fieldName === 'id' || opt.columns[0].fieldType === 'cb') {
                        opt.columns[0].fixed = true;
                    }
                    if (opt.columns[1].fieldName === 'code' || opt.columns[1].fieldName === 'title' || opt.columns[1].codeToView) {
                        opt.columns[1] = this.codeHandle(opt.columns[1]);
                        opt.columns[1].fixed = true;
                    }
                }
                return opt;
            },
            extendDetailTableOpt: function (opt) {
                _.defaults(opt, {
                    showEmptyRow: false,
                    useDefaultGlobalFilter: false,
                    lazyLoad: true
                });
                return opt;
            },
            codeHandle: function (column) {
                if (LIB.setting.useCheckInsteadOfCodeAsLink) {//编码替换
                    return {
                        title: "  ",
                        width: '80px',
                        fieldType: "custom",
                        fieldName: column.fieldName,
                        fixed: true,
                        render: function () {
                            return '<div style="color: #33a6ff;cursor: pointer;">查 看</div>'
                        }
                    }
                }
                return column;
            }
        }
    };


    var displayFieldSettingLIB = {

        fieldSetting: [{
            //字段显示名, 用于显示 , 默认应该是国际化key, 也可以是显示的字符串
            displayName: "gb.common.infoSource",
            //字段名, 后台pojo使用的字段
            fieldName: "infoSource",
            //字段类型, 可选值为 : enum(枚举)/string(字符串)/int(整型)/long(长整型)/date(日期类型)/text（areatext输入框）/refer(弹窗)
            fieldType: "enum",
            //字段是否必填
            required: false,
            //如果字段类型 == enum, 需要设置枚举类型的数据字典code
            dataDicCode: "info_source",
            //如果字段类型 == string, 可设置最小长度
            minLength: null,
            //如果字段类型 == string, 可设置最大长度
            maxLength: null,
            //如果字段类型 in (int, long, date), 可设置最小值
            minValue: null,
            //如果字段类型 in (int, long, date), 可设置最大值
            maxValue: null,
            //字段显示顺序
            order: null,
            //form表单分组
            formFieldGroup: null
        }],
        dataRenderMgr: {
            renderVO: function (vo, fieldSetting) {
                if (!!fieldSetting) {
                    var customVO = _.reduce(fieldSetting, function (m, data) { m[data.fieldName] = null; return m; }, {});
                    _.extend(vo, customVO);
                };
                return vo;
            },
            renderRules: function (fieldSetting, rules) {

                if (!!fieldSetting) {
                    var _this = this;
                    var customRules = _.reduce(fieldSetting, function (m, data) {
                        //enum date
                        m[data.fieldName] = [{
                            required: !!data.required,
                            message: '请输入' + _this.$t(data.displayName)
                        }];
                        if (data.fieldType == 'string') {
                            var _max = isNaN(data.maxLength) ? 50 : data.maxLength,
                                _min = isNaN(data.minLength) ? 1 : data.minLength;
                            m[data.fieldName].push(LIB.formRuleMgr.length(_max, _min));
                        } else if (data.fieldType == 'int' || data.fieldType == 'long') {
                            //number integer phone array email
                            var _max = isNaN(data.maxValue) ? 10000 : data.maxValue,
                                _min = isNaN(data.minValue) ? 0 : data.minValue;
                            data.fieldType = data.fieldType == 'int' ? 'integer' : 'number';
                            m[data.fieldName].push({
                                type: data.fieldType,
                                min: _min,
                                max: _max,
                                message: '请输入正确的' + _this.$t(data.displayName)
                            })
                        }
                        return m;
                    }, []);
                    _.extend(rules, customRules);
                }
                return rules;
            }
        },
        formRenderMgr: {
            renderHtml: function (htmlTpls, fieldSetting, callback) {
                var html = htmlTpls['enum'];
                if (!!fieldSetting) {
                    var template = require('artTempalte');
                    var formHtml = [];
                    _.each(fieldSetting, function (data, key) {
                        if (!!key) { //判断formItemGroup
                            formHtml.push('<p  style="padding-top: 15px;line-height: 28px;font-size: 14px;color: #666;font-weight: bold;border-bottom: 1px solid #fff">{{$t("' + key + '")}}</p>');
                        };
                        _.each(data, function (value) { //循环某个模块：例如：基本信息
                            if (value.fieldType == 'enum' || value.fieldType == 'text' || value.fieldType == 'string' || value.fieldType == 'date') {
                                formHtml.push(template.compile(htmlTpls[value.fieldType])(value));
                            } else {
                                var str = callback(value.fieldType);
                                formHtml.push(template.compile(str)(value));
                            }
                        })
                    });
                    html = formHtml.join("");
                }
                return html;
            }
        },
        tableRenderMgr: {
            renderModel: function (fieldSetting, tableModel) {
                if (!!fieldSetting) {
                    tableModel.columns = tableModel.columns || [];

                    var customTabelModel = {};

                    var _this = this;
                    customTabelModel.columns =
                        _.map(fieldSetting, function (data) {
                            var obj = {
                                title: _this.$t(data.displayName),
                                fieldName: data.fieldName,
                                filterType: data.fieldType,
                                filterName: data.filterName || data.fieldName,
                                orderName: data.orderName || data.fieldName,
                                render: data.render ? new Function('return  ' + data.render)() : undefined
                            };
                            // if(fieldSetting.length>10){//当列数大于10行时，每列设为200px
                            // obj.width = '200px';
                            // };
                            //是否有分类标签
                            obj.title = data.formItemGroup != "" ? (_this.$t(data.formItemGroup) + _this.$t(data.displayName)) : _this.$t(data.displayName);
                            //枚举值的filterName需要额外设置
                            if (data.fieldType == "enum") {
                                obj.filterName = "criteria.intsValue." + data.fieldName;

                                obj.fieldType = "custom";
                                obj.render = function (renderData) {
                                    return LIB.getDataDic(data.dataDicCode, [renderData[obj.fieldName]]);
                                };
                                obj.popFilterEnum = LIB.getDataDicList(data.dataDicCode);
                            } else if (data.fieldType == "date") {
                                obj.filterType = 'date';
                            } else {
                                obj.filterType = 'text';
                            }
                            // 自定义字段默认排序
                            obj.defaultOrder = data.defaultOrder;
                            return obj;
                        });

                    // 处理排序
                    var _noOrderColumns = null,
                        needOrderColumns = customTabelModel.columns.filter(function (item) {
                            return item.defaultOrder;
                        })
                    if (needOrderColumns.length > 0) {
                        _noOrderColumns = customTabelModel.columns.filter(function (item) {
                            return !item.defaultOrder;
                        });
                        tableModel.columns = tableModel.columns.concat(_noOrderColumns);
                        needOrderColumns = needOrderColumns.sort(function (a, b) {
                            return a.defaultOrder - b.defaultOrder;
                        })
                        needOrderColumns.forEach(function (column) {
                            tableModel.columns.splice(column.defaultOrder, 0, column);
                        })
                    } else {
                        tableModel.columns = tableModel.columns.concat(customTabelModel.columns);
                    }

                }
                return tableModel;
            }
        },
        detailPanedFormRenderMgr: {
            // 参数必要的字段
            // artData: [{
            //     name: "$t('gb.common.checkItemName')",
            //     fieldName: 'name',
            //     model: 'mainModel.vo.name',
            //     type: 'input'
            // }, {
            //     name: "$t('gb.common.checkItemName')",
            //     fieldName: 'name',
            //     model: 'mainModel.vo.name',
            //     type: 'date'
            // }],

            renderTemplate: function (template, data) {
                var i, j;
                // 获取iv-row的正则表达式
                var rowReg = /(<iv-row.*?>[\s\S]+?<\/iv-row>)/g;
                // 获取el-form-item的正则表达式                
                var elReg = /(<el-form-item.*?>[\s\S]+?<\/el-form-item>)/g;
                // 替换字符串的正则表达式
                var lastRowReg = /([\s\S]*)<\/iv-row>/g;
                // 模版字符串
                var input_tpl =
                    '<el-form-item class="small-info-box" :label="<%=name%>" prop="<%=fieldName%>">\
                        <iv-input :value.sync="mainModel.vo.<%=fieldName%>" :textonly="mainModel.isReadOnly"></iv-input>\
                    </el-form-item>';
                var date_tpl =
                    '<el-form-item  :label="<%=name%>" prop="<%=fieldName%>" class="small-info-box" >\
                        <date-picker format="yyyy-MM-dd 00:00:00" v-if="!mainModel.isReadOnly" :selected-date.sync="mainModel.vo.<%=fieldName%>"></date-picker>\
                        <iv-input v-else :value.sync="mainModel.vo.<%=fieldName%>" textonly class="inp"></iv-input>\
                    </el-form-item>';
                var select_tpl =
                    '<el-form-item :label="<%=name%>" prop="<%=fieldName%>" class="small-info-box">\
                        <span v-if="mainModel.isReadOnly">{{mainModel.vo.<%=fieldName%>}}</span>\
                        <i-select :model.sync="mainModel.vo.<%=fieldName%>" :list="getDataDicList(\'<%=dataDicCode%>\')" v-else>\
                            <i-option v-for="s in getDataDicList(\'<%=dataDicCode%>\')" :value="s.id">{{s.value}}</i-option>\
                        </i-select>\
                    <el-form-item>';
                var textarea_tpl =
                    '<el-form-item class="small-info-box" :label="<%=name%>" prop="<%=fieldName%>">\
                        <iv-input type="textarea" :value.sync="mainModel.vo.<%=fieldName%>" :textonly="mainModel.isReadOnly"></iv-input>\
                    </el-form-item>';

                var html = '</iv-row>';

                // 获取<iv-row>
                var rows = template.match(rowReg);

                if (!rows || !rows.length) {
                    return;
                }
                if (data.length === 0) {
                    return;
                }

                // 获取最后一个<iv-row>的<el-form-item>
                var els = rows[rows.length - 1].match(elReg);

                function renderHtmlByType(data) {
                    var html = '';
                    switch (data.type) {
                        case 'input':
                            html = artTemplate.compile(input_tpl)(data);
                            break;
                        case 'date':
                            html = artTemplate.compile(date_tpl)(data);
                            break;
                        case 'select':
                            html = artTemplate.compile(select_tpl)(data);
                            break;
                        case 'textarea':
                            html = artTemplate.compile(textarea_tpl)(data);
                            break;
                    }
                    return html;
                }

                // <el-form-item>长度为4时直接添加<iv-row>
                if (els.length === 4) {
                    // 获取新增<iv-row>的个数
                    var rowLength = Math.floor(data.length / 4);
                    var remainder = data.length % 4;
                    if (remainder > 0) {
                        rowLength++;
                    }

                    for (i = 0; i < rowLength; i++) {
                        html += '<iv-row class="bip-content-item">';

                        for (j = 0; j < 4; j++) {
                            if ((i * 4 + j) === data.length) {
                                break;
                            }
                            html += renderHtmlByType(data[i * 4 + j])
                        }

                        html += '</iv-row>'
                    }
                }

                // 数据的长度 + <el-form-item>长度小于等于4时， 插入到最后一个<iv-row>
                else if (data.length + els.length <= 4) {
                    for (i = 0; i < data.length; i++) {
                        html += renderHtmlByType(data[i]);
                    }
                }

                // 数据的长度 + <el-form-item>长度大于4时， 一部分插入到最后一个<iv-row>，另一部分新建<iv-row>
                else {

                    var lengthDiff = 4 - els.length;
                    for (i = 0; i < lengthDiff; i++) {
                        html += renderHtmlByType(data[i]);
                    }
                    html += '</iv-row>'

                    var _data = data.slice(lengthDiff)
                    var rowLength = Math.floor(_data / 4);
                    var remainder = _data % 4;
                    if (remainder !== 0) {
                        rowLength++;
                    }
                    for (i = 0; i < rowLength; i++) {
                        html += '<iv-row class="bip-content-item">';

                        for (j = 0; j < 4; j++) {
                            if ((i * 4 + j) === _data.length) {
                                break;
                            }
                            html += renderHtmlByType(_data[i * 4 + j])
                        }

                        html += '</iv-row>'
                    }
                }

                // 替换html
                template = template.replace(lastRowReg, '$1' + html);
                return template;
            }
        }
    };

    _.extend(LIB, commonLIB, optsLIB, displayFieldSettingLIB
    );

    return LIB;
});

// 级联组件相关变量 公司 -》 部门 -》 属地 -》 检查对象
window.changeMarkObj = {
    hasCompChanged: false,
    hasDeptChanged: false,
    hasDominationAreaChanged: false
};



// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function (fmt) { //author: meizz 
    fmt = fmt || "yyyy-MM-dd";
    var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}




var isIE = function () {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true;
    }
    return false;
}
// 对HTML DOM的扩展
// IE 十以前的版本兼容 document element 的classList
if (isIE() || !("classList" in document.documentElement)) {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
        get: function () {
            var self = this;

            function update(fn) {
                return function (value) {
                    var classes = self.className.split(/\s+/g),
                        index = classes.indexOf(value);

                    fn(classes, index, value);
                    self.className = classes.join(" ");
                }
            }

            return {
                add: update(function (classes, index, value) {
                    if (!~index) classes.push(value);
                }),

                remove: update(function (classes, index) {
                    if (~index) classes.splice(index, 1);
                }),

                toggle: update(function (classes, index, value) {
                    if (~index)
                        classes.splice(index, 1);
                    else
                        classes.push(value);
                }),

                contains: function (value) {
                    return !!~self.className.split(/\s+/g).indexOf(value);
                },

                item: function (i) {
                    return self.className.split(/\s+/g)[i] || null;
                }
            };
        }
    });
    if (String.prototype.startsWith === undefined) {
        String.prototype.startsWith = function (str) { var reg = new RegExp("^" + str); return reg.test(this); }
    }
    //测试ok，直接使用str.endWith("abc")方式调用即可String.prototype.endWith=function(str){var reg=new RegExp(str+"$");return reg.test(this);} 
}

String.prototype.firstUpperCase = function () {
    return this.toString()[0].toUpperCase() + this.toString().slice(1);
};
// 下拉树形组件的默认展开层级数
DEFAULT_OPEN_LAYER = 2;
