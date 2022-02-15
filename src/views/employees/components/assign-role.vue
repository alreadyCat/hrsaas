<template>
  <el-dialog title="分配权限" :visible="dialogVisible" @close="closeDialog">
    <el-checkbox-group v-model="roleList" style="display:flex;justify-content:center;">
      <el-checkbox v-for="role in allRoleList" :key="role.id" :label="role.id">{{ role.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row>
      <el-col align="center" style="margin-top:20px;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  data() {
    return {
      allRoleList: [],
      dialogVisible: false,
      userId: '',
      roleList: []
    }
  },
  methods: {
    async save() {
      try {
        await assignRoles({
          id: this.userId,
          roleIds: this.roleList
        })
        this.$message.success('保存成功')
      } catch (error) {
        this.$message.error('保存失败')
      }
      this.closeDialog()
    },
    async loadRoleList() {
      const res = await getRoleList()
      this.allRoleList = res.rows
    },
    async loadUserDetail(id) {
      const res = await getUserDetailById(id)
      this.roleList = res.roleIds.filter(role => {
        return this.allRoleList.find(item => {
          return item.id === role
        })
      })
      this.userId = id
    },
    closeDialog() {
      this.allRoleList = []
      this.roleList = []
      this.dialogVisible = false
    }

  }
}
</script>

<style>

</style>
