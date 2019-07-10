<template>
    <div class="ram-box">
        <ul class="detail" v-if="isHaveRam">
            <li class="detail-item" v-for="(item, index) in aRams" :key="index">
                <p class="num" @click="choseRam(index)">{{ item }}</p>
                <div class="btns">
                    <a class="btn" @click="ramClear(index)">MC</a>
                    <a class="btn" @click="ramAdd(index)">M+</a>
                    <a class="btn" @click="ramSub(index)">M-</a>
                </div>
            </li>
        </ul>
        <h1 class="no-data" v-else>内存中没有内容</h1>
        <div class="bottom-box" :class="{ 'no-data': !isHaveRam}">
            <a class="btn" @click="deleteRams">
                <i class="fa fa-trash-o" aria-hidden="true"></i>
            </a>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
    export default {
        name: "cc-ram",
        props: [ 'currNum', "command" ],
        data(){
            return {
                aRams: []
            }
        },
        computed: {
            isHaveRam: function(){
                return !!this.aRams.length;
            },
            currInput: function(){
                return parseFloat(this.currNum);
            }
        },
        methods: {
            deleteRams: function(){
                this.aRams = [];
                this.$emit('clearRAM');
            },
            choseRam: function(index){
                let oSendData = {
                    type: 'ram-chose',
                    data: this.aRams[index]
                };

                this.$emit('choseRAM', oSendData);
            },
            ramClear: function(index){
                this.aRams.splice(index, 1);
            },
            ramAdd: function(index){
                let newNum = this.aRams[index] + this.currInput;
                this.$set(this.aRams, index, newNum);
            },
            ramSub: function(index){
                let newNum = this.aRams[index] - this.currInput;
                this.$set(this.aRams, index, newNum);
            },
            addNewRam: function(isEmpty=false){
                if(isEmpty){
                    this.aRams.unshift(0);
                }else{
                    this.aRams.unshift(this.currInput);
                }

                this.$emit("ramStore");
            }
        },
        watch: {
            command: function(val){
                let commandType = val.data;
                switch (commandType){
                    case 1: this.deleteRams();
                            break;
                    case 2: this.choseRam(0);
                            break;
                    case 3: if(!this.isHaveRam){
                                this.addNewRam(true);
                            }
                            this.ramAdd(0);
                            break;
                    case 4: if(!this.isHaveRam){
                                this.addNewRam(true);
                            }
                            this.ramSub(0);
                            break;
                    case 5: this.addNewRam();
                            break;
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/css/variable.less";
    .ram-box{
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
                margin: 20px 0;
                transition: all 100ms;

                &:hover{
                    background: @dGray;
                }
                &:active{
                    background: @dGray;
                }
                .num{
                    font-size: @f22;
                    font-weight: bold;
                    line-height: 2;
                    padding-right: 10px;
                }
                .btns{
                    padding-bottom: 5px;
                    a.btn{
                        display: inline-block;
                        width: 64px;
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        margin-right: 10px;
                        border: 3px solid transparent;

                        &:hover{
                            border: 3px solid rgba(223,223,223, 0.5);
                        }
                    }
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
