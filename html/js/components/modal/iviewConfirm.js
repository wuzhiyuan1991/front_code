define(function(require) {	

	var Vue = require("vue");
	var Button = require("../iviewButton");
	var Icon = require("../iviewIcon");
    var assist = require("../utils/assist");
	var Modal = require("./iviewModal");

	
	var prefixCls = 'ivu-modal-confirm';


//	Modal.newInstance = properties => {
	return function(properties) {
	    var _props = properties || {};

	    var props = '';
//	    (0, _keys2.default)(_props).forEach(function (prop) {
//	        props += ' :' + (0, _assist.camelcaseToHyphen)(prop) + '=' + prop;
//	    });
		for(var prop in _props) {
	        props += ' :' + assist.camelcaseToHyphen(prop) + '=' + prop;
		}

	    var div = document.createElement('div');
	    div.innerHTML = '\n        <Modal' + props + ' :visible.sync="visible" :width="width">\n            <div class="' + prefixCls + '">\n                <div class="' + prefixCls + '-head">\n                    <div :class="iconTypeCls"><i :class="iconNameCls"></i></div>\n                    <div class="' + prefixCls + '-head-title">{{{ title }}}</div>\n                </div>\n                <div class="' + prefixCls + '-body">\n                    {{{ body }}}\n                </div>\n                <div class="' + prefixCls + '-footer">\n                    <vi-Button type="ghost" size="large" v-if="showCancel" @click="cancel">{{ cancelText }}</vi-Button>\n                    <vi-Button type="primary" size="large" :loading="buttonLoading" @click="ok">{{ okText }}</vi-Button>\n                </div>\n            </div>\n        </Modal>\n    ';
	    document.body.appendChild(div);

	    var modal = new Vue({
	        el: div,
	        components: { Modal:Modal, Button:Button, Icon:Icon},
	        data: _.extend(_props, {
	            visible: false,
	            width: 416,
	            title: '',
	            body: '',
	            iconType: '',
	            iconName: '',
	            okText: '确定',
	            cancelText: '取消',
	            showCancel: false,
	            loading: false,
	            buttonLoading: false
	        }),
	        computed: {
	            iconTypeCls: function iconTypeCls() {
	                return [prefixCls + '-head-icon', prefixCls + '-head-icon-' + this.iconType];
	            },
	            iconNameCls: function iconNameCls() {
	                return ['ivu-icon', 'ivu-icon-' + this.iconName];
	            }
	        },
	        methods: {
	            cancel: function cancel() {
	                this.visible = false;
	                this.buttonLoading = false;
	                this.onCancel();
	                this.remove();
	            },
	            ok: function ok() {
	                if (this.loading) {
	                    this.buttonLoading = true;
	                } else {
	                    this.visible = false;
	                    this.remove();
	                }
	                this.onOk();
	            },
	            remove: function remove() {
	                var _this = this;

	                setTimeout(function () {
	                    _this.destroy();
	                }, 300);
	            },
	            destroy: function destroy() {
	                this.$destroy();
	                document.body.removeChild(div);
	                this.onRemove();
	            },
	            onOk: function onOk() {},
	            onCancel: function onCancel() {},
	            onRemove: function onRemove() {}
	        }
	    }).$children[0];

	    return {
	        show: function show(props) {
	            modal.$parent.showCancel = props.showCancel;
	            modal.$parent.iconType = props.icon;

	            switch (props.icon) {
	                case 'info':
	                    modal.$parent.iconName = 'information-circled';
	                    break;
	                case 'success':
	                    modal.$parent.iconName = 'checkmark-circled';
	                    break;
	                case 'warning':
	                    modal.$parent.iconName = 'android-alert';
	                    break;
	                case 'error':
	                    modal.$parent.iconName = 'close-circled';
	                    break;
	                case 'confirm':
	                    modal.$parent.iconName = 'help-circled';
	                    break;
	            }

	            if ('width' in props) {
	                modal.$parent.width = props.width;
	            }

	            if ('title' in props) {
	                modal.$parent.title = props.title;
	            }

	            if ('content' in props) {
	                modal.$parent.body = props.content;
	            }

	            if ('okText' in props) {
	                modal.$parent.okText = props.okText;
	            }

	            if ('cancelText' in props) {
	                modal.$parent.cancelText = props.cancelText;
	            }

	            if ('onCancel' in props) {
	                modal.$parent.onCancel = props.onCancel;
	            }

	            if ('onOk' in props) {
	                modal.$parent.onOk = props.onOk;
	            }

	            // async for ok
	            if ('loading' in props) {
	                modal.$parent.loading = props.loading;
	            }

	            // notice when component destroy
	            modal.$parent.onRemove = props.onRemove;

	            modal.visible = true;
	        },
	        remove: function remove() {
	            modal.visible = false;
	            modal.$parent.buttonLoading = false;
	            modal.$parent.remove();
	        },

	        component: modal
	    };
	};
    
});