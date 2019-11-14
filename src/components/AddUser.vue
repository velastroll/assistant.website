<template>
  <b-modal :id="`modal-add-user`" :title="`Add new user`">
    <!-- name -->
    <b-row>
      <b-col cols="2" class="row-icon">
        <i class="material-icons">face</i>
      </b-col>
      <b-col>
        <b-form-input
          id="input-live-name"
          v-model="name"
          class="input-modal"
          :state="nameState"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Nombre y apellidos"
          trim
        ></b-form-input>
      </b-col>
    </b-row>
    <!-- nif -->
    <b-row>
      <b-col cols="2" class="row-icon">
        <i class="material-icons">fingerprint</i>
      </b-col>
      <b-col>
        <b-form-input
          id="input-live-nif"
          class="input-modal"
          v-model="nif"
          :state="nifState"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Documento acreditativo"
          trim
        ></b-form-input>
      </b-col>
    </b-row>
    <!-- town -->
    <b-row>
      <b-col cols="2" class="row-icon">
        <i class="material-icons">home_work</i>
      </b-col>
      <b-col>
        <b-form-select
          id="select-location"
          class="input-modal"
          v-model="town"
          :options="town_options"
          size="sm"
        ></b-form-select>
      </b-col>
    </b-row>

    <template v-slot:modal-footer>
      <div class="w-100">
        <p class="float-left">Modal Footer Content</p>
        <b-button
          :disabled="!submitState"
          variant="primary"
          size="sm"
          class="float-right"
          @click="submit()"
        >ADD USER</b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
// @ is an alias to /src
// import Struct from '@/components/Struct.vue'
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "AddUser",
  components: {},

  data: function() {
    return {
      users: this.$store.getters["users/get"],
      name: "",
      nif: "",
      town: null,
      town_options: [
        { value: null, text: "Please select an option", disabled: true },
        { value: "a", text: "This is First option" },
        { value: "b", text: "Selected Option" },
        { value: "c", text: "This is an option with object value" }
      ]
    };
  },
  mounted() {
    if (this.$store.getters["auth/access_token"] == null) {
      //this.$parent.redirect("/login");
    }
  },
  methods: {
    submit() {
      console.log(`${this.name} - ${this.nif} - ${this.selected}`);
      var payload = { name: this.name, nif: this.nif, town: this.town };
      this.$store.dispatch("users/add", payload).then(res => {
          if (status == 200){
              //ok, add the response, which is the person updated profile
              this.$parent.makeToast("success",`Success`, "New person added to the system.");
          }
          else if (status == 400){
            this.$parent.makeToast("danger",`Error ${res.status}`,res.description);
          }
          else {
            this.$parent.makeToast("danger",`Error ${res.status}`,res.description);
            // delete tokens
            this.$store.commit("auth/clearTokens");
            this.$store.commit("users/clear");
            this.$parent.redirect("/login");
          }

      });
    }
  },
  computed: {
    submitState() {
      return this.nameState && this.nifState && this.town != null;
    },
    nameState() {
      return this.name.length > 5 && this.name.includes(" ") ? true : false;
    },
    nifState() {
      return this.nif.length >= 9 ? true : false;
    },
    ...mapGetters(["users/get"]),
    ...mapActions(["users/retrieve"]),
    ...mapMutations([
      "auth/updateAccessToken",
      "auth/updateRefreshToken",
      "auth/clearTokens",
      "users/clear"
    ])
  }
};
</script>


<style scoped>
.row-icon {
  text-align: right;
  max-height: 20px;
}
.input-modal {
  margin-bottom: 10px;
  height: 30px;
  border-radius: 10px;
  font-size: 1rem;
}
</style>