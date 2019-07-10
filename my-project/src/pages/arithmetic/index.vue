<template>
  <div class="arithmetic-wrapper">
    <h2 class="title">算法示例</h2>
    <ul class="explore-list">
      <li>
        <a href="/arithmetic/sku/index">
          SKU算法
          <i class="fa fa-angle-right" aria-hidden="true"></i>
        </a>
      </li>
      <li>
        <a href="/arithmetic/backpack/index">
          背包问题
          <i class="fa fa-angle-right" aria-hidden="true"></i>
        </a>
      </li>
      <li>
        <a href="/arithmetic/food_delivery/index">
          外卖小哥送饭
          <i class="fa fa-angle-right" aria-hidden="true"></i>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'index'
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";

  .arithmetic-wrapper{
    .title{
      .font(@f22, @c33, center, 50px, bold);
    }
    .explore-list{
      padding: 0 15px;
      >li{
        margin-bottom: 10px;
        a{
          display: block;
          box-sizing: border-box;
          .wh(100%, 30px);
          .font(15px, @green, left, 30px);
          padding: 0 15px;
          border: 1px solid @green;
          border-radius: 6px;
          text-decoration: none;
          position: relative;

          .fa{
            .position2(absolute, top, 7px, right, 15px);
          }
        }
      }
    }
  }
</style>
