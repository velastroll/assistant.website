<template>
  <div class="body-home" style=" width: 100%; min-height: 100%; margin: 0 0 0 0; padding: 0 0 0 0;">
    <b-row class="justify-content-center">
      <b-col
        cols="12"
        style="min-width: 90%; max-width: 90%; margin-top: 10px; "
        md="auto"
        class="justify-content-center"
      >
        <!-- filters -->
        <b-row style="padding-right: 0px;">
          <!-- type -->
          <div class="container-type-date">
            <b-button-group>
              <b-button
                class="date-btn"
                @click="date_filter='D'"
                :pressed="date_filter == 'D'"
              >DIARIO</b-button>
              <b-button
                class="date-btn"
                @click="date_filter='M'"
                :pressed="date_filter == 'M'"
              >MENSUAL</b-button>
              <b-button
                class="date-btn"
                @click="date_filter='A'"
                :pressed="date_filter == 'A'"
              >ANUAL</b-button>
            </b-button-group>
          </div>
          <!-- input -->
          <div class="container-input-date float-right">
            <!-- button -->
            <div>
              <div class="update-btn">
                <b-button class="date-btn">
                  <i class="material-icons" style="padding-top: 0.125rem;">sync</i>
                </b-button>
              </div>
            </div>
            <!-- anually filter -->
            <div v-if="date_filter != 'D'" class="input-date" style="width: 100px;">
              <b-form-input v-model="year_filter" type="number" placeholder="Año"></b-form-input>
            </div>
            <!-- monthly filter -->
            <div v-if="date_filter == 'M'" class="input-date" style="width: 100px">
              <b-form-input v-model="month_filter" type="number" placeholder="Mes"></b-form-input>
            </div>
            <!-- daily filter -->
            <div v-if="date_filter == 'D' " class="input-date">
              <b-form-input v-model="daily_filter" type="date"></b-form-input>
            </div>
          </div>
        </b-row>

        <!-- content -->
        <b-row class="justify-content-center">
          <!-- task -->
          <div class="task-grid" v-if="device != null">
            <!-- Device -->
            <div class="infocard">
              <table style="width:100%;">
                <tr>
                  <td class="text-right">
                    <i
                      class="material-icons"
                      style="text-align: right; max-height: 20px; padding-top: 0.25rem;"
                    >info</i>
                  </td>
                  <td class="text-left">
                    <span
                      style="text-align: left; font-weight: bold; padding-top: 1rem; text-transform: uppercase;"
                    >Información</span>
                  </td>
                </tr>
                <tr style="width: 100%: background: yellow;">
                  <td class="datacol">
                    <div v-if="device.relation!=null">
                      <div>
                        <img
                          style="width: 2rem; height: 2rem; color: #2c3e50;"
                          src="/marker/device.svg"
                        />
                        <b-button class="dvc assigned">
                          <span>{{device.device}}</span>
                        </b-button>
                      </div>
                      <div>
                        <span>Desde el {{parseDate(device.relation.from)}}</span>
                      </div>
                    </div>
                    <div v-else>
                      <div>
                        <img
                          style="width: 2rem; height: 2rem; color: #2c3e50;"
                          src="/marker/device.svg"
                        />
                        <b-button class="dvc unnassigned">
                          <span>sin asignar</span>
                        </b-button>
                      </div>
                    </div>
                  </td>
                  <td class="datacol">
                    <div style="width: 100%: padding: 0 1rem 0 1rem;" class="text-right">
                      <div>
                        <span>{{device.relation.user.name}} {{device.relation.user.surname}}, {{device.relation.user.nif}} [{{device.relation.user.postcode}}]</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            <!-- PENDING TASK -->
            <div class="infocard" v-if="device.relation != null">
              <table style="width: 100%">
                <tr>
                  <!-- tarea epndiente -->
                  <td class="datacol">
                    <b-row>
                      <b-col
                        style="text-align: right; max-height: 20px; padding-top: 0.5rem; max-width: 150px"
                      >
                        <i class="material-icons">query_builder</i>
                      </b-col>
                      <b-col
                        style="text-align: left; font-weight: bold; padding-top: 0.5rem; text-transform: uppercase;"
                      >Tareas pendientes</b-col>
                    </b-row>
                  </td>
                  <!-- añadir tarea -->
                  <td class="datacol text-center">
                    <b-row>
                      <b-col
                        style="text-align: right; max-height: 20px; padding-top: 0.5rem; max-width: 150px"
                      >
                        <i class="material-icons">flash_on</i>
                      </b-col>
                      <b-col
                        style="text-align: left; font-weight: bold; padding-top: 0.5rem; text-transform: uppercase;"
                      >Añadir tarea</b-col>
                    </b-row>
                  </td>
                </tr>
                <tr>
                  <!-- pendientes contenido -->
                  <td class="datacol text-center">
                    <b-col v-if="device.relation!=null" style="width: 100%">
                      <div v-if="device.pending.length == 0">
                        <span>No hay tareas pendientes</span>
                      </div>
                      <div :key="i" v-for="(t, i) in device.pending">
                        <span>
                          [{{t.event}}] ordenada por
                          <strong>{{t.by}}</strong>
                          el {{parseDate(t.at)}}
                        </span>
                      </div>
                    </b-col>
                  </td>
                  <!-- añadir tarea contenido -->
                  <td class="datacol">
                    <b-form-select
                      v-model="taskSelected"
                      :options="taskOptions"
                      class="event-content"
                    ></b-form-select>
                    <b-button
                      class="dvc addevent"
                      @click="sendTask()"
                      :disabled="!taskSelected"
                    >{{addTaskBtnText()}}</b-button>
                  </td>
                </tr>
              </table>
            </div>
            <!-- AÑADIR TAREAS -->
            <div class="infocard" v-if="device.relation != null"></div>
          </div>

          <!-- charts -->
          <div class="chart-grid">
            <!-- Intents -->
            <b-row style="width: 100%">
              <b-col
                cols="2"
                style="text-align: right; max-height: 20px; padding-top: 0.5rem; padding-left: 3rem;"
              >
                <i class="material-icons">pie_chart</i>
              </b-col>
              <b-col>
                <div style="text-align: left; font-weight: bold; padding-top: 0.5rem;">Intenciones</div>
              </b-col>
            </b-row>
            <Intents device="XX:XX:XX:XX:XX:XX" />

            <!-- hotword -->
            <b-row style="width: 100%">
              <b-col
                cols="2"
                style="text-align: right; max-height: 20px; padding-top: 0.5rem; padding-left: 3rem;"
              >
                <i class="material-icons">show_chart</i>
              </b-col>
              <b-col>
                <div style="text-align: left; font-weight: bold; padding-top: 0.5rem;">Accuracy</div>
              </b-col>
            </b-row>
            <Intents device="XX:XX:XX:XX:XX:XX" />
          </div>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapActions, mapMutations } from "vuex";
import Intents from "@/components/stats/Intents";

export default {
  name: "Stats",
  components: {
    Intents
  },

  data: function() {
    return {
      device: null,
      date_filter: "D",
      daily_filter: "",
      month_filter: "null",
      year_filter: "",
      user: null,
      users: [],
      devices: [],
      events: [],
      taskSelected: null,
      taskOptions: [{ value: null, text: "Please select an option" }]
    };
  },
  mounted() {
    if (sessionStorage.getItem("access_token") != null) {
      // download data
      this.updateAll();
    } else {
      this.$parent.redirect("/login");
    }
    this.filterDevice();
  },
  methods: {
    getNifAndDevice(device) {
      let dev = device.replace("%3", ":");
      this.devices.forEach(d => {
        if (d.device == dev) {
          if (d.relation != null) {
            this.nif = d.relation.user.nif;
            this.device = d;
          }
        }
      });
    },
    /* Create a new task for a specific device. */
    sendTask() {
      if (this.taskSelected == null) {
        this.makeToast(
          "danger",
          "Wrong task",
          `The task ${this.taskSelected} is not valid.`
        );
      } else {
        this.$store
          .dispatch("tasks/new", {
            event: this.taskSelected,
            device: this.device.device
          })
          .then(r => {
            if (r.status == 200) {
              this.taskSelected = null;
              this.makeToast(
                "success",
                "Added",
                "New task assigned to the device."
              );
            } else {
              this.makeToast("danger", `Error [${r.status}]`, `${r.data}`);
            }
            this.updateDevices();
          });
      }
    },
    updateAll() {
      this.updateUsers();
    },
    /** Retrieve event types */
    updateEvents: function() {
      this.$store.dispatch("tasks/getEvents").then(r => {
        if (r.status == 200) {
          this.events = this.$store.getters["tasks/getEvents"];
          this.taskOptions = [{ value: null, text: "Please select an option" }];
          for (var i in this.events) {
            this.taskOptions.push({
              value: this.events[i].name,
              text: this.events[i].name
            });
          }
          this.selectInfo()
        }
      });
    },
    selectInfo(){
      let deviceQ = this.$route.query["d"];
      this.nif = this.$route.query["u"];
      if (deviceQ != null) {
        // retrieve this.nif and this.device
        this.getNifAndDevice(deviceQ);
      } else if (this.nif != null){
          this.filterDevice()
      }

      // retrieve data
      if (this.nif == null && deviceQ == null) this.$parent.redirect("/users");
    },
    /** Retrieve users */
    updateUsers() {
      this.$store.dispatch("users/retrieve").then(r => {
        if (r.status == 200) {
          this.users = r.data;
          this.updateDevices();
        } else {
          this.$parent.makeToast("danger", `Oups ${r.status}`, r.description);
        }
      });
    },
    /** Retrieve devices */
    updateDevices() {
      this.$store.dispatch("device/retrieve").then(r => {
        if (r.status == 200) {
          this.devices = r.data;
          console.log("end devices");
          this.updateEvents();
        } else {
          this.$parent.makeToast("danger", `Oups ${r.status}`, r.description);
        }
      });
    },
    /* Sets into [this.device] the device which has an active relation with [this.nif] */
    filterDevice() {
      this.devices.forEach(it => {
        if (it.relation != null) {
          if (it.relation.user.nif == this.nif) this.device = it;
        }
      });
    },
    addTaskBtnText() {
      if (this.taskSelected) return "Añadir tarea";
      else return "Elige primero";
    },
    parseDate(date) {
      return (
        date.substring(8, 10) +
        "/" +
        date.substring(5, 7) +
        "/" +
        date.substring(0, 4) +
        " a las " +
        date.substring(11, 13) +
        ":" +
        date.substring(14, 16)
      );
    },
    makeToast(a, b, c) {
      this.$parent.makeToast(a, b, c);
    },
    retrieveStats() {
      this.$store.dispatch("tasks/get", {
        device: this.device,
        type: this.date_filter
      });
    }
  },
  computed: {
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
td.datacol {
  width: 50%;
  background: pink;
}

.event-content {
  width: 250px;
}

div.infocard {
  background: white;
  border: solid;
  border-width: 0px 1px 1px 0px;
  border-color: rgba(185, 185, 185, 0.096);
  border-radius: 1rem;
  padding: 1rem 1rem 1rem 1rem;
  margin: 1rem 1rem 1rem 1rem;
}
.unnassigned {
  color: brown;
}

.unnassigned:hover {
  color: darkgreen;
}

.dvc {
  background: #f2f2f200;
  border: solid;
  text-transform: uppercase;
  border-radius: 1rem;
  border-width: 1px 1px 1px 1px;
  margin: 0 0 0 0px;
  padding-top: 0px;
  padding-bottom: 0px;
}

.dvc:hover span {
  display: none;
}

.assigned:hover:before {
  content: "desasignar dispositivo";
}
.unnassigned:hover:before {
  content: "elegir dispositivo";
}

.addevent {
  color: darkgreen;
}

.addevent:disabled {
  border-color: gray;
  color: gray;
}

.addevent:hover {
  color: white;
  border-color: darkgreen;
  background: darkgreen;
}

.assigned {
  color: #2c3e50;
}

.assigned:hover {
  color: brown;
}

.chart-grid {
  width: 300px;
  height: 100%;
}
.task-grid {
  min-width: 300px;
  justify-content: center;
  width: calc(100vw - 400px);
  background: orange;
}
.input-date {
  float: right;
  padding-right: 1rem;
}
.smart-screen {
  display: inline;
}

div.container-type-date {
  width: 300px;
  float: left;
}

div.container-input-date {
  min-width: 275px;
  width: calc(100% - 300px);
  float: right;
}

@media only screen and (max-width: 650px) {
  .chart-grid {
    width: 100%;
  }

  .task-grid {
    width: 100%;
  }
  .smart-screen {
    display: none;
  }

  div.container-type-date {
    width: 100%;
    float: none;
    justify-content: center;
  }

  div.container-input-date {
    width: 100%;
    float: none;
  }

  div.input-date {
    width: 80%;
  }
}

.update-btn {
  float: right;
}

.date-btn {
  padding: 0px 15px 0px 15px;
  height: 30px;
  margin-top: 5px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #2c3e5000;
  color: #2c3e50;
}

.date-btn:hover {
  background-color: #2c3e50;
  color: #f2f2f2;
}

.date-btn:active {
  background-color: #2c3e50;
  color: #f2f2f2;
}

.input-search {
  margin-top: 5px;
  margin-bottom: 10px;
  height: 30px;
  border-radius: 10px;
}

.row-table {
  border-bottom: 1px solid #303c4727;
}
.row-table:hover {
  background-color: #2c3e5011;
}

.header-table {
  font-weight: bolder;
  background-color: #2c3e50;
  color: #f2f2f2;
  border-radius: 10px;
}

.body-home {
  background-color: #f2f2f2;
}
</style>
