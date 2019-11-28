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
              >DAILY</b-button>
              <b-button
                class="date-btn"
                @click="date_filter='M'"
                :pressed="date_filter == 'M'"
              >MONTHLY</b-button>
              <b-button
                class="date-btn"
                @click="date_filter='A'"
                :pressed="date_filter == 'A'"
              >ANUALLY</b-button>
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
        <b-row>
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
          <!-- task -->
          <div class="task-grid">
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
          
          <!-- task -->
          <div class="task-grid">
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
      device: '',
      date_filter: "D",
      daily_filter: "",
      month_filter: "null",
      year_filter: ""
    };
  },
  mounted() {
    if (sessionStorage.getItem("access_token") != null) {
      // retrieve data
    } else {
      this.$parent.redirect("/login");
    }
  },
  methods: {
    makeToast(a, b, c) {
      this.$parent.makeToast(a, b, c);
    },
    retrieveStats(){
      this.$store.dispatch("tasks/get", {
        device: this.device,
        type: this.date_filter,
        
      })
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
.chart-grid {
  width: 300px;
  height: 100%;
  border: solid;
}
.task-grid {
  min-width: 300px;
  width: 300px;
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
