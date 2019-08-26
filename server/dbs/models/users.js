// 加载mongoose第三方包
import mongoose from 'mongoose'

// 拿到mongoose的结构，用于后边设计表
const Schema = mongoose.Schema

// 设计文档结构（设计表结构）
// 字段名称就是表结构中的属性名称(列名)
const UserSchema = new Schema({
  username: {
    // 类型
    type: String,
    // 唯一不重复
    unique: true,
    // 必须有
    require: true
  },
  password: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  }
})

// 导出结构
export default mongoose.model('User', UserSchema)
