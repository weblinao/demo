<template>
  <div class="backpack-completely-wrapper">
    <h1 class="title">完全背包问题</h1>
    <p class="desc">
      有n件物品和1个容量为W的背包。<span class="important">每种物品没有上限</span>，第i件物品的重量为weights[i]，
      价值为values[i]，求解将哪些物品装入背包可使价值总和最大。
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
      <button class="btn" @click="knapsack">计算-动态规划(bad)</button>
      <button class="btn" @click="myKnapscak">计算-贪心算法改(good)</button>
    </div>
    <div class="result-desc">
      <p>选取物品分别为：</p>
      <p v-for="(oGood, index) in aSelected" :key="index">
        物品{{oGood.id}}，价值{{oGood.val}}，消耗容量{{oGood.cost}}，数量{{oGood.count}}
      </p>
      <p>总消耗{{nTotalCost}}，总价值{{nTotalVal}}</p>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'completely',
  data () {
    return {
      capacity: 11, // 背包容量
      goods: [ // 商品
        // count: 数量 val: 价值 cost: 消耗容量
        {count: 10000, val: 6, cost: 4},
        {count: 10000, val: 4, cost: 2},
        {count: 10000, val: 5, cost: 7},
        {count: 10000, val: 7, cost: 3},
        {count: 10000, val: 2, cost: 1},

        // {count: 10000, val: 1, cost: 1},
        // {count: 10000, val: 8, cost: 4},
        // {count: 10000, val: 6, cost: 3},
        // {count: 10000, val: 9, cost: 6},
        // {count: 10000, val: 10, cost: 7},
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
     * 创建状态转移表  无法确定选取物品
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
            // let nNext = aResultMatrix[i-1][j-nCost] + nVal;
            // aResultMatrix[i][j] = Math.max(nLast, nNext);
            aResultMatrix[i][j] = 0;
            let nBound = j / nCost;
            for (let k = 0; k <= nBound; k++) {
              aResultMatrix[i][j] = Math.max(aResultMatrix[i][j], aResultMatrix[i-1][j - k*nCost] + k*nVal);
            }
          }
        }
      }

      // let nTotalCost = 0;
      // let aSelected = [];
      // for (let i=NGOODS-1, j=NCAPACITY; i>=0; i--) {
      //   if (aResultMatrix[i][j] > aResultMatrix[i-1][j]){
      //     let oGood = this.goods[i];
      //     aSelected.push(oGood);
      //     j -= oGood.cost;
      //     nTotalCost += oGood.cost
      //   }
      // }
      // this.nTotalCost = nTotalCost;
      this.nTotalVal = aResultMatrix[NGOODS-1][NCAPACITY];
      // this.aSelected = aSelected.reverse();

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
          // 还有剩余空间，放入尽量多的当前物品
          let maxCount = Number.parseInt(nRemainSpace / oCurrGood.cost);
          aSelected.push({...oCurrGood, count: maxCount});
          nRemainSpace -= oCurrGood.cost * maxCount;
          nTotalVal += oCurrGood.val * maxCount;
          nTotalCost += oCurrGood.cost * maxCount;
        } else {
          // 还能放得下，那么放几个好？逐一尝试

          // let isReplace = false;
          // 从利率/消耗比 较低的已选物品开始比较
          for (let j=aSelected.length-1; j>=0; j--) {
            let oTarget = aSelected[j];

            let nAdd = 0;
            let nRemove = 0;
            let nLastVal = nTotalVal;
            const nMaxK = Math.floor((oTarget.cost * oTarget.count + nRemainSpace) / oCurrGood.cost);
            // 从一个开始放
            for (let k=1; k<=nMaxK; k++) {
              // 计算放入k个当前物品要拿出几个比较物品
              let nNeedSpace = k * oCurrGood.cost - nRemainSpace;
              let nRemoveNum = Math.ceil(nNeedSpace / oTarget.cost);
              // 计算替换后的总价值和原总价值比较
              let nTestVal = nTotalVal - nRemoveNum + (k * oCurrGood.val);
              if (nTestVal > nLastVal){
                nLastVal = nTestVal;
                nAdd = k;
                nRemove = nRemoveNum;
              }else{
                break;
              }
            }
            if (nAdd>0) {
              // 先移除nRemove个比较物品
              let nReplaceIndex = j;
              if (nRemove === oTarget.count) {
                aSelected.splice(nReplaceIndex, 1);
              } else {
                aSelected[nReplaceIndex].count -= nRemove;
              }
              nRemainSpace += oTarget.cost * nRemove;
              nTotalVal -= oTarget.val * nRemove;
              nTotalCost -= oTarget.cost * nRemove;
              // 再加入nAdd个当前物品
              aSelected.push({...oCurrGood, count: nAdd});
              nRemainSpace -= oCurrGood.cost * nAdd;
              nTotalVal += oCurrGood.val * nAdd;
              nTotalCost += oCurrGood.cost * nAdd;
            }
            if (nRemainSpace===0) break;
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
  .backpack-completely-wrapper{
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
