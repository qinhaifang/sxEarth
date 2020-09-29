<template>
  <div class="top-content">
    <div class="top-title">
      <div class="user">
        <span class="username">{{username}}</span>
        <img src="static/images/User.png">
      </div>
      <div class="logo">
        <span class="title">高分遥感精准扶贫示范系统</span>
        <img src="static/images/jzfp.png">
      </div>
      <div class="login-out">
        <span @click="loginOut">退出</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: sessionStorage.getItem("username") || "admin"
    };
  },
  methods: {
    loginOut() {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('userId');
      this.$router.push({path: '/'});
    }
  }
};
</script>

<style scoped>
</style>