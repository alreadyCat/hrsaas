<template>
  <el-row
    type="flex"
    justify="space-between"
    style="width: 100%"
    align="middle"
  >
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>

    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>
          <span>{{ treeNode.manager }}</span>
        </el-col>

        <el-col>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除子部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartment } from '@/api/departments'
export default {
  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {
    handleCommand(option) {
      if (option === 'add') {
        this.$emit('addDept', this.treeNode)
      } else if (option === 'edit') {
        this.$emit('editDept', this.treeNode)
      } else {
        this.$confirm('确认删除此部门？').then(() => {
          return delDepartment(this.treeNode.id)
        }).then(() => {
          this.$store.dispatch('departments/loadDepartments')
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }
    }

  }
}
</script>

<style>
</style>
