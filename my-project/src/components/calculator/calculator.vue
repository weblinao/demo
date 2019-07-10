<template>
    <div class="calculator">
        <div
            is="menuBar"
            @historyShow="historyStateChange"
            :send-history="oDataToHistory"
        ></div>
        <div
            is="screen"
            :s-curr-num="sShowNum"
            :s-s-formula="sShowFormula"
        ></div>
        <div
            is="keyboard"
            @keyClick="getMsg"
            :curr-num="sShowNum"
            :is-showing-history="isShowingHistory"
        ></div>
    </div>
</template>

<script>
/* eslint-disable */
    import menuBar from '@modulePath/calculator/ccMenuBar.vue';
    import screen from '@modulePath/calculator/ccScreen.vue';
    import keyboard from '@modulePath/calculator/ccKeyboard.vue';

    export default {
        name: "calculator",
        components: {
            menuBar,
            screen,
            keyboard
        },
        data(){
            return {
                msg: 'this is calculator',
                oCurrInput: {
                    sInt: '0',          // 整数部分字符串
                    sDec: '',           // 小数部分字符串
                    isHavePoint: false,  // 是否有小数点
                    isNegate: false      // 是否是负数
                },
                nLastResult: 0,        // 上次计算结果
                nextOperate: 0,        // 下一步计算操作 0：无操作 1：+ 2：- 3：* 4：/
                sSFormula: '',       // 储存公式
                nClcStatus: 0,       // 计算状态： 0：未计算 1：计算完成 2：准备 3: 函数计算结果 4：错误
                isShowingHistory: false,
                oDataToHistory: {}
            }
        },
        computed: {
            // 当前输入的字符串形式
            sCurrNum: function(){
                let sNum = '';
                if(this.oCurrInput.isNegate) sNum += '-';
                sNum += this.oCurrInput.sInt;
                if(this.oCurrInput.isHavePoint){
                    sNum += '.' + this.oCurrInput.sDec;
                }

                return sNum;
            },
            sShowNum: function(){
                // 计算状态为0、2，显示当前输入的数，计算状态为1，显示计算结果
                return this.nClcStatus === 1 ? this.nLastResult.toString() : this.sCurrNum;
            },
            // 当前输入的number形式
            nCurrNum: function(){
                return parseFloat(this.sCurrNum);
            },
            // 下一步计算操作
            sNextOperate: function(){
                let sOperate = '';
                switch (this.nextOperate){
                    case 1:
                        sOperate = '+';
                        break;
                    case 2:
                        sOperate = '-';
                        break;
                    case 3:
                        sOperate = '×';
                        break;
                    case 4:
                        sOperate = '÷';
                        break;
                }

                return sOperate;
            },
            // 用于展示的公式
            sShowFormula: function(){
                return this.sSFormula + this.sNextOperate;
            }
        } ,
        methods: {
            getMsg: function(oData){
                let sCommand = oData.type;
                console.log(oData);
                switch(sCommand){
                    case 'key-num':
                        this.numClick(oData.data);
                        break;
                    case 'key-dPoint':
                        this.dPointClick();
                        break;
                    case 'key-negate':
                        this.negateClick();
                        break;
                    case 'key-clear':
                        this.clearClick(oData.data);
                        break;
                    case 'key-arithmetic':
                        this.arithmeticClick(oData.data);
                        break;
                    case 'key-Sfn':
                        this.singleFnClick(oData.data);
                        break;
                }
            },
            historyStateChange: function(isShow){
                this.isShowingHistory = isShow;
            },
            setCurrInput: function(n){
                let isNegate = n < 0,
                    sNum = n.toString().replace('-', '').split('.'),
                    isHavePoint = sNum.length > 1,
                    sDec = isHavePoint ? sNum[1] : ''
                ;

                this.oCurrInput.sInt = sNum[0];
                this.oCurrInput.sDec = sDec;
                this.oCurrInput.isHavePoint = isHavePoint;
                this.oCurrInput.isNegate = isNegate;
            },
            clearCurrInput: function(){
                this.oCurrInput.sInt = '0';
                this.oCurrInput.sDec = '';
                this.oCurrInput.isHavePoint = false;
                this.oCurrInput.isNegate = false;
            },
            clearFormula: function(){
                this.sSFormula = '';
            },
            //  将当前输入数放入储存公式中
            pushNumToFormula: function(){
                let sNum = this.nCurrNum.toString();
                this.sSFormula += sNum;
            },
            //  将下一步操作放入储存公式中
            pushOpeToFormula: function(){
                let sOperate = '';
                switch (this.nextOperate){
                    case 1:
                        sOperate = '+';
                        break;
                    case 2:
                        sOperate = '-';
                        break;
                    case 3:
                        sOperate = '*';
                        break;
                    case 4:
                        sOperate = '/';
                        break;
                }

                this.sSFormula += sOperate;
            },
            setLastResult: function(n){
                this.nLastResult = n;
            },
            // 退格
            backspace: function(){
                if(this.oCurrInput.isHavePoint){
                    if(this.oCurrInput.sDec.length > 0){
                        let arr = this.oCurrInput.sDec.split('');
                        arr.pop();
                        arr = arr.join('');
                        this.oCurrInput.sDec = arr;
                    }else{
                        this.oCurrInput.isHavePoint = false;
                    }
                }else{
                    if(this.oCurrInput.sInt.length > 1){
                        let arr = this.oCurrInput.sInt.split('');
                        arr.pop();
                        arr = arr.join('');
                        this.oCurrInput.sInt = arr;
                    }else{
                        this.oCurrInput.sInt = '0';
                        this.oCurrInput.isNegate = false;
                    }
                }
            },
            // 做四则运算
            doCalculate: function(){
                let nResult = 0;
                switch (this.nextOperate){
                    case 1:
                        nResult = this.nLastResult +this.nCurrNum;
                        break;
                    case 2:
                        nResult = this.nLastResult - this.nCurrNum;
                        break;
                    case 3:
                        nResult = this.nLastResult * this.nCurrNum;
                        break;
                    case 4:
                        nResult = this.nLastResult / this.nCurrNum;
                        break;
                }
                // 保存计算结果
                this.nLastResult = nResult;
                // 重置下一步操作
                this.nextOperate = 0;
                // 设置计算状态为完成计算
                this.nClcStatus = 1;

            },
            storeToHistory: function(sData){
                this.oDataToHistory = sData;
            },
            numClick: function(n){
                // 前一步得到计算结果
                if(this.nClcStatus === 1){
                    this.clearFormula();
                    this.clearCurrInput();
                    this.nClcStatus = 0;
                }
                // 已经有了下一步操作
                if(this.nextOperate !== 0 && this.nClcStatus !== 2){
                    // 清除当前输入，准备新的输入
                    this.clearCurrInput();
                    // 设置计算状态为 准备计算
                    this.nClcStatus = 2;
                }

                let nCurrInt = this.oCurrInput.sInt;

                if(this.oCurrInput.isHavePoint){
                    this.oCurrInput.sDec += n;
                }else{
                    if(nCurrInt === '0'){
                        nCurrInt = n.toString();
                    }else{
                        nCurrInt += n;
                    }
                    this.oCurrInput.sInt = nCurrInt;
                }
            },
            dPointClick: function(){
                this.oCurrInput.isHavePoint = true;
            },
            negateClick: function(){
                this.oCurrInput.isNegate = !this.oCurrInput.isNegate;
            },
            clearClick: function(nType){
                switch (nType){
                    case 1:
                        this.clearCurrInput();
                        this.nClcStatus = 0;
                        break;
                    case 2:
                        this.clearFormula();
                        this.clearCurrInput();
                        this.nClcStatus = 0;
                        this.nextOperate = 0;
                        break;
                    case 3:
                        this.backspace();
                        break;
                }
            },
            arithmeticClick: function(nType){
                if(nType !== 5){
                    if(this.sSFormula.length === 0){
                        // 未有过计算
                        // 将当前输入数作为上一步计算结果
                        this.setLastResult(this.nCurrNum);
                        // 储存数字
                        this.pushNumToFormula();
                    }
                    // 准备计算的情况下直接计算
                    if(this.nClcStatus === 2){
                        // 储存操作
                        this.pushOpeToFormula();
                        // 储存数字
                        this.pushNumToFormula();
                        // 计算
                        this.doCalculate();
                        // 删除当前输入
                        this.clearCurrInput();
                    }
                    this.nextOperate = nType;
                }else{
                    // =键 求结果
                    // =的计算是上一步计算结果和 当前显示数 的计算结果
                    this.setCurrInput(parseFloat(this.sShowNum));
                    this.pushOpeToFormula();
                    this.pushNumToFormula();
                    this.doCalculate();

                    // 将计算结果和公式放入历史记录
                    this.storeToHistory({
                        sFormula: this.sSFormula,
                        nResult: this.nLastResult
                    });
                    // 删除当前输入
                    this.clearCurrInput();
                    this.clearFormula();
                }

            },
            singleFnClick: function(nType){
                // 简单的函数计算只对当前数进行运算，不计入历史
                switch (nType){
                    case 1:
                        // 取百分比
                        this.getPercent();
                        break;
                    case 2:
                        // 取平方根
                        this.getSquareRoot();
                        break;
                    case 3:
                        // 取平方
                        this.getSquare();
                        break;
                    case 4:
                        // 取n分之一
                        this.getSeparate();
                        break;
                }

            },
            getPercent: function(){
                let nTarget = parseFloat(this.sShowNum),
                    nResult = nTarget / 100
                ;

                this.setCurrInput(nResult);
                this.nClcStatus = this.nClcStatus === 1 ? 0 : this.nClcStatus;
            },
            getSquareRoot: function(){
                let nTarget = parseFloat(this.sShowNum),
                    nResult = Math.sqrt(nTarget)
                ;

                this.setCurrInput(nResult);
                this.nClcStatus = this.nClcStatus === 1 ? 0 : this.nClcStatus;
            },
            getSquare: function(){
                let nTarget = parseFloat(this.sShowNum),
                    nResult = Math.pow(nTarget, 2)
                ;

                this.setCurrInput(nResult);
                this.nClcStatus = this.nClcStatus === 1 ? 0 : this.nClcStatus;
            },
            getSeparate: function(){
                let nTarget = parseFloat(this.sShowNum),
                    nResult = 0
                ;

                if(nTarget !== 0){
                    nResult = 1 / nTarget;
                }else{

                    return;
                }

                this.setCurrInput(nResult);
                this.nClcStatus = this.nClcStatus === 1 ? 0 : this.nClcStatus;
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/css/variable.less";
    .calculator{
        min-width: 320px;
        background: @gray;
    }
</style>
