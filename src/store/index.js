import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const gas_url = "https://script.google.com/macros/s/AKfycbwTXXF8720G9hwqPgjKtZ2mgxnUT3l8F3aO91vf_l6bonZZ-KN33QPq/exec";

export default new Vuex.Store({
  state: {
    loading: true,
    err_msg: "",
    video_items: [],

    selector_options: {
      year_options: [],
      course_options: [],
      schoolyear_options: [],
      schoolclass_options: [],
      eventname_options: [],
      thema_options: [],
    }
  },
  mutations: {
    async fetchData(state){
      axios.get(gas_url,
                {crossDomain: true})
      .then(Response => {
        // ここら辺、めちゃくちゃなので後できれいにする。
        let year_options = ["All"];
        let course_options = ["All"];
        let schoolyear_options = ["All"];
        let schoolclass_options = ["All"];
        let eventname_options = ["All"];
        let thema_options = ["All"];

        let year_set = new Set();
        let course_set = new Set();
        let schoolyear_set = new Set();
        let schoolclass_set = new Set();
        let eventname_set = new Set();
        let thema_set = new Set();

        state.video_items = Response.data;

        for(let v in state.video_items){
          year_set.add(state.video_items[v]['year']);
          course_set.add(state.video_items[v]['course']);
          schoolyear_set.add(state.video_items[v]['schoolyear']);
          schoolclass_set.add(state.video_items[v]['schoolclass']);
          eventname_set.add(state.video_items[v]['eventname']);
          thema_set.add(state.video_items[v]['thema']);
        }

        state.selector_options.year_options = year_options.concat([...year_set]);
        state.selector_options.course_options = course_options.concat([...course_set]);
        state.selector_options.schoolyear_options = schoolyear_options.concat([...schoolyear_set]);
        state.selector_options.schoolclass_options = schoolclass_options.concat([...schoolclass_set]);
        state.selector_options.eventname_options = eventname_options.concat([...eventname_set]);
        state.selector_options.thema_options = thema_options.concat([...thema_set]);

        state.loading = false;
      })
      .catch(err => {console.log(err)});
    }
  },
  actions: {
    acfetchData({commit}){
      commit('fetchData');
    }
  },
  getters: {
    getloading() {
      return this.state.loading;
    }
  },
  modules: {
  }
})
