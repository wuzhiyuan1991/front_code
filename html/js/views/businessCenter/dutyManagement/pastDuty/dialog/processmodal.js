define(function (require) {

    var LIB = require('lib');
    var tpl = require("text!./processmodal.html");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var multiInputSelect = require("componentsEx/multiInputSelector/main");
    var processModal = require('./recordSelectModal')
    var api = require("../vuex/api");
    require('../editor/graphEditor')
    require('../editor/popper')
    var newVO = function () {
        return {
            id: null,
            //编码
            code: null,
            //禁用标识 0未禁用，1已禁用
            disable: "0",
            //公司id
            compId: null,
            //部门id
            orgId: null,
            //工作内容
            content: JSON.stringify({lines:[],nodes:[]}),
            //备注
            remark: null,
            //状态 0:待完成,1:已完成
            img:null,
            recordId: null
        }
    };
    var initDataModel = function () {
        return {
            imageSrc: null,
            mainModel: {
                vo: newVO(),
                title: "编辑",

            },
            userSelectModel: {
                show: false,
            },
            rules: {
                "code": [LIB.formRuleMgr.length(100)],
                "disable": LIB.formRuleMgr.require("状态"),
                "compId": [LIB.formRuleMgr.require("公司")],
                "orgId": [LIB.formRuleMgr.length(10)],
                "content": [LIB.formRuleMgr.length(65535)],
                "remark": [LIB.formRuleMgr.length(500)],
                "status": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
            },
            schemeUpModel:{
                params: {
                    recordId:"",// this.permitModel.id,
                    dataType: 'DUTY01', //检查方法数据来源标识(参考资料)
                    fileType: 'I',
                },
                filters: {
                    max_file_size: '10mb',
                    // mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt,mp4,avi,flv,3gp" }]
                    mime_types: [{ title: "files", extensions: "png,jpg,jpeg" }]
                },
                events: {
                    onSuccessUpload:true,
                }
            },
            processModel:{
                show: false,
                data: {id:null, name:null}
            },
            inFile: null,
            oldContent: null
        };
    }

    var opts = {
        template: tpl,
        data: function () {
            var data = initDataModel();
            return data;
        },
        components: {
            "userSelectModal": userSelectModal,
            'multiInputSelect': multiInputSelect,
            "processModal" : processModal
        },
        watch: {
            // visible: function (val) {
            //     if (val) {
            //         this.initData()
            //     }
            // }
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            orgId: {
                type:String,
                default: null
            }

        },
        computed: {
            filterData: function () {
                if(this.mainModel.vo.id){
                    return {
                        orgId: this.orgId,
                        "criteria.strsValue.excludedIds": [this.mainModel.vo.id]
                    }
                }else{
                    return { orgId: this.orgId}
                }

            }
        },
        ready: function () {
            this.initData({lines:[],nodes:[]})
        },
        // 46===t.keyCode&&this.selectedElement&&(t.preventDefault(),o.default.deleteEle.call(this)),90===t.keyCode&&t.ctrlKey&&(t.preventDefault(),o.default.undo.call(this)),89===t.keyCode&&t.ctrlKey&&(t.preventDefault(),o.default.redo.call(this)),83===t.keyCode&&t.ctrlKey&&(t.preventDefault(),o.default.save.call(this))
        methods: {
            doClearSelect: function () {
                this.refreshData(JSON.parse(this.mainModel.vo.content));
            },
            doSelectModal: function (data) {
                // this.mainModel.vo.content = data[0].content;
                this.processModel.data = data[0];
                this.refreshData(JSON.parse(this.processModel.data.content));
            },
            refreshData: function (data) {
                //刷新数据
                var editor = this.editor;
                var canvas =  editor.canvas;
                var ctx =canvas.getContext("2d");
                ctx.clearRect(0,0,canvas.width,canvas.height);
                editor.load(data);
            },
            init: function (data) {
                this.processModel = {
                    show: false,
                    data: {id:null, name:null}
                };

                this.mainModel.vo = newVO();
                if(data){
                    // _.extend(this.mainModel.vo, data);
                    this.mainModel.vo = _.clone(data);
                }else{
                }
                this.refreshData(JSON.parse(this.mainModel.vo.content));
            },
            doSave: function (ctx, data) {
                var _this = this;
                var code = ctx.toDataURL("image/png");
                var codeList = code.split(',')
                _this.mainModel.vo.img = codeList[1];
                _this.mainModel.vo.content = data;

                return ;
                // 下面掉 系统上传流程
                upload(code);
                //将base64转换为blob
                function dataURLtoFile(dataURI, type) {
                    var binary = atob(dataURI.split(',')[1]);
                    var array = [];
                    for(var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return new Blob([new Uint8Array(array)], {type:type });
                }
                function convertBase64UrlToBlob(urlData) {
                    var bytes = atob(urlData.split(',')[1]); //去掉url的头，并转换为byte
                    //处理异常,将ascii码小于0的转换为大于0
                    var ab = new ArrayBuffer(bytes.length);
                    var ia = new Uint8Array(ab);
                    for(var i = 0; i < bytes.length; i++) {
                        ia[i] = bytes.charCodeAt(i);
                    }
                    return new Blob([ab], { type: 'image/png' });
                }
                function upload(code){
                    var form= document.getElementById('submitForm');
                    var formData = new FormData(form);   //这里连带form里的其他参数也一起提交了,如果不需要提交其他参数可以直接FormData无参数的构造函数
                    _this.imageSrc = convertBase64UrlToBlob(code)
                    var file = new File([_this.imageSrc], "神奇的动物.png")
                    formData.append("file",file);  //append函数的第一个参数是后台获取数据的参数名,和html标签的input的name属性功能相同
                    //如果想base64转file后，给file命名，以一个固定的文件名上传，则可以使用
                    //var formData = new FormData(form);   //这里连带form里的其他参数也一起提交了,如果不需要提交其他参数可以直接FormData无参数的构造函数
                    //formData.append("file1",convertBase64UrlToBlob(frontFile.replace(/^data:image\/(png|jpg);base64,/,"")),"file1.png");  //append函数的第一个参数是后台获取数据的参数名,和html标签的input的name属性功能相同
                    $.ajax({
                        url : '/file/upload',
                        type : "POST",
                        data : formData,
                        dataType:"json",
                        headers:{ accept:'*/*' },
                        processData : false, // 告诉jQuery不要去处理发送的数据
                        contentType : false, // 告诉jQuery不要去设置Content-Type请求头
                        success:function(data){
                        }
                    }); }
            },
            doSaveClose: function () {
                var _this = this;
                this.visible = false;
                document.getElementById('saveBtn').click();

                setTimeout(function () {
                    _this.$emit('do-save', _this.mainModel.vo);
                },300)
            },
            initData: function (data) {
                var _this = this;
                // const data = {};
                // //节点格式
                // //创建编辑器
                // data.nodes = [
                //     { "id": "582ca57c-78dd-4edf-b6bd-6bc4dae5bd4c", "type": "node", "shape": "capsule", "index": 1, "x": 129, "y": 148, "size": "80*40", "label": "开始", "fontSize": "14px", "color": "rgba(200,255,200,1)", "edgeColor": "rgb(10,255,10,1)", "customProperties": {}, "isNode": true, "isLine": false },
                //     { "id": "f423093a-cec6-433e-8b53-feb6ff3adac0", "type": "node", "shape": "rect", "index": 3, "x": 292, "y": 148, "size": "80*40", "label": "常规节点", "fontSize": "14px", "color": "#E6F7FF", "edgeColor": "#1890FF", "customProperties": {}, "isNode": true, "isLine": false },
                //     { "id": "050e931f-f1f0-42d8-8ef0-795ef17c794e", "type": "node", "shape": "rhomb", "index": 5, "x": 444, "y": 148, "size": "80*40", "label": "判断", "fontSize": "14px", "color": "#E6FFFB", "edgeColor": "#5CDBD3", "customProperties": {}, "isNode": true, "isLine": false },
                //     { "id": "4027ea1e-df35-450d-b59a-d03626a453ca", "type": "node", "shape": "capsule", "index": 7, "x": 292, "y": 58, "size": "80*40", "label": "结束", "fontSize": "14px", "color": "rgba(255,200,200,1)", "edgeColor": "rgb(255,50,50,1)", "customProperties": {}, "isNode": true, "isLine": false }]
                //
                // data.lines = [{ "id": "0ca6e08f-b39e-48e9-bb16-a5cd834cb7bc", "type": "line", "index": 8, "source": "582ca57c-78dd-4edf-b6bd-6bc4dae5bd4c", "fromConOrder": 2, "target": "f423093a-cec6-433e-8b53-feb6ff3adac0", "toConOrder": 4, "inflexionPoint": null, "label": null, "fontSize": "12px", "color": "rgb(0, 0, 0, 1)", "startPoint": null, "endPoint": null, "customProperties": {}, "isNode": false, "isLine": true },
                // { "id": "41f89abd-869f-47ef-a2cb-5fa71d0891c0", "type": "line", "index": 9, "source": "f423093a-cec6-433e-8b53-feb6ff3adac0", "fromConOrder": 2, "target": "050e931f-f1f0-42d8-8ef0-795ef17c794e", "toConOrder": 4, "inflexionPoint": null, "label": null, "fontSize": "12px", "color": "rgb(0, 0, 0, 1)", "startPoint": null, "endPoint": null, "customProperties": {}, "isNode": false, "isLine": true },
                // { "id": "7c8bcd57-938a-4c02-beb1-7678b7caefe1", "type": "line", "index": 10, "source": "050e931f-f1f0-42d8-8ef0-795ef17c794e", "fromConOrder": 3, "target": "4027ea1e-df35-450d-b59a-d03626a453ca", "toConOrder": 2, "inflexionPoint": [{ "x": 444, "y": 193 }, { "x": 379, "y": 193 }, { "x": 379, "y": 58 }], "label": "111", "fontSize": "12px", "color": "rgb(0, 0, 0, 1)", "startPoint": null, "endPoint": null, "customProperties": {}, "isNode": false, "isLine": true }]


                var editor = new GraphEditor();
                this.editor = editor;
                //编辑器加载数据

                editor.canvas.width = 860
                editor.canvas.height = 350
                editor.load(data);
                window.removeEventListener("keydown", function () {

                })

                //绑定元素容器
                editor.itemPannel = 'itempannel';
                //绑定详细属性栏
                editor.detailPannel = 'detailpannel';
                //绑定工具栏
                editor.toolbar = 'toolbar';
                const nodeDetail = $('#nodedetail');
                const lineDetail = $('#linedetail');
                const nodeName = $('#nodename');
                const lineName = $('#linename');
                const nodeCustom = $('#nodecustom');
                const lineCustom = $('#linecustom');
                const nodeFontSize = $('#fontsize_node');
                const lineFontSize = $('#fontsize_line');

                //选择元素事件
                editor.on('selectedElement', function (e) {
                    if (e.element.isNode) {
                        // lineDetail.hide();
                        // nodeDetail.show();
                        nodeName.val(e.element.label);
                        nodeFontSize.val(e.element.fontSize);
                        nodeCustom.val(e.element.customProperties.nodestyle);
                    } else if (e.element.isLine) {
                        // nodeDetail.hide();
                        // lineDetail.show();
                        lineName.val(e.element.label);
                        lineFontSize.val(e.element.fontSize);
                        lineCustom.val(e.element.customProperties.btnstyle);
                    }
                });

                editor.on('click', function (e) {
                    if (!e.element) {
                        // nodeDetail.hide();
                        // lineDetail.hide();
                    }
                });
                //撤销事件
                editor.on('undo', function (e) {
                    // nodeDetail.hide();
                    // lineDetail.hide();
                });
                //重做事件
                editor.on('redo', function (e) {
                    // nodeDetail.hide();
                    // lineDetail.hide();
                    // console.log(e.data);
                });
                editor.on('delete', function (e) {
                    // nodeDetail.hide();
                    // lineDetail.hide();
                    // console.log(e);
                });
                //保存事件

                editor.on('save', function (e) {
                    // LIB.Msg.info("保存成功");

                    _this.doSave(editor.canvas,JSON.stringify(e.data))
                });

                nodeName.change(function (e) {
                    updateEditor(e, 'label');
                });

                lineName.change(function (e) {
                    updateEditor(e, 'label');
                });

                nodeFontSize.change(function (e) {
                    updateEditor(e, 'fontSize');
                });

                lineFontSize.change(function (e) {
                    updateEditor(e, 'fontSize');
                });

                nodeCustom.change(function (e) {
                    updateEditor(e, 'nodestyle');
                });

                lineCustom.change(function (e) {
                    updateEditor(e, 'btnstyle');
                });

                function updateEditor(e, name) {
                    const property = {};
                    property.name = name;
                    property.value = $('#' + e.target.id).val();
                    if (editor.selectedElement) {
                        editor.update(editor.selectedElement.id, property);
                    };
                }
            },
            doShowSelectUserModal: function (item) {
                this.handlingRole = item;
                this.userSelectModel.show = true;
            },

        }
    };

    var component = LIB.Vue.extend(opts);
    return component;

});