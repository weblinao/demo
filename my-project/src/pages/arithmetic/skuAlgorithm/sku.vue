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
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: "sku",
    data(){
      return {
        clcType: 1, // 0:由结果到过程， 1:有过程到结果
        isUsePrimeNum: false, // 是否使用质数优化
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
          // othera: {
          //   desc: "其它属性a",
          //   chosenID: null,
          //   data: [
          //     { id: "oa-01", desc: "a1"},
          //     { id: "oa-02", desc: "a2"},
          //     { id: "oa-03", desc: "a3"},
          //     { id: "oa-04", desc: "a4"},
          //   ]
          // },
          // otherb: {
          //   desc: "其它属性b",
          //   chosenID: null,
          //   data: [
          //     { id: "ob-01", desc: "b1"},
          //     { id: "ob-02", desc: "b2"},
          //     { id: "ob-03", desc: "b3"},
          //     { id: "ob-04", desc: "b4"},
          //   ]
          // },
          // otherc: {
          //   desc: "其它属性c",
          //   chosenID: null,
          //   data: [
          //     { id: "oc-01", desc: "c1"},
          //     { id: "oc-02", desc: "c2"},
          //     { id: "oc-03", desc: "c3"},
          //     { id: "oc-04", desc: "c4"},
          //   ]
          // },
          // otherd: {
          //   desc: "其它属性d",
          //   chosenID: null,
          //   data: [
          //     { id: "od-01", desc: "d1"},
          //     { id: "od-02", desc: "d2"},
          //     { id: "od-03", desc: "d3"},
          //     { id: "od-04", desc: "d4"},
          //   ]
          // },
          // othere: {
          //   desc: "其它属性e",
          //   chosenID: null,
          //   data: [
          //     { id: "oe-01", desc: "e1"},
          //     { id: "oe-02", desc: "e2"},
          //     { id: "oe-03", desc: "e3"},
          //     { id: "oe-04", desc: "e4"},
          //   ]
          // },
          // otherf: {
          //   desc: "其它属性f",
          //   chosenID: null,
          //   data: [
          //     { id: "of-01", desc: "f1"},
          //     { id: "of-02", desc: "f2"},
          //     { id: "of-03", desc: "f3"},
          //     { id: "of-04", desc: "f4"},
          //   ]
          // },
          // otherg: {
          //   desc: "其它属性g",
          //   chosenID: null,
          //   data: [
          //     { id: "og-01", desc: "g1"},
          //     { id: "og-02", desc: "g2"},
          //     { id: "og-03", desc: "g3"},
          //     { id: "og-04", desc: "g4"},
          //   ]
          // },
          // otherh: {
          //   desc: "其它属性h",
          //   chosenID: null,
          //   data: [
          //     { id: "oh-01", desc: "h1"},
          //     { id: "oh-02", desc: "h2"},
          //     { id: "oh-03", desc: "h3"},
          //     { id: "oh-04", desc: "h4"},
          //   ]
          // },
          // otheri: {
          //   desc: "其它属性i",
          //   chosenID: null,
          //   data: [
          //     { id: "oi-01", desc: "i1"},
          //     { id: "oi-02", desc: "i2"},
          //     { id: "oi-03", desc: "i3"},
          //     { id: "oi-04", desc: "i4"},
          //   ]
          // },
          // otherj: {
          //   desc: "其它属性j",
          //   chosenID: null,
          //   data: [
          //     { id: "oj-01", desc: "j1"},
          //     { id: "oj-02", desc: "j2"},
          //     { id: "oj-03", desc: "j3"},
          //     { id: "oj-04", desc: "j4"},
          //   ]
          // },
          // otherk: {
          //   desc: "其它属性k",
          //   chosenID: null,
          //   data: [
          //     { id: "ok-01", desc: "k1"},
          //     { id: "ok-02", desc: "k2"},
          //     { id: "ok-03", desc: "k3"},
          //     { id: "ok-04", desc: "k4"},
          //   ]
          // },
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
        // results: [
        //   { id: "c-01;s-01;r-01;p-01;oa-01;ob-01", price: 1200, count: 10},
        //   { id: "c-02;s-01;r-04;p-02;oa-01;ob-01", price: 1250, count: 14},
        //   { id: "c-03;s-02;r-04;p-03;oa-02;ob-02", price: 1360, count: 11},
        //   { id: "c-03;s-02;r-02;p-03;oa-02;ob-02", price: 1700, count: 20},
        //   { id: "c-02;s-01;r-03;p-04;oa-03;ob-04", price: 1280, count: 34},
        //   { id: "c-02;s-02;r-03;p-01;oa-03;ob-04", price: 1280, count: 34},
        //   { id: "c-03;s-01;r-04;p-05;oa-04;ob-04", price: 1250, count: 14},
        //   { id: "c-01;s-01;r-04;p-05;oa-04;ob-03", price: 1250, count: 14},
        // ],
        // results: [
        //   { id: "c-01;s-01;r-01;p-01;oa-01;ob-01;oc-01;od-01;oe-01", price: 1200, count: 10},
        //   { id: "c-02;s-01;r-04;p-02;oa-01;ob-01;oc-01;od-01;oe-01", price: 1250, count: 14},
        //   { id: "c-03;s-02;r-04;p-03;oa-02;ob-02;oc-02;od-02;oe-02", price: 1360, count: 11},
        //   { id: "c-03;s-02;r-02;p-03;oa-02;ob-02;oc-02;od-02;oe-02", price: 1700, count: 20},
        //   { id: "c-02;s-01;r-03;p-04;oa-03;ob-04;oc-03;od-04;oe-03", price: 1280, count: 34},
        //   { id: "c-02;s-02;r-03;p-01;oa-03;ob-04;oc-03;od-04;oe-03", price: 1280, count: 34},
        //   { id: "c-03;s-01;r-04;p-05;oa-04;ob-04;oc-03;od-04;oe-03", price: 1250, count: 14},
        //   { id: "c-01;s-01;r-04;p-05;oa-04;ob-03;oc-04;od-03;oe-04", price: 1250, count: 14},
        // ],
        // results: [
        //   { id: "c-01;s-01;r-01;p-01;oa-01;ob-01;oc-01;od-01;oe-01;of-01;og-01;oh-01;oi-01;oj-01;ok-01", price: 1200, count: 10},
        //   { id: "c-02;s-01;r-04;p-02;oa-01;ob-01;oc-01;od-01;oe-01;of-01;og-01;oh-01;oi-01;oj-01;ok-01", price: 1250, count: 14},
        //   { id: "c-03;s-02;r-04;p-03;oa-02;ob-02;oc-02;od-02;oe-02;of-01;og-01;oh-01;oi-01;oj-01;ok-01", price: 1360, count: 11},
        //   { id: "c-03;s-02;r-02;p-03;oa-02;ob-02;oc-02;od-02;oe-02;of-01;og-01;oh-01;oi-01;oj-01;ok-01", price: 1700, count: 20},
        //   { id: "c-02;s-01;r-03;p-04;oa-03;ob-04;oc-03;od-04;oe-03;of-01;og-01;oh-01;oi-01;oj-01;ok-01", price: 1280, count: 34},
        //   { id: "c-02;s-02;r-03;p-01;oa-03;ob-04;oc-03;od-04;oe-03;of-01;og-01;oh-01;oi-01;oj-01;ok-01", price: 1280, count: 34},
        //   { id: "c-03;s-01;r-04;p-05;oa-04;ob-04;oc-03;od-04;oe-03;of-01;og-01;oh-01;oi-01;oj-01;ok-01", price: 1250, count: 14},
        //   { id: "c-01;s-01;r-04;p-05;oa-04;ob-03;oc-04;od-03;oe-04;of-01;og-01;oh-01;oi-01;oj-01;ok-01", price: 1250, count: 14},
        // ],
        NOTCHOSEN: "notChosen",
        oCombs: {},
        /**
         * oCombs: {
         *    c-o1: {
         *      type: 0,     // 是否是最终结果
         *      key: "c-01", // 已选的项目id组合 c-01;s-01
         *      canChoses: { // 各选项可选情况
         *        colors: {  // 选项color
         *          data: [],   // 剩余可选项id
         *          isChosen: 1 // 当前选项是否被选中
         *        },
         *        rams: {
         *          data: [ "r-01", "r-04"],
         *          isChosen: 0
         *        }
         *      }
         *    }
         * }
         */
        aCombKeyOnce: [], // 记录一次id组合中已计算的key 结果推导过程方法使用
        aKey2ID: [],  // 选项关键词->选项ID 对照表 color-> c
        aID2Key: [],  // 选项ID->选项关键词 对照表 c -> color
        aNum2Key: [], // 数字->选项关键词 对照表 顺序按results中id的顺序
        oResult: {},
        lastFilter: {     // 上次过滤的结果集
          searchKeys: "",
          results: []
        },
        aID2PN: {}, // 选项ID->质数 对照表 c-01 -> 2
        aResult2PNProduct: {} // 结果id->质数积 对照表
      }
    },
    methods: {
      // 建立选项关键词与选项ID的联系 方便查找
      initKeyAndIDArr: function () {
        let aKey2ID = [];
        let aID2Key = [];
        for (let key in this.choseList) {
          let sIDHead = this.choseList[key].data[0].id.split("-")[0];
          aKey2ID[key] = sIDHead;
          aID2Key[sIDHead] = key;
          this.aNum2Key.push(key);
        }

        this.aKey2ID = aKey2ID;
        this.aID2Key = aID2Key;
      },
      /***************************** 结果推导过程,看看就好 start **************************************/
      /**
       * 根据给的sku结果id，推导所有的可能组合
       * 在选择的过程中根据已选的id组合，迅速确定状态
       * 优点：交互效果更好
       * 缺点：随条件的增多，初始化时间呈指数上升
       */
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
        for (let key in this.aKey2ID) {
          obj[key] = { isChosen: 1, data: []};
        }

        return obj;
      },
      /**
       * 将某个可能放入组合对象中
       * @string sChosen 已选的关键词字符串
       * @string sNotChosen 未选的关键词字符串
       * */
      pushItemToOCombs: function (sChosen, sNotChosen) {
        if(!sChosen) return;

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
            // 所有的情况都会出现在 notChosen 中
            this.setOCombItem(this.NOTCHOSEN, sKey);
          }
        }
      },
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
      setOCombsItem: function (aKeys, sChosen) {
        let sNotChosen = this.getNotChosenStr(aKeys, sChosen);

        // 已记录？ 跳过
        if(!this.aCombKeyOnce[sChosen]){
          this.pushItemToOCombs(sChosen, sNotChosen);
          this.aCombKeyOnce[sChosen] = sNotChosen; // 记录已设置
          // 交换一下就是另一种组合
          this.pushItemToOCombs(sNotChosen, sChosen);
          this.aCombKeyOnce[sNotChosen] = sChosen;
        }
      },
      /** 递归方法 start **/
      /**
       * 获取一组结果所有的可能性
       * @array   arr             结果中所有的元素ID集合   [c-01, s-01, r-01, p-01]
       * @number  choseMaxIndex   已选中的最大元素的下标   1
       * @string  str             已选取元素字符串        "c-01;s-01"
       */
      getNcombination: function (aKeys, choseMaxIndex, sOldChosen) {
        let len = aKeys.length;
        for (let i=choseMaxIndex+1; i<len; i++){
          let sChosen = sOldChosen+";"+aKeys[i];
          if(sChosen.startsWith(";")){
            sChosen = sChosen.substring(1);
          }
          this.setOCombsItem(aKeys, sChosen);
          // 由于setOCombsItem会自动补全互补的，所以第二个id开始的都可以省略
          if (sChosen.startsWith( this.aKey2ID[this.aNum2Key[0]] )) {
            // 在已选的基础上 递归
            this.getNcombination(aKeys, i, sChosen);
          }
        }
      },
      // 获取所有可能的结果组合
      getAllcombination: function (aCsr) {
        // 重置一下记录列表
        this.aCombKeyOnce = [];
        this.getNcombination(aCsr, -1, "");
      },
      /** 递归方法 end **/

      /** 动态规划方法 start **/
      /**
       * 将数字组成的数组转化为ID组成
       * @array aKey 结果中所有的元素ID集合   [c-01, s-01, r-01, p-01]
       * @array aResult 数字结果集合 [0, 1]
       */
      changeNums2IDs: function (aKeys, aResult) {
        let sChosen = "";
        for (let n of aResult.values()) {
          sChosen += ";" + aKeys[n];
        }
        sChosen = sChosen.substring(1);
        this.setOCombsItem(aKeys, sChosen);
      },
      /**
       * 获取Kn阶组合的可能性 [a0, a1, ..., an]
       * @array aKeys ID数组
       */
      getKnCombs: function (aKeys) {
        let kn = aKeys.length;

        let aN = [];
        // 1阶
        for (let i=0; i<kn; i++) {
          aN.push(i);
          this.changeNums2IDs(aKeys, [i]);
        }
        // Kn阶
        this.changeNums2IDs(aKeys, aN);

        /**
         * 获取基础的2阶， 每个阶层的基础都是不一样的
         */
        const getBaseK2 = (len, kn, aKeys) => {
          const NSTARTMIN = 0;          // a0的最小值
          const NSTARTMAX = len - kn;   // a0的最大值
          const NENDMIN = kn - 1;       // a1的最小值
          const NENDMAX = len - 1;      // a1的最大值

          // 2阶
          let aK2 = [];
          for (let a0=NSTARTMIN; a0<=NSTARTMAX; a0++){
            let an = a0>=NENDMIN ? a0+1 : NENDMIN;
            if ((an-a0) < kn-2) {
              an = a0 + (kn - 2);
            }
            for (; an<=NENDMAX; an++){
              aK2.push([a0, an]);
              if (kn===2) {
                this.changeNums2IDs(aKeys, [a0, an]);
              }
            }
          }
          return aK2;
        };
        /**
         * 把基础数组升阶 kn -> kn+1
         */
        const LevelUp = (baseArr, kn, aKeys, isLast) => {
          let aLevelUp = [];
          let nCurrK = baseArr[0].length; // 当前基础数组的阶数
          for (let aBase of baseArr.values()) {
            let len = aBase.length;
            const NMAX = aBase[len-1]; // 可插入数的下限（不包括） ex: [1, 2, 5] NMAX=5
            const NMIN = aBase[len-2]; // 可插入数的上限（不包括） ex: [1, 2, 5] NMIN=2
            for (let i=NMIN+1; i<(NMAX-kn+nCurrK); i++) {
              let aBaseCopy = [...aBase];
              aBaseCopy.splice(len-1, 0, i);
              aLevelUp.push(aBaseCopy);
              if(isLast){
                this.changeNums2IDs(aKeys, aBaseCopy);
              }
            }
          }

          return aLevelUp;
        };
        // 大于1阶，在2阶的基础上扩充
        // 由于setOCombsItem会自动补全互补的，所以不用求所有的结果，求一半就可以了
        let maxK = Number.parseInt( kn/2 + (kn%2 ? 1 : 0) );
        // 从2阶开始求每阶的组合
        for (let lv=2; lv<=maxK; lv++) {
          // 先获取n阶对应的2阶基础
          let baseArr = getBaseK2(kn, lv, aKeys);
          // 以2阶为基础升阶，升到lv阶为止
          for (let k=3; k<=lv; k++) {
            baseArr = LevelUp(baseArr, lv, aKeys, k===lv);
          }
        }
      },
      /**
       * 用动态规划的方法获取所有组合可能性
       * @param aKeys 结果中所有的元素ID集合   [c-01, s-01, r-01, p-01]
       */
      getDynamicPlanningCombs: function (aKeys) {
        this.aCombKeyOnce = [];
        this.getKnCombs(aKeys);
      },
      /** 动态规划方法 end **/

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
       * 高亮某选项某个按钮，置灰其它按钮
       * @string key           选项关键词
       * @array highLightIDs  高亮的按钮ID
       */
      highLightChoseItem: function (key, highLightIDs) {
        let aTarget = this.choseList[key].data;
        for (let index of aTarget.keys()) {
          let isHighLight = highLightIDs.includes(aTarget[index].id);
          this.$set(this.choseList[key].data, index, {
            ...aTarget[index],
            isCanChose: isHighLight,
            isChosen: isHighLight,
          });
        }
      },
      // 获取已选择的ID组合
      getChosenStr: function () {
        let sChosen = ""; // 要搜索的已选选项ID字符串
        for (let key in this.choseList) {
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
       * 根据已建立的所有组合状态的对象来改变按钮状态
       */
      changeStateByOComb: function () {
        let searchKey = this.getChosenStr() || this.NOTCHOSEN; // 要搜索的已选选项ID字符串

        let combs = this.oCombs[searchKey];
        for(let key in combs.canChoses){
          // 当前项已选中
          if(combs.canChoses[key].isChosen){
            // 选中项高亮，其它置灰
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
      /***************************** 结果推导过程 end **************************************/

      /***************************** 过程确定结果 start **************************************/
      pushItemToOCombsByResult: function (sChosen, sNotChosen) {
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
      printStateByResult: function (sChosen, aResult) {
        if(!aResult || !aResult.length){
          this.pushItemToOCombsByResult(sChosen, "");
        }
        // 遍历结果集，将每个结果对应的按钮状态都放到对应的组合集中存起来
        for (let oResult of aResult.values()) {
          let aKeys = oResult.id.split(";");
          let sNotChosen = this.getNotChosenStr(aKeys, sChosen);

          // 把该选项的所有状态存到结果集
          this.pushItemToOCombsByResult(sChosen, sNotChosen);
        }
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
          if (this.isUsePrimeNum) {
            // 获取质数积
            const getPNProduct = aKey => {
              let nResult = 1;
              for (let sKey of aKey.values()) {
                nResult *= this.aID2PN[sKey]; // 已选中的质数积
              }
              return nResult;
            };
            // 质数求余数
            let nTestProduct = getPNProduct(aKey);

            aResult = results.filter(oResult => {
              let sResultKey = oResult.id;
              let nResultProduct = 1;
              if(this.aResult2PNProduct[sResultKey]){
                nResultProduct = this.aResult2PNProduct[sResultKey];
              }else{
                nResultProduct = getPNProduct(oResult.id.split(";"));
                // 存一下计算结果
                this.aResult2PNProduct[sResultKey] = nResultProduct;
              }

              return (nResultProduct % nTestProduct) === 0
            });
          } else {
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
        }

        // 记录上次过滤结果，减少下次搜索时间
        this.lastFilter = {
          searchKeys: sChosen,
          results: aResult,
        };

        return aResult;
      },
      /**
       * 根据已选择的ID通过结果集来改变按钮状态
       */
      changeStateByResult: function () {
        let searchKey = this.getChosenStr() || this.NOTCHOSEN;

        // 没有有搜索过？先生成对应的组合
        if (!this.oCombs[searchKey]) {
          let aResult = this.scanResult(searchKey);
          this.printStateByResult(searchKey, aResult);
        }

        let combs = this.oCombs[searchKey];
        for(let key in combs.canChoses){
          // 当前项已选中
          if(combs.canChoses[key].isChosen){
            // 选中项高亮，其它置灰
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
      /************ 质数优化 start *************/
      initPrimeNum: function () {
        this.isUsePrimeNum = true;
        // 初始化 aID2PN 选项ID->质数 对照表
        let aID2PN = {};
        let nPn = 1;

        // 判断一个数是不是质数
        const isPrimeNum = num => {
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
        };
        // 获取下一个质数
        const getNextPrimeNum = nLastPn => {
          let testNum = nLastPn + 1;
          while (true) {
            if (isPrimeNum(testNum)) break;
            testNum++;
          }
          return testNum;
        };
        // 初始化所有选项，分别为其关联一个质数
        for (let key in this.choseList) {
          let aChoseItem = this.choseList[key].data;
          for (let item of aChoseItem.values()) {
            let sID = item.id;
            nPn = getNextPrimeNum(nPn);
            aID2PN[sID] = nPn;
          }
        }

        this.aID2PN = aID2PN;
      },
      /************ 质数优化 end ***************/
      /***************************** 过程确定结果 end **************************************/
      choiceChosen: function (choice) {
        if(!choice.isCanChose) return;
        // console.time("点击响应时间");
        let sIDHead = choice.id.split("-")[0];
        let sKey = this.aID2Key[sIDHead];
        if(choice.isChosen){
          this.choseList[sKey].chosenID = null;
          this.oResult = {};
        }else{
          this.choseList[sKey].chosenID = choice.id;
        }

        if (this.clcType===0) {
          this.changeStateByOComb();
        } else {
          this.changeStateByResult();
        }
        // console.timeEnd("点击响应时间");
      },
    },
    mounted(){
      this.initKeyAndIDArr();

      /*** 结果推导过程 自己捣鼓的，效果不好 start ***/
      /**
       * 结果推导过程-递归
       * 初始化速度 4阶约10ms 6阶约55ms 9阶约330ms 15阶约24000ms
       */
      // this.getAllcombination(this.results[0].id.split(";"));
      // console.time("结果推导过程-递归");
      // for (let elem of this.results.values()) {
      //   this.getAllcombination(elem.id.split(";"));
      // }
      // this.changeStateByOComb();
      // console.timeEnd("结果推导过程-递归");

      /**
       * 结果推导过程-动态规划
       * 初始化速度 4阶约12ms 6阶约55~70ms 9阶约355ms 15阶约26000ms
       */
      // console.time("结果推导过程-动态规划");
      // for (let elem of this.results.values()) {
      //   this.getDynamicPlanningCombs(elem.id.split(";"));
      // }
      // this.changeStateByOComb();
      // console.timeEnd("结果推导过程-动态规划");
      /*** 结果推导过程 end ***/

      /*** 过程确定结果 start ***/
      /**
       * 过程确定结果-常规算法
       * 初始化速度
       *    4阶约2ms 6阶约3ms 9阶约3.2ms 15阶约5ms
       * 点击响应时间(选一个)
       *    4阶约1.5ms 6阶约1.3ms 9阶约3ms 15阶约4ms
       * 二次点击响应时间(选一个)
       *    4阶约0.5ms 6阶约1ms 9阶约1ms 15阶约2ms
       */
      // console.time("过程确定结果-常规算法");
      // this.changeStateByResult();
      // console.timeEnd("过程确定结果-常规算法");

      /**
       * 过程确定结果-质数优化
       * 除去初始化所有选项id对应一个质数，其实和上面的常规算法是一样的
       */
      console.time("过程确定结果-质数优化");
      this.initPrimeNum();
      this.changeStateByResult();
      console.timeEnd("过程确定结果-质数优化");
      /*** 过程确定结果 end ***/
    }
  }
</script>

<style scoped lang="less">
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
   }
</style>
