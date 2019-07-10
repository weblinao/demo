<template>
    <div class="history-box">
        <ul class="detail" v-if="isHaveHistory">
            <li class="detail-item" v-for="(item, index) in aHistorys" @click="choseHistory(index)" :key="index">
                <p class="formula">{{ item.sShowFormula }}</p>
                <p class="answer">{{ item.nResult }}</p>
            </li>
        </ul>
        <h1 class="no-data" v-else>尚无历史记录</h1>
        <div class="bottom-box" :class="{ 'no-data': !isHaveHistory}">
            <a class="btn" @click="deleteHistorys">
                <i class="fa fa-trash-o" aria-hidden="true"></i>
            </a>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
    export default {
        name: "cc-history",
        props: [ 'sendHistory'],
        data(){
            return {
                aHistorys: []
            }
        },
        computed: {
            isHaveHistory: function(){
                return !!this.aHistorys.length;
            }
        },
        methods: {
            deleteHistorys: function(){
                // console.log('delete historys');
                this.aHistorys = [];
                this.$emit('deleteAll');
            },
            choseHistory: function(index){
                let oSendData = {
                    type: 'history-clk',
                    data: this.aHistorys[index]
                };

                this.$emit('choseHistory', oSendData);
            }
        },
        watch: {
            sendHistory: function(val){
                let sShowFormula = val.sFormula;

                sShowFormula = sShowFormula
                    .replace(/\(-(\d|\.)+\)/g, "nagete[$&]")
                    .replace(/\(|\)/g, '')
                    .replace(/\+/g, ' + ')
                    .replace(/-/g, ' - ')
                    .replace(/\*/g, ' × ')
                    .replace(/\//g, ' ÷ ')
                    .replace(/\[/g, '(')
                    .replace(/\]/g, ')');

                val.sShowFormula = sShowFormula;

                this.aHistorys.unshift(val);
                this.$emit('pushNewHistory');
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/css/variable.less";
    .history-box{
        position: fixed;
        top: 218px;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
        background: @gray;

        .detail{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 50px;
            overflow: auto;

            .detail-item{
                text-align: right;
                padding-right: 10px;
                margin: 20px 0;
                transition: all 100ms;

                &:hover{
                    background: @llGray;
                }
                &:active{
                    background: @dGray;
                    padding-right: 15px;
                }
                .formula{
                    color: @coffee;
                    font-size: @f16;
                    line-height: 1.5;
                }
                .answer{
                    font-size: @f24;
                    line-height: 1.5;
                }
            }
        }
        .no-data{
            padding: 15px;
            font-size: @f20;
        }
        .bottom-box{
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 0;
            height: 50px;

            &.no-data{
                display: none;
            }
            a.btn{
                display: block;
                width: 50px;
                height: 50px;
                font-size: 26px;
                line-height: 50px;
                text-align: center;
                float: right;
                &:hover{
                    background: @llGray;
                }
                &:active{
                    background: @dGray;
                }
            }
        }
    }

</style>
