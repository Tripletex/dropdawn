!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():e.Dropdawn=t()}(this,function(){"use strict";var e=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function i(e){var t=["dropdown__label",e.value?"dropdown__label--float-above":""].join(" "),n="dropdown__button"+(e.expanded?" dropdown__button--focus":"")+(e.readonly?" dropdown__button--readonly":""),o=e.hideLabelWhenSelected&&e.value;return React.createElement("button",{className:n,onClick:e.onClick,onKeyDown:e.onKeyDown,role:"combobox","aria-expanded":e.expanded,disabled:e.disabled,readonly:e.readonly,type:"button"},React.createElement("div",{className:"dropdown__button--text-wrapper"},o?null:React.createElement("div",{className:t},e.label),React.createElement("div",{className:"dropdown__selected-text"},e.value)),e.readonly?null:React.createElement("i",{className:"material-icons dropdown__button--icon"},"arrow_drop_down"))}var s=function(i){function s(e){t(this,s);var o=n(this,(s.__proto__||Object.getPrototypeOf(s)).call(this,e));return o.state={highlighted:o.props.selected||o.props.options[0],searchValue:o.props.query,hasRendered:!1},o.onKeyDown=o.onKeyDown.bind(o),o.handleChange=o.handleChange.bind(o),o}return o(s,React.Component),e(s,[{key:"handleChange",value:function(e){this.setState({searchValue:e.target.value}),this.props.updateSearch(e.target.value,!1)}},{key:"placeDropdown",value:function(){if(!this.dropdown)return{};var e=this.props.button.getBoundingClientRect(),t=this.dropdown.getBoundingClientRect(),n=window.innerHeight;return e.top+e.height+t.height>n?{bottom:0}:{top:e.top+e.height+"px"}}},{key:"onKeyDown",value:function(e){var t=this,n=function(e){var n=t.props.options.indexOf(t.state.highlighted)+e;console.log("change highlighted"+n),n<0||n>=t.props.options.length||t.setState({highlighted:t.props.options[n]},t.scrollToHighlighted.bind(t,!1))};switch(e.which||e.keyCode){case 40:n(1);break;case 38:n(-1);break;case 13:if(0===this.props.options.length)return e.preventDefault(),e.stopPropagation,!1;this.props.selectOption(this.state.highlighted),e.preventDefault();break;case 27:this.props.selectOption(this.props.selected);break;case 9:return e.preventDefault(),e.stopPropagation,!1}}},{key:"scrollToHighlighted",value:function(e){var t=this.theList.querySelector(".highlighted");null!==t&&t.scrollIntoView({behavior:e?"instant":"smooth",block:"nearest",inline:"nearest"})}},{key:"componentDidMount",value:function(){window.addEventListener("keydown",this.onKeyDown);var e=this.search;e&&(e.focus(),e.selectionStart=e.selectionEnd=e.value.length,this.setState({hasRendered:!0}),this.scrollToHighlighted(!0))}},{key:"componentWillUnmount",value:function(){window.removeEventListener("keydown",this.onKeyDown)}},{key:"createNew",value:function(){var e=this;this.props.createNew(function(t){return e.props.selectOption(t)})}},{key:"render",value:function(){var e=this;return this.props.options.length>0&&!this.props.options.some(function(t){return t.value===e.state.highlighted.value})&&this.setState(function(t){return{highlighted:e.props.options[0]}}),React.createElement("div",{ref:function(t){return e.dropdown=t},style:this.placeDropdown(),className:"dropdown__dropdown-container"},this.props.hideSearch?null:React.createElement("div",{className:"dropdown__searchBox--container"},React.createElement("input",{className:"dropdown__searchBox--input",ref:function(t){return e.search=t},onChange:this.handleChange,name:"searchbox",value:this.state.searchValue}),React.createElement("i",{className:"material-icons dropdown__searchBox--icon"},"search"),this.props.createNew?React.createElement("button",{onClick:function(t){return e.createNew()},className:"dropdown__searchBox--addNew"},React.createElement("i",{className:"material-icons"},"add")):null),React.createElement("div",{className:"dropdown__options--container"},React.createElement("ul",{ref:function(t){return e.theList=t},className:"dropdown__options",role:"listbox"},this.props.options.map(function(t,n){var o=["dropdown__options--list-item",e.state.highlighted.value===t.value?" highlighted":""].join(" ");return React.createElement("li",{key:t.value,role:"option",onClick:function(n){return e.props.selectOption(t)},className:o},t.content)}))))}}]),s}();return function(r){function a(e){t(this,a);var o=n(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,e));return o.state={selected:e.selected||null,open:!1,options:o.getOptions(),query:""},o.clickOutsideOfWidget=o.clickOutsideOfWidget.bind(o),o.onButtonKeyDown=o.onButtonKeyDown.bind(o),o.selectOption=o.selectOption.bind(o),o.updateSearch=o.updateSearch.bind(o),o}return o(a,React.Component),e(a,[{key:"getOptions",value:function(){var e=(this.props.options||[]).slice(0);return this.props.removeSelectedText&&e.unshift({content:this.props.removeSelectedText}),e}},{key:"updateSearch",value:function(e){var t=this;this.props.onInput?this.props.onInput(e):this.props.apiCall?this.props.apiCall(e).then(function(e){return t.setState({options:e})}):this.setState({options:this.getOptions().filter(function(t){return-1!==(t.displayName||t.content).toLowerCase().indexOf(e.toLowerCase())})})}},{key:"selectOption",value:function(e){this.setState({selected:void 0===e.value?null:e}),this.props.onChange&&this.props.onChange(e),this.close()}},{key:"clickOutsideOfWidget",value:function(e){this.root&&(this.root.querySelector(".dropdown__dropdown-container")&&(function e(t,n){return t===n||!!n&&e(t,n.parentElement)}(this.root,e.target)||this.close()))}},{key:"onButtonKeyDown",value:function(e){if(!this.state.open&&!(e.shiftkey||e.ctrlKey||e.altKey)){var t=e.which||e.keyCode;if(console.log((e.which||e.keyCode)+e.key),[40,38,32,13].some(function(e){return e===t}))this.state.open||(e.stopPropagation(),e.preventDefault(),this.open());else if(/\w/.test(e.key)&&1===e.key.length){if(t<=46||91===t)return;e.stopPropagation(),e.preventDefault(),this.open(),this.setState({query:e.key})}}}},{key:"getButtonContent",value:function(){return null===this.state.selected||void 0===this.state.selected.value?null:this.state.selected.displayName||this.state.selected.content}},{key:"cleanUp",value:function(){window.removeEventListener("click",this.clickOutsideOfWidget),window.removeEventListener("focus",this.clickOutsideOfWidget),document.body.classList.remove("dropdown__prevent-scroll")}},{key:"open",value:function(){this.state.open||this.props.readonly||(this.setState({open:!0}),window.addEventListener("click",this.clickOutsideOfWidget),window.addEventListener("focus",this.clickOutsideOfWidget,!0),document.body.classList.add("dropdown__prevent-scroll"))}},{key:"componentWillReceiveProps",value:function(e){this.props.selected&&this.props.selected.value===e.selected.value||this.setState({selected:e.selected})}},{key:"close",value:function(){this.state.open&&(this.setState({open:!1,options:this.getOptions(),query:""}),this.cleanUp(),this.root.querySelector("button").focus())}},{key:"componentWillUnmount",value:function(){this.cleanUp()}},{key:"render",value:function(){var e=this;return React.createElement("div",{ref:function(t){return e.root=t},className:"dropdown--wrapper "+this.props.className,onkeydown:function(e){return console.log("keydown")}},React.createElement("input",{type:"hidden",name:this.props.name,value:null!==this.state.selected?this.state.selected.value:""}),React.createElement(i,{value:this.getButtonContent(),label:this.props.label,hideLabelWhenSelected:this.props.hideLabelWhenSelected,onClick:function(t){return e.state.open?e.close():e.open()},expanded:this.state.open,onKeyDown:this.onButtonKeyDown,disabled:this.props.disabled,removeSelectedText:this.props.removeSelectedText,readonly:this.props.readonly}),this.state.open?React.createElement(s,{button:this.root,query:this.state.query,updateSearch:this.updateSearch,selectOption:this.selectOption,hideSearch:this.props.hideSearch,selected:this.state.selected,createNew:this.props.createNew,options:this.state.options}):null,this.state.selected&&this.props.viewLink?React.createElement("div",{className:"dropdown---helper-text"},React.createElement("a",{href:this.props.viewLink(this.state.selected),target:"_blank"},this.props.viewLinkText||this.getButtonContent())):null)}}]),a}()});
//# sourceMappingURL=dropdawn-1.0.0.js.map
