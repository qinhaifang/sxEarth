<template>
  <div>
    <script :id="id" type="text/plain"></script>
  </div>
</template>
<script>
import '../../../static/UE/ueditor.config.js'
import '../../../static/UE/ueditor.all.js'
import '../../../static/UE/lang/zh-cn/zh-cn.js'
import '../../../static/UE/ueditor.parse.min.js'
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
       id: {
        type: String
      },
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    mounted() {
      const _this = this;
      this.editor = UE.getEditor(this.id, this.config); // 初始化UE
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>

<style>
</style>
