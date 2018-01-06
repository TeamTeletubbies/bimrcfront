<template>
<div class="page">
  <div class="titlebar">
    <div class="title">
        项目列表
    </div>
    <div>共12个项目</div>
    <div class="space"></div>
    <el-button type="primary" @click="showCreate=true">添加项目</el-button>
  </div>
  <div class="projectlist">
      <div v-for="item in data" :key="item.Id" class="projectitem" @click="$router.push('/project/'+item.Id)">
          <img class="thumb"></img>
          <div class="name">{{item.ProjName}}</div>
          <div class="timeuser">
            <div class="time">{{item.CreateTime}}</div>
            <div class="user">{{item.UserName}}</div>
          </div>
      </div>
  </div>
  <el-dialog
    title="创建项目"
    :visible.sync="showCreate"
    width="50%">
    <el-form ref="form"  label-width="100px">
        <el-form-item label="项目名称">
            <el-input v-model="createData.ProjName"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="showCreate = false">取 消</el-button>
        <el-button type="primary" @click="doCreate">确 定</el-button>
    </span>
    </el-dialog>
</div>
</template>
<script>
function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  var uuid = s.join("");
  return uuid;
}

export default {
  data: function() {
    return {
      showCreate: false,
      createData: {},
      data: []
    };
  },
  created: async function() {
    this.refresh();
  },
  methods: {
    doCreate: async function() {
      this.createData.bucketName = await this.createBucket();
      if (this.createData.bucketName == "") {
        return;
      }
      this.createData.UserName = window.user.firstName + " " + window.user.lastName;
      this.createData.UserId = window.user.userId;
      try {
        let result = await this.$http.post(
          window.apiurl + "/api/Project",
          this.createData
        );
        this.showCreate = false;

        this.refresh();
      } catch (e) {
        console.log(e);
      }
    },
    createBucket: async function() {
      let bucketKey = uuid();
      try {
        let result = await this.$http.post(
          window.forgeurl + "/oss/v2/buckets",
          {
            bucketKey: bucketKey,
            authId: 1,
            access: "full",
            policyKey: "persistent"
          }
        );
        return result.body.bucketKey;
      } catch (e) {
        console.log(e);
        return "";
      }
    },
    refresh: async function() {
      try {
        let result = await this.$http.get(window.apiurl + "/api/Project");
        this.data = result.body;
        this.data.forEach(x=>x.CreateTime=x.CreateTime.substring(0,10))
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>
<style scoped>
.titlebar {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  background-color: #eee;
  padding: 0px 15px;
  position: fixed;
  top: 60px;
  width: 100%;
  box-sizing: border-box;
}

.titlebar .title {
  font-size: 20px;
  font-weight: 700;
  margin: 0px 10px;
}

.page {
  padding-top: 60px;
}

.projectlist {
    width: 100%;
    margin:20px 50px;
}

.projectitem {
  height: 200px;
  width: 200px;
  background-color: #EEE;
  margin:10px;
  float: left;
}

.projectitem .thumb{
    height: 150px;
    width: 200px;
}

.projectitem .name{
    width: 100%;
    color: #409eff;
    font-size: 20px;
    text-align: left;
    margin:0px 10px;
}

.projectitem .timeuser{
    font-size: 14px;
    margin:0px 10px;

}

.projectitem .time{
    float: left;
}

.projectitem .user{
    float: right;
}
</style>

