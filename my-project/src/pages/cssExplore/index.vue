<template>
  <div class="css-explore-wrapper">
    <h2 class="title">CSS实验</h2>
    <ul class="explore-list">
      <li class="not-finish">
        <a href="/css_explore/conic_gradient">
          圆锥渐变 <span class="state">not done</span>
        </a>
      </li>
      <li class="not-finish">
        <a href="/css_explore/parallax_scrolling">
          滚动视差 <span class="state">not done</span>
        </a>
      </li>
      <li>
        <a href="/css_explore/focus_within">伪类选择器 :focus-within</a>
      </li>
      <li class="not-finish">
        <a href="/css_explore/animation_3d">
          3D动画 <span class="state">not done</span>
        </a>
      </li>
      <li>
        <a href="/css_explore/paper_crane">纸鹤</a>
      </li>
      <li>
        <a href="/css_explore/loadings">Loadings</a>
      </li>
      <li>
        <a href="/css_explore/angry_birds">愤怒的小鸟</a>
      </li>
      <li>
        <a href="/css_explore/have_a_drink">一杯扎啤</a>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "css-explore-index"
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";

  .css-explore-wrapper{
    .title{
      .font(@f22, @c33, center, 50px, bold);
    }
    .explore-list{
      padding: 15px 15px 0;
      >li{
        margin-bottom: 25px;
        position: relative;
        height: 40px;
        &:before, &:after{
          content: '';
          display: block;
          .square(16px);
          background: #D8D8D7;
          border-radius: 50%;
          position: absolute;
          top: 12px;
          transition: all .5s cubic-bezier(0.5, -0.5, 0.25, 1.5);
        }
        &:before{
          left: 0;
          z-index: 50;
        }
        &:after{
          right: 0;
          z-index: 1;
        }
        &:hover{
          &:before{
            .wh(95%, 40px);
            background: @green;
            border-radius: 0;
            top: 0;
          }
          &:after{
            .wh(90%, 40px);
            background: darken(@green, 20%);
            border-radius: 0;
          }
          a{
            color: @white;
          }
        }

        a{
          display: block;
          width: 100%;
          color: #000;
          text-decoration: none;
          font-weight: bold;
          padding: 0 60px;
          font-size: @f16;
          line-height: 40px;
          //border: 1px solid @green;
          border-radius: 5px;
          overflow: hidden;
          .position2(absolute, top, 0, left, 0, 100);
          transition: color .5s;

          .state{
            float: right;
          }
        }
        &.not-finish{
          //color: @red;
          //border-color: @red;
          &:hover{
            &:before{
              background: @red;
            }
            &:after{
              background: darken(@red, 20%);
            }
          }
        }
      }
    }
  }
</style>
