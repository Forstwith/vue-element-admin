<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.agentName" placeholder="agentName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.clientId" placeholder="clientId" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <!-- <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select> -->
      <el-select v-model="listQuery.sortString" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>

      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>

    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="clientID" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.clientId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="lastConnectedTime" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="agentName" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.agentName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="agentAddress" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.agentAddress }}</span>
        </template>
      </el-table-column>

      <el-table-column label="clientIp" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.clientIp }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Status" class-name="status-col" width="150">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="350" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status=='connecting'" type="primary" size="mini" @click="handleUpdate(row)">
            MSG
          </el-button>
          <el-button v-if="row.status=='connecting'" size="mini" type="danger" @click="handleMsg(row,'socketClose')">
            CLOSE
          </el-button>
          <el-button v-if="row.status=='connecting'" size="mini" type="success" @click="handleMsg(row, 'changeDoorStatus', {doorStatus: 'Access'})">
            Access
          </el-button>
          <el-button v-if="row.status=='connecting'" size="mini" type="danger" @click="handleMsg(row, 'changeDoorStatus', {doorStatus: 'Forbid'})">
            Forbid
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Message" prop="msg">
          <el-input v-model="temp.msg" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="sendMessage()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
    <!--
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { sendMessageClient, fetchClientList, fetchPv, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        connecting: 'success',
        diconnected: 'danger',
        draft: 'info'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        type: undefined,
        clientId: undefined,
        agentName: undefined,
        sortString: 'id DESC'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: 'id ASC' }, { label: 'ID Descending', key: 'id DESC' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        agentName: '',
        clientId: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Input Message',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        agentName: [{ required: true, message: 'agentName is required', trigger: 'blur' }],
        clientId: [{ required: true, message: 'clientId is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchClientList(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.data.list.map(v => {
          if (v.historyType === 0) {
            v['status'] = 'connecting'
          } else {
            v['status'] = 'disconnected'
          }
          v.createTime = new Date(v.createTime).getTime()
          return v
        })
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sortString = 'id ASC'
      } else {
        this.listQuery.sortString = 'id DESC'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    sendMessage() {
      const _this = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          _this.handleMsg(_this.temp.row, 'printMsg', _this.temp)
          this.dialogFormVisible = false
        }
      })
    },
    handleUpdate(row) {
      this.temp.row = row// copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    openInputLayer() {

    },
    handleMsg(row, functionName, param) {
      var query = {
        type: 'TEXT'
      }
      if (functionName) {
        query['type'] = 'FUNCTION'
        query['functionName'] = functionName
      }
      query['clientId'] = row.clientId
      query['agentName'] = row.agentName
      query['param'] = param
      sendMessageClient(query).then(response => {
        console.log(response)
        if (response.succ) {
          this.$message({
            title: 'Success',
            message: '操作成功！',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$message({
            title: 'ERROR',
            message: '操作失败！',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', 'clientID', 'lastConnectedTime', 'agenName', 'agentAddress', 'clientIp', 'status']
        const filterVal = ['id', 'clientId', 'createTime', 'agentName', 'agentAddress', 'clientIp', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'ClientConnectList'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sortString = this.listQuery.sortString
      return sortString === `id ASC`
        ? 'ascending'
        : sortString === `id DESC`
          ? 'descending'
          : ''
    }
  }
}
</script>
