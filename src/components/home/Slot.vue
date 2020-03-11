<template>
  <div v-if="this.msg != null">
    <b-card
      style=" cursor: pointer;"
      :class=" 'border-slot' + this.borderColor(this.msg.last_status[0].timestamp)"
      @click="showData(msg)"
    >
      <div :style="`color: ${getColor(this.msg.last_status[0].timestamp)}`">
        <b-row>
          <b-col style="text-align: left; max-height: 20px;">
            <i class="material-icons">settings_remote</i>
          </b-col>
          <b-col>
            <div style="text-align: right; font-weight: bold;">{{this.msg.device.toUpperCase()}}</div>
          </b-col>
        </b-row>
      </div>
      <b-row>
        <!-- Last status -->
        <div
          :class="this.getTaskClass(this.msg.last_status[0])"
        >[{{this.msg.last_status[0].type}}] {{this.getMinutes(this.msg.last_status[0].timestamp)}}</div>
        <!-- User -->
        <div class="row-description">
          <div
            v-if="this.msg.relation != null"
          >{{this.msg.relation.user.name}} - {{this.msg.relation.user.nif}}</div>
          <div v-else style="color: red">Sin asignar</div>
        </div>
        <!-- Last intent -->
        <div
          class="row-description"
          style="text-transform: uppercase;font-size:0.65rem; font-style: italic;"
        >
          <div
            v-if="this.msg.last_intent != null"
          >Consultó [{{this.msg.last_intent.intent}}] {{this.getMinutes(this.msg.last_intent.timestamp)}}</div>
          <div v-else style="color: red">Sin uso todavía</div>
        </div>
      </b-row>
    </b-card>

    <!-- modal -->
    <b-modal
      :id="`modal-show-${this.msg.device}`"
      :title="`Dispositivo ${this.msg.device.toUpperCase()}`"
      hide-footer
    >
      <div v-if="this.msg.relation">
        <b-row>
          <b-col cols="2" style="text-align: right; max-height: 20px;">
            <i class="material-icons">face</i>
          </b-col>
          <b-col>
            <div
              style="text-align: left; font-weight: bold;"
            >{{this.msg.relation.user.name}} {{this.msg.relation.user.surname}}</div>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="2" style="text-align: right; max-height: 20px;">
            <i class="material-icons">fingerprint</i>
          </b-col>
          <b-col>
            <div style="text-align: left; font-weight: bold;">{{this.msg.relation.user.nif}}</div>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="2" style="text-align: right; max-height: 20px;">
            <i class="material-icons">date_range</i>
          </b-col>
          <b-col>
            <div
              style="text-align: left; font-weight: bold;"
            >{{this.parseDate(this.msg.relation.from)}}</div>
          </b-col>
        </b-row>
      </div>
      <div v-else>
        <b-row class="justify-content-center">
          <span style="color:red;">Este dispositivo no tiene usuario asignado.</span>
        </b-row>
      </div>
      <hr />
      <b-row style="width: 100%">
        <b-col cols="2" class="col-icon">
          <i class="material-icons">settings</i>
        </b-col>
        <b-col>
          <div
            class="to-settings"
            @click="redirect(`/settings?d=${msg.device}`)"
          >Configura parámetros del dispositivo</div>
        </b-col>
      </b-row>
      <hr />
      <b-row style="width: 100%">
        <b-col cols="2" class="col-icon">
          <i class="material-icons">bar_chart</i>
        </b-col>
        <b-col>
          <div
            class="to-settings"
            @click="redirect(`/stats?d=${msg.device}`)"
          >Ver estadísticas de uso</div>
        </b-col>
      </b-row>
      <hr />
      <b-row style="width: 100%">
        <b-col cols="2" class="col-icon">
          <i class="material-icons">flash_on</i>
        </b-col>
        <b-col>
          <div class="col-heading">Acciones rápidas</div>
        </b-col>
      </b-row>

      <b-row class="justify-content-center">
        <b-col>
          <b-form-select v-model="selected" :options="options" class="event-content float-right"></b-form-select>
        </b-col>
      </b-row>
      <b-row v-if="selected" style="width: 100%;" class="justify-content-center">
        <b-col md="auto">
          <b-button
            placeholder="Añadir tarea"
            class="quick-action-btn float-right"
            @click="sendTask()"
          >Añadir tarea</b-button>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col cols="2" class="col-icon">
          <i class="material-icons">cached</i>
        </b-col>
        <b-col>
          <div class="col-heading">Tareas pendientes</div>
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <div v-if="this.msg.pending.length == 0">
          <b-col style="text-align:center; ">
            <span style="font-style: italic;">Sin tareas pendientes</span>
          </b-col>
        </div>
        <div v-else>
          <b-col :key="i" v-for="(v,i) in this.msg.pending">
            <span class="pending-action">{{v.event}} por {{v.by}} a las {{parseDate(v.at)}}</span>
          </b-col>
        </div>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
/* eslint-disable */
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
      device: null,
      device_selected: null,
      edit: false,
      edited: false,
      selected: null,
      options: [{ value: null, text: "Elige una opción" }]
    };
  },
  watch: {
    msg: function() {
      this.device = this.msg;
    }
  },
  created() {
    this.events = this.$store.getters["tasks/getEvents"];
    for (var i in this.events) {
      this.options.push({
        value: this.events[i].name,
        text: this.events[i].name
      });
    }
  },
  methods: {
    redirect(url) {
      try {
        this.$router.push(url).catch(err => {});
      } catch (e) {}
    },
    getMinutes(from) {
      var date = new Date(from);
      var a = date.getTime();
      var now = new Date();
      var n = now.getTime();
      date = parseInt((n - a) / 1000.0);
      if (date < 60) return " hace " + date + "sec.";
      else {
        date = parseInt(date / 60);
        if (date < 60) return " hace " + date + "min.";
        else return " hace " + parseInt(date / 60) + " horas";
      }
    },
    getStreet: function(street) {
      if (street.length > 16) return `${street.substring(0, 20)}...`;
      else return street;
    },
    showData: function(select) {
      this.device_selected = select;
      this.$bvModal.show(`modal-show-${this.msg.device}`);
    },
    getColor(time) {
      var date = new Date(time);
      var a = date.getTime();
      var now = new Date();
      var n = now.getTime();
      date = parseInt((n - a) / 60000.0);
      var color = "darkgreen";
      if (date > 30) color = "#cccc00";
      if (date > 1440) color = "orange";
      if (date > 5760) color = "brown";
      if (this.msg.last_status[0].type == "OFF") color = "grey";
      return color;
    },
    borderColor(time) {
      var date = new Date(time);
      var a = date.getTime();
      var now = new Date();
      var n = now.getTime();
      date = parseInt((n - a) / 60000.0);
      var toReturn = " border-green ";
      if (date > 30) toReturn = " border-yellow ";
      if (date > 1440) toReturn = " border-orange ";
      if (date > 5760) toReturn = " border-red ";
      if (this.msg.last_status[0].type == "OFF") toReturn = " border-grey ";
      else if (this.msg.last_status[0].type != "ALIVE")
        toReturn = toReturn + " doing-action ";
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
    getTask(task) {
      if (task.type == "ALIVE") return task.state;
      else return task.content;
    },
    getTaskClass(task) {
      if (task.state == "ALIVE") return " last-action ";
      else return " task-action last-action ";
    },
    sendTask() {
      if (this.selected == null) {
        this.makeToast(
          "danger",
          "Mala tarea",
          `La tarea ${this.selected} no es válida.`
        );
      } else {
        this.$store
          .dispatch("tasks/new", {
            event: this.selected,
            device: this.msg.device
          })
          .then(r => {
            this.selected = null;
            this.$parent.updateDevices();
            this.makeToast(
              "success",
              "Añadida",
              "Nueva tarea asignada al dispositivo."
            );
          });
      }
    }
  },
  computed: {
    ...mapActions(["common/UPDATE_PARKINGS", "auth/refreshToken"])
  }
};
</script>

<style scss>
span.pending-action:hover {
  color: red;
  text-decoration: underline;
}

.event-content {
  margin: 0 -0.5rem 0 0;
  padding: 0 0 0 1rem;
  width: 375px;
  margin-right: 1rem;
}

@media only screen and (max-width: 450px) {
  .event-content {
    width: 92%;
  }
}

.task-action {
  font-weight: bolder;
}

.doing-action {
  background: #bcff96;
}

.border-slot {
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
.border-grey {
  border-color: grey;
  background-color: lightgray;
}
.row-description {
  width: 100%;
  text-align: right;
  font-weight: lighter;
  margin-right: 10px;
}
.last-action {
  font-style: italic;
  width: 100%;
  text-align: right;
  margin-right: 10px;
}
.link {
  color: green;
  font-weight: bolder;
}

.quick-action-btn {
  margin-top: 0.5rem;
  background: rgba(0, 0, 0, 0);
  border-radius: 1rem;
  border: brown;
  color: brown;
  border-style: solid;
  font-weight: bolder;
}

.quick-action-btn:hover {
  color: white;
  background: brown;
}

div.to-settings {
  text-align: left;
  font-weight: normal;
  padding-top: 0.5rem;
  color: blue;
  cursor: pointer;
}

div.to-settings:hover {
  text-decoration: underline;
}

.col-icon {
  text-align: right;
  max-height: 20px;
  padding-top: 0.5rem;
}

.col-heading {
  text-align: left;
  font-weight: bold;
  padding-top: 0.5rem;
}
</style>