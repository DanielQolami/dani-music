<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>{{ $t("upload.uploadDropbox") }}</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <div class="mb-4" v-show="onlyMp3Warning">
        <p dir="auto">{{ $t("upload.onlyMp3Warning") }}</p>
      </div>
      <div class="mb-4 text-center" v-show="offlineMsg">
        <p>You're Offline</p>
      </div>
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i>{{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from "@/includes/firebase";
import { addDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default {
  name: "Upload",
  props: ["addSong"],
  data() {
    return {
      is_dragover: false,
      onlyMp3Warning: false,
      offlineMsg: false,
      uploads: [],
    };
  },
  methods: {
    upload($event) {
      this.is_dragover = false;

      // const { files } = $event.dataTransfer; this is an Object, but next line is an Array
      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files] // for drag and drop
        : [...$event.target.files]; // for input type="file"

      files.forEach((file) => {
        if (file.type !== "audio/mpeg") {
          // only mp3 files
          this.onlyMp3Warning = true;
          return;
        }

        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            variant: "bg-red-400",
            icon: "fas fa-times",
            text_class: "text-red-400",
          });
          this.offlineMsg = true;
          return;
        }

        this.onlyMp3Warning = false;
        this.offlineMsg = false;

        // reference to storage
        const storageRef = ref(storage); // music-2be5a.appspot.com
        // reference to songs
        const songsRef = ref(storage, `songs/${file.name}`); // music-2be5a.appspot.com/songs/example.mp3
        const task = uploadBytesResumable(songsRef, file); // uploading file to songsRef

        const uploadIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: file.name,
            variant: "bg-blue-400",
            icon: "fas fa-spinner fa-spin",
            text_class: "",
          }) - 1; // push function return the length of the array

        task.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].current_progress = progress;
          },
          (error) => {
            this.uploads[uploadIndex].variant = "bg-red-400";
            this.uploads[uploadIndex].icon = "fas fa-times";
            this.uploads[uploadIndex].text_class = "text-red-400";
            // console.log(error);
            /* switch (error.code) {
              case "storage/unauthorized":
                // User doesn't have permission to access the object
                break;
              case "storage/canceled":
                // User canceled the upload
                break;
              case "storage/invalid-checksum":
                // File on the client does not match the checksum of the file received by the server. Try uploading again.
                break;
              case "storage/server-file-wrong-size":
                // File on the client does not match the size of the file recieved by the server. Try uploading again.
                break;
              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
                break;
            } */
          },
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: "",
              comment_count: 0,
            };

            song.url = await getDownloadURL(task.snapshot.ref);
            const songRef = await addDoc(songsCollection, song);
            const songSnapshot = await getDoc(songRef);

            this.addSong(songSnapshot);

            // we need to store data, then show success. so that user doesn't close the app before storing the data
            this.uploads[uploadIndex].variant = "bg-green-400";
            this.uploads[uploadIndex].icon = "fas fa-check";
            this.uploads[uploadIndex].text_class = "text-green-400";
          }
        );
      });

      // console.log(files);
    },
    cancelUploads() {
      this.uploads.forEach((upload) => {
        upload.task.cancel();
      });
    },
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  },
};
</script>
