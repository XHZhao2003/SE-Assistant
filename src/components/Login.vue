<template>
  <div class="login-container">
    <div class="intro-box">
      欢迎使用软件工程智能助教系统！<br />
      请登录以继续使用系统功能。
    </div>
    <div class="login-box">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">账号</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="请输入账号"
          />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="请输入密码"
          />
        </div>
        <div class="button-group">
          <button type="button" @click="handleRegister">注册</button>
          <button type="submit">登录</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      if (this.username && this.password) {
        alert("登录成功！");
        this.$router.push("/app/new-session"); // 跳转到新会话界面
        try {
          // 与后端 API 交互的预留接口
          const response = await fetch("http://your-backend-api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: this.username,
              password: this.password,
            }),
          });
          const data = await response.json();
          if (response.ok) {
            alert("登录成功！");
            this.$router.push("/app/new-session"); // 跳转到新会话界面
          } else {
            alert(`登录失败：${data.message}`);
          }
        } catch (error) {
          alert("登录时发生错误，请稍后再试！");
          console.error(error);
        }
      } else {
        alert("请输入账号和密码！");
      }
    },
    async handleRegister() {
      try {
        // 与后端 API 交互的预留接口
        const response = await fetch("http://your-backend-api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          alert("注册成功，请登录！");
        } else {
          alert(`注册失败：${data.message}`);
        }
      } catch (error) {
        alert("注册时发生错误，请稍后再试！");
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
/* 登录页面容器 */
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
}

/* 简介框样式 */
.intro-box {
  width: 60%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 登录框样式 */
.login-box {
  width: 60%;
  padding: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

/* 表单组样式 */
.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 14px;
}

/* 按钮组样式 */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.button-group button {
  width: 48%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-group button[type="button"] {
  background-color: #f0f0f0;
  color: #333;
}

.button-group button[type="button"]:hover {
  background-color: #e0e0e0;
}

.button-group button[type="submit"] {
  background-color: #3498db;
  color: #fff;
}

.button-group button[type="submit"]:hover {
  background-color: #2980b9;
}
</style>
