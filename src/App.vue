<template>
  <v-card
    tile
    class="overflow-hidden">
  <v-app>
    <v-app-bar
      app
      absolute
      color="#044B89"
      dark
      shrink-on-scroll
      prominent
    >
    <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

    <v-app-bar-title>西大和学園SS発表会アーカイブ</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>検索ホーム</v-list-item-title>
          </v-list-item>

          <v-list-item to="/about">
            <v-list-item-icon>
              <v-icon>mdi-help</v-icon>
            </v-list-item-icon>
            <v-list-item-title>ヘルプ</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <!-- メイン -->
    <v-main>
      <v-container>
      <router-view></router-view>
      </v-container>
    </v-main>
    <div>
      {{err_msg}}
    </div>
</v-app>
</v-card>
</template>

<script>
import store from './store/index'

export default {
  name: 'App',

  data: () => ({
    drawer: false,
    group: null,
    err_msg: store.state.err_msg,
  }),

  methods: {
    async GetData(){
      await store.dispatch('acfetchData');
    }
  },

  created(){
    this.GetData();
  }

};
</script>
