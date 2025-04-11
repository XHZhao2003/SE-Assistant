<template>
  <nav class="menu">
    <ul>
      <li><router-link to="/new-session">新会话</router-link></li>
      <li><router-link to="/history-session">历史会话</router-link></li>
      <li><router-link to="/course-video">课程视频</router-link></li>
      <li><router-link to="/course-slide">课程讲义</router-link></li>
      <li><router-link to="/uml-playground">UML演练场</router-link></li>
    </ul>
  </nav>
</template>
  
<script>
export default {
  name: 'Menu',
}
</script>
  
  <style scoped>
.menu ul {
  list-style-type: none;
  padding: 0;
}
.menu li {
  width: 200px;
  margin: 5px 0;
}
.router-link-active {
  color: #007bff;
}
</style>