<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- head -->
      <page-tools :show-before="true">
        <template v-slot:before>
          <span>共{{ total }}条记录</span>
        </template>
        <template v-slot:after>
          <el-button type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button type="danger" @click="exportExcel">excel导出</el-button>
          <el-button type="primary" @click="showDialog">新增员工</el-button>
        </template>
      </page-tools>
      <!-- table -->
      <el-table
        v-loading="loading"
        style="width: 100%"
        border
        :data="emplInfoLst"
      >
        <el-table-column
          type="index"
          label="序号"
          sortable
          align="center"
          width="100px"
        />
        <el-table-column
          prop="username"
          label="姓名"
          sortable
          align="center"
          width="160px"
        />
        <el-table-column
          label="头像"
          sortable
          align="center"
          width="160px"
        >
          <template slot-scope="{row}">
            <img v-imgerror="require('@/assets/common/bigUserHeader.png')" :src="row.staffPhoto" alt="" style="width:100px;height:100px;border-radius:50%;">
          </template>
        </el-table-column>
        <el-table-column
          prop="workNumber"
          label="工号"
          sortable
          align="center"
          width="160px"
        />
        <el-table-column
          prop="formOfEmployment"
          label="聘用形式"
          sortable
          :formatter="formatEmployment"
          align="center"
          width="160px"
        />
        <el-table-column
          prop="departmentName"
          label="部门"
          sortable
          align="center"
          width="160px"
        />
        <el-table-column
          prop="timeOfEntry"
          label="入职日期"
          sortable
          align="center"
          width="230"
        />
        <el-table-column
          prop="formOfEmployment"
          label="账户状态"
          sortable
          align="center"
          width="width"
        >
          <template>
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="prop"
          label="操作"
          align="center"
          width="width"
        >
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="delEpl(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <el-row type="flex" justify="center" align="middle" style="height:60px">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          @current-change="currentChange"
        />
      </el-row>
      <add-employee ref="addForm" @loadEmployeeList="loadEmployeeList" />
    </div>
    <assign-role ref="AssignRole" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import addEmployee from '@/views/employees/components/add-employee'
import EmployeeForm from '@/api/constant/employees'
import { formatDate } from '@/filters'
import AssignRole from './components/assign-role.vue'
export default {
  components: { addEmployee, AssignRole },
  data() {
    return {
      emplInfoLst: [], // employee info list
      page: 1,
      size: 10,
      total: 0,
      loading: false

    }
  },
  created() {
    this.loadEmployeeList()
  },
  methods: {
    async loadEmployeeList() { // load employees
      const res = await getEmployeeList({
        page: this.page,
        size: this.size
      })
      this.total = res.total
      this.emplInfoLst = res.rows
    },
    currentChange(page) { // change page
      this.loading = true
      this.page = page
      this.loadEmployeeList()
      this.loading = false
    },
    formatEmployment(row, column, cellValue, index) { // format employment
      // 要去找 1所对应的值
      const obj = EmployeeForm.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEpl(id) { // delete employee
      try {
        await delEmployee(id)
        this.$message.success('删除成功')
        this.loadEmployeeList()
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    showDialog() {
      this.$refs.addForm.dialogVisible = true
    },
    exportExcel() {
      //  做操作
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)

        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx'

        })
        // 获取所有的数据

        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'],
        //   data: [['张三', 12000], ['李四', 5000]],
        //   filename: '员工薪资表',
        //   autoWidth: true,
        //   bookType: 'csv'
        // })
      })
    },
    // 该方法负责将数组转化成二维数组
    formatJson(headers, rows) {
      // 首先遍历数组
      // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]]) // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') {
            var en = EmployeeForm.hireType.find(obj => obj.id === item[headers[key]])
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        }) // => ["张三", "13811"，"2018","1", "2018", "10002"]
      })
      // return data
      // return rows.map(item => {
      //   // item是对象  => 转化成只有值的数组 => 数组值的顺序依赖headers  {username: '张三'  }
      //   // Object.keys(headers)  => ["姓名", "手机号",...]
      //   return Object.keys(headers).map(key => {
      //     return item[headers[key]]
      //   }) // /  得到 ['张三'，’129‘，’dd‘,'dd']
      // })
    },
    async editRole(id) {
      this.$refs.AssignRole.loadRoleList()
      await this.$refs.AssignRole.loadUserDetail(id)
      this.$refs.AssignRole.dialogVisible = true
    }
  }
}
</script>

<style>

</style>
