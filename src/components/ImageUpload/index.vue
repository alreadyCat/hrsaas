<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlepreview"
      :on-remove="handleRemove"
      :on-change="onChange"
      :before-upload="beforeAvatarUpload"
      :http-request="upload"
      :limit="1"
      :file-list="fileList"
      :class="{'disabled':exsitImage}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showProgress" :percentage="percentage" style="width:180px;" />
    <el-dialog :visible.sync="dialogVisible" title="图片预览" class="dialog">
      <img ref="img" :src="src" alt="" style="width:100%">
    </el-dialog>

  </div>

</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDMXS7VcS1KL6ZlgKgmb9PO7Y7PRCgtpVu',
  SecretKey: '8zauwhCSRActtc4KJ1SbT4ORDhuqWv3u'
})
export default {
  data() {
    return {
      fileList: [
      ],
      dialogVisible: false,
      src: '',
      fileUid: '',
      percentage: 0,
      showProgress: false
    }
  },
  computed: {
    exsitImage() {
      return this.fileList.length === 1
    }

  },
  methods: {
    handlepreview(file) {
      this.dialogVisible = true
      this.src = file.url
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    onChange(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeAvatarUpload(file) {
      //   const isJPG = file.type === 'image/jpeg'
      //   const isLt2M = file.size / 1024 / 1024 < 2

      //   if (!isJPG) {
      //     this.$message.error('上传头像图片只能是 JPG 格式!')
      //   }
      //   if (!isLt2M) {
      //     this.$message.error('上传头像图片大小不能超过 2MB!')
      //   }
      //   return isJPG && isLt2M
      const CorrectType = ['image/jpeg', 'image/gif', 'image/png', 'image/bmp']
      const isCorrectType = CorrectType.some(item => item === file.type)
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isCorrectType) {
        this.$message.error('上传头像只能是 png | jpeg | gif | bmp 格式')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB')
      }
      this.fileUid = file.uid
      return isCorrectType && isLt2M
    },
    upload(params) {
      this.showProgress = true
      if (params.file) {
        cos.putObject({
          Bucket: 'hrsaas-1259672777',
          Region: 'ap-nanjing',
          Key: params.file.name,
          Body: params.file,
          StorageClass: 'STANDARD',
          onProgress: params => {
            this.percentage = params.percent * 100
          }
        }, (err, data) => {
          this.$message(err || null)
          if (!err && data.statusCode === 200) {
            this.$message.success('上传成功')
            this.percentage = 0
            this.showProgress = false
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.fileUid) {
                return { url: 'http://' + data.Location, loadStatus: true }
              }
              return item
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped lang='scss'>
 ::v-deep.disabled .el-upload--picture-card{
    display: none;
}
 ::v-deep.dialog .el-dialog__header{
     padding: 0 20px;
}
</style>
