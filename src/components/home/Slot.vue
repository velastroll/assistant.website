<template>
  <div v-if="this.msg != null">
    <b-card
      style=" cursor: pointer;"
      :class=" 'border-slot' + this.borderColor(this.msg.status[0].timestamp)"
      @click="showData(msg)"
    >
      <div :style="`color: ${getColor(this.msg.status[0].timestamp)}`">
        <b-row>
          <b-col style="text-align: left; max-height: 20px;" >
            <i class="material-icons"> settings_remote </i>
          </b-col>
          <b-col>
            <div
              style="text-align: right; font-weight: bold;"
            >{{this.msg.mac.toUpperCase()}}</div>
          </b-col>
        </b-row>
      </div>
      <b-row>
        <div :class="this.getTaskClass(this.msg.status[0])">[{{this.getTask(this.msg.status[0])}}] {{this.getMinutes(this.msg.status[0].timestamp)}}</div>
        <div class="row-description">{{this.msg.relation.user.name}} - {{this.msg.relation.user.nif}} </div>
      </b-row>
    </b-card>


    <b-modal :id="`modal-show-${this.msg.mac}`" :title="`Device ${this.msg.mac.toUpperCase()}`">
      <b-row>
        <b-col cols="2" style="text-align: right; max-height: 20px;" ><i class="material-icons"> face </i></b-col>
        <b-col><div style="text-align: left; font-weight: bold;">{{this.msg.relation.user.name}}</div></b-col>
      </b-row>
      <b-row>
        <b-col cols="2" style="text-align: right; max-height: 20px;" ><i class="material-icons"> fingerprint </i></b-col>
        <b-col><div style="text-align: left; font-weight: bold;">{{this.msg.relation.user.nif}}</div></b-col>
      </b-row>
      <b-row>
        <b-col cols="2" style="text-align: right; max-height: 20px;" ><i class="material-icons"> date_range </i></b-col>
        <b-col><div style="text-align: left; font-weight: bold;">{{this.parseDate(this.msg.relation.from)}}</div></b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Slot",
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
      var n = now.getTime();
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
    showData: function(select) {
      this.parking_selected = select;
      this.$bvModal.show(`modal-show-${this.msg.mac}`);
    },
    getColor(time) {
      var date = new Date(time);
      var a = date.getTime();
      var now = new Date();
      var n = now.getTime();
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
      var n = now.getTime();
      date = parseInt((n - a) / 60000.0);
      var toReturn = " border-green ";
      if (date > 30) toReturn = " border-yellow "
      if (date > 1440) toReturn = " border-orange ";
      if (date > 5760) toReturn = " border-red ";
      if (this.msg.status[0].state != 'ALIVE') toReturn = toReturn + ' doing-action '
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
    },
    getTask(task){
      console.log(task)
      if (task.state == "ALIVE") return task.state;
      else return task.content;
    },
    getTaskClass(task){
      if (task.state == "ALIVE") return ' last-action ';
      else return ' task-action last-action ';
    }
  },
  computed: {
    ...mapActions(["common/UPDATE_PARKINGS", "auth/refreshToken"])
  }
};
</script>

<style scoped>

.task-action{
  font-weight: bolder;
}

.doing-action {
  background: #bcff96;
}

.border-slot{
  border-radius: 3px;
  border-width: 2px;
  border-style: solid;
}

.border-red {
  border-color: darkred;
}
.border-orange {
  border-color: darkorange;
}
.border-green {
  border-color: darkgreen;
}
.border-yellow {
  border-color: #cccc00;
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