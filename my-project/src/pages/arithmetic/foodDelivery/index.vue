<template>
  <div class="arithmetic-food-delivery-wrapper">
    <h2 class="title">外卖小哥送饭</h2>
    <p class="question-desc">
      附图中有一个无向图，其中圈内数字代表一个地点，边e上数字代表长度L e （双向相同）。
      一位外卖小哥在起点A，要去3个商家（B 1 , B 2 , B 3 ）取餐，送到3个对应的地方（C 1 , C 2 ,
      C 3 ），即B 1 至C 1 ，B 2 至C 2 ， B 3 至C 3 。小哥的电动助力车的箱子同时最多装下2份外卖。
    </p>
    <div class="img-box">
      <img src="@imgPath/arithmetic/food_delivery.png" alt="">
    </div>
    <p class="question-content">
      请问: 小哥该怎么走最短路径？这个最短路径的长度是多少？这里，A是出发点，最后一餐
      （不限次序）送达地为终点。为了简化问题，假设商家已经备好了外卖，小哥取餐送餐不用
      等。又假设每份外卖重量大小一样。
    </p>
    <p class="answer">
      最短路线为：{{sShortestPath}} <br>
      总路程为：{{nShortestDistance}} <br>
      具体路径为：{{sDetailPath}}
    </p>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'food-delivery-index',
  data () {
    return {
      graph: {
        $1: {
          linkTo: [
            {id: '$2', range: 1},
            {id: '$5', range: 1}
          ]
        },
        $2: {
          linkTo: [
            {id: '$1', range: 1},
            {id: '$3', range: 2},
            {id: '$6', range: 2}
          ]
        },
        $3: {
          linkTo: [
            {id: '$2', range: 2},
            {id: '$4', range: 1},
            {id: '$8', range: 2}
          ]
        },
        $4: {
          linkTo: [
            {id: '$3', range: 1},
            {id: '$15', range: 3}
          ]
        },
        $5: {
          linkTo: [
            {id: '$1', range: 1},
            {id: '$6', range: 1},
            {id: '$9', range: 1}
          ]
        },
        $6: {
          linkTo: [
            {id: '$2', range: 2},
            {id: '$5', range: 1},
            {id: '$7', range: 1}
          ]
        },
        $7: {
          linkTo: [
            {id: '$6', range: 1},
            {id: '$8', range: 1},
            {id: '$10', range: 1}
          ]
        },
        $8: {
          linkTo: [
            {id: '$3', range: 2},
            {id: '$7', range: 1},
            {id: '$11', range: 1}
          ]
        },
        $9: {
          linkTo: [
            {id: '$5', range: 1},
            {id: '$10', range: 3},
            {id: '$12', range: 2}
          ]
        },
        $10: {
          linkTo: [
            {id: '$7', range: 1},
            {id: '$9', range: 3},
            {id: '$11', range: 1},
            {id: '$13', range: 2}
          ]
        },
        $11: {
          linkTo: [
            {id: '$8', range: 1},
            {id: '$10', range: 1},
            {id: '$14', range: 1}
          ]
        },
        $12: {
          linkTo: [
            {id: '$9', range: 2},
            {id: '$13', range: 2}
          ]
        },
        $13: {
          linkTo: [
            {id: '$10', range: 2},
            {id: '$12', range: 2},
            {id: '$14', range: 1}
          ]
        },
        $14: {
          linkTo: [
            {id: '$11', range: 1},
            {id: '$13', range: 1},
            {id: '$15', range: 1}
          ]
        },
        $15: {
          linkTo: [
            {id: '$4', range: 3},
            {id: '$14', range: 1}
          ]
        }
      },
      locations: [
        {id: 'A', location: '$2'},
        {id: 'B1', location: '$3', sendTo: 'C1'},
        {id: 'B2', location: '$7', sendTo: 'C2'},
        {id: 'B3', location: '$4', sendTo: 'C3'},
        {id: 'C1', location: '$12', require: 'B1'},
        {id: 'C2', location: '$11', require: 'B2'},
        {id: 'C3', location: '$13', require: 'B3'},
      ],
      aShortestWay: {}, //记录已经计算过的最短路径
      sShortestPath: '',
      nShortestDistance: 0,
      sDetailPath: ''
    }
  },
  mounted () {
    console.profile('测试');
    this.getShortestWay();
    console.profileEnd('测试');
  },
  methods: {
    getShortestWay: function () {
      console.log('get all way');
      let aKeys = ['B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

      let aWays = [];
      // 获取6个地址的所有排序
      for (let [index, item] of aKeys.entries()) {
        aWays = this.getSortResult(aWays, item);
      }
      aWays = this.filterSort(aWays);
      // console.log(aWays);
      let shortestPath = {
        isGet: false,
        way: [],
        path: [],
        totalDistance: 0
      };
      // 循环所有送餐方式，计算每个方式的最短总路程
      for (let [index, item] of aWays.entries()) {
        let aWays = [];
        let nTotalDistance = 0;
        for (let i=0; i<=item.length-2; i++) {
          let startPoint = this.locations.find(value => value.id === item[i]).location;
          let endPoint = this.locations.find(value => value.id === item[i+1]).location;
          let oShortestPath = this.getShortestPath(startPoint, endPoint);
          aWays.push(oShortestPath.way);
          nTotalDistance += oShortestPath.range;
        }
        if (!shortestPath.isGet || shortestPath.totalDistance>nTotalDistance) {
          shortestPath.isGet = true;
          shortestPath.way = item;
          shortestPath.path = [...aWays];
          shortestPath.totalDistance = nTotalDistance;
        }
      }
      console.log(shortestPath);
      console.log(`最短路线为 ${shortestPath.way.join('-->')}，总路程为${shortestPath.totalDistance}`);
      this.sShortestPath = shortestPath.way.join('-->');
      this.nShortestDistance = shortestPath.totalDistance;
      this.sDetailPath = this.getDetailPath(shortestPath.path);
    },
    getDetailPath: function (aPath) {
      let aPathCopy = [];
      for (let [index, item] of aPath.entries()) {
        if (index===0) {
          aPathCopy = [...item];
        } else {
          item.shift();
          aPathCopy = [...aPathCopy, ...item];
        }
      }
      for (let [index, item] of aPathCopy.entries()) {
        aPathCopy[index] = item.substring(1);
      }

      return aPathCopy.join('->');
    },
    // 过滤排列中不合理的项
    filterSort: function (aWays) {
      let aReasonable = [];
      for (let [index, item] of aWays.entries()) {
        if (this.checkIsReasonable(item)) {
          // 添加起点
          aReasonable.push(['A', ...item]);
        }
      }
      return aReasonable;
    },
    // 计算所有可能的合理的送餐顺序
    getSortResult: function (aSorted, sInsert) {
      let aResult = [];
      if (aSorted && aSorted.length) {
        for (let [index, item] of aSorted.entries()) {
          for (let i=0; i<= item.length; i++) {
            let aResultItem = [...item];
            if (i===0) {
              aResultItem.unshift(sInsert);
            } else {
              aResultItem.splice(i, 0, sInsert);
            }

            aResult.push(aResultItem);
          }
        }
      } else {
        aResult.push([sInsert]);
      }

      return aResult;
    },
    // 验证当前送餐顺序是否合理
    checkIsReasonable: function (aCheck) {
      // 如果要送到C1，要检查是否已经取了B1
      if (aCheck.includes('C1')) {
        let nMerchantIndex = aCheck.findIndex(value => value==='B1');
        let nCustomerIndex = aCheck.findIndex(value => value==='C1');
        if (nMerchantIndex>nCustomerIndex) return false;
      }
      if (aCheck.includes('C2')) {
        let nMerchantIndex = aCheck.findIndex(value => value==='B2');
        let nCustomerIndex = aCheck.findIndex(value => value==='C2');
        if (nMerchantIndex>nCustomerIndex) return false;
      }
      if (aCheck.includes('C3')) {
        let nMerchantIndex = aCheck.findIndex(value => value==='B3');
        let nCustomerIndex = aCheck.findIndex(value => value==='C3');
        if (nMerchantIndex>nCustomerIndex) return false;
      }
      // 容量有限不能3个一起取
      let sCheck = aCheck.join('');
      sCheck = sCheck.replace(/\d/g, '');

      return !sCheck.includes('BBB');
    },
    // 获取两点间的最短路径
    getShortestPath: function (startPoint, endPoint) {
      let searchKey = `${startPoint}-to-${endPoint}`;

      if (this.aShortestWay[searchKey]) {
        return this.aShortestWay[searchKey]
      }

      let graph = this.graph;
      let aPath = [{
        id: startPoint,
        wayIndex:-1,
      }];
      let aWayID = [startPoint];
      let nDistance = 0; // 当前走过的距离
      let oS2EWay = {    // 起点到终点的路径
        isGet: false,
        way: [],
        range: 0
      };

      // 跳到下一个点
      function goToNextPoint(oLastPoint) {
        // 路径记录里只有起点且起点没有路径可走了
        // console.log(aPath[0].wayIndex, graph[aPath[0].id].linkTo.length-1);
        if (aPath.length===1 && (aPath[0].wayIndex >= graph[aPath[0].id].linkTo.length-1)) {
          // 设置停止信号
          isSearching = false;
          return true;
        }
        // 是否有路可走
        if (graph[oLastPoint.id].linkTo.length-1 > oLastPoint.wayIndex) {
          // 有路可走，去下一个点
          let nextIndex = oLastPoint.wayIndex + 1;
          let nextPoint = graph[oLastPoint.id].linkTo[nextIndex];
          let nextPointID = nextPoint.id;
          // 不能去去过的点
          if (aWayID.includes(nextPointID)) {
            aPath[aPath.length-1].wayIndex = nextIndex;
            // console.log('去过的点', nextPointID, aPath[aPath.length-1].wayIndex);
            // 继续尝试去下一点
            return false;
          } else {
            let nTestRange = nDistance + nextPoint.range;
            // 如果有了起点到终点的路径则比较一下 当前已走的路径
            if (oS2EWay.isGet && oS2EWay.range<=nTestRange) {
              aPath[aPath.length-1].wayIndex = nextIndex;
              // 记录的路径小于当前已走的路径 不用继续往下走了
              // console.log('记录的路径小于当前已走的路径', aPath[aPath.length-1].wayIndex);
              return false;
            }
            nDistance = nTestRange;                 // 累加路程
            aPath[aPath.length-1].wayIndex = nextIndex;   // 记录当前节点的去的下一个节点的下标
            aPath.push({                                  // 将下一点放入路径点
              id: nextPointID,
              wayIndex: -1
            });
            aWayID.push(nextPointID);
            return true;
          }
        } else {
          // 没有路走了
          // console.log('没有路走了');
          return false;
        }
      }
      // 返回上一个点
      function goToLastPoint() {
        if (aWayID.length>1) {
          let sDiscardID = aWayID.pop();
          aPath.pop();                    // 删除路径记录中最后一条记录
          let oCurrLastPoint = aPath[aPath.length-1]; // 获取上一个点的记录
          // console.log(sDiscardID, oCurrLastPoint.id, graph[oCurrLastPoint.id], oCurrLastPoint, aWayID);
          let nDiscardRange = graph[oCurrLastPoint.id].linkTo[oCurrLastPoint.wayIndex].range;  // 获取上个点到已抛弃点的距离
          nDistance -= nDiscardRange;
        }
      }

      let isSearching = true;
      let i=0;
      // 循环走所有路径
      while (isSearching && i<1000000) {
        // console.log(aWayID);
        let oLastPoint = aPath[aPath.length-1];
        // 判断跑到终点了吗？
        if (oLastPoint.id === endPoint) {
          // console.log(oLastPoint.id, 'get point');
          // 记录一条路径
          if (!oS2EWay.isGet || nDistance < oS2EWay.range) {
            oS2EWay.isGet = true;
            oS2EWay.way = [...aWayID];
            oS2EWay.range = nDistance;
          }
          // 记录完，返回上一点，继续尝试其他路径
          goToLastPoint();

        } else {
          // console.log('not end');
          // 没有到终点，去下一个点
          let isJumpSuccess = goToNextPoint(oLastPoint);
          if (!isJumpSuccess) {
            // 没有成功跳到下一个点，看看当前节点是否无路可走了
            if (graph[oLastPoint.id].linkTo.length-1 <= aPath[aPath.length-1].wayIndex) {
              // console.log(oLastPoint.id, '当前要丢弃的点');
              // 返回上一点
              goToLastPoint();
            }
          }
        }
        // console.log(aPath, nDistance);
        i++;
      }

      this.aShortestWay[searchKey] = {...oS2EWay}; // 记录一下计算结果
      return oS2EWay;
    }
  }
}
</script>

<style scoped lang="less">
  @import "~@cssPath/variable.less";
  @import "~@cssPath/mixin.less";
  .arithmetic-food-delivery-wrapper{
    padding: 15px;

    .title{
      .font(15px, @c33, center, 25px);
    }
    .question-desc, .question-content{
      .font(12px, @c44, justify, 1.2);
      text-indent: 24px;
    }
    .img-box{
      .wh(100%, 250px);

      img{
        .wh(100%, 100%);
      }
    }
    .answer{
      padding-top: 15px;
      .font(14px, @c00, left, 1.2);
    }
  }
</style>
