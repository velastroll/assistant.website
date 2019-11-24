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
        <b-form-input
          id="select-location"
          class="input-modal"
          v-model="postcode"
          :state="pcState"
          type="number"
          size="sm"
          placeholder="Código postal"
        ></b-form-input>
      </b-col>
    </b-row>
    <div
      v-if="goodPostcode() && existLocation() == null"
      style="color: red"
    >This postal code does not exist. Add first the town.</div>
    <div v-else-if="pcState" style="color: green; text-align: right;">Add user to {{existLocation().name}}</div>

    <template v-slot:modal-footer>
      <div class="w-100">
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
      provinces: this.$store.getters["provinces/get"],
      name: "",
      nif: "",
      postcode: null
    };
  },
  mounted() {},
  methods: {
    submit() {
      var payload = { name: this.name, nif: this.nif, postcode: this.postcode };
      this.$store.dispatch("users/add", payload).then(res => {
        if (res.status == 200) {
          //hide modal
          this.$bvModal.hide("modal-add-user")
          // reset fields
          this.name = ''
          this.nif = ''
          this.postcode = ''
          // retrieve user list
          this.$parent.updateUsers()
          this.users = this.$store.getters["users/get"]
          //ok, add the response, which is the person updated profile
          this.$parent.makeToast(
            "success",
            `Success`,
            "New person added to the system."
          );
        } else {
          this.$parent.makeToast(
            "danger",
            `Error ${res.status}`,
            res.description
          );
          // delete tokens
          this.$parent.redirect("/login");
        }
      });
    },
    existLocation() {
      return this.$parent.existLocation(this.postcode);
    },
    goodPostcode() {
      return this.postcode > 1000 && this.postcode < 52008;
    }
  },
  computed: {
    submitState() {
      return this.nameState && this.nifState && this.postcode != null;
    },
    nameState() {
      return this.name.length > 5 && this.name.includes(" ") ? true : false;
    },
    nifState() {
      return this.nif.length >= 9 ? true : false;
    },
    pcState() {
      return this.goodPostcode() && this.existLocation() != null;
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