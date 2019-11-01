<template>
  <div v-if="this.msg != null">
    <b-card
      style=" cursor: pointer;"
      :class="this.borderColor(this.msg.timestamp)"
      @click="showParking(msg)"
    >
      <div :style="`color: ${getColor(this.msg.timestamp)}`">
        <b-row>
          <b-col style="text-align: left; max-height: 20px;" >
            <i class="material-icons"> record_voice_over </i>
          </b-col>
          <b-col>
            <div
              style="text-align: right; font-weight: bold;"
            >{{this.msg.device.toUpperCase()}}</div>
          </b-col>
        </b-row>
      </div>
      <b-row>
        <div class="row-description" :id="`${this.msg.id}-street`">
          {{this.getStreet("XXXXXXXXXXXXXXXXX")}}
          <b-tooltip  v-if="true" :target="`${this.msg.id}-street`" triggers="hover"> CALLE DE LA MELANCOLIA, MANOLITO </b-tooltip>
        </div>
        <div class="last-action">[{{this.msg.state}}] {{this.getMinutes(this.msg.timestamp)}}</div>
        <div class="row-description">Valladolid</div>
      </b-row>
    </b-card>
    <b-modal :id="`modal-show-${this.msg.device}`" :title="`${this.msg.device}: ${this.msg.state}`">
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button
            v-if="edit && !edited"
            variant="danger"
            size="sm"
            class="float-right"
            @click="edit = false"
          >cancel</b-button>
          <b-button
            v-if="!edit"
            variant="danger"
            size="sm"
            class="float-right"
            @click="edit = true"
          >EDIT</b-button>
          <b-button
            v-if="edit"
            variant="success"
            size="sm"
            class="float-right"
            @click="saveChanges()"
          >save</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Parking",
  props: {
    msg: {
      type: Object
    }
  },
  data: function() {
    return {
      parking: null,
      parking_selected: null,
      edit: false,
      edited: false
    };
  },
  watch: {
    msg: function() {
      this.parking = this.msg;
    }
  },
  created() {},
  methods: {
    getMinutes(from){
      var date = new Date(from);
      var a = date.getTime();
      var now = new Date();
      var n = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
      date = parseInt((n - a) / 1000.0);
      if (date < 60) return " " + date + "sec. ago";
      else {
        date = parseInt(date / 60);
        if (date < 60) return " " + date + "min. ago";
        else return " " + parseInt(date / 60) + " hours ago";
      }
    },
    getStreet: function(street) {
      if (street.length > 16) return `${street.substring(0, 20)}...`;
      else return street;
    },
    showParking: function(select) {
      this.parking_selected = select;
      this.$bvModal.show(`modal-show-${this.msg.device}`);
    },
    getColor(time) {
      var date = new Date(time);
      var a = date.getTime();
      var now = new Date();
      var n = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
      date = parseInt((n - a) / 60000.0);
      var color = "darkgreen";
      if (date > 30 ) color = "#cccc00";
      if (date > 1440) color = "orange";
      if (date > 5760) color = "brown";
      return color;
    },
    borderColor(time) {
      var date = new Date(time);
      var a = date.getTime();
      var now = new Date();
      var n = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
      date = parseInt((n - a) / 60000.0);
      var toReturn = " border-green ";
      if (date > 30) toReturn = " border-yellow "
      if (date > 1440) toReturn = " border-orange ";
      if (date > 5760) toReturn = " border-red ";
      return toReturn;
    },
    parseDate(date) {
      var y = date.substring(0, 4);
      var m = date.substring(5, 7);
      var d = date.substring(8, 10);
      var h = date.substring(11, 13);
      var mm = date.substring(14, 16);
      return "" + d + "/" + m + "/" + y + " - " + h + ":" + mm;
    },
    makeToast(variant = null, title, content) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true
      });
    }
  },
  computed: {
    ...mapActions(["common/UPDATE_PARKINGS", "auth/refreshToken"])
  }
};
</script>

<style scoped>
.border-red {
  border-color: darkred;
  border-radius: 3px;
  border-width: 2px;
  border-style: solid;
}
.border-orange {
  border-color: darkorange;
  border-radius: 3px;
  border-width: 2px;
  border-style: solid;
}
.border-green {
  border-color: darkgreen;
  border-radius: 3px;
  border-width: 2px;
  border-style: solid;
}
.border-yellow {
  border-color: #cccc00;
  border-radius: 3px;
  border-width: 2px;
  border-style: solid;
}
.row-description {
  width: 100%;
  text-align: right;
  font-weight: lighter;
  margin-right: 10px;
}
.last-action{
    font-style: italic;
    width: 100%;
    text-align: right;
    margin-right: 10px;
}
.link {
  color: green;
  font-weight: bolder;
}
</style>