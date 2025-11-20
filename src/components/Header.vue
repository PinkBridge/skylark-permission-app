<template>
  <div class="header-container">
    <div class="system-title">
      <div>
        <span>{{ systemTitle }}</span>
      </div>
    </div>
    <div class="header-blank"></div>
    <div class="header-tools">
      <div class="header-tools-item">
        <LanguageComponent />
      </div>  
      <div class="user-avatar header-tools-item">
        <UserAvatarComponent />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import UserAvatarComponent from './UserAvatar.vue'
import LanguageComponent from './LanguageSelect.vue'

export default {
  name: 'HeaderComponent',
  components: {
    UserAvatarComponent,
    LanguageComponent,
  },
  setup() {
    const systemTitle = ref(process.env.VUE_APP_SYSTEM_TITLE
     || 'Skylar Permission App')
    return {
      systemTitle
    }
  }
}
</script>

<style scoped>
:global(:root) {
  --system-title-width: 240px;
  --header-tools-width: 480px;
  --header-blank-width: calc(100vw - var(--system-title-width) - var(--header-tools-width));
}

.header-container {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.system-title {
  height: 100%;
  width: var(--system-title-width);
  line-height: var(--header-height);
  font-size: 20px;
  font-weight: bold;
  font-family: 'Arial', sans-serif;
  text-align: center;
  background-color: #001529;
  color: #fff;
}

.header-blank {
  width: var(--header-blank-width);
}

.header-tools {
  width: var(--header-tools-width);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding-right: 40px;
}

.header-tools-item {
  margin-left: 20px;
}
</style>