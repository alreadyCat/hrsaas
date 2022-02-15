<template>
  <el-dialog
    title="分配权限"
    :visible="dialogVisible"
    @close="closeDialog"
  >
    <el-tree
      ref="elTree"
      :data="perList"
      :props="defaultProps"
      show-checkbox
      :check-strictly="true"
      node-key="id"
      :default-checked-keys="defaultCheckedList"
      default-expand-all
    />
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="save">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils/tranListToTreeData'
import { getRoleDetail, assignPerm } from '@/api/setting'
export default {
  data() {
    return {
      dialogVisible: false,
      perList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultCheckedList: [],
      id: ''
    }
  },
  methods: {
    async loadPerTree() {
      const res = await getPermissionList()
      this.perList = tranListToTreeData(res, '0')
    },
    closeDialog() {
      this.perList = []
      this.dialogVisible = false
    },
    async loadRolePer(id) {
      this.id = id
      const res = await getRoleDetail(id)
      this.defaultCheckedList = res.permIds
    },
    async save() {
      const perList = this.$refs.elTree.getCheckedKeys()
      try {
        await assignPerm({
          id: this.id,
          permIds: perList
        })
        this.$message.success('保存成功')
        this.closeDialog()
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>

<style>

</style>
