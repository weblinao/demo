<template>
  <div class="cssExplore-haveADrink-wrapper">
    <div class="container">
      <div class="keg">
        <span class="handle"></span>
        <span class="pipe"></span>
      </div>
      <div class="glass">
        <span class="beer"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'have-a-drink'
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";
  .cssExplore-haveADrink-wrapper{
    .wh(100vw, 100vh);
    display: flex;
    justify-content: center;
    background: linear-gradient(lightslategray 300px, #333 300px);

    .container{
      .wh(700px, 300px);
      position: absolute;

      & *:before, & *:after{
        content: '';
        position: absolute;
      }
      .keg{
        .wh(90px, 200px);
        background: linear-gradient(to right, #6B6B6B 70px, #494949 20px);
        .position2(absolute, bottom, 0, left, 310px);

        @keyframes flow{
          0%,15%{
            height: 0;
            top: 40px;
          }
          18%{
            height: 112px;
            top: 40px;
          }
          45%{
            height: 30px;
            top: 40px;
          }
          48%, 100%{
            height: 0;
            top: 70px;
          }
        }
        .pipe{
          .wh(10px, 40px);
          .position2(absolute, top, 33px, left, 10px);
          background-color: #ccc;
          &:before{
            .wh(40px, 20px);
            background: radial-gradient(circle at 10px 10px, #eee 7px, #ccc 7px, #ccc 10px, transparent 10px),
                        linear-gradient(#ccc 50%, #999 50%);
            border-radius: 10px;
            top: -2px;
            left: -5px;
          }
          &:after{
            .wh(10px, 112px);
            background: rgba(255, 206, 84, 0.5);
            top: 40px;
            left: 0;
            animation: flow 5s infinite;
          }
        }

        @keyframes handle{
          10%, 60%{
            transform: rotate(0deg);
          }
          15%, 50%{
            transform: rotate(-90deg);
          }
        }
        .handle{
          .wh(10px, 20px);
          background-color: #ccc;
          .position2(absolute, top, 22px, left, 10px);
          transform-origin: 3px 20px;
          animation: handle 5s infinite;

          &:before{
            .wh(10px, 0px);
            border-width: 30px 5px 0 5px;
            border-color: #000 transparent transparent transparent;
            border-style: solid;
            top: -30px;
            left: -5px;
          }
          &:after{
            .wh(20px, 10px);
            border-radius: 5px 5px 0 0;
            background-color: #ccc;
            top: -40px;
            left: -5px;
          }
        }
      }
      @keyframes glassMove{
        0%{
          left: 100px;
          opacity: 0;
        }
        15%, 55%{
          left: 300px;
          opacity: 1;
        }
        100%{
          left: 500px;
          opacity: 0;
        }
      }
      .glass{
        .wh(70px, 100px);
        .position2(absolute, bottom, 0, left, 300px);
        color: rgba(255, 255, 255, .3);
        border-radius: 5px;
        background: rgba(255, 255, 255, .3);
        animation: glassMove 5s infinite;

        &:before{
          .wh(50px, 40px);
          top: 20px;
          right: -20px;
          border-radius: 0 40% 40% 0;
          clip-path: inset(0 0 0 72%);
          border: 10px solid;
        }
        @keyframes beerFull{
          0%, 18%{
            height: 0px;
          }
          48%, 100%{
            height: 80px;
          }
        }
        @keyframes frothFull{
          0%, 20%{
            height: 0px;
            top: 0;
          }
          48%, 100%{
            height: 15px;
            top: -13px;
          }
        }
        @keyframes frothShake{
          0%, 100%{
            transform: rotate(-3deg);
          }
          50%{
            transform: rotate(3deg);
          }
        }
        .beer{
          .wh(60px, 82px);
          .position2(absolute, bottom, 15px, left, 5px);
          background: rgba(255, 206, 84, 0.8);
          animation: beerFull 5s infinite;

          &:before{
            .wh(60px, 15px);
            background: #eee;
            border-radius: 5px 5px 0 0;
            top: -13px;
            left: 0;
            animation: frothShake 1s infinite, frothFull 5s infinite;
          }
        }
      }
    }
  }
</style>
