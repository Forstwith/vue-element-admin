<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      websocke : Object,

    }
  },
  methods: {
      initWebSocket(){ // 初始化weosocket
        const wsuri = `ws://192.168.18.169:8059/websocket/${localStorage.getItem('userId')}`// 这个地址由后端童鞋提供
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen(){ // 连接建立之后执行send方法发送数据
        this.websocketsend(this.user)
        console.log(111);
      },
      websocketonerror(){// 连接建立失败重连
        this.initWebSocket()
      },
      websocketonmessage(e){
        let _this = this // 数据接收
        if (e.data == '连接成功') {// 这个判断是我业务需求才加的
          return
        }
        // 业务需求，将socket接收到的值存进vuex
        _this.$store.store.dispatch('RESET_ID') // 先调用reset方法置空vuex > store里面的scorketId（为什么置空，下面标题3解释）
        _this.$store.store.dispatch('SAVE_ID', JSON.parse(e.data).areaId) // 重新给store中的scorketId赋值（数据格式问题先转了json）
        // console.log(_this.$store.store.state.scorketId);
      },
      websocketsend(Data){// 数据发送
        this.websock.send(Data)
      },
      websocketclose(e){  // 关闭
        console.log('断开连接', e)
      }
  }
}

</script>
