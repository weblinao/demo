<template>
  <div class="css-animation-3d-wrapper">
    3D动画
    <div class="stage">
      <div class="square-box">
        <div class="surface front"></div>
        <div class="surface back"></div>
        <div class="surface right"></div>
        <div class="surface left"></div>
        <div class="surface top"></div>
        <div class="surface bottom"></div>
      </div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'animation-3d'
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";
  .css-animation-3d-wrapper{
    .stage{
      perspective: 1000px;
      -webkit-transform-style: preserve-3d;
      -moz-transform-style: preserve-3d;
      -ms-transform-style: preserve-3d;
      transform-style: preserve-3d;
      position: relative;
      left: 100px;
      top: 100px;

      .square-box{
        position: absolute;
        -webkit-transform-style: preserve-3d;
        -moz-transform-style: preserve-3d;
        -ms-transform-style: preserve-3d;
        transform-style: preserve-3d;
        transform: rotateX(-40deg) rotateY(52deg) rotateZ(7deg);

        .surface{
          background: rgba(23, 93, 150, .5);
          .square(100px);
          border: 1px solid @white;
          .position2(absolute, top, 0, left, 0);
          /*transform-origin: center center 0;*/
        }
        .front{transform:rotateY(0deg) translateZ(50px);}
        .back{transform:rotateX(180deg) translateZ(50px);}
        .right{ transform:rotateY(90deg) translateZ(50px);}
        .left{transform:rotateY(-90deg) translateZ(50px);}
        .top{transform:rotateX(90deg) translateZ(50px);}
        .bottom{transform:rotateX(-90deg) translateZ(50px);}

      }
    }

  }
</style>
