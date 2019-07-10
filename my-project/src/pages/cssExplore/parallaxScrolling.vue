<template>
  <div class="cssExplore-parallaxScrolling-wrapper">
    <header class="header">
      <h1 class="title">滚动视差</h1>
    </header>
    <!--<div class="state-chose-list">-->
      <!--使用 background-attachment: fixed 实现滚动视差-->
    <!--</div>-->
    <section class="content-box">
      <!--定位元素和background-attachment: fixed意外的不搭啊？？-->
      <div class="example-container example-1">
        <section class="g-word">Header</section>
        <section class="g-img bg-1">IMG1</section>
        <section class="g-word">Content1</section>
        <section class="g-img bg-2">IMG2</section>
        <section class="g-word">Content2</section>
        <section class="g-img bg-3">IMG3</section>
        <section class="g-word">Footer</section>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'parallax-scrolling'
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";
  .cssExplore-parallaxScrolling-wrapper{
    .header{
      width: 100vw;
      .position2(fixed, top, 0, left, 0);

      .title{
        .font(@f22, @c33, center, 50px, bold);
      }
    }
    .state-chose-list{
      height: 10vh;
    }
    .content-box{
      .example-1{
        section{
          .font(40px, @white, center, 100vh, bold);
          height: 100vh;
        }
        .g-word{
          background: #4F454E;
        }
        .g-img{
          background-attachment: fixed;
          background-size: cover;
          background-position: center center;

          &.bg-1{
            background-image: url("../../assets/img/cssExplore/timg1.jpg");
          }
          &.bg-2{
            background-image: url("../../assets/img/cssExplore/timg2.jpg");
          }
          &.bg-3{
            background-image: url("../../assets/img/cssExplore/timg3.jpg");
          }
        }
      }
    }
  }
</style>
