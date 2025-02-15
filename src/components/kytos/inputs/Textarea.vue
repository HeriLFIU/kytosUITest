<template>
  <div :class="{[customClass]: true, 'k-textarea-wrap': true, 'no-compact': true}">
    <icon v-if="icon && iconName" :icon="iconName"></icon>
    <textarea ref="textarea" @input="updateText" type="text" :id="id" class="k-textarea" :value="value" :tooltip="tooltip" :placeholder="placeholder"
      v-bind:disabled="isDisabled" onshow="this.focus()" autofocus>
    </textarea>
  </div>
</template>

<script>
import KytosBase from '../base/KytosBase';
import KytosBaseWithIcon from '../base/KytosBaseWithIcon';

/**
 * A text input field with multi-line.
 */
export default {
  name: 'k-textarea',
  mixins: [KytosBaseWithIcon],
  props: {
   /**
    * The value text used in TextArea.
    */
   value: {
      type: String
    },
   modelValue: {
      default: ""
    },
   /**
    * A tooltip displayed in the text-area
    */
   tooltip: {
      type: String
    },
   /**
    * String displayed when the text-area is empty.
    */
   placeholder: {
      type: String
    },
   /**
    * Optimal action called after textarea changes.
    */
   action: {
      type: Function,
      default: function(value) {return}
   },
   /**
    * Custom CSS Classes
    */
   customClass: {
      type: String,
      default: ""
   }
  },
  methods: {
    updateText(value){
      this.$emit('textarea', value)
      this.action(value)

      this.$emit('update:value', this.$refs.textarea.value)
      this.action(this.$refs.textarea.value)
    }
  }
}
</script>

<style lang="sass">

@import '../../../assets/styles/variables'

.k-textarea-wrap
 border: 1px solid $fill-input-bg
 border-radius: 0.2em
 background: $fill-input-bg
 display: flex
 flex-direction: row

 &:hover
  border-color: $fill-input-hover
  background: $fill-input-hover

  textarea, svg
   background: $fill-input-hover
   fill: $fill-icon-h
   color: $fill-icon-h

 svg
  fill: $fill-icon
  color: $fill-icon
  padding: 0.3em 0.5em

.k-textarea
 padding: 0.2em
 border: none
 border-radius: 0.2em
 outline: none
 background: $fill-input-bg
 color: $fill-input
 font-size: 0.8em
 flex: 1

 &:focus
  border-color: $fill-input-hover

 &:hover
  border-color: $fill-input-hover
  color: $fill-text
  background: $fill-input-hover

</style>
