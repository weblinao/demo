<template>
    <div class="menu-box">
        <div class="top-box">
            <a class="btn" @click="hideMenu">
                <i class="icon fa fa-bars"></i>
            </a>
            <span class="curr-type">计算器</span>
        </div>
        <div class="mode-list-box">
            <div class="container">
                <div class="mode-box" v-for="(item, mIndex) in mode" :key="mIndex">
                    <h2 class="mode-title">{{item.typeName}}</h2>
                    <ul class="list-box">
                        <li v-for="(typeItem, tIndex) in item.list" :key="tIndex">
                            <a class="mode-item"
                               :class="{'curr': typeItem.type===currMode}"
                               @click="getMode(typeItem.type)"
                            >{{typeItem.name}}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="bottom-box">
            <a class="btn">
                <i class="fa fa-info" aria-hidden="true"></i>
                <span>关于</span>
            </a>
            <a class="btn" href="/home">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span>返回目录</span>
            </a>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
    export default {
        name: "cc-menu",
        data(){
            return {
                mode: [
                    {
                        typeName: '计算器',
                        list: [
                            {name: '标准', type: 0},
                            {name: '科学', type: 1},
                            {name: '程序员', type: 2},
                            {name: '日期计算', type: 3}
                        ]
                    },{
                        typeName: '转换器',
                        list: [
                            {name: '货币', type: 4},
                            {name: '体积', type: 5},
                            {name: '长度', type: 6},
                            {name: '重量和质量', type: 7},
                            {name: '温度', type: 8},
                            {name: '能量', type: 9},
                            {name: '面积', type: 10},
                            {name: '速度', type: 11},
                            {name: '时间', type: 12},
                            {name: '功率', type: 13},
                            {name: '数据', type: 14},
                            {name: '压力', type: 15},
                            {name: '角度', type: 16}
                        ]
                    }

                ],
                currMode: 0
            }
        },
        methods: {
            hideMenu: function(){
                this.$emit('closeMenu');
            },
            getMode: function(nType){
                if(nType !== this.currMode){
                    this.currMode = nType;
                    let oSendData = {
                        type: 'mode-change',
                        data: nType
                    };
                    this.$emit('changeMode', oSendData);
                }else{
                    this.hideMenu();
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/css/variable.less";
    .menu-box{
        position: fixed;
        width: 75%;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 10;
        background: @grayWhite;

        .top-box{
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: @grayWhite;
            height: 50px;
            font-size: @f22;
            line-height: 50px;

            a.btn{
                display: inline-block;
                width: 50px;
                height: 50px;
                font-size: @f22;
                line-height: 50px;
                text-align: center;
                &:hover{
                    background: @llGray;
                }
                &:active{
                    background: @dGray;
                }
            }
        }
        .mode-list-box{
            width: 100%;
            height: 100%;
            overflow: auto;

            .container{
                padding-bottom: 110px;
                .mode-box{
                    .mode-title{
                        height: 50px;
                        line-height: 50px;
                        font-size: @f22;
                        padding-left: 50px;
                        font-weight: normal;
                    }
                    .list-box{
                        li{
                            .mode-item{
                                display: block;
                                height: 50px;
                                line-height: 50px;
                                font-size: @f18;
                                padding-left: 55px;

                                &:hover{
                                    background: @llGray;
                                }
                                &:active{
                                    background: @dGray;
                                }

                                &.curr{
                                    background: @blue;
                                    &:hover{
                                        background: @dBlue;
                                    }
                                    &:active{
                                        background: @ddBlue;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .bottom-box{
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 0;
            border-top: 1px solid #D8D8D8;
            background: @grayWhite;

            a.btn{
                display: block;
                height: 50px;
                line-height: 50px;
                font-size: @f18;
                text-decoration: none;
                color: #000;
                cursor: default;

                &:active{
                    background: @dGray;
                }
                &:hover{
                    background: @llGray;
                }
                i.fa{
                    width: 40px;
                    text-align: center;
                    margin-right: 10px;
                }
            }
        }
    }
</style>
