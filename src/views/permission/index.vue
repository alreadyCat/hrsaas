<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPer('0')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border :data="permissionList" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button v-if="row.type===1" type="text" @click="addPer(row.id)">添加</el-button>
            <el-button type="text" @click="editPer(row.id)">编辑</el-button>
            <el-button type="text" @click="delPer(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-dialog
        title="新增"
        :visible="dialogVisible"
        @close="closeDialog"
      >
        <el-form ref="form" :model="formData" label-width="80px" :rules="rules">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch v-model="formData.enVisible" inactive-value="0" active-value="1" />
          </el-form-item>
          <el-form-item align="center">
            <el-button size="small" type="primary" @click="save">确定</el-button>
            <el-button size="small" @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, getPermissionDetail, delPermission, updatePermission, addPermission } from '@/api/permission'
import { tranListToTreeData } from '@/utils/tranListToTreeData'
export default {
  data() {
    return {
      title: '',
      permissionList: [
      ],
      formData: {
        name: '',
        description: '',
        code: '',
        enVisible: '0',
        type: '',
        pid: ''
      },
      dialogVisible: false,
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadPermissionList()
  },
  methods: {
    async loadPermissionList() {
      const res = await getPermissionList()
      this.permissionList = tranListToTreeData(res, '0')
    },
    addPer(id) {
      this.title = '新增权限'
      this.formData.pid = id
      this.dialogVisible = true
    },
    async editPer(id) {
      this.title = '编辑权限'
      const res = await getPermissionDetail(id)
      this.formData = res
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.formData = {}
    },
    async delPer(id) {
      try {
        await this.$confirm('确认删除?')
        try {
          await delPermission(id)
          this.$message.success('删除成功')
        } catch (error) {
          this.$message.error('删除失败')
        }
      } catch (error) {
        return
      }
      this.loadPermissionList()
    },
    async save() {
      if (this.title === '新增权限') {
        this.formData.type = this.formData.pid === '0' ? '1' : '0'
        try {
          await addPermission(this.formData)
          this.$message.success('保存成功')
        } catch (error) {
          this.$message.success('保存失败')
        }
      } else {
        try {
          await updatePermission(this.formData)
          this.$message.success('保存成功')
        } catch (error) {
          this.$message.success('保存失败')
        }
      }
      this.loadPermissionList()
      this.closeDialog()
    }
  }
}
</script>

<style>

</style>
