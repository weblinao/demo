<template>
  <div class="sku-wrapper">
    <header class="title">SKU算法演示</header>
    <div class="chose-box" v-for="(item, index) in choseList" :key="index">
      <h4 class="chose-title">{{item.desc}}</h4>
      <ul class="chose-list">
        <li :class="{ 'chosed': cItem.id===item.chosenID, 'cant-chose': !cItem.isCanChose}"
            v-for="(cItem, cIndex) in item.data"
            @click="choiceChosen(cItem)"
            :key="cIndex">{{cItem.desc}}</li>
      </ul>
    </div>
    <div class="result-box">
      <p>已选产品ID：{{oResult.id}}</p>
      <p>现有库存：{{oResult.count}}</p>
      <p>单价：￥{{oResult.price}}</p>
    </div>
    <div class="hint">
      过程计算结果，用质数代替ID排序，可生产，无需拼凑ID<br>
      skuID扔需属性id拼凑或直接指示两者关系的联系
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'sku-prime-num',
  data(){
    return {
      choseList: {
        colors: {
          desc: "颜色",
          chosenID: null,
          data: [
            { id: "k4512", desc: "红色"},
            { id: "c-02", desc: "银色"},
            { id: "c-03", desc: "金色"},
            { id: "c-04", desc: "黑色"},
          ]
        },
        sizes: {
          desc: "尺寸",
          chosenID: null,
          data: [
            { id: "s-01", desc: "4.5寸"},
            { id: "i3ejr", desc: "5.0寸"},
          ]
        },
        rams: {
          desc: "内存",
          chosenID: null,
          data: [
            { id: "r-01", desc: "16G"},
            { id: "r-02", desc: "32G"},
            { id: "r-03", desc: "64G"},
            { id: "r-04", desc: "128G"},
          ]
        },
        proDates: {
          desc: "生产日期",
          chosenID: null,
          data:  [
            { id: "p-01", desc: "2014年"},
            { id: "p-02", desc: "2015年"},
            { id: "p-03", desc: "2016年"},
            { id: "p-04", desc: "2017年"},
            { id: "p-05", desc: "2018年"},
          ]
        },
      },
      results: [
        { id: "k4512;s-01;r-01;p-01", price: 1200, count: 10},
        { id: "c-02;s-01;r-04;p-02", price: 1250, count: 14},
        { id: "c-03;i3ejr;r-04;p-03", price: 1360, count: 11},
        { id: "c-03;i3ejr;r-02;p-03", price: 1700, count: 20},
        { id: "c-02;s-01;r-03;p-04", price: 1280, count: 34},
        { id: "c-02;i3ejr;r-03;p-01", price: 1280, count: 34},
        { id: "c-03;s-01;r-04;p-05", price: 1250, count: 14},
        { id: "k4512;s-01;r-04;p-05", price: 1250, count: 14},
      ],
      NOTCHOSEN: "@1",
      oCombs: {},
      /**
       * oCombs: {
     *    @2: {
     *      type: 0,     // 是否是最终结果
     *      key: "@2", // 已选的项目id组合质数积
     *      canChoses: { // 各选项可选情况
     *        colors: {  // 选项color
     *          data: [],   // 可选选项
     *          isChosen: 1 // 当前选项选中
     *        },
     *        rams: {
     *          data: [ "r-01", "r-04"], // 剩余可选项id
     *          isChosen: 0 // 当前选项未选中
     *        }
     *      }
     *    }
     * }
       */
      aID2PN: [],  // 选项ID->质数 对照表 c-01 -> 2
      aPN2Key: [], // 质数->选项key 对照表 2->colors
      oPNList: {}, // 质数->选项 对照表
      aResultProduct: [], // sku->质数积对照表
      /**
       * oPNList: {
       *    colors: [
       *      { id: 'c-01', num: 2},
       *      { id: 'c-02', num: 3},
       *    ]
       * }
       */
      oResult: {},
    }
  },
  methods: {
    /****************** 映射 * 映射 * 映射 * 映射 * 映射 * 映射 ***********************/
    /**
     * 置灰某选项所有按钮
     * @string key       选项关键词
     * @array activeIDs 保持活动的按钮ID
     */
    disableChoseItem: function (key, activeIDs) {
      let aTarget = this.choseList[key].data;
      for (let index of aTarget.keys()) {
        let isActive = activeIDs.includes(aTarget[index].id);
        this.$set(this.choseList[key].data, index, {
          ...aTarget[index],
          isCanChose: isActive,
          isChosen: false,
        });
      }
    },
    /**
     * 高亮某选项某个按钮
     * @string key           选项关键词
     * @number nHighLightPro  高亮的按钮ID质数积
     */
    highLightChoseItem: function (key, nHighLightPro) {
      let aTarget = this.choseList[key].data;
      for (let index of aTarget.keys()) {
        let nPrime = this.aID2PN[aTarget[index].id];
        let isHighLight = nHighLightPro % nPrime === 0;
        if(isHighLight){
          this.$set(this.choseList[key].data, index, {
            ...aTarget[index],
            isCanChose: true,
            isChosen: true,
          });
        }else{
          this.$set(this.choseList[key].data, index, {
            ...aTarget[index],
            isChosen: false,
          });
        }
      }
    },
    // 获取已选择的ID组合质数积
    getChosenPro: function () {
      let nChosen = 1;
      for (let oChoseItem of Object.values(this.choseList)) {
        nChosen *= oChoseItem.chosenID ? this.aID2PN[oChoseItem.chosenID] : 1;
      }

      return nChosen===1 ? null : '@'+nChosen;
    },
    /**
     * 根据已选择的ID通过结果集来改变按钮状态
     */
    changeStateByResult: function () {
      let searchKey = this.getChosenPro() || this.NOTCHOSEN;

      // 没有有搜索过？先生成对应的组合
      if (!this.oCombs[searchKey]) {
        let aResult = this.scanResult(searchKey);
        this.printState(searchKey, aResult);
      }

      let combs = this.oCombs[searchKey];
      for(let [key, oChoseItem] of Object.entries(combs.canChoses)){
        // 当前项已选中
        if(oChoseItem.isChosen){
          // 先置灰不可用的
          this.disableChoseItem(key, oChoseItem.data);
          // 选中项高亮
          this.highLightChoseItem(key, this.getPNFromSPN(combs.key));
        }else{
          // 当前项未选中，把不存在的项置灰
          this.disableChoseItem(key, oChoseItem.data);
        }
      }
      // 选中sku
      if(combs.type){
        this.oResult = this.results.filter(item => {
          let nResultPro = this.getPNProduct(item.id.split(";"));
          let nTargetPro = this.getPNFromSPN(combs.key);
          return nResultPro===nTargetPro
        })[0];
      }
    },
    // 按钮被点击
    choiceChosen: function (choice) {
      if(!choice.isCanChose) return;

      let sKey = this.getWhereThePNFrom(this.aID2PN[choice.id]);
      if(choice.isChosen){
        this.choseList[sKey].chosenID = null;
        this.oResult = {};
      }else{
        this.choseList[sKey].chosenID = choice.id;
      }

      this.changeStateByResult();
    },
    /****************** 映射 * 映射 * 映射 * 映射 * 映射 * 映射 ***********************/

    /****************** 筛选 * 筛选 * 筛选 * 筛选 * 筛选 * 筛选 ***********************/
    /**
     * 设置Ocomb组合集中的一项的可选择集 canChoses
     * @string targetKey 要修改的组合项
     * @string itemKey 要修改的组合项中的可选择项
     * @string sKey 可选的项目id
     */
    setChoseItem: function (targetKey, itemKey, sKey) {
      let oldArr = this.oCombs[targetKey].canChoses[itemKey].data;
      oldArr.push(sKey);
      let newArr = [...new Set(oldArr)]; // 去重
      this.oCombs[targetKey].canChoses[itemKey].isChosen = 0;
      this.oCombs[targetKey].canChoses[itemKey].data = newArr;
    },
    /**
     * 设置Ocomb组合集中的一项
     * @string oCombItemKey 一种组合结果
     * @string oTargetItem 未选中项的信息
     */
    setOCombItem: function (oCombItemKey, oTargetItem) {
      // 如果当前组合中没有，初始化一下
      if(!this.oCombs[oCombItemKey]){
        this.oCombs[oCombItemKey] = {
          type: 0,
          key: oCombItemKey,
          canChoses: this.getDefaultCanChoses()
        }
      }

      this.setChoseItem(oCombItemKey, oTargetItem.key, oTargetItem.id);
    },
    // 获取默认的可选择集
    getDefaultCanChoses: function () {
      let obj = {};
      for (let key of Object.keys(this.choseList)) {
        obj[key] = { isChosen: 1, data: []};
      }

      return obj;
    },
    /**
     * 获取未选的id
     * @array aKeys sku包含的id集
     * @string sChosen sku中已选id
     */
    getNotChosenStr: function (aKeys, sChosen) {
      // 根据获取的sKey获取已排列的key
      let keys = sChosen.split(";");
      // 将已排列的key从arr中剔除
      let sNotChosen = aKeys.join(";");
      if(sChosen===sNotChosen){
        sNotChosen = null;
      }else{
        for (let item of keys.values()){
          if(sNotChosen.startsWith(item)){
            sNotChosen = sNotChosen.replace(item+";", "");
          }else{
            sNotChosen = sNotChosen.replace(";"+item, "");
          }
        }
      }

      return sNotChosen;
    },
    /**
     * 设置组合集的一种组合的一种状态
     * @string sCombKey 组合关键词，已选id质数积 @11594
     * @number nNotChosenPro sku中未选id质数积
     */
    pushItemToOCombs: function (sCombKey, nNotChosenPro) {
      // 没有未选中
      if(nNotChosenPro === 1){
        this.$set(this.oCombs, sCombKey, {
          type: 1,
          key: sCombKey,
          canChoses: this.getDefaultCanChoses()
        })
      }else{
        let aNotChosen = this.getIDFromProduce(nNotChosenPro);

        for (let oItem of aNotChosen.values()){
          this.setOCombItem(sCombKey, oItem);
        }
      }
    },
    /**
     * 修改isChosen；1的data
     * oCombs: {
   *      ...
   *      canChoses: {
   *        colors: {
   *          data: [],   <--- 设置这个
   *          isChosen: 1
   *        },
   *        ...
   * }
     * @string sCombItemKey 组合名id质数积
     * @string targetID 要修改项目的按钮id
     * @string sourcePro 作为数据来源的组合id质数积
     */
    changeOCombsChosenItem: function (sCombItemKey, targetID, sourcePro) {
      // 确定组合集中有没有数据来源，没有就生成一下
      if (!this.oCombs[sourcePro]) {
        let aResult = this.scanResult(sourcePro);
        this.printState(sourcePro, aResult);
      }

      let sTargetKey = this.getWhereThePNFrom(this.aID2PN[targetID]);
      let aSourceID = this.oCombs[sourcePro].canChoses[sTargetKey].data;
      let aTargetID = this.oCombs[sCombItemKey].canChoses[sTargetKey].data;
      let aNewArr = [];

      if (!aTargetID.length) {
        aNewArr = aSourceID;
      } else {
        // 取aSourceID 和 aTargetID 的交集
        let aFullArr = [...new Set(aTargetID.concat(aSourceID))];
        // console.log(aFullArr, 5550);
        for (let sID of aFullArr.values()) {
          if (aSourceID.includes(sID) && aTargetID.includes(sID)) {
            aNewArr.push(sID);
          }
        }
      }

      // this.$set(this.oCombs[sCombItemKey].canChoses[sTargetKey], "data", aNewArr);
      this.oCombs[sCombItemKey].canChoses[sTargetKey].data = aNewArr;
    },
    /**
     * 设置某种组合中已选项目可选的按钮
     * oCombs: {
   *    @2: {
   *      ...
   *      canChoses: {
   *        colors: {
   *          data: [],   <--- 设置这个
   *          isChosen: 1
   *        },
   *        ...
   * }
     * @string sCombItemKey 组合id质数积 @27807
     */
    setOCombsChosenItem: function (sCombItemKey) {
      if (sCombItemKey === this.NOTCHOSEN) return;

      let nPrime = this.getPNFromSPN(sCombItemKey);
      let aKey = this.getIDFromProduce(nPrime);
      // console.log(aKey, 200);
      // 遍历组合中每一个被选中项的id
      for (let oItem of aKey.values()) {
        let testPro = oItem.num;
        // 获取要修改项目id之外的其它id组合，修改的数据来源就是它们
        let nSourcePro = nPrime / testPro;
        let sourcePro = nSourcePro===1 ? this.NOTCHOSEN : '@'+nSourcePro;

        this.changeOCombsChosenItem(sCombItemKey, oItem.id, sourcePro);
      }
    },
    /**
     * 从结果集中把按钮状态提取并放入组合集中
     * @string sChosenPro 组合名(已选的id质数积)
     * @array aResult 符合条件的结果集
     */
    printState: function (sChosenPro, aResult) {
      // console.log("sChosenPro: ", sChosenPro);
      if(!aResult || !aResult.length){
        this.pushItemToOCombs(sChosenPro, 1);
      }
      // 遍历结果集，将每个结果对应的按钮状态都放到对应的组合集中存起来
      for (let oResult of aResult.values()) {
        // let aKeys = oResult.id.split(";");
        let nResultProduct = this.getResultProduct(oResult.id);
        let nChosenPro = this.getPNFromSPN(sChosenPro);
        let nNotChosenPro = nResultProduct / nChosenPro;
        //
        // 把该选项的所有状态存到结果集
        this.pushItemToOCombs(sChosenPro, nNotChosenPro);
      }
      this.setOCombsChosenItem(sChosenPro);
    },
    /**
     * 扫描所有结果集，获取含有已选项的子结果集
     * @string sChosen 已选项id ex: c-01;s-01
     */
    scanResult: function (sChosenPro) {
      let aResult = []; // 符合当前选择的结果集

      if (sChosenPro===this.NOTCHOSEN) {
        aResult = this.results;
      } else {
        let results = this.results;

        // 过滤结果集中所有包含被选中ID的集合
        // 质数求余数
        let nTestProduct = this.getPNFromSPN(sChosenPro); // 已选id的质数积

        aResult = results.filter(oResult => {
          let nResultProduct = this.getResultProduct(oResult.id);

          return (nResultProduct % nTestProduct) === 0
        });
      }

      return aResult;
    },
    /****************** 筛选 * 筛选 * 筛选 * 筛选 * 筛选 * 筛选 ***********************/

    /****************** 质数相关 * 质数相关 * 质数相关 * 质数相关 ***********************/
    // 判断一个数是不是质数
    isPrimeNum: function (num) {
      if (num === 2) {//2是质数
        return true;
      } else if (num % 2 === 0) {//排除偶数
        return false;
      }
      // 求平方根
      // 如果一个数不是素数是合数， 那么一定可以由两个自然数相乘得到，
      // 其中一个大于或等于它的平方根，一个小于或等于它的平方根。并且成对出现
      let squareRoot = Math.sqrt(num);

      //因为2已经验证过，所以从3开始；且已经排除偶数，所以每次加2
      for(let i = 3; i <= squareRoot; i += 2) {
        if (num % i === 0) {
          return false;
        }
      }
      return true;
    },
    // 获取下一个质数
    getNextPrimeNum: function (nLastPn) {
      let testNum = nLastPn + 1;
      while (true) {
        if (this.isPrimeNum(testNum)) break;
        testNum++;
      }
      return testNum;
    },
    // 获取质数积
    getPNProduct: function (aID) {
      let nResult = 1;
      for (let sID of aID.values()) {
        nResult *= this.aID2PN[sID];
      }
      return nResult;
    },
    // 获取结果质数积
    getResultProduct: function (sResultKey) {
      let nResultProduct = 1;
      if(this.aResultProduct[sResultKey]){
        nResultProduct = this.aResultProduct[sResultKey];
      }else{
        nResultProduct = this.getPNProduct(sResultKey.split(";"));
        // 存一下计算结果
        this.aResultProduct[sResultKey] = nResultProduct;
      }
      return nResultProduct;
    },
    // 从"@11594"中获取11594
    getPNFromSPN: function (sPrimeNum) {
      return parseInt(sPrimeNum.substring(1));
    },
    // 从质数积中获取各个质数
    getIDFromProduce: function (nProduct) {
      let aID = [];
      for (let [key, val] of Object.entries(this.oPNList)) {
        if (nProduct === 1) break;
        for (let idItem of val.values()) {
          let nTestPrime = idItem.num;
          if (nProduct % nTestPrime === 0) {
            nProduct /= nTestPrime;
            aID.push({
              ...idItem,
              key,
            });
            break;
          }
        }
      }

      return aID;
    },
    // 获取质数对应的选项key
    getWhereThePNFrom: function (nPrime) {
      let targetKey = "";
      let sPrime = '@' + nPrime;
      if (this.aPN2Key[sPrime]) {
        targetKey = this.aPN2Key[sPrime];
      } else {
        for (let [key, aItems] of Object.entries(this.oPNList)) {
          let len = aItems.length;
          if(nPrime>=aItems[0].num && nPrime<=aItems[len-1].num){
            targetKey = key;
            break;
          }
        }
        this.aPN2Key[sPrime] = targetKey;
      }
      return targetKey;
    },
    /****************** 质数相关 * 质数相关 * 质数相关 * 质数相关 ***********************/

    /****************** 初始化 * 初始化 * 初始化 * 初始化 * 初始化 ***********************/
    // 建立选项关键词与选项ID的联系 方便查找
    initKeyAndIDArr: function () {
      let aID2PN = {};
      let nPn = 1;

      for (let key of Object.keys(this.choseList)) {
        let aChoseItem = this.choseList[key].data;
        this.oPNList[key] = [];
        for (let item of aChoseItem.values()) {
          let sID = item.id;
          nPn = this.getNextPrimeNum(nPn);
          aID2PN[sID] = nPn;
          this.oPNList[key].push({
            id: sID, num: nPn
          });
        }
      }

      this.aID2PN = aID2PN;
    },
    // 初始化按钮状态
    initState: function () {
      let searchKey = this.NOTCHOSEN;
      // 没有有搜索过？先生成对应的组合
      if (!this.oCombs[searchKey]) {
        let aResult = this.scanResult(searchKey);
        this.printState(searchKey, aResult);
      }

      let combs = this.oCombs[searchKey];
      for(let [key, oChoseItem] of Object.entries(combs.canChoses)){
        this.disableChoseItem(key, oChoseItem.data);
      }
    },
    /****************** 初始化 * 初始化 * 初始化 * 初始化 * 初始化 ***********************/
  },
  mounted(){
    this.initKeyAndIDArr();

    console.time("过程确定结果-质数优化");
    this.initState();
    console.timeEnd("过程确定结果-质数优化");
  }
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";
  .sku-wrapper{
    .title{
      font-size: 15px;
      text-align: center;
      line-height: 1.5;
      padding-top: 20px;
    }
    .chose-box{
      padding: 15px;

      .chose-title{
        color: gray;
        font-size: 15px;
        padding-bottom: 15px;
      }
      .chose-list{
        border-bottom: 1px solid #EEEEEE;

        &:after{
          content: '';
          display: table;
        }
        >li{
          display: inline-block;
          font-size: 12px;
          height: 24px;
          line-height: 24px;
          padding: 0 5px;
          background: #EEEEEE;
          border: 1px solid #E5E5E5;
          border-radius: 4px;
          margin-right: 15px;
          margin-bottom: 15px;

          &.chosed{
            background: #EA6F5A;
            color: #fff;
            border: 1px solid #EA6F5A;
          }
          &.cant-chose{
            opacity: 0.5;
          }
        }
      }
    }
    .result-box{
      padding: 0 15px;
      >p{
        padding-bottom: 10px;
      }
    }
    .hint{
      padding: 0 15px;
      .font(@f12, @coffee, justify, 1.5);
    }
  }
</style>
