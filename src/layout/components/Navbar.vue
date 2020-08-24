<template>
  <div class="navbar" :class="showBread ? '' : 'navbar-no-bread'">
    <div class="right-menu-view">
      <!-- 侧边栏的开关按钮 -->
      <hamburger
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <p class="admin-title">小巨人后台管理系统</p>
      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatar" class="user-avatar" />
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
            <el-dropdown-item>我的</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="bottom-bread">
      <!-- 面包屑 -->
      <breadcrumb class="breadcrumb-container" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      avatar: require("@/assets/user.png"),
      showBread: true
    };
  },
  computed: {
    ...mapGetters(["sidebar"])
  },
  watch: {
    $route() {
      this.getRouter();
    }
  },
  created() {
    this.getRouter();
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push("/login");
    },
    getRouter() {
      this.$route.path === "/dashboard"
        ? (this.showBread = false)
        : (this.showBread = true);
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar-no-bread {
  height: 50px !important;
  .bottom-bread {
    display: none;
  }
}
.navbar {
  height: 100px;
  overflow: hidden;
  position: relative;
  background: #010b1f;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .right-menu-view {
    overflow: hidden;
    height: 50px;
    position: relative;
    .admin-title {
      margin: 0;
      padding: 0;
      line-height: 50px;
      color: #fff;
      text-align: center;
      letter-spacing: 10px;
    }
    .right-menu {
      position: absolute;
      top: 0;
      right: 5px;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
  .bottom-bread {
    background-color: #fff;
    overflow: hidden;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
}
</style>
