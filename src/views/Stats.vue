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
          <!-- CARDS -->
          <div class="task-grid">
            <!-- Device -->
            <div class="infocard" v-if="user!=null">
              <table style="width:100%;">
                <tr>
                  <!-- tarea pendiente -->
                  <td class="datacol">
                    <b-row class="justify-content-center" style="width: 100%; text-align:center">
                      <b-col
                        cols="5"
                        style="text-align: right; max-height: 20px; padding-top: 0.5rem;"
                      >
                        <img
                          style="width: 2rem; height: 1rem; color: #2c3e50;"
                          src="/marker/device.svg"
                        />
                      </b-col>
                      <b-col
                        style="text-align: left; font-weight: bold; padding-top: 0.5rem; text-transform: uppercase;"
                      >Dispositivo</b-col>
                    </b-row>
                  </td>
                  <!-- añadir tarea -->
                  <td class="datacol text-center">
                    <b-row class="justify-content-center" style="width: 100%; text-align:center">
                      <b-col
                        cols="5"
                        style="text-align: right; max-height: 20px; padding-top: 0.5rem;"
                      >
                        <i class="material-icons">face</i>
                      </b-col>
                      <b-col
                        style="text-align: left; font-weight: bold; padding-top: 0.5rem; text-transform: uppercase;"
                      >Usuario</b-col>
                    </b-row>
                  </td>
                </tr>
                <tr style="width: 100%;">
                  <td class="datacol">
                    <div v-if="device != null">
                      <div>
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
                        <b-button class="dvc unnassigned" v-b-modal.assign>
                          <span>sin asignar</span>
                        </b-button>
                      </div>
                    </div>
                  </td>
                  <td class="datacol">
                    <div
                      v-if="user != null"
                      style="width: 100%: padding: 0 1rem 0 1rem; width:100%;"
                      class="text-center"
                    >
                      <div>
                        <span>{{user.name}} {{user.surname}}, {{user.nif}}</span>
                      </div>
                      <div>
                        <span>[{{user.postcode}}]</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            <div v-else>
              <span style="color: red;">No tiene ningún usuario asociado</span>
            </div>
            <!-- TAREAS PENDIENTES -->
            <div class="infocard" v-if="device != null">
              <table style="width: 100%">
                <tr>
                  <!-- tarea pendiente -->
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
                    <b-col v-if="device!=null" style="width: 100%">
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
            <!-- ULTIMAS -->
            <b-row style="width: 100%; margin-left: 0;" class="justify-content-center">
              <!-- tareas -->
              <div class="infocard" style="width: 350px;" v-if="device != null">
                <b-row>
                  <b-col
                    style="text-align: right; max-height: 20px; padding-top: 0.5rem; max-width: 60px"
                  >
                    <i class="material-icons">done_all</i>
                  </b-col>
                  <b-col
                    style="text-align: left; font-weight: bold; padding-top: 0.5rem; text-transform: uppercase;"
                  >ultimas tareas realizadas</b-col>
                </b-row>
                <b-row v-if="device.last_events.length == 0">No se han realizado acciones</b-row>
                <b-row :key="i" v-for="(t, i) in device.last_events" class="tablerow">
                  <span style="padding: 0 0.5rem 0 3rem;">{{t.name}} el</span>
                  <span>{{parseDate(t.timestamp)}}</span>
                </b-row>
              </div>
              <!-- acciones -->
              <div class="infocard" style="width: 350px;" v-if="device != null">
                <b-row>
                  <b-col
                    style="text-align: right; max-height: 20px; padding-top: 0.5rem; max-width: 100px"
                  >
                    <i class="material-icons">done_all</i>
                  </b-col>
                  <b-col
                    style="text-align: left; font-weight: bold; padding-top: 0.5rem; text-transform: uppercase;"
                  >ultimas acciones</b-col>
                </b-row>
                <b-row v-if="device.last_status.length == 0">No se han realizado acciones</b-row>
                <table>
                  <tr :key="i" v-for="(t, i) in device.last_status" class="tablerow">
                    <td class="text-right" style="min-width: 75px; ">{{t.type}}</td>
                    <td class="text-left" style="padding-left: 1rem">{{parseDate(t.timestamp)}}</td>
                  </tr>
                </table>
              </div>
            </b-row>
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

    <!-- modal -->
    <b-modal id="assign" title="Escoge un dispositivo">
      <div style="font-style: italic;">
        Mostrando dispositivos disponibles:
      </div>
      <div
        :key="i"
        v-for="(d, i) in this.unrelated"
        style="width: 100%; text-align: center;"
      >
      <span class="bolder-link" @click="dev2assign = d.device">[{{d.device}}]</span> hizo ping hace {{timeTo(d.last_status[0].timestamp)}} segundos </div>
      <template v-slot:modal-footer>
        <div class="w-100">
          <p class="float-left">Seleccionado: <a style="color: #4b93db">{{dev2assign}}</a></p>
          <b-button
            :disabled="dev2assign == 'Ninguno'"
            variant="primary"
            size="sm"
            class="float-right"
            @click="show=false; addRelation(dev2assign)"
          >
            Asignar
          </b-button>
        </div>
      </template>
    </b-modal>
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
      date_filter: "D",
      daily_filter: "",
      month_filter: "null",
      year_filter: "",
      user: null,
      users: [],
      dev2assign: 'Ninguno',
      device: null,
      devices: [],
      unrelated: [],
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
    addRelation(deviceid){
      this.$store
        .dispatch("relation/new", {nif: this.nif, device: deviceid})
        .then( r => {
          if (r.status == 200){
            this.updateAll()
            this.makeToast("success", "Success", r.data)
            this.$bvModal.hide('assign')
          } else {
            this.makeToast("danger", "Error", r.data)
          }
        }
      )
    },
    timeTo(timestamp) {
      var date = new Date(timestamp);
      var a = date.getTime();
      var now = new Date();
      var n = now.getTime();
      return parseInt((n - a) / 1000.0);  
    },
    getNifAndDevice(device) {
      let dev = device.replace("%3", ":");
      this.devices.forEach(d => {
        if (d.device == dev) {
          this.device = d;
          if (d.relation != null) {
            this.nif = d.relation.user.nif;
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
          this.selectInfo();
        }
      });
    },
    selectInfo() {
      let deviceQ = this.$route.query["d"];
      this.nif = this.$route.query["u"];
      if (deviceQ != null) {
        // retrieve this.nif and this.device
        this.getNifAndDevice(deviceQ);
      } else if (this.nif != null) {
        this.filterDevice();
      }

      // retrieve user
      this.users.forEach(u => {
        console.log(u);
        if (u.nif == this.nif) {
          this.user = u;
        }
      });

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
          this.splitUnrelatedDevices();
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
    splitUnrelatedDevices() {
      this.unrelated = [];
      this.devices.forEach(d => {
        if (d.relation == null) this.unrelated.push(d);
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
span.bolder-link{
  font-weight: bold;
  cursor: pointer;
}
span.bolder-link:hover{
  color:#4b93db;
}

td.datacol {
  width: 50%;
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
