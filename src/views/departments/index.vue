<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="card">
        <!-- 一行 -->
        <tree-tools :tree-node="company" :is-root="true" @addDept="addDept" />
        <!-- 树 -->
        <el-tree
          :data="departments"
          :props="defaultProps"
          default-expand-all
          @node-click="handleNodeClick"
        >
          <TreeTools slot-scope="{data}" :tree-node="data" @addDept="addDept" @editDept="editDept" />
        </el-tree>

      </el-card>

      <add-dept ref="addDept" :dialog-visible.sync="dialogVisible" :dept-info="deptInfo" />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { mapActions } from 'vuex'
import AddDept from './components/add-dept.vue'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogVisible: false,
      deptInfo: {}
    }
  },
  computed: {
    departments() { // departments info
      return this.$store.state.departments.departments
    },
    companyInfo() { // company info
      return this.$store.state.departments.companyInfo
    }
  },
  async created() { // get departments
    try {
      await this['departments/loadDepartments']()
    } catch (error) {
      console.log('获取部门失败')
    }
  },
  methods: {
    ...mapActions(['departments/loadDepartments']),
    handleNodeClick(data) {
    },
    addDept(deptInfo) { // show dialog
      this.deptInfo = deptInfo
      this.dialogVisible = true
    },
    editDept(deptInfo) { // edit department, show form data
      this.deptInfo = deptInfo
      this.dialogVisible = true
      console.log(deptInfo)
      this.$refs.addDept.showFormData(deptInfo.id)
    }
  }
}
</script>

<style scoped>
.card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
