<template>
    <div class="cc-keyboard">
        <div class="mem-btn-box" @click="keyboardClick">
            <a class="btn" @click="keyRAMClick(1)" :class="{'disable': !isHaveRAM || isErr || isShowingRAM || isShowingHistory}">MC</a>
            <a class="btn" @click="keyRAMClick(2)" :class="{'disable': !isHaveRAM || isErr || isShowingRAM || isShowingHistory}">MR</a>
            <a class="btn" @click="keyRAMClick(3)" :class="{'disable': isErr || isShowingRAM || isShowingHistory}">M+</a>
            <a class="btn" @click="keyRAMClick(4)" :class="{'disable': isErr || isShowingRAM || isShowingHistory}">M-</a>
            <a class="btn" @click="keyRAMClick(5)" :class="{'disable': isErr || isShowingRAM || isShowingHistory}">MS</a>
            <a class="btn" @click="showRAMBox" :class="{'disable': !isHaveRAM || isShowingHistory}">
                M<i class="icon fa fa-caret-down"></i>
            </a>
        </div>
        <div class="main-btn-box" @click="keyboardClick">
            <a class="btn" @click="keySfnClick(1)" :class="{'disable': isErr}">
                <div class="container">%</div>
            </a>
            <a class="btn" @click="keySfnClick(2)" :class="{'disable': isErr}">
                <div class="container">√</div>
            </a>
            <a class="btn" @click="keySfnClick(3)" :class="{'disable': isErr}">
                <div class="container">
                    <span>x</span><span>2</span>
                </div>
            </a>
            <a class="btn" @click="keySfnClick(4)" :class="{'disable': isErr}">
                <div class="container">
                    <span>1</span><span>/</span><span>x</span>
                </div>
            </a>

            <a class="btn" @click="keyClearClick(1)">
                <div class="container">CE</div>
            </a>
            <a class="btn" @click="keyClearClick(2)">
                <div class="container">C</div>
            </a>
            <a class="btn" @click="keyClearClick(3)">
                <div class="container">
                    <i class="icon fa fa-times-circle-o"></i>
                </div>
            </a>
            <a class="btn btn-fn" @click="keyArithmeticClick(4)" :class="{'disable': isErr}">
                <div class="container">÷</div>
            </a>

            <a class="btn btn-num" @click="keyNumClick(7)">
                <div class="container">7</div>
            </a>
            <a class="btn btn-num" @click="keyNumClick(8)">
                <div class="container">8</div>
            </a>
            <a class="btn btn-num" @click="keyNumClick(9)">
                <div class="container">9</div>
            </a>
            <a class="btn btn-fn" @click="keyArithmeticClick(3)" :class="{'disable': isErr}">
                <div class="container">×</div>
            </a>

            <a class="btn btn-num" @click="keyNumClick(4)">
                <div class="container">4</div>
            </a>
            <a class="btn btn-num" @click="keyNumClick(5)">
                <div class="container">5</div>
            </a>
            <a class="btn btn-num" @click="keyNumClick(6)">
                <div class="container">6</div>
            </a>
            <a class="btn btn-fn" @click="keyArithmeticClick(2)" :class="{'disable': isErr}">
                <div class="container">-</div>
            </a>

            <a class="btn btn-num" @click="keyNumClick(1)">
                <div class="container">1</div>
            </a>
            <a class="btn btn-num" @click="keyNumClick(2)">
                <div class="container">2</div>
            </a>
            <a class="btn btn-num" @click="keyNumClick(3)">
                <div class="container">3</div>
            </a>
            <a class="btn btn-fn" @click="keyArithmeticClick(1)" :class="{'disable': isErr}">
                <div class="container">+</div>
            </a>

            <a class="btn" @click="keyNegateClick" :class="{'disable': isErr}">
                <div class="container">±</div>
            </a>
            <a class="btn btn-num" @click="keyNumClick(0)">
                <div class="container">0</div>
            </a>
            <a class="btn" @click="keyDPointClick" :class="{'disable': isErr}">
                <div class="container">.</div>
            </a>
            <a class="btn btn-fn" @click="keyArithmeticClick(5)">
                <div class="container">=</div>
            </a>
        </div>
        <div
            is="ram"
            class="ramBox-init"
            :class="{ 'no-show': !isShowingRAM}"
            @clearRAM="setNoRAM"
            @choseRAM="getRAM"
            @ramStore="ramStored"
            :curr-num="currNum"
            :command="sendCommand"
        ></div>
    </div>
</template>

<script>
/* eslint-disable */
    import ram from '@modulePath/calculator/ccRam.vue';
    export default {
        name: "cc-keyboard",
        props: [ 'currNum', 'isShowingHistory' ],
        components: {
            ram
        },
        data(){
            return {
                isHaveRAM: false,
                isErr: false,
                isShowingRAM: false,
                sendCommand: {}
            }
        },
        methods: {
            sendData: function(oSendData){
                this.$emit('keyClick', oSendData);
            },
            keyNumClick: function(num){
                let oSendData = {
                    type: 'key-num',
                    data: num
                };
                this.sendData(oSendData);
            },
            /*
            * oType: 操作类型
            * 1：清除所有内存
            * 2：重新调用内存
            * 3：内存加
            * 4：内存减
            * 5：内存储存
            * 6；显示内存
            * */
            keyRAMClick: function(oType){
                if(this.isShowingRAM){
                    this.hideRAMBox();
                    return;
                }
                if(!this.isHaveRAM && (oType === 1 || oType === 2)) return;
                let oSendData = {
                    type: 'ram-command',
                    data: oType,
                };
                this.sendCommand = oSendData;
            },
            /*
            * operate: 操作类型
            * 1：+
            * 2：-
            * 3：*
            * 4：/
            * 5：=
            * */
            keyArithmeticClick: function(operate){
                if(this.isErr && operate !== 5) return false;
                let oSendData = {
                    type: 'key-arithmetic',
                    data: operate
                };
                this.sendData(oSendData);
            },
            keyDPointClick: function(){
                if(this.isErr) return false;
                let oSendData = {
                    type: 'key-dPoint'
                };
                this.sendData(oSendData);
            },
            keyNegateClick: function(){
                if(this.isErr) return false;
                let oSendData = {
                    type: 'key-negate'
                };
                this.sendData(oSendData);
            },
            /*
            * oType: 操作类型
            * 1：清除当前输入
            * 2：清除当前所有输入（包括公式）
            * 3：清除上一步输入
            * */
            keyClearClick: function(oType){
                if(this.isErr) return false;
                let oSendData = {
                    type: 'key-clear',
                    data: oType
                };
                this.sendData(oSendData);
            },
            /*
            * oType: 操作类型
            * 1：求百分比
            * 2：取平方根
            * 3：计算平方
            * 4：取1/n
            * */
            keySfnClick: function(oType){
                if(this.isErr) return false;
                let oSendData = {
                    type: 'key-Sfn',
                    data: oType
                };
                this.sendData(oSendData);
            },
            setNoRAM: function(){
                this.isHaveRAM = false;
            },
            getRAM: function(data){
                this.sendData(data);
                this.hideRAMBox();
            },
            showRAMBox: function(){
                if(this.isShowingRAM){
                    this.hideRAMBox();
                    return;
                }
                if(!this.isHaveRAM) return;
                this.isShowingRAM = true;
            },
            hideRAMBox: function(){
                this.isShowingRAM = false;
            },
            ramStored: function(){
                this.isHaveRAM = true;
            },
            keyboardClick: function(){
                let oSendData = {
                    type: 'keyboard-click'
                };
                // this.sendData(oSendData);
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/css/variable.less";
    .cc-keyboard{
        position: fixed;
        top: 179px;
        bottom: 0;
        left: 0;
        right: 0;
        background: @gray;

        .mem-btn-box{
            margin-top: 10px;
            margin-bottom: 5px;
            display: flex;
            justify-content: space-around;

            a.btn{
                display: block;
                width: 17%;
                margin: 0 1%;
                text-align: center;
                font-size: @f12;
                line-height: 2;
                &:hover{
                    background: @llGray;
                }
                &:active{
                    background: @dGray;
                }
                &.disable{
                    background: @gray !important;
                }
            }
        }
        .main-btn-box{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            width: 100%;
            position: absolute;
            top: 39px;
            bottom: 0;
            left: 0;
            right: 0;

            a.btn{
                display: table;
                width: 23.9%;
                height: 15.5%;
                margin: 0.5%;
                text-align: center;
                font-size: @f24;
                background: @dWhite;

                &.btn-num{
                    background: @white;
                    font-weight: bold;
                }
                &:hover{
                    background: @llGray;
                }
                &:active{
                    background: @dGray;
                }
                &.btn-fn{
                    font-size: 50px;
                    font-weight: normal;
                    &:active{
                        background: @lBlue;
                        color: @white;
                    }
                    &:hover{
                        background: @blue;
                        color: @white;
                    }
                }
                &.disable{
                    background: @dWhite !important;
                }

                .container{
                    display: table-cell;
                    vertical-align: middle;
                }
            }
        }

        .disable{
            color: @disableColor !important;
        }
        .ramBox-init{
            transition: all .3s;

            &.no-show{
                top: 100%;
                bottom: -100%;
            }
        }
    }
</style>
