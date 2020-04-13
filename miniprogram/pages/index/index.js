// miniprogram/pages/index/index.js

const db  =  wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls : [],
    listData : [],
    current : 'links'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getListData();
    this.getBannerList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleLinks(ev){
    let id = ev.target.dataset.id;    //挂载的属性,然后可以在ev.target.dataset中拿到
    /**  客户端点赞,只能给自己点赞,无权限为其他用户点赞
    db.collection('users').doc(id).update({
      data : {
        links : 5
      }
    }).then((res)=>{

    });
    */
    wx.cloud.callFunction({
      name :'update',
      data : {
        collection :'users',
        doc : id,
        data : "{links : _.inc(1)}"
      }
    }).then((res)=>{
      // console.log(res);
      let updated = res.result.stats.updated;
      if (updated){
        let cloneListData = [...this.data.listData];
        for (let i = 0; i < cloneListData.length;i++){
          if (cloneListData[i]._id == id ){
            cloneListData[i].links++;
          }
        }
        this.setData({
          listData : cloneListData
        });
      }
    });
  },
  handleCurrent(ev){
    let current = ev.target.dataset.current;
    if( current == this.data.current ){
      return false;
    }
    this.setData({
      current
    },()=>{
      this.getListData();
    });
  },
  getListData(){
    db.collection('users')
    .field({
      userPhoto : true,
      nickName : true,
      links :true
    })
    .orderBy(this.data.current, 'desc')
    .get()
    .then((res)=>{
      this.setData({
        listData : res.data
      });
    });
  },
  handleDetail(ev){
    let id = ev.target.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?userId=' + id
    })
  },
  getBannerList(){
    db.collection('banner').get().then((res)=>{
      // console.log(res.data)
      this.setData({
        imgUrls : res.data
      });
    });
  }
})