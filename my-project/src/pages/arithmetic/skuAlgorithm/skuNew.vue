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
      过程计算结果，常规算法，可生产，需拼凑ID
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'sku-new',
  data(){
    return {
      choseList: {
        colors: {
          desc: "颜色",
          chosenID: null,
          data: [
            { id: "c-01", desc: "红色"},
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
            { id: "s-02", desc: "5.0寸"},
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
        { id: "c-01;s-01;r-01;p-01", price: 1200, count: 10},
        { id: "c-02;s-01;r-04;p-02", price: 1250, count: 14},
        { id: "c-03;s-02;r-04;p-03", price: 1360, count: 11},
        { id: "c-03;s-02;r-02;p-03", price: 1700, count: 20},
        { id: "c-02;s-01;r-03;p-04", price: 1280, count: 34},
        { id: "c-02;s-02;r-03;p-01", price: 1280, count: 34},
        { id: "c-03;s-01;r-04;p-05", price: 1250, count: 14},
        { id: "c-01;s-01;r-04;p-05", price: 1250, count: 14},
      ],
      NOTCHOSEN: "notChosen",
      oCombs: {},
      /**
       * oCombs: {
       *    c-o1: {
       *      type: 0,     // 是否是最终结果
       *      key: "c-01", // 已选的项目id组合 c-01;s-01
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
      aKey2ID: [],  // 选项关键词->选项ID 对照表 color-> c
      aID2Key: [],  // 选项ID->选项关键词 对照表 c -> color
      aNum2Key: [], // 数字->选项关键词 对照表 顺序按results中id的顺序
      oResult: {},
      lastFilter: {     // 上次过滤的结果集
        searchKeys: "",
        results: []
      },
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
     * @array highLightIDs  高亮的按钮ID
     */
    highLightChoseItem: function (key, highLightIDs) {
      let aTarget = this.choseList[key].data;
      for (let index of aTarget.keys()) {
        let isHighLight = highLightIDs.includes(aTarget[index].id);
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
    // 获取已选择的ID组合
    getChosenStr: function () {
      let sChosen = ""; // 要搜索的已选选项ID字符串
      for (let key of Object.keys(this.choseList)) {
        sChosen += this.choseList[key].chosenID ? this.choseList[key].chosenID+";" : "";
      }
      if(sChosen.endsWith(";")){
        sChosen = sChosen.substring(0, sChosen.length-1);
      }
      if(!sChosen){
        sChosen = null;
      }

      return sChosen;
    },
    /**
     * 根据已选择的ID通过结果集来改变按钮状态
     */
    changeStateByResult: function () {
      let searchKey = this.getChosenStr() || this.NOTCHOSEN;

      // 没有有搜索过？先生成对应的组合
      if (!this.oCombs[searchKey]) {
        let aResult = this.scanResult(searchKey);
        this.printState(searchKey, aResult);
      }

      let combs = this.oCombs[searchKey];
      for(let key of Object.keys(combs.canChoses)){
        // 当前项已选中
        if(combs.canChoses[key].isChosen){
          // 先置灰不可用的
          this.disableChoseItem(key, combs.canChoses[key].data);
          // 选中项高亮
          this.highLightChoseItem(key, combs.key.split(";"));
        }else{
          // 当前项未选中，把不存在的项置灰
          this.disableChoseItem(key, combs.canChoses[key].data);
        }
      }
      if(combs.type){
        this.oResult = this.results.filter((item) => item.id===combs.key)[0];
      }
    },
    // 按钮被点击
    choiceChosen: function (choice) {
      if(!choice.isCanChose) return;

      let sIDHead = choice.id.split("-")[0];
      let sKey = this.aID2Key[sIDHead];
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
     * @string sKey 未选中项的id
     */
    setOCombItem: function (oCombItemKey, sKey) {
      // 如果当前组合中没有，初始化一下
      if(!this.oCombs[oCombItemKey]){
        this.oCombs[oCombItemKey] = {
          type: 0,
          key: oCombItemKey,
          canChoses: this.getDefaultCanChoses()
        }
      }
      // console.log(oCombItemKey, 111);
      this.setChoseItem(oCombItemKey, this.aID2Key[ sKey.split("-")[0] ], sKey);
    },
    // 获取默认的可选择集
    getDefaultCanChoses: function () {
      let obj = {};
      for (let key of Object.keys(this.aKey2ID)) {
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
     * @string sChosen 已选id
     * @string sNotChosen sku中未选id
     */
    pushItemToOCombs: function (sChosen, sNotChosen) {
      // 没有未选中
      if(!sNotChosen){
        this.$set(this.oCombs, sChosen, {
          type: 1,
          key: sChosen,
          canChoses: this.getDefaultCanChoses()
        })
      }else{
        let aNotChosen = sNotChosen.split(";");

        for (let sKey of aNotChosen.values()){
          this.setOCombItem(sChosen, sKey);
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
     * @string sCombItemKey 组合名
     * @string targetID 要修改项目的按钮id
     * @string sourceKey 作为数据来源的组合名
     */
    changeOCombsChosenItem: function (sCombItemKey, targetID, sourceKey) {
      // 确定组合集中有没有数据来源，没有就生成一下
      if (!this.oCombs[sourceKey]) {
        let aResult = this.scanResult(sourceKey);
        this.printState(sourceKey, aResult);
      }

      let sTargetKey = this.aID2Key[targetID.split("-")[0]];
      let aSourceID = this.oCombs[sourceKey].canChoses[sTargetKey].data;
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
     *    c-o1: {
     *      ...
     *      canChoses: {
     *        colors: {
     *          data: [],   <--- 设置这个
     *          isChosen: 1
     *        },
     *        ...
     * }
     * @string sCombItemKey 组合名
     */
    setOCombsChosenItem: function (sCombItemKey) {
      if (sCombItemKey === this.NOTCHOSEN) return;

      let aKey = sCombItemKey.split(";");
      // 遍历组合中每一个被选中项的id
      for (let key of aKey.values()) {
        let testKey = "";
        if (sCombItemKey.startsWith(key)) {
          testKey = key;
        } else {
          testKey = ";" + key;
        }
        // 获取要修改项目id之外的其它id组合，修改的数据来源就是它们
        let sourceKey = sCombItemKey.replace(testKey, "") || this.NOTCHOSEN;
        if (sourceKey.startsWith(";")) sourceKey = sourceKey.substring(1);

        this.changeOCombsChosenItem(sCombItemKey, key, sourceKey);
      }
    },
    /**
     * 从结果集中把按钮状态提取并放入组合集中
     * @string sChosen 组合名
     * @array aResult 符合条件的结果集
     */
    printState: function (sChosen, aResult) {
      if(!aResult || !aResult.length){
        this.pushItemToOCombs(sChosen, "");
      }
      // 遍历结果集，将每个结果对应的按钮状态都放到对应的组合集中存起来
      for (let oResult of aResult.values()) {
        let aKeys = oResult.id.split(";");
        let sNotChosen = this.getNotChosenStr(aKeys, sChosen);

        // 把该选项的所有状态存到结果集
        this.pushItemToOCombs(sChosen, sNotChosen);
      }
      this.setOCombsChosenItem(sChosen);
    },
    /**
     * 扫描所有结果集，获取含有已选项的子结果集
     * @string sChosen 已选项id ex: c-01;s-01
     */
    scanResult: function (sChosen) {
      let aResult = []; // 符合当前选择的结果集

      if (sChosen===this.NOTCHOSEN) {
        aResult = this.results;
      } else {
        let aKey = sChosen.split(";");
        let results = [];
        if (sChosen.includes(this.lastFilter.searchKeys)) {
          results = this.lastFilter.results;
        } else {
          results = this.results;
        }

        // 过滤结果集中所有包含被选中ID的集合
        // 字符串匹配
        aResult = results.filter(oResult => {
          for (let sKey of aKey.values()) {
            let testKey = "";
            // 第一个选项
            if (this.aKey2ID[this.aNum2Key[0]] === sKey.split("-")[0]) {
              testKey = sKey + ";";
              if (!oResult.id.startsWith(testKey)) { // 检查是否是第一个
                return false;
              }
            } else if (this.aKey2ID[this.aNum2Key[this.aNum2Key.length - 1]] === sKey.split("-")[0]) { // 最后一个选项
              testKey = ";" + sKey;
              if (!oResult.id.endsWith(testKey)) { // 检查是否是最后一个
                return false;
              }
            } else { // 中间的选项
              testKey = ";" + sKey + ";";
              if (!oResult.id.includes(testKey)) { // 检查是否包含
                return false;
              }
            }
          }
          return true;
        });
      }

      // 记录上次过滤结果，减少下次搜索时间
      this.lastFilter = {
        searchKeys: sChosen,
        results: aResult,
      };

      return aResult;
    },
    /****************** 筛选 * 筛选 * 筛选 * 筛选 * 筛选 * 筛选 ***********************/

    /****************** 初始化 * 初始化 * 初始化 * 初始化 * 初始化 ***********************/
    // 建立选项关键词与选项ID的联系 方便查找
    initKeyAndIDArr: function () {
      let aKey2ID = [];
      let aID2Key = [];
      for (let key of Object.keys(this.choseList)) {
        let sIDHead = this.choseList[key].data[0].id.split("-")[0];
        aKey2ID[key] = sIDHead;
        aID2Key[sIDHead] = key;
        this.aNum2Key.push(key);
      }

      this.aKey2ID = aKey2ID;
      this.aID2Key = aID2Key;
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
      for(let key of Object.keys(combs.canChoses)){
        this.disableChoseItem(key, combs.canChoses[key].data);
      }
    },
    /****************** 初始化 * 初始化 * 初始化 * 初始化 * 初始化 ***********************/
  },
  mounted(){
    this.initKeyAndIDArr();

    console.time("过程确定结果-常规算法");
    this.initState();
    console.timeEnd("过程确定结果-常规算法");
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
