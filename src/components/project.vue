<template>
<div class="page-1">

        <el-tabs  value="first" class="half">
    <el-tab-pane label="项目概览" name="first" style="text-align:left"> 
        <h2>{{project.ProjName}}</h2>
        <h4>BUCKET:{{project.BucketName}}</h4>
        <h4>用户名:{{project.UserName}}</h4>
        <h4>创建时间:{{project.CreateTime}}</h4>
        <el-upload
            action=""
            drag
            :file-list="bim.filelist"
            :on-change="uploadbim"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传FBX文件</div>
            <el-dialog :visible.sync="showTemp2" :show-close="false" >
            正在向Forge上传模型。。。
        </el-dialog>
        </el-upload>
    </el-tab-pane>

    <el-tab-pane label="添加新扫描" name="second">
        <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview">
        <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="rcnew.dialogVisible" size="tiny">
        <img width="100%" :src="rcnew.dialogImageUrl" alt="">
        </el-dialog>
    <el-button type="primary" @click="showTemp=true">提交</el-button>
        <el-dialog :visible.sync="showTemp" :show-close="false" >
            正在向Forge上传图片。。。
        </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="进度列表" name="third" >
        <el-table @row-click="showColor" 
            :data="rcs"
            style="width: 100%">
            <el-table-column
                prop="DateTime"
                label="日期"
                width="180">
            </el-table-column>
            <el-table-column
                prop="Status"
                label="状态"
                width="80">
            </el-table-column>
            <el-table-column
                prop="Count"
                label="已完成"
                width="80">
            </el-table-column>
            </el-table>
  <el-button type="primary" @click="reset">重设视图</el-button>

    </el-tab-pane>
  
    </el-tabs>
  <div class="forge" id="forge"></div>

</div>

</template>
<script>
var viewer;
export default {
  data: function() {
    return {
      bim: {
        filelist: []
      },
      rcnew: {
        dialogImageUrl: "",
        dialogVisible: false
      },
      rcs: [],
      project: {},
      showTemp: false,
      showTemp2: false
    };
  },
  mounted: function() {
    this.refreshProj();
    viewer = new Autodesk.Viewing.Private.GuiViewer3D(
      document.querySelector("#forge"),
      {}
    );

    var options = {
      docid: "http://localhost:8081/BIMRCSVF/BIMRCtestModel1-三维视图-{三维}(1).svf",
      env: "AutodeskProduction"
    };

    Autodesk.Viewing.Initializer(options, function() {
      viewer.initialize();
      viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function(
        event
      ) {
        viewer.fitToView(true);
        setTimeout(function() {
          viewer.autocam.setHomeViewFrom(viewer.navigation.getCamera());
        }, 1000);
      });
      viewer.load(options.docid);
    });
  },
  methods: {
    uploadbim: async function() {
      this.showTemp2 = true;
    },
    handlePictureCardPreview: function(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    refreshrc: async function() {
      //   try {
      //     let result = await this.$http.get(
      //       window.apiurl + "/api/RCModel/?projId=" + this.$route.params.id
      //     );
      //     this.rcs = result.body;
      //     console.log("xxxxxxx");
      //     console.log(this);
      //   } catch (e) {
      //     console.log(e);
      this.rcs = [
        {
          Id: 1,
          DateTime: "2017-11-26T14:42:03.7762153+08:00",
          ProjectId: 0,
          Progress: 5.1,
          Status: "以完成",
          ExistId: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 19, 17, 14, 15],
          Count: 15
        },
        {
          Id: 2,
          DateTime: "2017-11-26T14:42:03.7762153+08:00",
          ProjectId: 0,
          Progress: 5.1,
          Status: "已完成",
          ExistId: [2, 3, 4, 5, 6, 7, 8, 9, 10],
          Count: 8
        }
      ];
    },
    showColor: function(row, event, column) {
      console.log(viewer);
      window.v = viewer;
      viewer.clearThemingColors();
      let i = row.ExistId;
      for (var ii in i) {
        viewer.setThemingColor([ii], new THREE.Vector4(1, 0, 0));
      }
    },
    refreshProj: async function() {
      try {
        let result = await this.$http.get(window.apiurl + "/api/project");
        this.project = result.body.filter(
          x => x.Id == this.$route.params.id
        )[0];
        this.refreshrc();
      } catch (e) {
        console.log(e);
      }
    },
    reset: function() {
      viewer.clearThemingColors();
    }
  }
};
</script>
<style>
.page-1 {
  position: fixed;
  z-index: -100;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
.half {
  width: 40%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
}
.forge {
  position: fixed;
  left: 40%;
  width: 60%;
  height: 100%;
  box-sizing: border-box;
}
</style>
