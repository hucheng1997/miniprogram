let datas = require('../../datas/list-data.js')
let appDatas=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMusicPlay: false,
    index: null,
    detailObj: {},
    isCollected: false,
  },
  //处理音乐播放
  handleMusicPlay() {
    let isMusicPlay = !this.data.isMusicPlay;
    this.setData({
      isMusicPlay
    });
    let {
      dataUrl,
      title
    } = this.data.detailObj.music;
    //控制音乐播放
    if (isMusicPlay) {
      wx.playBackgroundAudio({
        dataUrl,
        title
      })
    } else {
      wx.pauseBackgroundAudio();
    }

  },
  handleCollection() {
    let isCollected = !this.data.isCollected;
    this.setData({
      isCollected
    });
    let title = isCollected ? '收藏成功' : '取消收藏';
    //提示用户
    wx.showToast({
      title,
      icon: 'success'
    });
    //缓存数据到本地
    let {
      index
    } = this.data;
    wx.getStorage({
      key: 'isCollected',
      success: (res) => {
        let obj = res.data;
        obj[index] = isCollected;
        wx.setStorage({
          key: 'isCollected',
          data: obj,
          success: () => {
            console.log("缓存成功")
          }
        })
      }
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let isCollected = wx.getStorageSync('isCollected');
    //处理空对象
    if (!isCollected) {
      wx.setStorageSync('isCollected', {})
    }
    let index = options.index;
    if (isCollected[index]) {
      this.setData({
        isCollected: true
      })
    }
    this.setData({
      detailObj: datas.list_data[index],
      index
    })
    let backgroundAudioManager=wx.getBackgroundAudioManager();
    backgroundAudioManager.onPlay(()=>{
      this.setData({
        isMusicPlay:true
      })
      appDatas.data.isPlay=true;
      appDatas.data.pageIndex = index;
    });
    backgroundAudioManager.onPause(() => {
      this.setData({
        isMusicPlay: false
      })
      appDatas.data.isPlay = false;
      appDatas.data.pageIndex = index;
    });
    //判断当前页面是否播放
    if (appDatas.data.isPlay && appDatas.data.pageIndex === index){
      this.setData({
        isMusicPlay: true
      })
    }
  },
  handleShareArticle(){
    wx.showActionSheet({
      itemList: ['转发到朋友圈', '转发到QQ空间', '转发到微博']
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})