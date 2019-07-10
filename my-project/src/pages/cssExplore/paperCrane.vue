<template>
  <div class="cssExplore-paperCrane-wrapper">
    <div class="cranes">
      <span class="head"></span>
      <span class="neck"></span>
      <span class="side"></span>
      <span class="wing"></span>
      <span class="belly"></span>
      <span class="tail"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'paper-crane'
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";
  .cssExplore-paperCrane-wrapper{
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: dodgerblue;
    overflow: hidden;

    .cranes{
      .wh(100vw, 20vh);
      color: @white;
      position: relative;

      span{
        .triangle(60px, 60px, 120px);
        .position2(absolute, top, 0, left, 33.8%);
        transition: all .5s;
      }

      &:hover{
        .head{
          .triangle(128px, 80px, 22px);
          .position2(absolute, top, 0, left, 0);
          transform: rotate(-5deg);
          opacity: .8;
        }
        .neck{
          .triangle(112px, 80px, 144px);
          .position2(absolute, top, 0, left, 16px);
          transform: rotate(-50deg);
          opacity: .8;
        }
        .side{
          .triangle(96px, 240px, 160px);
          .position2(absolute, top, 177px, left, 70px);
          transform: rotate(-107deg);
          opacity: .8;
        }
        .wing{
          .triangle(270px, 480px, 114px);
          .position2(absolute, top, -100px, left, -22px);
          transform: rotate(-50.5deg);
          opacity: .8;
        }
        .belly{
          .triangle(96px, 16px, 160px);
          .position2(absolute, top, 177px, left, 70px);
          transform: rotate(-107deg);
          opacity: .8;
        }
        .tail{
          .triangle(460px, 90px, 72px);
          .position2(absolute, top, 222px, left, -112px);
          transform: rotate(-146deg);
          opacity: .8;
        }
      }
    }
  }
</style>
