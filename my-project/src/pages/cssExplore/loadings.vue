<template>
  <div class="cssExplore-loadings-wrapper">
    <div class="loading-1">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="stage-2">
      <div class="loader">
        <span></span><span></span><span></span>
      </div>
    </div>
    <div class="stage-3">
      <div class="loading-3">
        <span class="girl"></span>
        <div class="boys">
          <span></span><span></span><span></span><span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loadings'
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";
  .cssExplore-loadings-wrapper{
    .loading-1{
      background: #8B3A25;
      .wh(100vw, 200px);
      position: relative;

      >span{
        display: inline-block;
        .square(20px);
        background: @white;
        border-radius: 50%;
        .position2(absolute, top, 90px, left, 120px);

        &:nth-child(2){
          left: 120px + 30px * 1;
        }
        &:nth-child(3){
          left: 120px + 30px * 2;
        }
        &:nth-child(4){
          left: 120px + 30px * 3;
        }
        &:nth-child(5){
          left: 120px + 30px * 4;
        }

        @keyframes step{
          10%{
            top: 75px;
            left: 135px;
            width: 25px;
          }
          20%{
            top: 60px;
            left: 150px;
            width: 30px;
          }
          80%{
            top: 60px;
            left: 120px + 30px * 3;
            width: 30px;
          }
          90%{
            top: 75px;
            left: 120px + 30px * 4 - 15px;
            width: 25px;
          }
          100%{
            top: 90px;
            left: 120px + 30px * 4;
            width: 20px;
          }
        }
        &:first-child{
          animation: step .4s ease;
          animation-iteration-count: infinite;
        }
        @keyframes moveLeft{
          from{
            transform: translateX(0px);
          }
          to{
            transform: translateX(-30px);
          }
        }
        &:not(:first-child){
          animation: moveLeft .4s ease;
          animation-iteration-count: infinite;
        }
      }
    }
    .stage-2{
      .wh(100vw, 200px);
      background: linear-gradient(to right, silver, teal);
      display: flex;
      align-items: center;
      justify-content: center;

      .loader{
        @diameter: 10em;
        .wh(2*@diameter, @diameter);
        position: relative;
        overflow: hidden;

        &:before, &:after{
          content: '';
          position: absolute;
          bottom: 0;
        }
        &:before{
          .wh(100%, @diameter/40);
          background: @white;
          left: 0;
        }
        &:after{
          .square(@diameter);
          box-sizing: border-box;
          border: @diameter/40 solid @white;
          border-radius: 50%;
          left: @diameter/2;
        }

        @keyframes runRotating{
          0%{
            left: -@diameter/10;
            transform: rotate(0deg);
          }
          10%{
            left: @diameter - @diameter/20;
            transform: rotate(0deg);
          }
          60%{
            left: @diameter - @diameter/20;
            transform: rotate(-1turn);
          }
          70%, 100%{
            left: 2*@diameter;
            transform: rotate(-1turn);
          }
        }
        span{
          display: block;
          .square(@diameter/10);
          border-radius: 50%;
          background: @white;
          .position2(absolute, bottom, @diameter/40, left, @diameter - @diameter/20);
          transform-origin: @diameter/20 @diameter/10+@diameter/40-@diameter/2;
          animation: runRotating 2s linear infinite;

          &:nth-child(1){
            animation-delay: .075s;
          }
          &:nth-child(2){
            animation-delay: .15s;
          }
        }
      }
    }
    .stage-3{
      .wh(100vw, 200px);
      background: #FDFDFD;
      display: flex;
      align-items: center;
      justify-content: center;

      .loading-3{
        font-size: 35px;
        .wh(8em, 1em);
        position: relative;

        span{
          display: inline-block;
          .square(1em);
          border-radius: 15%;
          box-shadow: 0 0 0.2em rgba(0, 0, 0, 0.3);
          position: absolute;
          bottom: 0;
        }
        @keyframes girlsComing{
          0%{
            transform: translateX(0);
            background: #FF6CB9;
          }
          100%{
            transform: translateX(7em);
            background: #FF96FF;
          }
        }
        .girl{
          margin-right: 0.5em;
          background: #FF6CB9;
          left: 0;
          animation: girlsComing 3s ease-in-out infinite;
        }
        @keyframes jump-1{
          0%, 15%{
            transform: rotate(0deg);
          }
          35%, 100%{
            transform: rotate(-180deg);
          }
        }
        @keyframes jump-down-1 {
          5% {
            transform: scale(1, 1);
          }

          15% {
            transform: scale(1.3, 0.7);
          }

          20%, 25% {
            transform: scale(0.8, 1.4);
          }

          40% {
            transform: scale(1.3, 0.7);
          }

          55%, 100% {
            transform: scale(1, 1);
          }
        }
        @keyframes jump-2{
          0%, 30%{
            transform: rotate(0deg);
          }
          50%, 100%{
            transform: rotate(-180deg);
          }
        }
        @keyframes jump-3{
          0%, 45%{
            transform: rotate(0deg);
          }
          65%, 100%{
            transform: rotate(-180deg);
          }
        }
        @keyframes jump-4{
          0%, 60%{
            transform: rotate(0deg);
          }
          80%, 100%{
            transform: rotate(-180deg);
          }
        }
        .boys{
          display: inline-block;
          span{
            transform-origin: -0.375em center;
            &:nth-child(1){
              background: #1E90FF;
              left: 1.75em;
              animation: jump-1 3s ease-in-out infinite, jump-down-1 3s ease-in-out infinite;
            }
            &:nth-child(2){
              left: 2*1.75em;
              background: #22A6FF;
              animation: jump-2 3s ease-in-out infinite;
            }
            &:nth-child(3){
              left: 3*1.75em;
              background: #27BBFF;
              animation: jump-3 3s ease-in-out infinite;
            }
            &:nth-child(4){
              left: 4*1.75em;
              background: #2BD1FF;
              animation: jump-4 3s ease-in-out infinite;
            }
          }
        }
      }
    }
  }
</style>
