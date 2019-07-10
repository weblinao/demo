<template>
  <div class="sku-index-wrapper">
    <div class="bg"></div>
    <header class="header">
      <h1 class="title">SKU算法</h1>
      <p class="desc">多属性商品选择</p>
    </header>
    <section class="section">
      <ul class="detail-list">
        <li>
          <a class="link" href="/arithmetic/sku/test">
            SKU算法(四种方法)
            <i class="fa fa-angle-right" aria-hidden="true"></i>
          </a>
        </li>
        <li>
          <a class="link" href="/arithmetic/sku/new">
            sku算法(改)
            <i class="fa fa-angle-right" aria-hidden="true"></i>
          </a>
        </li>
        <li>
          <a class="link" href="/arithmetic/sku/prime_num">
            SKU算法(质数代替ID)
            <i class="fa fa-angle-right" aria-hidden="true"></i>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: 'sku-index'
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";
  .sku-index-wrapper{
    padding: 0 15px;
    min-height: 100vh;
    .bg{
      .wholeScreen(-1);
      background: url("../../../assets/img/arithmetic/sku_bg.png") no-repeat center center;
      background-attachment: fixed;
      opacity: .5;
    }
    .header{
      .title{
        .font(@f22, @c33, left, 50px, bold);
      }
      .desc{
        .font(@f14, @c66, left, 2);
      }
    }
    .section{
      .detail-list{
        margin-top: 15px;
        >li{
          width: 100%;
          margin-bottom: 10px;

          .link{
            display: block;
            box-sizing: border-box;
            .wh(100%, 30px);
            .font(15px, @green, left, 30px);
            padding: 0 15px;
            border: 1px solid @green;
            border-radius: 6px;
            text-decoration: none;
            position: relative;
            background: @white;

            .fa{
              .position2(absolute, top, 7px, right, 15px);
            }
          }
        }
      }
    }
  }
</style>
