<template>
  <div class="backpack-index-wrapper">
    <div class="bg"></div>
    <header class="header">
      <h1 class="title">背包问题</h1>
      <p class="desc">
        背包问题(Knapsack problem)是一种组合优化的NP完全问题。问题可以描述为：给定一组物品，每种物品都有自己的重量和价格，
        在限定的总重量内，我们如何选择，才能使得物品的总价格最高。问题的名称来源于如何选择最合适的物品放置于给定背包中。相似问
        题经常出现在商业、组合数学，计算复杂性理论、密码学和应用数学等领域中。也可以将背包问题描述为决定性问题，即在总重量不超
        过W的前提下，总价值是否能达到V？
      </p>
    </header>
    <section class="section">
      <ul class="detail-list">
        <li>
          <a class="link" href="/arithmetic/backpack/simple">
            01背包问题
            <i class="fa fa-angle-right" aria-hidden="true"></i>
          </a>
        </li>
        <li>
          <a class="link" href="/arithmetic/backpack/completely">
            完全背包问题
            <i class="fa fa-angle-right" aria-hidden="true"></i>
          </a>
        </li>
        <li>
          <a class="link" href="/arithmetic/backpack/multiple">
            多重背包问题
            <i class="fa fa-angle-right" aria-hidden="true"></i>
          </a>
        </li>
        <li>
          <a class="link not-finish" href="/arithmetic/backpack/two_dimensional">
            二维费用的背包问题
            <i class="fa fa-angle-right" aria-hidden="true"></i>
            <span class="hint">not done</span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: 'backpack-directory'
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";
  .backpack-index-wrapper{
    padding: 0 15px;
    min-height: 100vh;
    .bg{
      .wholeScreen(-1);
      background: url("../../../assets/img/arithmetic/backpack_bg.png") no-repeat center center fixed;
      background-size: contain;
      opacity: .5;
    }
    .header{
      .title{
        .font(@f22, @c33, left, 50px, bold);
      }
      .desc{
        .font(@f12, @c66, left, 2);
        text-indent: 2*@f12;
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
            &.not-finish{
              color: @red;
              border-color: @red;
              .hint{
                float: right;
                margin-right: 10px;
                transform: translateY(-2px);
              }
            }
          }
        }
      }
    }
  }
</style>
