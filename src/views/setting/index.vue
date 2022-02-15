<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="roleM">
            <el-row>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addRole">新增角色</el-button>
            </el-row>
            <el-table
              :data="roleList"
            >
              <el-table-column
                header-align="center"
                align="center"
                label="序号"
                type="index"
              />
              <el-table-column
                header-align="center"
                align="center"
                label="角色"
                prop="name"
              />
              <el-table-column
                header-align="center"
                align="center"
                label="描述"
                prop="description"
              />
              <el-table-column
                header-align="center"
                align="center"
                label="操作"
              >
                <template slot-scope="{row}">
                  <el-button type="success" size="mini" @click="assignPermission(row.id)">分配权限</el-button>
                  <el-button type="primary" size="mini" @click="editRole(row.id)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="delRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center" style="height:60px" align="middle">
              <el-pagination
                layout="prev, pager, next"
                :total="total"
                :page-size="3"
                @current-change="currentChange"
              />
            </el-row>
            <assign-per ref="assignPer" />
            <el-dialog
              :title="roleInfo.id?'编辑角色':'新增角色'"
              :visible="dialogVisible"
              width="width"
              @close="closeDialog"
            >
              <el-form ref="elForm" label-width="80px" :rules="rules" :model="roleInfo">
                <el-form-item label="角色姓名" prop="name">
                  <el-input v-model="roleInfo.name" />
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                  <el-input v-model="roleInfo.description" />
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
              </div>
            </el-dialog>

          </el-tab-pane>

          <el-tab-pane label="公司信息" name="comInfo">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
            />
            <el-form label-width="80px" style="padding-top:30px;">
              <el-form-item label="公司名称">
                <el-input v-model="companyInfo.name" style="width:400px;" disabled />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyInfo.companyAddress" style="width:400px;" disabled />
              </el-form-item>
              <el-form-item label="公司邮箱">
                <el-input v-model="companyInfo.mailbox" style="width:400px;" disabled />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyInfo.remarks" style="width:400px;" type="textarea" :rows="3" disabled />
              </el-form-item>

            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import assignPer from './components/assign-per.vue'
export default {
  components: { assignPer },
  data() {
    return {
      roleList: [],
      page: 1,
      pagesize: 10,
      total: 0,
      companyInfo: {},
      dialogVisible: false,
      roleInfo: {},
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        description: [
          { min: 1, max: 300, message: '长度不能超过300', trigger: 'change' }
        ]
      },
      activeName: 'roleM'
    }
  },
  async created() {
    this.loadRoleList()
    this.loadCompanyInfo()
  },
  methods: {
    async loadRoleList() { // load roles
      const res = await getRoleList({
        page: this.page,
        pagesize: this.pagesize
      })
      this.roleList = res.rows
      this.total = res.total
    },
    currentChange(page) { // change page
      this.page = page
      this.loadRoleList()
    },
    async loadCompanyInfo() { // load company info
      const res = await getCompanyInfo(this.$store.getters.userInfo.companyId)
      this.companyInfo = res
    },
    async delRole(id) { // del role
      try {
        await this.$confirm('确认删除该角色吗')
        // 只有点击了确定 才能进入到下方
        await deleteRole(id) // 调用删除接口
        this.loadRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log('')
      }
    },
    async editRole(id) { // edit role
      try {
        const res = await getRoleDetail(id)
        this.roleInfo = res
      } catch (error) {
        this.$message.error('获取角色失败')
      }

      this.dialogVisible = true
    },
    closeDialog() { // close dialog
      this.dialogVisible = false
      this.$refs.elForm.resetFields()
    },
    submit() { // submit edit role
      this.$refs.elForm.validate(async(valid) => {
        if (valid) {
          if (this.roleInfo.id) { // edit role
            try {
              await updateRole(this.roleInfo)
              this.$message.success('编辑成功')
            } catch (error) {
              this.$message.error('编辑失败')
            }
          } else { // add role
            try {
              await addRole(this.roleInfo)
              this.$message.success('添加成功')
            } catch (error) {
              this.$message.error('添加失败')
            }
          }
          this.loadRoleList()
          this.dialogVisible = false
        } else {
          this.$message.error('信息填写有误')
        }
      })
    },
    addRole() { // add role
      this.dialogVisible = true
    },
    assignPermission(id) { // assign permission
      this.$refs.assignPer.loadPerTree()
      this.$refs.assignPer.loadRolePer(id)
      this.$refs.assignPer.dialogVisible = true
    }
  }
}
</script>

<style>

</style>
