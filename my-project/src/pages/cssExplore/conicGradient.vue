<template>
  <div class="cssExplore-conicGradient-wrapper">
    <header class="header">
      <h1 class="title">conic-gradient 圆锥渐变</h1>
    </header>
    <p class="hint">现在还不支持,等Chrome升到69再说</p>
    <ul class="example-list">
      <li class="ex-1">
        <h3 class="example-title">简单实现</h3>
        <p class="example-desc">最简单的圆锥渐变</p>
        <div class="example-content">
          <div class="test"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'conic-gradient'
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";
  .cssExplore-conicGradient-wrapper {
    .header{
      .title{
        .font(@f22, @c33, center, 50px, bold);
      }
    }
    .hint{
      .font(@f12, @c66, left, 1.5);
      padding: 0 15px;
    }
    .example-list{
      padding: 0 15px;

      >li{
        .example-title{
          .font(@f16, @c44, left, 30px);
        }
        .example-desc{
          .font(@f12, @c66, justify, 1.5);
          text-indent: 2 * @f12;
        }

        &.ex-1{
          .example-content{
            .test{
              .square(200px);
              background: conic-gradient(deeppink, yellowgreen);
            }
          }
        }
      }
    }
  }
</style>
