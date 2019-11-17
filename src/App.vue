<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { MessageBox, Message, Notification } from "element-ui";
import store from "@/store";
export default {
  name: "App",
  data() {
    return {
      websocke: Object,
      token:'',
    };
  },
  created() {
    this.initWebSocket();
  },
  methods: {
    initWebSocket() {
      // 初始化weosocket
      this.token = this.uuid();
      const wsuri = `ws://127.0.0.1:8100/websocket/` + this.token; // 这个地址由后端童鞋提供
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  },
    websocketonopen() {
      // 连接建立之后执行send方法发送数据
      // this.websocketsend()
      console.log("websocket连接成功");
    },
    websocketonerror() {
      // 连接建立失败重连
      // this.initWebSocket()
    },
    websocketonmessage(e) {
      let _this = this; // 数据接收
      try {
        var message = JSON.parse(e.data);
          if (message.type == "FUNCTION") {
            var updateDto = JSON.parse(message.content);
            var msg;
            var dashboard = updateDto.dashboard
          if(updateDto.actionType == 'ADD'){
            msg = "Client:" + updateDto.clientInfo.clientId + " connected"
            // dashboard.connectingClients = updateDto.connectingClient
            // dashboard.connectedCount += 1
            // dashboard.weekConnectingClient[6] += updateDto.connectingClient 
            // dashboard.weekConnectedCount[6] += 1 
          } else if( updateDto.actionType == 'DELETE' ){
            msg = "Client:" + updateDto.clientInfo.clientId + " disconnected"
            // dashboard.connectingClients -= 1
            // dashboard.weekConnectingClient[6] -= 1 
          }
          // dashboard.agentsCount = updateDto.agentsCount
          this.$store.dispatch('user/setDashbarod',dashboard)
          if (message.functionName == "Notification") {
            Notification({
              message: msg,
              type: "success",
              duration: 5 * 1000,
              position: "top-right",
              showClose: false
            });
          }
        }
      } catch (error) {
        console.log(e.data)
      }
      

    },
    websocketsend(Data) {
      // 数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      // 关闭
      console.log("断开连接", e);
    }
  }
};
</script>
