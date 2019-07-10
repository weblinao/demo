<template>
  <div class="cssExplore-angryBirds-wrapper">
    <div class="pig">
      <span class="ears"></span>
      <span class="eyes"></span>
      <span class="nose"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'angry-birds'
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";

  .cssExplore-angryBirds-wrapper{
    height: 100vh;
    background: skyblue;
    &:before{
      content: '';
      display: table;
    }

    .pig{
      position: relative;
      margin-top: 40px;
      font-size: 20px;
      .wh(12em, 10em);
      background-color: #50a032;
      border: 0.2em solid #2b4d13;
      border-top-left-radius: 50% 55%;
      border-top-right-radius: 50% 60%;
      border-bottom-right-radius: 50% 40%;
      border-bottom-left-radius: 50% 45%;
      box-shadow:
          inset -1.5em 1em 1.5em -0.5em rgba(255, 255, 255, 0.3),
          inset 0.5em -0.5em 0.8em 0.2em rgba(0, 0, 0, 0.2);

      &:before, &:after, & *:before, & *:after{
        content: '';
        position: absolute;
      }
      &:before, &:after{
        .wh(1.4em, 1em);
        border-top: 0.5em solid #0f2d00;
        top: 2.3em;
        border-top-left-radius: 50% 40%;
        border-top-right-radius: 50% 40%;
      }
      &:before{
        left: 1.2em;
        transform: rotate(-20deg);
      }
      &:after{
        right: 1em;
        transform: rotate(25deg);
      }

      .nose{
        .wh(4.6em, 4em);
        .position2(absolute, top, 3em, left, 4.2em);
        background-color: #82b923;
        border: 0.1em solid #1d3c07;
        border-top-left-radius: 50% 55%;
        border-top-right-radius: 50% 55%;
        border-bottom-right-radius: 45%;
        border-bottom-left-radius: 45%;
        box-shadow: -0.1em 0.5em 0.2em 0.1em rgba(68, 132, 36, 0.6);

        &:before, &:after{
          .wh(1.2em, 1.8em);
          top: 1.4em;
          background-color: #0f2d00;
          border-radius: 50%;
          box-shadow: inset -0.3em -0.2em 0.1em -0.1em #2d6b1f;
        }
        &:before{
          left: 0.8em;
        }
        &:after{
          right: 0.8em;
          height: 1.6em;
        }
      }
      .eyes{
        .eyeball(@x, @y){
          background: radial-gradient(circle at @x @y, black 0.4em, transparent 0.4em) white;
        }
        &:before, &:after{
          .square(2.8em);
          border-radius: 50%;
          border: 0.1em solid #193c09;
          top: 3.6em;
          box-shadow:
              inset 0.3em -0.6em 0.5em -0.2em rgba(0, 0, 0, 0.3),
              -0.1em 0.5em 0.2em 0.1em rgba(68, 132, 36, 0.6);
        }
        &:before{
          left: 0.8em;
          .eyeball(1em, 1.5em);
        }
        &:after{
          right: 0.3em;
          .eyeball(1.9em, 1.5em);
        }
      }
      .ears{
        &:before, &:after{
          .wh(0.8em, 0.9em);
          border-top-left-radius: 45% 55%;
          border-top-right-radius: 45%;
          border-bottom-right-radius: 45% 55%;
          border-bottom-left-radius: 45%;
          border: 0.1em solid #1d3a0d;
          background-color: #2f6317;
        }
        &:before{
          top: 0.3em;
          left: 1.3em;
          color: #50a032;
          box-shadow:
              0.4em 0.7em 0 -0.2em,
              -0.2em 0.7em 0 -0.1em,
              -0.6em 0.5em 0 -0.2em,
              -0.1em -0.2em 0 0.4em,
              -0.1em -0.2em 0 0.6em #2b4d13;
          transform: rotate(-40deg);
        }
        &:after{
          top: -1.1em;
          left: 5.8em;
          color: #5cb739;
          box-shadow:
              0.3em 0.6em 0 -0.2em,
              -0.1em 0.6em 0 -0.1em,
              -0.6em 0.6em 0 -0.2em,
              -0.1em -0.2em 0 0.4em,
              -0.1em -0.2em 0 0.6em #2b4d13;
          transform: rotate(-6deg);
        }
      }
    }
  }
</style>
