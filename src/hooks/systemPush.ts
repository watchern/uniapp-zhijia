/**
 * @author Mino
 * @date 2021/08/04
 * @description App Push
 */

export default {
  /**
   * @description 需要在App.vue中onLaunch中调用
   * // this.$push.create("点击查看消息内容>>", {url: "/pages/user/account/forget"}, {
   // 	delay: 0,
   // 	title: "您有1条新的消息",
   // }, true);
   */
  init() {
    plus.push.setAutoNotification(true); // setAutoNotification 默认就是true
    plus.push.addEventListener("click", (message) => {
      console.log(message)
      // @ts-ignore
      let {url} = message?.payload;
      if (url) {
        uni.navigateTo({
          url,
          success: () => {
          }, // 可以根据需求删除消息 this.remove(message);
          complete: () => {
          } // 可以根据需求删除消息 this.remove(message);
        });
      }
    })
  },
  /**
   * @param {number} message
   * @param isChange
   * @description
   *    - 传入message时，删除消息列表中的message；
   *      - 不传参数：则全部清空
   */
  remove(message, isChange) {
    message ? plus.push.remove(message) : plus.push.clear();
    isChange && this.changeBadge();
  },
  /**
   * @param {string} content 消息内容
   * @param {Object} payload 消息承载的数据
   * @param {Object} options 消息配置
   * @param {Boolean} isChange 创建消息后是否更新BadgeNumber
   * @example
   *  this.$push.create("点击查看消息内容>>", {url: "/pages/office/xxx", xxx: x}, {
   delay: 3,
   title: "您有3条新的消息",
   });
   */
  create(content: string, payload: object = {}, options: object, isChange: boolean) {
    // @ts-ignore
    plus.push.createMessage(...arguments);
    // @ts-ignore
    const delay = options.delay ? (~~options.delay * 1000) : 0;
    setTimeout(() => {
      isChange && this.changeBadge();
    }, delay)
  },
  changeBadge(number = 0) {
    const messages = this.getAllMessage();
    // @ts-ignore
    plus.runtime.setBadgeNumber(number || messages.length);
  },
  getAllMessage() {
    return plus.push.getAllMessage();
  }
}
