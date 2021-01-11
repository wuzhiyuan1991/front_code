define(function (require) {

    var LIB = require('lib');
    var template = require("text!./checkItem.html");
    var api = require("../vuex/api");

    var defaultModel = {
        ischeckAll:false,
        clickItem:0,
        bizTypeSc1:null,
        mainModel: {
            title: '选择巡检项',
            columns: [
               
                {
                    title: "分组名",
                    fieldName: "groupName",
                    width:200,
                    'renderClass': "textarea",
                    fixed:true
                },
                {
                    title: "检查项内容",
                    fieldName: "name",
                    'renderClass': "textarea txt-left",
                  
                    tipRender:function (data) {
                        return data.name;
                    },
                },
                {
                    title: "检查对象名称",
                    fieldName: "checkObjName",
                    'renderClass': "textarea",
                    visible :true,
                    width:200
                },
                {
                    title: "检查标准",
                    fieldName: "checkStd",
                    visible :true,
                    'renderClass': "textarea",
                },
                {
                    title: "",
                    fieldName: "id",
                    fieldType: "cb",
                },
            ],
            filterColumn: ["criteria.strValue.name"],
            selectedDatas: [],
            defaultFilterValue: '',
            data: []
        },
    };

    var opts = {
        template: template,
        components: {

        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            type:{
                type: String,
                default:null,
            },
            checkTableId: {
                type: String,
                default: ''
            },
        },
        computed: {
            groupName:function () {
                var data = []
                _.each(this.mainModel.data,function (params) {
                  if (data.indexOf(params.groupName)==-1) {
                    data.push(params.groupName)
                  }
                      
                })
                return data
            },
            tableData:function () {
                var data = {}
                _.each(this.mainModel.data,function (params) {
                  if (Object.keys( data).indexOf(params.groupName)==-1) {
                    data[params.groupName]= []}
                   
                    data[params.groupName].push(params)
                      
                })
                return data
            },
            selectData:function () {
                var data = {}
                _.each(this.mainModel.data,function (params) {
                  if (Object.keys( data).indexOf(params.groupName)==-1) {
                    data[params.groupName]= {selectedDatas:[]}}
                })
                return data
            },
        },
        data: function () {
            return defaultModel;
        },
        watch: {
            ischeckAll:function(nVal){
                var that =this
                if (nVal) {
                    
                    _.each(that.$children[0].$children,function(child){
                        
                        if (child.setAllCheckBoxValues) {
                            child.setAllCheckBoxValues(true)
                        }
                        
                        
                    });
                    that.mainModel.selectedDatas=[]
                    _.each( Object.keys(this.selectData),function (item) {
                        that.selectData[item].selectedDatas= that.tableData[item]
                        that.mainModel.selectedDatas= that.mainModel.selectedDatas.concat( that.selectData[item].selectedDatas)
                         
                      }) 
                }else{
                    _.each(that.$children[0].$children,function(child){
                        
                        if (child.setAllCheckBoxValues) {
                            child.setAllCheckBoxValues(false)
                        }
                        
                        
                    });
                    that.mainModel.selectedDatas=[]
                    _.each( Object.keys(this.selectData),function (item) {
                       that.selectData[item].selectedDatas=[]
                         
                      }) 
                }

            },
            visible: function (nVal) {
                if (nVal) {
                    this.init();
                } else {
                    this.reset();
                }
            },
        },
        methods: {
            selModual:function (item) {
               this.clickItem= this.groupName.indexOf(item)
                
                        var that =this
                        
                        var height = 0
                      $('#selectScroll .rip-item-sub').each(function (index,item) {
                          if (that.clickItem>index) {
                           height+= $(item).height()+10
                          }else{
                              return false
                          }
                        
                        
                      })
                      
                       
                  $('#selectScroll').scrollTop(height)     
                    
                        
                    
                
            },
            doQueryTable: function () {
                var _this = this;
                _this.mainModel.data = [];
                if(this.checkTableId){
                    api.getCheckTableAllItems({id: this.checkTableId}).then(function (res) {
                        this.bizTypeSc1=res.data.bizTypeSc1
                        _.each(res.data.tirList,function (item) {
                            _.each(item.itemList,function (it) {
                                it.groupName = item.groupName;
                                _this.mainModel.data.push(it);
                            })
                        })
                        var columns = _this.mainModel.columns;
               
               
                        if (_this.bizTypeSc1 == null || _this.bizTypeSc1 == 'isp_simple') {
                            
                            _.each(columns, function (item) {
                                if (item.fieldName == 'checkObjName' || item.fieldName == 'checkStd') {
                                    item.visible = false;
                                }
                                if (item.fieldName == 'name' || item.fieldType == 'sequence') {
                                    item.visible = true;
                                }
                            });
                        } else {//巡检模式
                            _this.isShowEquipInspection = true;
                                _.each(columns, function (item) {
                                if (item.fieldName == 'checkObjName' || item.fieldName == 'checkStd') {
                                    item.visible = true;
                                }
                                if (item.fieldName == 'name' || item.fieldType == 'sequence') {
                                    item.visible = false;
                                }
                            });
                        }
                      
                       
                       

                    })
                    
                }
            },
         
            doSave: function () {
                var that =this
                that.mainModel.selectedDatas=[]
              _.each( Object.keys(this.selectData),function (item) {
                 
                that.mainModel.selectedDatas= that.mainModel.selectedDatas.concat( that.selectData[item].selectedDatas)
                 
              }) 
                if (this.mainModel.selectedDatas.length === 0) {
                    return LIB.Msg.warning("请选择检查项");
                }
               
                
                this.$emit("do-save", this.mainModel.selectedDatas);
            },
            doClose: function () {
                this.visible = false;
            },
            reset: function () {
                this.mainModel.data=[]
                this.ischeckAll=false
            },
            
            init: function () {
                this.doQueryTable();
            }
        },
        ready: function () {
            var that= this
            $('#selectScroll').on('scroll',_.debounce( function () {
                var $that =$(this)
                var height =0
                $('#selectScroll .rip-item-sub').each(function (index,item) {
                    height+= $(item).height()+10
                    if ($that.scrollTop()<400) {
                        that.clickItem=0
                        $('#scrollLeft').scrollTop(0)
                        return false
                    }
                    if ($that.scrollTop()< height+200) {
                        that.clickItem=index+1
                        $('#scrollLeft').scrollTop((index+1)*40)
                        return false
                    }
                  
                  
                })
                
                
              
            },500))
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});