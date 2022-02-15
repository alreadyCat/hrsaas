<template>
  <el-dialog :title="title" :visible="dialogVisible" @close="handleclose">
    <el-form ref="elForm" :model="form" :rules="rules">
      <el-form-item label="部门名称" label-width="100px" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="部门编码" label-width="100px" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="部门负责人" label-width="100px" prop="manager">
        <el-select
          v-model="form.manager"
          placeholder="请选择"
          @focus="loadManager"
        >
          <el-option
            v-for="manager in managers"
            :key="manager.id"
            :label="manager.username"
            :value="manager.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" label-width="100px" prop="introduce">
        <el-input v-model="form.introduce" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleclose">取 消</el-button>
      <el-button type="primary" @click.prevent="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments
} from '@/api/departments'
import { getDepartmentManager } from '@/api/employees'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    deptInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    const checkName = async(rule, value, callback) => { // check Department name
      const { depts } = await getDepartments()
      let isRepeat = Boolean
      if (this.form.id) { // edit department validate
        isRepeat = depts.some(item => item.pid === this.deptInfo.pid && item.name === value && item.id !== this.deptInfo.id)
      } else { // add department validate
        if (this.deptInfo.id === undefined) { // click root
          isRepeat = depts.some(
            (item) => item.pid === '' && item.name === value
          )
        } else { // click another
          isRepeat = depts.some(
            (item) => item.pid === this.deptInfo.id && item.name === value
          )
        }
      }
      if (isRepeat) {
        callback(new Error('该部门已存在'))
      } else {
        callback()
      }
    }
    const checkCode = async(rule, value, callback) => { // check department code
      const { depts } = await getDepartments()
      let isRepeat = Boolean
      if (this.form.id) { // edit department validate
        isRepeat = depts.some(item => item.pid === this.deptInfo.pid && item.code === value && item.id !== this.deptInfo.id)
      } else { // add department validate
        if (this.deptInfo.id === undefined) { // click root
          isRepeat = depts.some((item) => item.pid === '' && item.code === value)
        } else { // click another
          isRepeat = depts.some((item) => item.pid === this.deptInfo.id && item.code === value)
        }
      }
      if (isRepeat) {
        callback(new Error('该部门代码已存在'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在1到50个字符', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在1到50个字符', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' }
        ],
        manager: [{ required: true, message: '必选', trigger: 'blur' }],
        introduce: [
          { max: 300, message: '长度不能超过300', trigger: 'change' }
        ]
      },
      managers: []
    }
  },
  computed: {
    title() {
      return this.form.id ? '修改部门信息' : '添加部门'
    }
  },

  methods: {
    submit() {
      // submit form
      this.$refs.elForm.validate(async(valid) => {
        if (valid) {
          try {
            if (this.form.id) {
              // 修改
              await updateDepartments(this.form)
              this.$message.success('修改成功')
            } else {
              // 添加
              await addDepartments({ ...this.form, pid: this.deptInfo.id })
              this.$message.success('添加成功')
            }

            this.$store.dispatch('departments/loadDepartments')
            this.$emit('update:dialogVisible', false)
          } catch (error) {
            this.$message.error(error.message)
          }
        } else {
          this.$message.error('错误提交')
          return false
        }
      })
    },
    async loadManager() {
      // load department managers
      const res = await getDepartmentManager()
      this.managers = res
    },
    handleclose() {
      this.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
      }
      this.$refs.elForm.resetFields()
      this.$emit('update:dialogVisible', false)
    },
    async showFormData(id) {
      // form data echo
      const res = await getDepartDetail(id)
      this.form = res
    }
  }
}
</script>

<style>
</style>
