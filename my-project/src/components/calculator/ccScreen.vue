<template>
    <div class="cc-screen">
        <div class="cc-screen-formula">
            <i class="icon fa fa-angle-left"></i>
            <div class="formula-container">
                <p class="formula-content">
                    {{sShowFormula}}
                </p>
            </div>
            <i class="icon fa fa-angle-right"></i>
        </div>
        <div class="cc-screen-num">
            {{sShowNum}}
        </div>
    </div>
</template>

<script>
/* eslint-disable */
    export default {
        name: "cc-screen",
        props:{
            sCurrNum: String,
            sSFormula: String
        },
        computed: {
            // 当前输入的公式
            sShowFormula: function(){
                let sFormula = this.sSFormula;

                sFormula = sFormula
                            .replace(/\(-(\d|\.)+\)/g, "nagete[$&]")
                            .replace(/\(|\)/g, '')
                            .replace(/\+/g, ' + ')
                            .replace(/-/g, ' - ')
                            .replace(/\*/g, ' × ')
                            .replace(/\//g, ' ÷ ')
                            .replace(/\[/g, '(')
                            .replace(/\]/g, ')');

                return sFormula;
            },
            // 当前输入的数
            sShowNum: function(){
                let sNum = this.sCurrNum,
                    sDecimalVal = sNum.split('.')[1] || null,
                    isHavePoint = !!sDecimalVal;

                function digitalFormatting(value, sDec, isHavePoint){
                    let sInt = value.split(".")[0];

                    if(Math.abs(value) < 1000){
                        return value;
                    }

                    sInt = sInt.split("").reverse().join("");
                    sInt = sInt.replace(/\d{3}/g, "$&,");
                    sInt = sInt.split("").reverse().join("");

                    sInt = sInt.replace(/-,/, "-");

                    if( sInt.indexOf(',') === 0 ){
                        sInt = sInt.slice(1);
                    }

                    if(!!sDec){
                        return sInt + "." + sDec;
                    }else{
                        if(isHavePoint){
                            sInt += ".";
                        }
                        return sInt;
                    }

                }

                return digitalFormatting(sNum, sDecimalVal, isHavePoint);
            }
        }
        // watch: {
        //     resultStr: function(nResult, oResult){
        //         let sendData = {
        //             type: 'show-num-changed',
        //             emitEvent: 'checkInputNum',
        //             data: nResult
        //         };
        //
        //         this.$emit(sendData.emitEvent, sendData);
        //     }
        // }
    }
</script>

<style scoped lang="less">
    .cc-screen{
        width: 100%;
        padding: 0 10px;

        .cc-screen-formula{
            box-sizing: content-box;
            height: 16px;
            line-height: 16px;
            padding: 0 15px 18px;
            font-size: 12px;
            position: relative;

            >i.icon{
                display: block;
                width: 15px;
                height: 15px;
                text-align: center;
                line-height: 15px;
                position: absolute;
                color: #0078D7;
                font-weight: bold;

                &:hover{
                     color: #000;
                 }

                &.fa-angle-left{
                     top: 0;
                     left: 0;
                 }
                &.fa-angle-right{
                     top: 0;
                     right: 0;
                 }
            }
            .formula-container{
                width: 100%;
                height: 16px;
                line-height: 16px;
                overflow: hidden;

                .formula-content{
                    color: #666666;
                    text-align: right;
                    /*.no-select;*/
                }
            }
        }
        .cc-screen-num{
            box-sizing: content-box;
            font-size: 52px;
            height: 70px;
            line-height: 60px;
            padding-bottom: 20px;
            text-align: right;
            /*.no-select;*/
        }
    }
</style>
