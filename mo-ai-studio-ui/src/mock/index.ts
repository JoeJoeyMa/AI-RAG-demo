export const mock = {
  "app.json": `{
  "pages": [
    "pages/index/index",
    "pages/menu/menu",
    "pages/cart/cart",
    "pages/order/order"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "订餐小程序",
    "navigationBarTextStyle": "black"
  },
  "usingComponents": {
    "van-button": "@vant/weapp/button/index",
    "van-row": "@vant/weapp/row/index",
    "van-col": "@vant/weapp/col/index",
    "van-icon": "@vant/weapp/icon/index",
    "van-tabs": "@vant/weapp/tabs/index",
    "van-tab": "@vant/weapp/tab/index",
    "van-image": "@vant/weapp/image/index",
    "van-tabbar": "@vant/weapp/tabbar/index",
    "van-tabbar-item": "@vant/weapp/tabbar-item/index"
  },
  "lazyCodeLoading": "requiredComponents",
  "sitemapLocation": "sitemap.json"
}`,
  "pages/menu/menu.wxml": `<view class="container">
  <van-row>
    <van-col span="8" wx:for="{{menuItems}}" wx:key="index">
      <van-image src="{{item.image}}" width="100%" height="100px" />
      <view>{{item.name}}</view>
      <view>¥{{item.price}}</view>
      <van-button type="primary" size="mini" bind:tap="addToCart" data-item="{{item}}">加入购物车</van-button>
    </van-col>
  </van-row>
</view>`,
  "pages/menu/menu.js": `Page({
  data: {
    menuItems: []
  },
  onLoad() {
    // 获取菜单数据
    this.setData({
      menuItems: [
        { name: '菜品1', price: 10, image: 'https://img.yzcdn.cn/vant/cat.jpeg' },
        { name: '菜品2', price: 20, image: 'https://img.yzcdn.cn/vant/cat.jpeg' }
      ]
    });
  },
  addToCart(event) {
    const item = event.currentTarget.dataset.item;
    // 添加到购物车逻辑
    wx.showToast({
      title: '已添加到购物车',
      icon: 'success',
      duration: 2000
    });
  }
});`,
  "pages/menu/menu.wxss": `.container {
  padding: 20px;
}`,
  "pages/menu/menu.json": `{
  "usingComponents": {
    "van-button": "@vant/weapp/button/index",
    "van-row": "@vant/weapp/row/index",
    "van-col": "@vant/weapp/col/index",
    "van-image": "@vant/weapp/image/index"
  }
}`,
  "pages/cart/cart.wxml": `<view class="container">
  <van-row wx:for="{{cartItems}}" wx:key="index">
    <van-col span="6">
      <van-image src="{{item.image}}" width="80px" height="80px" />
    </van-col>
    <van-col span="12">
      <view>{{item.name}}</view>
      <view>¥{{item.price}}</view>
    </van-col>
    <van-col span="6">
      <van-stepper value="{{item.quantity}}" bind:change="onQuantityChange" data-index="{{index}}" />
    </van-col>
  </van-row>
  <van-submit-bar
    price="{{totalPrice}}"
    button-text="提交订单"
    bind:submit="onSubmit"
  />
</view>`,
  "pages/cart/cart.js": `Page({
  data: {
    cartItems: [],
    totalPrice: 0
  },
  onLoad() {
    // 获取购物车数据
    this.setData({
      cartItems: [
        { name: '菜品1', price: 10, image: 'https://img.yzcdn.cn/vant/cat.jpeg', quantity: 1 },
        { name: '菜品2', price: 20, image: 'https://img.yzcdn.cn/vant/cat.jpeg', quantity: 2 }
      ]
    });
    this.calculateTotal();
  },
  onQuantityChange(event) {
    const { index } = event.currentTarget.dataset;
    const { value } = event.detail;
    const cartItems = this.data.cartItems;
    cartItems[index].quantity = value;
    this.setData({ cartItems });
    this.calculateTotal();
  },
  calculateTotal() {
    let total = 0;
    this.data.cartItems.forEach(item => {
      total += item.price * item.quantity;
    });
    this.setData({ totalPrice: total * 100 }); // 转换为分
  },
  onSubmit() {
    wx.navigateTo({
      url: '/pages/order/order'
    });
  }
});`,
  "pages/cart/cart.wxss": `.container {
  padding: 20px;
}`,
  "pages/cart/cart.json": `{
  "usingComponents": {
    "van-row": "@vant/weapp/row/index",
    "van-col": "@vant/weapp/col/index",
    "van-image": "@vant/weapp/image/index",
    "van-stepper": "@vant/weapp/stepper/index",
    "van-submit-bar": "@vant/weapp/submit-bar/index"
  }
}`,
  "pages/order/order.wxml": `<view class="container">
  <van-cell-group>
    <van-field
      value="{{ address }}"
      label="配送地址"
      placeholder="请输入配送地址"
      bind:change="onAddressChange"
    />
    <van-field
      value="{{ phone }}"
      label="联系电话"
      placeholder="请输入联系电话"
      bind:change="onPhoneChange"
    />
  </van-cell-group>
  <van-submit-bar
    price="{{totalPrice}}"
    button-text="确认下单"
    bind:submit="onSubmit"
  />
</view>`,
  "pages/order/order.js": `Page({
  data: {
    address: '',
    phone: '',
    totalPrice: 0
  },
  onLoad() {
    // 获取订单总价
    this.setData({ totalPrice: 3000 }); // 示例价格，30元
  },
  onAddressChange(event) {
    this.setData({ address: event.detail });
  },
  onPhoneChange(event) {
    this.setData({ phone: event.detail });
  },
  onSubmit() {
    if (!this.data.address || !this.data.phone) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }
    wx.showToast({
      title: '下单成功',
      icon: 'success',
      duration: 2000
    });
    // 这里可以添加提交订单到服务器的逻辑
  }
});`,
  "pages/order/order.wxss": `.container {
  padding: 20px;
}`,
  "pages/order/order.json": `{
  "usingComponents": {
    "van-field": "@vant/weapp/field/index",
    "van-cell-group": "@vant/weapp/cell-group/index",
    "van-submit-bar": "@vant/weapp/submit-bar/index"
  }
}`,
  "#summary":
    "创建了订餐小程序的基本结构，包括菜单页、购物车页和订单页。修改了app.json添加新页面路径，使用Vant Weapp组件构建UI，实现了基本的菜单展示、购物车管理和订单提交功能。",
}
