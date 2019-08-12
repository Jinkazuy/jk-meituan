const router = require("koa-router")();
var mongoose = require("mongoose");
router.get("/", async (ctx, next) => {

  mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true });
  // !!!!!注意：这里第二个参数对象，5.0以后的MongoDB是 useNewUrlParser: true
  // 5.x以前是 useMongoClient: true

  // 3333333333333333333
  // 3、拿到mongoose的表结构，用于后边设计表
  var Schema = mongoose.Schema;

  // 444444444444444444444
  // 4、设计集合（设计表结构）
  // 可以直接写成键值对，但这里写成对象的形式，可以增加约束条件
  var studentSchema = new Schema({
    name: {
      type: String,
      required: true // 必须有这个name键值对存在
    },
    gender: {
      type: Number,
      enum: [0, 1], // 限制值范围，必须是数字类型1 或者 数字类型0
      default: 0 // 默认值是数字类型0
    },
    age: {
      type: Number // 只约束值类型，不约束其他，也就是说可以不传age；
    }
  });

  var User = mongoose.model("users", studentSchema);

  var admin = new User({
    name: "zs",
    gender: "1",
    age: "18"
  });

  admin.save(function(err, ret) {
    // 如果err参数有内容，不为null的话，那么进入err分支；
    if (err) {
      console.log(err)
      console.log("保存失败");
    } else {
      // err参数为null，那么数据持久化成功；
      console.log("保存成功");
      // 输入保存的数据内容，并自动生成这条文档的"_id"键值对；
      console.log(ret);
    }
  });

  await ctx.render("index", {
    title: "Hello Koa 2!"
  });
});

router.get("/string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
  ctx.body = {
    title: "koa2 json"
  };
});

module.exports = router;
