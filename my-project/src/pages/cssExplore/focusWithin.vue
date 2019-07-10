<template>
  <div class="cssExplore-focusWithin-wrapper">
    <header class="header">
      <h1 class="title">伪类选择器 :focus-within</h1>
      <button class="btn-bar">
        <i></i><i></i><i></i>
      </button>
      <div class="menu-box">
        <div class="bg"></div>
        <ul class="jump-list">
          <li>
            <a href="/home">返回首页</a>
          </li>
          <li>
            <a href="/css_explore/index">返回上一页</a>
          </li>
        </ul>
      </div>
    </header>
    <section class="section">
      <section class="example example-1">
        <h3 class="title">冒泡的:focus-within</h3>
        <div class="content-box">
          <div class="box box-1">
            box-1
            <div class="box box-2">
              box-2
              <div class="box box-3">
                box-3
                <div class="box box-4">
                  box-4
                  <input type="button" value="Button">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="example example-2">
        <h3 class="title">感应用户聚焦区域</h3>
        <div class="content-box">
          <div class="input-modult">
            <input type="text" placeholder="user name">
            <input type="text" placeholder="code">
          </div>
        </div>
      </section>
      <section class="example example-3">
        <h3 class="title">配合 :placeholder-shown 伪类实现表单效果</h3>
        <div class="content-box">
          <div class="input-modult">
            <input class="search-val" type="text" placeholder="输入你想查询的内容">
            <button class="btn-search">Go</button>
          </div>
        </div>
      </section>
      <section class="example example-4">
        <h3 class="title">实现掘金登录效果</h3>
        <div class="content-box">
          <div class="login-box">
            <div class="input-area user-info">
              <input type="text" placeholder="请输入手机号或邮箱">
              <img class="top-img" src="@imgPath/cssExplore/greeting.png" alt="">
            </div>
            <div class="input-area password">
              <input type="password" placeholder="请输入密码">
              <img class="top-img" src="@imgPath/cssExplore/blindfold.png" alt="">
            </div>
            <img class="top-img no-focus-img" src="@imgPath/cssExplore/normal.png" alt="">
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
export default {
  name: 'focus-within'
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";
  .cssExplore-focusWithin-wrapper{
    .header{
      .wh(100vw, 50px);
      .position2(fixed, top, 0, left, 0, 100);
      background: #2C2B2C;

      .title{
        .font(@f16, @white, center, 50px, bold);
      }
      .btn-bar{
        display: inline-block;
        .wh(30px, 21px);
        outline: none;
        background: transparent;
        .position2(absolute, top, 15px, left, 15px);
        border: none;
        padding: 0;

        i{
          display: block;
          .wh(30px, 3px);
          background: @white;
          margin-bottom: 6px;
          border-radius: 3px;
          transition: all .3s;

          &:last-child{
            margin: 0;
          }
          &:first-child{
            transform-origin: left center;
            transform: rotate(0deg);
          }
          &:nth-child(2){
            opacity: 1;
          }
          &:last-child{
            transform-origin: left center;
            transform: rotate(0deg);
          }
        }

        &:focus-within{
          i{
            &:first-child{
              transform: rotate(30deg);
              width: 34px;
            }
            &:nth-child(2){
              opacity: 0;
            }
            &:last-child{
              transform: rotate(-30deg);
              width: 34px;
            }
          }
        }
      }
      .menu-box{
        .bg{
          width: 100vw;
          position: fixed;
          top: 50px;
          left: 0;
          right: 0;
          bottom: 0;
          transition: background .3s;
        }
        .jump-list{
          width: 50vw;
          position: fixed;
          top: 50px;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10;
          background: @gray;
          padding-top: 10px;
          transition: all .3s;
          >li{
            padding-left: 15px;
            a{
              .font(@f16, @c00, left, 30px);
              text-decoration: none;
            }
          }
        }
      }
      &:not(:focus-within){
        .menu-box{
          .bg{
            background: transparent;
            transform: translateX(-100vw);
          }
          .jump-list{
            transform: translateX(-50vw);
          }
        }
      }
      &:focus-within{
        .menu-box{
          .bg{
            background: rgba(0, 0, 0, .4);
            transform: translateX(0);
          }
          .jump-list{
            transform: translateX(0);
          }
        }
      }
    }
    .section{
      margin-top: 50px;
      padding-top: 15px;

      .example{
        margin-bottom: 15px;
        padding: 0 15px;
        .title{
          .font(@f16, @c33, left, 1);
        }
        .content-box{
          margin-top: 15px;
        }
      }
      .example-1{
        .content-box{
          .box{
            .font(@f14, @coffee, left, 1.5);
            padding: 0 15px 20px;
            border: 1px solid @coffee;
            border-radius: 5px;
          }
          .box-1:focus-within{
            background: greenyellow;
          }
          .box-2:focus-within{
            background: @blue;
          }
          .box-3:focus-within{
            background: plum;
          }
          .box-4{
            position: relative;
            input{
              .position2(absolute, top, 50%, left, 50%);
              transform: translate(-50%, -50%);
              background: @white;
              border: 1px solid @coffee;
              outline: none;
            }
            &:focus-within{
              background: orangered;
            }
          }
        }
      }
      .example-2{
        .content-box{
          .input-modult{
            padding: 15px;
            border: 1px solid #CDD6CD;
            transition: all .3s;

            input{
              display: block;
              width: 100%;
              outline: none;
              border: 1px solid #CDD6CD;
              padding: 10px;
              height: 35px;
              line-height: 35px;
              font-size: 15px;
              &:first-child{
                margin-bottom: 15px;
              }
              &:focus-within{
                border-color: @blue;
              }
            }
            &:focus-within{
              border-color: @blue;
              box-shadow: 0 0 10px #ddd;
              transform: translateY(-3px);
            }
          }
        }
      }
      .example-3{
        .content-box{
          .input-modult{
            border: 1px solid @coffee;
            padding: 10px;
            transition: all .3s;

            &:focus-within{
              border-color: @ddBlue;
              box-shadow: 5px 5px 10px #ddd;
              transform: translateY(-4px);
            }
            .search-val{
              height: 30px;
              outline: none;
              line-height: 30px;
              font-size: 15px;
              border: none;

              &:not(:placeholder-shown)+.btn-search{
                opacity: 1;
              }
            }
            .btn-search{
              float: right;
              .wh(80px, 30px);
              .font(15px, @white, center, 30px);
              border: none;
              background: @ddBlue;
              border-radius: 5px;
              opacity: 0;
              transition: all .3s ease .1s;
            }
          }
        }
      }
      .example-4{
        .content-box{
          background: rgba(0, 0, 0, .3);
          padding-bottom: 20px;
          &:before{
            content: '';
            display: table;
          }

          .login-box{
            .wh(318px, 371px);
            margin: 120px auto 0;
            padding: 24px;
            background: @white;
            position: relative;

            &:not(:focus-within){
              .no-focus-img{
                display: block;
              }
            }
            .top-img{
              .wh(120px, 95px);
              .position2(absolute, top, -77px, left, 99px);
              display: none;
            }
            .input-area{
              margin-bottom: 10px;

              &:focus-within{
                .top-img{
                  display: block;
                }
              }
              input{
                display: block;
                .wh(100%, 40px);
                padding: 10px;
                border: 1px solid #e9e9e9;
                .font(@f14, @c00, left, 20px);
                outline: none;
              }
              &.user-info{
                .top-img{
                  top: -72px;
                }
              }
              &.password{
                .top-img{
                  top: -75px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
