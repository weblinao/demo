<template>
    <div>
        <div class="cc-menu-bar">
            <a class="btn btn-bar" @click="showMenu">
                <i class="icon fa fa-bars"></i>
            </a>
            <span class="cc-mode">{{currModeStr}}</span>
            <a class="btn btn-history" :class="{ 'disabled': !isHaveHistory}" @click="showHistory">
                <i class="fa fa-history"></i>
            </a>
        </div>
        <div
            is="vHistory"
            class="box-init"
            :class="{ 'no-show': !isShowHistory}"
            @deleteAll="setNoData"
            @choseHistory="getHistory"
            @pushNewHistory="setHistoryHaveData"
            :send-history="sendHistory"
        ></div>
        <div
            is="vMenu"
            class="menu-init"
            :class="{ 'no-show': !isShowMenu}"
            @closeMenu="hideMenu"
            @changeMode="getNewMode"
        ></div>
    </div>

</template>

<script>
/* eslint-disable */
    import vHistory from '@modulePath/calculator/ccHistory.vue';
    import vMenu from '@modulePath/calculator/ccMenu.vue';
    export default  {
        name: "cc-menu-bar",
        components: {
            vHistory,
            vMenu
        },
        props: [ 'sendHistory'],
        data(){
            return {
                currMode: 1,  // 当前模式： 标准
                isHaveHistory: false,  // 是否含有历史记录
                isShowHistory: false,   // 是否显示历史记录
                isShowMenu: false   // 是否显示菜单
            };
        },
        computed: {
            currModeStr: function(){
                let str = '';

                switch(this.currMode){
                    case 1: str = '标准';
                        break;
                    default:break;
                }
                return str;
            }
        },
        methods: {
            showHistory: function(){
                if(this.isHaveHistory && !this.isShowHistory){
                    this.isShowHistory = true;
                    this.$emit('historyShow', true);
                }else{
                    this.hideHistory();
                }
            },
            hideHistory: function(){
                this.isShowHistory = false;
                this.$emit('historyShow', false);
            },
            setHistoryHaveData: function(){
                this.isHaveHistory = true;
            },
            setNoData: function(){
                this.isHaveHistory = false;
            },
            getHistory: function(data){
                console.log(data);
                // 将数据发给计算器
                this.hideHistory();
            },
            showMenu: function(){
                this.isShowMenu = true;
            },
            hideMenu: function(){
                this.isShowMenu = false;
            },
            getNewMode: function(data){
                console.log(data);
                // 将数据发给计算器
                this.hideMenu();
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/css/variable.less";

    .cc-menu-bar{
        width: 100%;
        height: 55px;
        line-height: 55px;
        position: relative;

        a.btn{
            display: inline-block;
            width: 55px;
            height: 55px;
            font-size: @f20;
            line-height: 55px;
            text-align: center;

            &.btn-bar{
                margin-right: 15px;
            }
            &.btn-history{
                float: right;
            }
            &:active{
                background: @dGray;
            }
            &:hover{
                background: @llGray;
            }
        }
        .cc-mode{
            font-size: @f24;
        }
        .disabled{
            color: @disableColor !important;
            background: @gray !important;
        }
    }
    .box-init{
        transition: all .3s;

        &.no-show{
            top: 100%;
            bottom: -100%;
        }
    }
    .menu-init{
        transition: all .3s;

        &.no-show{
            left: -100%;
        }
    }
</style>
