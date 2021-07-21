<template>
  <div class="page-login">
    <div class="login-container">
      <el-form label-width="60px">
        <el-form-item label="用户名">
          <el-input v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="pwd" type="password"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" :loading="loading" @click="submit">登录</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { login } from '@/utils/api'

// interface ILogin {
//   name: string,
//   pwd: string,
//   loading: boolean
// }

@Component
export default class Login extends Vue {
  // data (): ILogin {
  //   return {
  //     name: 'Hello',
  //     pwd: '',
  //     loading: false
  //   }
  // }

  name = ''
  pwd = ''
  loading = false

  async submit (): Promise<void> {
    if (!this.name) {
      this.$message({
        message: '请输入用户名',
        type: 'warning'
      })
      return
    }
    if (!this.pwd) {
      this.$message({
        message: '请输入密码',
        type: 'warning'
      })
      return
    }

    this.loading = true
    const [err, res] = await login(this.name, this.pwd)
    this.loading = false
    if (err) return
    const { data } = res
    if (!data) return
    const token = data.token
    window.localStorage.setItem('token_' + this.name, token)
    this.$router.replace({
      path: '/',
      query: {
        user: this.name
      }
    })
  }
}
</script>

<style scoped>
.login-container {
  width: 450px;
  padding: 40px;
  margin: 200px auto 0;
  text-align: center;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #fafafa;
}

@media screen and (max-width: 480px) {
  .login-container {
    width: 90%;
  }
}
</style>
