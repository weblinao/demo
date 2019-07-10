/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import testWebp from '@modulePath/testWebp'                  // webp测试
import calculator from '@modulePath/calculator/calculator'  // 计算器

Vue.use(Router)

const ROUTER_VIEW_TEMP =
    `<div>
		<keep-alive>
			<router-view v-if="$route.meta && $route.meta.keepAlive"></router-view>
		</keep-alive>
		<router-view v-if="!($route.meta && $route.meta.keepAlive)"></router-view>
	</div>`;

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/common',
      component: () => import ('@page/common/index'),
      children: [{
        path: '404',
        name: '404',
        component: () => import ('@page/common/404'),
      }]
    },
    {
      path: '/',
      name: 'index',
      redirect: 'home'
    },
    { // 主页
      path: '/home',
      name: 'home',
      component: () => import ('@modulePath/directory'),  // 目录
    },
    { // CSS实验
      path: '/css_explore',
      name: 'cssExplore',
      component: {
        template: ROUTER_VIEW_TEMP
      },
      children: [{ // css实验 目录
        path: 'index',
        name: 'cssExplore_index',
        component: () => import ('@page/cssExplore/index'),
      }, { // 圆锥渐变
        path: 'conic_gradient',
        name: 'conicGradient',
        component: () => import ('@page/cssExplore/conicGradient'),
      }, { // 滚动视差
        path: 'parallax_scrolling',
        name: 'parallaxScrolling',
        component: () => import ('@page/cssExplore/parallaxScrolling'),
      }, { // 伪类选择器 :focus-within
        path: 'focus_within',
        name: 'focusWithin',
        component: () => import ('@page/cssExplore/focusWithin'),
      }, { // 3d动画
        path: 'animation_3d',
        name: 'animation3D',
        component: () => import ('@page/cssExplore/animation3D'),
      }, { // 纸鹤
        path: 'paper_crane',
        name: 'paperCrane',
        component: () => import ('@page/cssExplore/paperCrane'),
      }, { // 各种loading
        path: 'loadings',
        name: 'loadings',
        component: () => import ('@page/cssExplore/loadings'),
      }, { // 愤怒的小鸟们
        path: 'angry_birds',
        name: 'angryBirds',
        component: () => import ('@page/cssExplore/angryBirds'),
      }, { // 来一杯扎啤
        path: 'have_a_drink',
        name: 'haveADrink',
        component: () => import ('@page/cssExplore/haveADrink'),
      }]
    },
    { // 算法示例
      path: '/arithmetic',
      name: 'arithmetic',
      component: {
        template: ROUTER_VIEW_TEMP
      },
      children: [{ // 算法示例 目录
        path: 'index',
        name: 'arithmetic_index',
        component: () => import ('@page/arithmetic/index'),
      }, { // sku算法
        path: 'sku',
        name: 'sku',
        component: {
          template: ROUTER_VIEW_TEMP
        },
        children: [{ // sku算法 目录
          path: 'index',
          name: 'skuIndex',
          component: () => import ('@page/arithmetic/skuAlgorithm/index'),
        }, { // sku算法
          path: 'test',
          name: 'skuTest',
          component: () => import ('@page/arithmetic/skuAlgorithm/sku'),
        }, { // sku算法 改
          path: 'new',
          name: 'skuNew',
          component: () => import ('@page/arithmetic/skuAlgorithm/skuNew'),
        }, { // sku算法 改 质数代替ID
          path: 'prime_num',
          name: 'skuPrimeNum',
          component: () => import ('@page/arithmetic/skuAlgorithm/skuPrimeNum'),
        }]
      }, { // 背包问题
        path: 'backpack',
        name: 'backpack',
        component: {
          template: ROUTER_VIEW_TEMP
        },
        children: [{ // 背包问题 目录
          path: 'index',
          name: 'backpackIndex',
          component: () => import ('@page/arithmetic/backpackQuestion/index'),
        },{ // 01背包问题
          path: 'simple',
          name: 'simple',
          component: () => import ('@page/arithmetic/backpackQuestion/simple'),
        },{ // 完全背包问题
          path: 'completely',
          name: 'completely',
          component: () => import ('@page/arithmetic/backpackQuestion/completely'),
        },{ // 多重背包问题
          path: 'multiple',
          name: 'multiple',
          component: () => import ('@page/arithmetic/backpackQuestion/multiple'),
        },{ // 二维费用的背包问题
          path: 'two_dimensional',
          name: 'twoDimensional',
          component: () => import ('@page/arithmetic/backpackQuestion/twoDimensional'),
        }]
      }, { // 送饭
        path: 'food_delivery',
        name: 'foodDelivery',
        component: {
          template: ROUTER_VIEW_TEMP
        },
        children: [{
          path: 'index',
          name: 'foodDeliveryIndex',
          component: () => import ('@page/arithmetic/foodDelivery/index'),
        }]
      }]
    },
    { // 计算器
      path: '/calculator',
      name: 'calculator',
      component: calculator
    },
    { // webp测试
      path: '/test_webp',
      name: 'test-webp',
      component: testWebp
    },
    {
      path: '*',
      redirect: () => {
        return {
          name: '404'
        };
      }
    }
  ]
})
