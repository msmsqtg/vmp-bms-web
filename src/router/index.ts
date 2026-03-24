import { IObject } from "@/types/interface";
import { useAppStore } from "@/store";
import { getToken } from "@/utils/cache";
import { getBaseRouteToMeta, registerToRouter } from "@/utils/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import {
  createRouter,
  createWebHashHistory,
  RouteLocationNormalized,
  RouteRecordRaw
} from "vue-router";
import baseRoutes from "./base";
import emits from "@/utils/emits";
import { EMitt } from "@/constants/enum";

interface dynamicRouteParams {
  path: string;
  query?: IObject;
  mete?: IObject;
}

NProgress.configure({ showSpinner: false });

const router = createRouter({
  history: createWebHashHistory(), //createWebHashHistory() hash模式
  routes: baseRoutes
});

// 路由加载前
router.beforeEach((to, from, next) => {
  //外链
  if (to.meta.isNewPage) {
    if (to.query.pop !== "true") {
      next(undefined);
      return false;
    }
  }

  const store = useAppStore();

  //token
  const token = getToken();
  const isPop = to.query.pop === "true"; //新窗口打开内页
  NProgress.start();
  if (to.path !== "/login") {
    if (store.state.routes.length) {
      if (to.name === "error") {
        const isMatched = autoRegisterDynamicToRouterAndNext(to);
        if (!isMatched) {
          store.updateState({ appIsRender: true, appIsReady: true });
          next();
        }
      } else {
        if (!to.query.pop) {
          const routeMeta: IObject = store.state.routeToMeta[to.path];
          // 优先使用 to.meta.title，然后是 routeMeta.title，最后是路径
          const title = to.query._mt || to.meta.title || (routeMeta ? routeMeta.title : '') || to.path;
          emits.emit(EMitt.OnPushMenuToTabs, {
            label: title,
            value: to.fullPath,
            mete: routeMeta
          });
        }
        store.updateState({ appIsRender: true, appIsReady: true });
        next();
      }
    } else {
      if (token) {
        store.initApp().then((res: Array<RouteRecordRaw>) => {
          const mergeRoute = baseRoutes.concat(res);
          router.options.routes = mergeRoute;
          registerToRouter(router, mergeRoute);
          if (!to.matched.length) {
            registerDynamicToRouterAndNext({ path: to.path, query: to.query });
          }
          store.updateState({
            appIsReady: true,
            routes: mergeRoute,
            routeToMeta: { ...store.state.routeToMeta, ...getBaseRouteToMeta(baseRoutes) }
          });
          setTimeout(() => {
            store.updateState({ appIsRender: true, appIsLogin: true });
          }, 600);
          next({ ...to, replace: true });
        });
      } else {
        if (isPop) {
          if (!to.matched.length) {
            registerDynamicToRouterAndNext({ path: to.path, query: to.query });
            store.updateState({ appIsRender: true, appIsReady: true });
            next(to.fullPath);
          } else {
            store.updateState({ appIsRender: true, appIsReady: true });
            if (to.meta.requiresAuth) {
              next("/login");
            } else {
              next();
            }
          }
        } else {
          next("/login");
        }
      }
    }
  } else {
    store.updateState({ appIsReady: true, appIsRender: true });
    next();
  }
});

// 路由加载后
router.afterEach(() => {
  NProgress.done();
});

/**
 * 获取系统视图路径映射
 * @returns
 */
export const getSysRouteMap = (): IObject => {
  return import.meta.glob("/src/views/**/*.vue");
};

/**
 * 根据路由path转换为系统视图组件路径
 * @param path
 * @returns
 */
export const toSysViewComponentPath = (path: string): string => {
  path = path.replace("_", "-");
  return `/src/views${path}.vue`;
};
/**
 * 自动注册路由
 * @param to
 * @returns
 */
const autoRegisterDynamicToRouterAndNext = (to: RouteLocationNormalized): boolean => {
  if (to.redirectedFrom) {
    const path = to.redirectedFrom.path;
    const component = matchedSysRouteComponent(path);
    if (component) {
      let title = path;
      if (path.includes("group-buy/page-config")) {
        title = "页面配置";
      } else if (path.includes("group-buy/create")) {
        title = "拼团活动配置";
      } else if (path.includes("group-buy")) {
        title = "拼团活动";
      } else if (path.includes("activity-management")) {
        title = "活动管理";
      }
      registerToRouter(router, [
        {
          path: path,
          name: path,
          component,
          redirect: "",
          meta: {
            title: title
          }
        }
      ]);
      // 更新 store 中的 routeToMeta
      const localStore = useAppStore();
      if (localStore) {
        localStore.updateState({
          routeToMeta: {
            ...localStore.state.routeToMeta,
            [path]: {
              title: title
            }
          }
        });
      }
      router.push(to.redirectedFrom);
      return true;
    }
  }
  return false;
};

/**
 * 寻找视图组件
 * @param path
 * @returns
 */
const matchedSysRouteComponent = (path: string): any => {
  const sysRouteMap = getSysRouteMap();
  const component = sysRouteMap[toSysViewComponentPath(path)];
  if (!component) {
    console.error("实时注册动态路由失败，未找到组件路径", path);
  }
  return component;
};

/**
 * 实时注册动态路由并直接跳转过去
 * @param route
 */
export const registerDynamicToRouterAndNext = (route: dynamicRouteParams): void => {
  const component = matchedSysRouteComponent(route.path);
  let title = route.path;
  if (route.path.includes("group-buy/page-config")) {
    title = "页面配置";
  } else if (route.path.includes("group-buy/create")) {
    title = "新建拼团活动";
  } else if (route.path.includes("group-buy")) {
    title = "拼团活动";
  } else if (route.path.includes("activity-management")) {
    title = "活动管理";
  } else if (route.path.includes("invitation-management/agent-whitelist")) {
    title = "代理人白名单";
  } else if (route.path.includes("invitation-management/export-record")) {
    title = "导出记录";
  } else if (route.path.includes("invitation-management/create")) {
    title = "邀约活动配置";
  } else if (route.path.includes("invitation-management")) {
    title = "邀约活动";
  }
  const newRoute: RouteRecordRaw = {
    path: route.path,
    name: route.path,
    component,
    redirect: !component ? { path: "/error", query: { to: 404 }, replace: true } : "",
    meta: {
      title: title
    }
  };
  registerToRouter(router, [newRoute]);
  // 更新 store 中的 routeToMeta
  const localStore = useAppStore();
  if (localStore) {
    localStore.updateState({
      routeToMeta: {
        ...localStore.state.routeToMeta,
        [route.path]: {
          title: title
        }
      }
    });
  }
  router.push(route);
};

export default router;
