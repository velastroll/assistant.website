<template>
  <b-modal :id="`modal-add-town`" :title="`Add a new location`">
    <!-- name -->
    <b-row>
      <b-col cols="2" class="row-icon">
        <i class="material-icons">home_work</i>
      </b-col>
      <b-col>
        <b-form-input
          id="input-live-name"
          v-model="name"
          class="input-modal"
          :state="nameState"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Location name"
          trim
        ></b-form-input>
      </b-col>
    </b-row>
    <!-- postalcode -->
    <b-row>
      <b-col cols="2" class="row-icon">
        <i class="material-icons">how_to_vote</i>
      </b-col>
      <b-col>
        <b-form-input
          id="input-live-pc"
          class="input-modal"
          v-model="postcode"
          :state="pcState"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Postal code"
          :type="'number'"
        ></b-form-input>
      </b-col>
    </b-row>

    <template v-slot:modal-footer>
      <div class="w-100">
        <p class="float-left" v-if="pcState">
          Add to
          <strong>{{getProvince()}}</strong>
        </p>
        <p class="float-left" style="color: red;" v-else-if="pcInUse()">Post code is already in use</p>
        <b-button
          :disabled="!submitState"
          variant="primary"
          size="sm"
          class="float-right"
          @click="submit()"
        >ADD TOWN</b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
// @ is an alias to /src
// import Struct from '@/components/Struct.vue'
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "AddTown",
  components: {},

  data: function() {
    return {
      name: "",
      postcode: null
    };
  },
  mounted() {},

  methods: {
    submit() {
      var payload = { name: this.name, postcode: this.postcode };
      this.$store.dispatch("provinces/add", payload).then(res => {
        if (res.status == 200) {
          // hide modal
          this.$bvModal.hide("modal-add-town")
          // reset fields
          this.name = ""
          this.postcode = null
          // retrieve new list
          this.$parent.updateProvinces()
          //ok, add the response, which is the person updated profile
          this.$parent.makeToast(
            "success",
            `Success`,
            "New town added to the system."
          );
        } else {
          this.$parent.makeToast("danger", `Error ${res.status}`, res.data);
          // delete tokens
        }
      });
    },
    getProvince() {
      return this.$parent.getProvinceOf(this.postcode);
    },
    pcInUse() {
      return this.$parent.pcInUse(this.postcode);
    }
  },
  computed: {
    submitState() {
      return this.nameState && this.pcState;
    },
    nameState() {
      return this.name.length > 3 ? true : false;
    },
    pcState() {
      return this.postcode >= 1000 && this.postcode < 52008 && !this.pcInUse()
        ? true
        : false;
    }
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