<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <panel-group :chart-data="{
      connectingClients: this.$store.state.user.dashbard.connectingClients,
      connectedCount: this.$store.state.user.dashbard.connectedCount,
      errorDisconnect: this.$store.state.user.dashbard.errorDisconnect,
      agentsCount: this.$store.state.user.dashbard.agentsCount
    }"  />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="{
      expectedData: this.$store.state.user.dashbard.weekErrorDisconnected,
      actualData: this.$store.state.user.dashbard.weekConnectedCount,
      weekData: this.$store.state.user.dashbard.week
    }" />
    </el-row>

    <el-row :gutter="32">
      <!-- <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col> -->
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :chart-data="{
            connectingClients: this.$store.state.user.dashbard.connectingClients,
            connectedCount: this.$store.state.user.dashbard.connectedCount,
            errorDisconnect: this.$store.state.user.dashbard.errorDisconnect}"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart :chart-data="{
      weekErrorDisconnected: this.$store.state.user.dashbard.weekErrorDisconnected,
      weekConnectedCount: this.$store.state.user.dashbard.weekConnectedCount,
      connectingClients: this.$store.state.user.dashbard.connectingClients,
      weekData: this.$store.state.user.dashbard.week}"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { initDashboard } from '@/api/remote-search'
// import TransactionTable from './components/TransactionTable'


export default {
  name: 'DashboardAdmin',
  components: {
    // GithubCorner,
    PanelGroup,
    LineChart,
    // RaddarChart,
    PieChart,
    BarChart

  },
  data() {
    return {
    }
  },
  created() {

  },

  mounted() {
    // 获取初始化数据
    initDashboard().then(response => {
      this.$store.dispatch('user/setDashbarod',response.data)
    })
  },

  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    testIncrease() {
      setInterval(() => {
        this.panelChartDate.connectingClients += 5
        console.log(this.panelChartDate.connectingClients)
      }, 5000)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
