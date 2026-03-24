import { IHttpResponse, IObject } from "@/types/interface";
import http from "../utils/http";

/**
 * 常用CRUD
 */
export default {
  /**
   * 删除
   * @param path
   * @param params
   * @returns
   */
  delete(path: string, params: IObject): Promise<IHttpResponse> {
    return http({
      url: path,
      data: params,
      method: "DELETE"
    });
  },
  get(path: string, params?: IObject, headers?: IObject): Promise<IHttpResponse> {
    return new Promise((resolve, reject) => {
      http({
        url: path,
        params,
        headers,
        method: "GET"
      })
        .then(resolve)
        .catch((error) => {
          if (error !== "-999") {
            reject(error);
          }
        });
    });
  },
  put(path: string, params?: IObject, headers?: IObject): Promise<IHttpResponse> {
    return http({
      url: path,
      data: params,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...headers
      },
      method: "PUT"
    });
  },
  /**
   * 通用post方法
   * @param path
   * @param body
   * @returns
   */
  post(path: string, body?: IObject, headers?: IObject): Promise<IHttpResponse> {
    // 如果是 FormData，不设置 Content-Type，让浏览器自动处理
    const isFormData = body instanceof FormData;
    return http({
      url: path,
      method: "post",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json;charset=UTF-8" }),
        ...headers
      },
      data: body
    });
  }
};
