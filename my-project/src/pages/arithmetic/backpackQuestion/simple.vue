<template>
  <div class="backpack-simple-wrapper">
    <h1 class="title">01背包问题</h1>
    <p class="desc">
      有n件物品和1个容量为W的背包。<span class="important">每种物品均只有一件</span>，第i件物品的重量为weights[i]，
      价值为values[i]，求解将哪些物品装入背包可使价值总和最大。对于一种物品，要么装入
      背包，要么不装。所以对于一种物品的装入状态只是1或0, 此问题称为01背包问题。
    </p>
    <div class="condition-desc">
      <p>
        共<span class="good-num">{{goods.length}}</span>个物品
      </p>
      <p>
        物品的价值分别为 <span>{{sVals}}</span>
      </p>
      <p>
        物品消耗空间分别为 <span>{{sCosts}}</span>
      </p>
      <p>
        现有背包容量为 <span>{{capacity}}</span>
      </p>
      <button class="btn" @click="knapsack">计算-动态规划(good)</button>
      <button class="btn" @click="myKnapscak">计算-贪心算法改(good)</button>
    </div>
    <div class="result-desc">
      <p>选取物品分别为：</p>
      <p v-for="(oGood, index) in aSelected" :key="index">
        物品{{oGood.id}}，价值{{oGood.val}}，消耗容量{{oGood.cost}}
      </p>
      <p>总消耗{{nTotalCost}}，总价值{{nTotalVal}}</p>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'simple',
  data () {
    return {
      capacity: 10, // 背包容量
      goods: [ // 商品
        // count: 数量 val: 价值 cost: 消耗容量
        {count: 1, val: 6, cost: 2},
        {count: 1, val: 4, cost: 1},
        {count: 1, val: 5, cost: 7},
        {count: 1, val: 7, cost: 4},
        {count: 1, val: 6, cost: 4},

        {count: 1, val: 1, cost: 1},
        {count: 1, val: 8, cost: 4},
        {count: 1, val: 6, cost: 2},
        {count: 1, val: 9, cost: 6},
        {count: 1, val: 10, cost: 7},
      ],
      aSelected: [],
      nTotalCost: 0,
      nTotalVal: 0
    }
  },
  computed: {
    sVals: function () {
      let sVals = "";
      for (let good of this.goods.values()) {
        sVals += '、' + good.val;
      }
      sVals = sVals.substring(1);

      return sVals;
    },
    sCosts: function () {
      let sCosts = "";
      for (let good of this.goods.values()) {
        sCosts += '、' + good.cost;
      }
      sCosts = sCosts.substring(1);

      return sCosts;
    }
  },
  methods: {
    initData: function () {
      // console.log('init data');
      for (let [index, oGood] of this.goods.entries()) {
        let nRate = oGood.val / oGood.cost;
        this.$set(this.goods, index, {
          ...oGood,
          rate: nRate,
          id: index
        })
      }
    },
    /**
     * 创建状态转移表
     * */
    knapsack: function () {
      console.time("动态规划");
      const NGOODS = this.goods.length;
      const NCAPACITY = this.capacity;
      let aResultMatrix = [];

      aResultMatrix[-1] = new Array(NCAPACITY+1).fill(0);
      for (let i=0; i<NGOODS; i++) {
        aResultMatrix[i] = [];
        let nCost = this.goods[i].cost;
        let nVal = this.goods[i].val;

        for (let j=0; j<=NCAPACITY; j++) {
          let nLast = aResultMatrix[i-1][j];
          if (j < nCost) {
            aResultMatrix[i][j] = nLast;
          } else {
            let nNext = aResultMatrix[i-1][j-nCost] + nVal;
            aResultMatrix[i][j] = Math.max(nLast, nNext);
          }
        }
      }

      let nTotalCost = 0;
      let aSelected = [];
      for (let i=NGOODS-1, j=NCAPACITY; i>=0; i--) {
        if (aResultMatrix[i][j] > aResultMatrix[i-1][j]){
          let oGood = this.goods[i];
          aSelected.push(oGood);
          j -= oGood.cost;
          nTotalCost += oGood.cost
        }
      }
      this.nTotalCost = nTotalCost;
      this.nTotalVal = aResultMatrix[NGOODS-1][NCAPACITY];
      this.aSelected = aSelected.reverse();

      // console.table(aResultMatrix);
      // console.log(this.aSelected);
      // console.log(this.nTotalCost);
      console.timeEnd("动态规划");
    },
    // 贪心算法，优先放入利率比高，消耗少的
    myKnapscak: function () {
      console.time("贪心算法");
      let aGoods = [...this.goods];
      // 按 价值/消耗 比从大到小排列， 同比的按消耗从小到大排列
      aGoods.sort(function (a, b) {
        if (a.rate === b.rate) return a.cost - b.cost;
        return b.rate - a.rate
      });

      // console.table(aGoods);
      let nRemainSpace = this.capacity;
      let nLen = aGoods.length;
      let aSelected = [];
      let nTotalCost = 0;
      let nTotalVal = 0;

      for (let i=0; i<nLen; i++){
        if (nRemainSpace===0) break;

        let oCurrGood = aGoods[i];
        if (nRemainSpace >= oCurrGood.cost) {
          // 还有剩余空间，放入当前物品
          aSelected.push(oCurrGood);
          nRemainSpace -= oCurrGood.cost;
          nTotalVal += oCurrGood.val;
          nTotalCost += oCurrGood.cost;
        } else {
          let nNeedSpace = oCurrGood.cost - nRemainSpace; // 还需要多少空间才能装上
          // 筛选已选物品中可替换的物品
          let aMayReplace = aSelected.filter(function (oGood) {
            return oGood.cost >= nNeedSpace;
          });
          if (aMayReplace && aMayReplace.length) {
            // 可能替换数组按价值 从小到大 排列
            aMayReplace.sort(function (a, b) {
              return a.val - b.val;
            });
            let oMayReplace = aMayReplace[0];
            // 可替换物品的价值比当前物品的价值低
            if (oMayReplace.val < oCurrGood.val){
              // 移除可替换物品
              aSelected = aSelected.filter(function (oGood) {
                return oGood.id !== oMayReplace.id;
              });
              nRemainSpace += oMayReplace.cost;
              nTotalVal -= oMayReplace.val;
              nTotalCost -= oMayReplace.cost;
              // 放入当前物品
              aSelected.push(oCurrGood);
              nRemainSpace -= oCurrGood.cost;
              nTotalVal += oCurrGood.val;
              nTotalCost += oCurrGood.cost;
            }
          }
        }
      }

      this.nTotalCost = nTotalCost;
      this.nTotalVal = nTotalVal;
      this.aSelected = aSelected;
      console.timeEnd("贪心算法");
    }
  },
  mounted () {
    this.initData();
  }
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";
  .backpack-simple-wrapper{
    padding: 0 15px;

    .title{
      .font(@f20, @c00, center, 1.5);
      padding-top: 20px;
    }
    .desc{
      .font(@f14, @coffee, justify, 1.5);
      text-indent: 2 * @f14;
      .important{
        color: @red;
        font-style: italic;
      }
    }
    .condition-desc{
      margin-top: 10px;

      .btn{
        display: block;
        border: 1px solid @dBlue;
        .wh(100%, 30px);
        background: @lBlue;
        border-radius: 5px;
        color: @ddBlue;
        margin-top: 10px;
        outline: none;
      }
    }
    .result-desc{
      margin-top: 10px;
    }
  }
</style>
