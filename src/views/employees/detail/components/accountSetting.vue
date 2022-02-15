<template>
  <el-form ref="form" :model="formData" label-width="80px" style="margin-left:120px;margin-top:30px;" :rules="rules">
    <el-form-item label="用户名" style="width:440px;" prop="username">
      <el-input v-model="formData.username" />
    </el-form-item>
    <el-form-item label="密码" style="width:440px;" prop="password">
      <el-input v-model="formData.password2" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
export default {
  data() {
    return {
      formData: {
        username: '',
        password2: '',
        id: this.$route.params.id || undefined
      },
      rules: {
        username: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.formData.id && this.loadUserInfo()
  },
  methods: {
    async loadUserInfo() {
      const res = await getUserDetailById(this.formData.id)
      this.formData = res
    },
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            await saveUserDetailById({ ...this.formData, password: this.formData.password2 })
            this.$message.success('保存成功')
          } catch (error) {
            this.$message.error('修改失败')
          }
        } else {
          this.$message.error('信息填写有误')
        }
      })
    }
  }
}
</script>

<style>

</style>
