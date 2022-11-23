import { Howl } from 'howler'; // so we can play/pause audio
import helper from '@/includes/helper';

export default {
  state: {
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
  },
  getters: {
    playing: (state) => {
      // using this to check if music is playing, So we change the play/pause icon
      if (state.sound.playing) {
        // check if it exists
        return state.sound.playing();
      }

      // it's safe to assume no audio is playing
      return false;
    },
  },
  mutations: {
    newSong(state, payload) {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      }); // we store instance of Howl object so we can interact with audio, anywhere in the app
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
    },
  },
  actions: {
    async newSong({ commit, state, dispatch }, payload) {
      if (state.currentSong === payload) {
        dispatch('toggleAudio');
      } else {
        if (state.sound instanceof Howl) {
          state.sound.unload();
        }

        commit('newSong', payload);

        state.sound.play();

        state.sound.on('play', () => {
          requestAnimationFrame(() => {
            dispatch('progress');
          });
        });
      }
    },
    async toggleAudio({ state }) {
      if (!state.sound.playing) {
        // check if it's a Howl object or a plain object
        return;
      }

      if (state.sound.playing()) {
        // check if music is playing
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    progress({ commit, state, dispatch }) {
      commit('updatePosition');

      if (state.sound.playing()) {
        // checking if the song is playing, so we can monitor the SEEK
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) {
        return;
      }

      // payload is the EVENT object that is returned by @click listener
      const { x, width } = payload.currentTarget.getBoundingClientRect();
      /* we are getting only two properties from getBoundingClientRect
      x: the distance from the left side of document to the left side of the player.
      width: width of the player. */
      // Document=2000px, Timeline=1000, Click=1000, Distance of timeline from left of document=500
      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);

      state.sound.once('seek', () => {
        dispatch('progress');
      });
    },
  },
};
