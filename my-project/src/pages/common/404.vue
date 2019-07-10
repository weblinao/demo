<template>
  <div class="common-404-wrapper">
    <div class="center-box">
      <h1 class="icon">404</h1>
      <p class="desc">Page is gone!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pathErr'
}
</script>

<style scoped lang="less">
  @import "~@cssPath/mixin.less";

  .common-404-wrapper{
    .wholeScreen();

    .center-box{
      .position2(absolute, top, 50%, left, 50%);
      transform: translate(-50%, -50%);
      padding: 15px;

      .icon{
        .font(24px, #000, center, 2, bold);
      }
      .desc{
        .font(14px, #444, center, 1.5);
      }
    }
  }
</style>
