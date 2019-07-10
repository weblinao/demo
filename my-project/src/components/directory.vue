<template>
  <div class="hello">
    <img src="@imgPath/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Directory</h2>
    <ul>
      <li>
        <a href="/css_explore/index">CSS特性探索</a>
      </li>
      <li>
        <a href="/arithmetic/index">算法演示</a>
      </li>
      <li>
        <a href="/calculator">计算器</a>
      </li>
      <li>
        <a href="/test_webp">Test Webp</a>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'directory',
    data() {
      return {
        msg: 'Welcome to Linao\'s Vue.js App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "../assets/css/variable.less";

  img {
    display: block;
    margin: 40px auto 0;
  }

  h1, h2 {
    font-size: @f20;
    line-height: 2;
    font-weight: normal;
  }

  h1 {
    text-align: center;
  }

  h2, ul {
    padding: 0 15px;
  }

  li {
  }

  a {
    display: block;
    color: @green;
    text-decoration: none;
    padding-left: 15px;
    font-size: @f14;
    line-height: 2 * @f14;
    border: 1px solid @green;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 10px;
  }
</style>
