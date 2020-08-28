<template>
  <div id="app">
    <div id="nav">
      <router-link to="/"><a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96" /> 项目列表</router-link> |
      <router-link to="/about">构建列表</router-link>
    </div>
    <div class="view-wrapper">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.view-wrapper {
  flex: 1;
  padding: 0 20px;
}
#nav {
  height: 80px;
  line-height: 80px;
  text-align: center;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
