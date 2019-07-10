<template>
  <div>
    <h1>webp测试</h1>
    <!--<div>-->
      <!--<h2>img直接引入webp</h2>-->
      <!--<img-->
          <!--src="https://mmbiz.qpic.cn/mmbiz_jpg/lcaq0oMjdFyFKlpVys34bfFK4u9ZovFdewF1OLvvFgloicTqSYv6JTgQFnic7lAaFaN3kSn0ibCbASDKueMDcicBvw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1"-->
          <!--alt="">-->
    <!--</div>-->
    <div>
      <h2>img直接引入webp</h2>
      <!--<img src="@imgPath/640.webp" alt="">-->
      <!--<picture>-->
        <!--<source type="image/webp" srcset="@imgPath/640.webp">-->
        <!--<img src="../assets/img/640.jpg" alt="">-->
      <!--</picture>-->
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: "test-webp",
    mounted() {
      let canUseWebp = (function () {
        let elem = document.createElement('canvas');
        if (!!(elem.getContext && elem.getContext('2d'))) {
          return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        } else {
          return false;
        }
      })();
      console.log(canUseWebp, 1200);
    }
  }
</script>

<style scoped lang="less">
  img {
    width: 100%;
  }
</style>
