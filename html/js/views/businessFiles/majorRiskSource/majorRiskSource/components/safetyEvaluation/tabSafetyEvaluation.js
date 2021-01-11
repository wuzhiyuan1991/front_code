define(function (require) {
    var Vue = require("vue");
    var LIB = require("lib");
    var template = require("text!./tabSafetyEvaluation.html");
    var dialogForm = require("../dialog/modalFormSafetyEvalution");
    var model = require("../../model");
    var api = require("../../vuex/api");
    return Vue.extend({
        template: template,
        components: {
            dialogForm: dialogForm,
        },
        props: {
            data: Object,
            model: Object,
        },
        data: function () {
            var _this=this;
            return {
                tableModel: {
                    info: LIB.Opts.extendDetailTableOpt({
                        columns: [{
                            title: "序号",
                            fieldType: "sequence",
                                width: 70,
                            },
                            {
                                title: "评价时间",
                                fieldName: "evaluateDate",
                                fieldType: "custom",
                                width:120,
                                render:function (data) {
                                    return  '<div style="color: #33a6ff;cursor: pointer;">$content</div>'
                                        .replace('$content',data.evaluateDate?data.evaluateDate.substr(0,10):'');
                                }
                            },
                            {
                                title: "评价原因",
                                fieldName: "evaluateUnit",
                                render:function (data) {
                                    return  model.enum.evaluateReason[data.evaluateReason];
                                }
                            },
                            {
                                title: "安全评价单位",
                                fieldName: "evaluateUnit",
                            },
                            {
                                title: "评价报告书编号",
                                fieldName: "reportNumber",
                                width:150,
                            },
                            {
                                title: "编制日期",
                                fieldName: "compileDate",
                                fieldType: "custom",
                                width:120,
                                render:function (data) {
                                    return  data.compileDate?data.compileDate.substr(0,10):'';
                                }
                            },
                            {
                                title: "安全评价报告",
                                fieldName: "files",
                                fileType:"custom",
                                showTip:false,
                                render:function (data) {
                                    var link='<p class="line-wrap"><a target="_blank" href="$url" >$name</a></p>';
                                    var links=[];
                                    if(!data.files||data.files.length===0){return ""};
                                    data.files.forEach(function (file) {
                                        links.push(link.replace('$url',LIB.convertFilePath(LIB.convertFileData(file))).replace('$name',file.orginalName))
                                    })
                                    return links.join('');
                                },
                                event: true,
                            },
                            {
                                title: "",
                                fieldType: "tool",
                                toolType: "edit,del"
                            }
                        ],
                        values: [],
                    }),
                },
            }
        },
        created: function () {
            var _this=this;
            // this.$nextTick(function () {
            //     _this.$refs.mainTable.pageModel.totalSize = _this.data.safetyEvaluation.length;
            //   //  this.data=JSON.parse(JSON.stringify(this.data));
            // })
        },
        methods: {
            downLoad:function(src){
                window.open(src);
            },
            doAdd: function (dataType) {
                debugger
                var _this=this;
                api.getUUID().then(function (res) {
                    var data=model.mrsSafetyEvaluation({
                        id:res.data,
                        majorRiskSource:_this.model,
                    })
                    _this.$refs.dialogForm.init(dataType,"add",data,_this.model.name)
                })
            },
            doEdit: function (item) {
                var data = JSON.parse(JSON.stringify(item.entry.data));
                this.$refs.dialogForm.init('other',"edit", data);
            },
            doEditCommon: function (item) {
                var data = JSON.parse(JSON.stringify(item.entry.data));
                this.$refs.dialogForm.init('common',"edit", data);
            },
            doDel:function (item) {
                var _this=this;
                item=item.entry.data;
                LIB.Modal.confirm({
                    title: '是否确认删除?',
                    onOk: function() {
                        api.removeMrsSafetyEvaluations({id:_this.model.id},[{id:item.id}]).then(function () {
                            LIB.Msg.success("删除成功");
                            _this.saveAfter();
                        })
                    }
                });
            },
            doClickCellOther:function(pms){
                this.doClickCell(pms,"other");
            },
            doClickCellCommon:function(pms){
                this.doClickCell(pms,"common");
            },
            doClickCell:function(pms,type){
                //event,entry,cell
                      if(pms.cell.fieldName==="evaluateDate"){
                        this.$refs.dialogForm.init(type,"view",pms.entry.data)
                      }  
                      pms.event.stopPropagation();
                      //pms.event.preventDefault();
            },
            saveAfter: function () {
                this.$parent.$parent.loadSafetyEvaluation();
                this.$parent.$parent.loadSafetyEvaluationCommon();
            },
            
        },
    })
})