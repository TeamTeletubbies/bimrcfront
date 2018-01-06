<template>
  <div id="app">
    <div class="topbar">
      <div class="title">
        BIM<span class="bold">RC</span>
      </div>
      <el-menu
        default-active="/"
        mode="horizontal"
        background-color="#545c64"
        text-color="#ddd"
        active-text-color="#409eff"
        router
        >
        <el-menu-item index="/">主页</el-menu-item>
        <el-submenu index="/project">
          <template slot="title">项目详情</template>
          <el-menu-item index="2-1">项目1</el-menu-item>
          <el-menu-item index="2-2">项目2</el-menu-item>
          <el-menu-item index="2-3">项目3</el-menu-item>
        </el-submenu>
        <el-menu-item index="/about">关于我们</el-menu-item>
      </el-menu>
      <div class="space"></div>
      <div class="user" v-if="login">
        <img class="icon" :src="user.profileImages?user.profileImages.sizeX58:''">
        <div class="name">{{user.firstName}} {{user.lastName}}</div>
      </div>
    </div>
    <div class="login" v-if="!login">
      <h1 class="welcome"><span>欢迎使用</span><span class="bim">BIM</span><span class="rc">RC</span></h1>
      <p class="intro">您可以上传项目的BIM模型<br/>通过现实捕捉技术记录每天的施工进展<br/>并在网页上的3D模型中展现</p>
      <a href="https://developer.api.autodesk.com/authentication/v1/authorize?response_type=token&client_id=m5O6diephXghGRCXYd8yQr5zRAAMmyZ7&redirect_uri=http%3a%2f%2flocalhost:8080&scope=data:read%20bucket:create">
        <el-button class="largebutton" type="primary">使用Autodesk账号登陆并开始使用</el-button></a>
    </div>
    <router-view v-if="login" />
  </div>
</template>

<script>
export default {
  name: "app",
  data: function() {
    return {
      login: false,
      user: {}
    };
  },
  created: async function() {
    let params = {},
      queryString = location.hash.substring(2),
      regex = /([^&=]+)=([^&]*)/g,
      m;
    while ((m = regex.exec(queryString))) {
      params[m[1]] = m[2];
    }
    window.token = params["access_token"];
    window.http = this.$http;
    try {
      let result = await this.$http.get(
        window.forgeurl + "/userprofile/v1/users/@me"
      );
      this.user = result.body;
      window.user=this.user;
      result = await this.$http.post(
        window.forgeurl + "/authentication/v1/authenticate",
        {
          client_id: "m5O6diephXghGRCXYd8yQr5zRAAMmyZ7",
          client_secret: "WmRaRGGcujisV8VU",
          grant_type: "client_credentials",
          scope: "bucket:create viewables:read data:read data:write"
        },{emulateJSON:true}
      );
      window.token = result.body.access_token;
      this.login = true;
      this.$router.push("/");
      console.log(this.user);
    } catch (e) {
      console.log(e);
    }

    // window.token='eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJjbGllbnRfaWQiOiJtNU82ZGllcGhYZ2hHUkNYWWQ4eVFyNXpSQUFNbXlaNyIsImV4cCI6MTUxMTY3ODY3Niwic2NvcGUiOlsiYnVja2V0OmNyZWF0ZSIsInZpZXdhYmxlczpyZWFkIiwiZGF0YTpyZWFkIiwiZGF0YTp3cml0ZSJdLCJhdWQiOiJodHRwczovL2F1dG9kZXNrLmNvbS9hdWQvand0ZXhwNjAiLCJqdGkiOiJQcDlIU2p6T1V6cmpJbWhESXEzam5tOFd2NXNyUVo4aEtQUHVzQVN0TXJPaHdYNGV3OXluTjhkNFRhYnU4ckpQIn0.B0lRsz_Imja4sla-f5szpSzQSQh_qYTxhp_RD0YqgUk'
  }
};
</script>

<style>
body {
  margin: 0px;
  padding: 0px;
  padding-top: 60px;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.topbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  background-color: #545c64;
  color: #ddd;
  padding: 0px 20px;
  position: fixed;
  width: 100%;
  top: 0px;
  box-sizing: border-box;
}

.topbar .title {
  font-size: 30px;
  margin: 10px;
  font-weight: 200;
}

.topbar .title .bold {
  font-weight: 700;
  color: #409eff;
}

.space {
  flex-grow: 1;
}

.user {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.user .icon {
  width: 40px;
  height: 40px;
  border-radius: 26px;
  border: 2px solid #ddd;
  margin-right: 15px;
}

.user .name {
}

.bim {
  margin-left: 10px;
  font-weight: 200;
  font-size: 1.5em;
  color: #2c3e50;
}

.rc {
  font-weight: 700px;
  color: #409eff;
  font-size: 1.5em;
}

.welcome {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #777;
  margin-top: 100px;
}

.intro {
  font-size: 20px;
  line-height: 1.7;
  margin: 70px;
}

.largebutton {
  font-size: 24px;
}
</style>
