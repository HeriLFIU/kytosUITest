<template>
  <div class='k-toolbar' >
    <!-- Replaced the v-binded is (:is='') for an exact component to test loading-->
   <component v-show="active == (index+1)"
              v-for="(component, index) in inner_components"
              is='test'
              v-bind:key="component.name">
   </component>
  </div>
 </template>
 
 <script type="module">
 import { defineAsyncComponent } from 'vue'
 import { loadModule } from 'https://cdn.jsdelivr.net/npm/vue3-sfc-loader@0.9.5/dist/vue3-sfc-loader.esm.js'
 import * as Vue from 'https://unpkg.com/vue@3/dist/vue.runtime.esm-browser.prod.js'
 
 const options = {
 
   moduleCache: {
     vue: Vue
   },

   pathResolve({ refPath, relPath }, options) {

    if ( relPath === '.' )
      return refPath;

    if ( relPath[0] !== '.' && relPath[0] !== '/' )
      return relPath;

    return String(new URL(relPath, refPath === undefined ? window.location : refPath));
   },

   handleModule: async function (type, getContentData, path, options) {

    switch (type) {
      case '.css':
        options.addStyle(await getContentData(false));
        return null;
      case '.kytos':
        console.log("Kytos extension detected. Switch extension to .vue");
        return null;
      default: return undefined; // let vue3-sfc-loader handle this
    }
   },

   async getFile(url) {
 
     const res = await fetch(url);
     if ( !res.ok )
        throw Object.assign(new Error(url+' '+res.statusText), { res });
     return await {type: '.vue', getContentData: ()=>res.text()};
   },
 
   addStyle(textContent) {
 
     const style = Object.assign(document.createElement('style'), { textContent });
     const ref = document.head.getElementsByTagName('style')[0] || null;
     document.head.insertBefore(style, ref);
   },

   log(type, ...args) {
     
     console.log("vue3-sfc-loader log:");
     console[type](...args);
   }
 
 }
 
 export default {
   name: 'k-toolbar',
   props: ["active", "compacted", "components"],
   data () {
     return {
      url: this.$kytos_server+ 'ui/k-toolbar',
      template: null,
      inner_components: this.components || [] ,
     }
   },
   render: function(createElement){
     if (this.template) return this.template();
   },
   created() {
       var self = this
       console.log("test")
       this.$kytos.component('test', defineAsyncComponent( () => loadModule("http://localhost:8181/ui/kytos/maintenance/k-toolbar/main.kytos", options) ))
       $.get({
         url: this.url,
         datatype: 'json',
         async: true,
         cache: false,
         success: function(data) {
           // Test: disabled vue3-sfc-loader
           //self.inner_components = self.inner_components.concat(data);
         }
       }).always(function(){
           //self.load_components()
           //setTimeout(self.load_icons, 2000)
       })
   },
   methods: {
     load_icons () {
       var self = this
       var components  = $('.k-toolbar .k-toolbar-item')
       $.each(components, function(index, component){
           self.inner_components[index].icon = component.getAttribute('icon')
           self.inner_components[index].tooltip = component.getAttribute('tooltip')
       })
       self.$emit('update:components', self.inner_components)
     },
     load_components (){
       var self = this
       $.each(self.inner_components, function(index, component){
         if('url' in component){
           var url = self.$kytos_server+component.url
           console.log(url)
           self.$kytos.component(component.name, defineAsyncComponent( () => loadModule(url, options) ))
         }
       })
     }
  }
 }
 </script>
 
 <style lang="sass">
 
 @import '../../../assets/styles/variables'
 
 .k-toolbar
   -webkit-order: 2
   -ms-flex-order: 2
   z-index: 999
   margin-top: 40px
   padding: 5px 10px
   background: $fill-panel
   width: 220px
   display: block
 
 .compacted
  .k-toolbar
   width: 100vw
   height: 40px
   margin-top: 0px
   box-shadow: 5px 2px 10px $kytos-black
   overflow: hidden
   padding: 0px
 
   .no-compact
    display: none
 
 </style>
 