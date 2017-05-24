import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    isLoading: false,
    stones: null,
    currentStoneId: null
}

const getters = {
    stonesOrderedByAge: state => {
        return null // TODO: Implement this function
    }
}

const mutations = {
    LOADING_STARTED (state) {
        state.isLoading = true
    },
    LOADING_ENDED (state) {
        state.isLoading = false
    },
    SET_CURRENT_STONE_ID (state, id) {
        state.currentStoneId = id
    }
}

const actions = {
    selectStone ({ commit }, id) {
        commit('SET_CURRENT_STONE_ID', id)
    }
}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
