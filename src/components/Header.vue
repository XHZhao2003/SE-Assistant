<template>
  <header class="header">
    <div class="logo-container">
      <div class="logo">软件工程智能学习助手</div>
    </div>
    <div class="help-link-container">
      <a href="#" class="help-link">帮助文档</a>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
}
</script>

<style scoped>

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f4f4f4;
}

.logo-container {
  flex-grow: 1;
}

.help-link-container {
  flex-shrink: 0;
}

.logo {
  font-size: 20px;
}

.help-link {
  text-decoration: none;
  color: #333;
}
</style>
