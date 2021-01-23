<template>
  <v-container v-if="show_loading">
    <v-overlay>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
  <v-container v-else>
    <v-card elevation="2">
      <v-card-title
        >条件
        <v-card-actions>
          <v-btn icon @click="show_switch = !show_switch">
            <v-icon>{{
              show_switch ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn icon @click="show_kind = !show_kind">
            <v-icon>{{
              show_kind ? "mdi-format-list-bulleted" : "mdi-grid"
            }}</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card-title>

      <v-expand-transition>
        <v-container v-show="show_switch">
          <v-row align="center">
            <v-col class="d-flex" cols="12" sm="2">
              <v-select
                v-model="inputyear"
                @change="filtered"
                item-text="`${filter.year}`"
                :items="selector_options.year_options"
                label="Year"
                dense
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="2">
              <v-select
                v-model="inputcourse"
                @change="filtered"
                item-text="`${filter.course}`"
                :items="selector_options.course_options"
                label="中高"
                dense
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="2">
              <v-select
                v-model="inputschoolyear"
                @change="filtered"
                item-text="`${filter.schoolyear}`"
                :items="selector_options.schoolyear_options"
                label="学年"
                dense
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                v-model="inputschoolclass"
                @change="filtered"
                item-text="`${filter.schoolyear}`"
                :items="selector_options.schoolyear_options"
                label="クラス"
                dense
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                v-model="inputeventname"
                @change="filtered"
                item-text="`${filter.eventname}`"
                :items="selector_options.eventname_options"
                label="イベント名"
                dense
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="12">
              <v-autocomplete
                v-model="inputthema"
                @change="filtered"
                item-text="`${filter.schoolyear}`"
                :items="selector_options.thema_options"
                label="テーマ"
                dense
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </v-expand-transition>
    </v-card>

    <!-- コンテナ形式 -->
    <v-container v-if="show_items.length != 0 && show_kind">
      <v-row dense>
        <v-col
          v-for="item in show_items"
          v-bind:video="item"
          v-bind:key="item.id"
        >
          <v-card min-width="360" outlined>
            <v-card-title>
              {{ item.name }}
            </v-card-title>
            <v-card-subtitle> 投稿日: {{ item.publishedAt }} </v-card-subtitle>
            <v-card-actions>
              <v-card-text>
                {{ item.eventname }}
              </v-card-text>
              <v-btn :href="item.videoid" color="#FF0000" target="_brank" dark>
                <v-icon>mdi-youtube</v-icon></v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- リスト形式 -->
    <v-container v-else-if="show_items.length != 0 && !show_kind">
      <v-card
        v-for="item in show_items"
        v-bind:video="item"
        v-bind:key="item.id"
        outlined
      >
        <v-card-title>
          <v-card-actions>
            <v-btn
              fab
              icon
              :href="item.videoid"
              color="#FF0000"
              target="_brank"
            >
              <v-icon>mdi-youtube</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-actions>
            <v-btn :href="item.videoid" elevation="0" text target="_brank" x-large>
              {{ item.name }}
            </v-btn>
          </v-card-actions>
        </v-card-title>
      </v-card>
    </v-container>
    <!-- なんもないとき -->
    <v-container v-else>
      <v-card elevation="0">
        <v-card-title> No item </v-card-title>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import store from "../store/index";
export default {
  name: "Home",
  data() {
    return {
      // 条件の表示
      show_switch: false,
      // 動画一覧の表示形式, false: コンテナ形式(デフォルト), true: リスト形式
      show_kind: true,
      // ローディング判定
      show_loading: store.state.loading,
      // 全てのデータと実際に表示するデータを格納
      items: store.state.video_items,
      show_items: [],

      // 条件一覧の格納
      selector_options: {
        year_options: [],
        course_options: [],
        schoolyear_options: [],
        schoolclass_options: [],
        eventname_options: [],
        thema_options: [],
      },

      // 現在のフィルター条件を格納
      filter: {
        year: "All",
        course: "All",
        schoolyear: "All",
        schoolclass: "All",
        eventname: "All",
        thema: "All",
      },
    };
  },

  methods: {
    filtered: function () {
      var show_videos = [...this.items]; // 配列のコピー

      // まずフィルターで走査
      for (var key in this.filter) {
        var temp_videos = [];
        // Allならば次のフィルターに移る
        if (this.filter[key] == "All") {
          continue;
        }

        // Allじゃないフィルターなら表示用のものから合致しないものを取り出す
        for (var video in show_videos) {
          if (show_videos[video][key] == this.filter[key]) {
            temp_videos.push(show_videos[video]);
          }
        }
        show_videos = [...temp_videos];
      }
      this.show_items = show_videos;
    },
  },

  // 条件を変更したときに実行される関数
  computed: {
    inputyear: {
      get() {
        return this.filter.year;
      },
      set(val) {
        this.filter.year = val;
      },
    },
    inputcourse: {
      get() {
        return this.filter.course;
      },
      set(val) {
        this.filter.course = val;
      },
    },
    inputschoolyear: {
      get() {
        return this.filter.schoolyear;
      },
      set(val) {
        this.filter.schoolyear = val;
      },
    },
    inputschoolclass: {
      get() {
        return this.filter.schoolclass;
      },
      set(val) {
        this.filter.schoolclass = val;
      },
    },
    inputeventname: {
      get() {
        return this.filter.eventname;
      },
      set(val) {
        this.filter.eventname = val;
      },
    },
    inputthema: {
      get() {
        return this.filter.thema;
      },
      set(val) {
        this.filter.thema = val;
      },
    },
  },
  created() {
    store.watch((state) => {
      this.show_loading = state.loading;
      this.items = state.video_items;
      this.show_items = state.video_items;
      this.selector_options = state.selector_options;
    });
  },
};
</script>
