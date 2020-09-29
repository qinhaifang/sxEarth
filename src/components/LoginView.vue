<template>
  <div class="login">
    <div class="login-title">>广西县级财政扶贫资金动态监控系统</div>
    <div class="form">
      <div class="form-title">用户登录</div>
      <el-form ref="form" :model="form" :rules="rules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input size="small " v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            size="small"
            v-model="form.password"
            @keyup.enter.native="submitForm()"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            :loading="loading"
            @click.enter.native="submitForm()"
            >登 录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginIn } from "../api/api";

export default {
  name: "LoginView",
  data() {
    return {
      form: {
        name: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      loading: false
    };
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          const params = {
            username: this.form.username,
            password: this.form.password,
            userSysType: "1"
          };
          loginIn(params).then(res => {
            this.loading = false;
            sessionStorage.setItem("token", res.Authorization); //res.Authorization);
            sessionStorage.setItem("username", res.username); // res.username);
            sessionStorage.setItem("userId", res.userId); // res.userId);
            this.$router.push({
              path: "/index"
            });
          });
        }
      });
    }
  }
};
</script>

<style scoped></style>
