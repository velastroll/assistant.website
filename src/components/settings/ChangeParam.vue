<template>
  <div>
    <div v-if="scope == 'GLOBAL'">
      <a>
        This is the global configuration.
        <br />You can edit it and save it in a way that devices auto-update it receive
        <strong>CONF</strong> event.
        <br />You can force this update sending the event
        <strong>CONF</strong> to
        all devices after you had saved it, setting the
        <a class="pending">new values</a>.
      </a>
    </div>
    <div v-else-if="scope == 'location'">
      <a>
        <a v-if="conf != null">
          This is the configuration of all devices related to
          <strong>{{ town }}</strong>
        </a>
        <a v-else class="pending">No configuration is saved yet</a>
        <br />You can edit it and save it in a way that devices update it when it
        receive
        <strong>CONF</strong> event.
        <br />You can force this update sending the event
        <strong>CONF</strong> to
        all devices after you had saved it, setting the
        <a class="pending">new values</a> for the devices of this location.
      </a>
    </div>
    <div v-else>
      <a>
        <a v-if="conf != null">
          This is the
          <strong>{{ conf.device }}</strong> device configuration
        </a>
        <a v-else class="pending">No configuration is saved yet</a>
        <br />You can edit it and save it,
        <a class="pending">generating the new values</a> in a way that devices
        updates it when receive
        <strong>CONF</strong> event.
      </a>
      <hr />
      <!-- configure wifi -->
      <div class="content-card">
        <b-row class="inner-row">
          <a class="row-text font-weight-bold">WIFI SSID</a>
          <b-input
            v-model="ssid"
            :state="checkssid()"
            style="width: 10rem; border-radius: 0.5rem; height: 1.5rem; text-align: right;"
          />
          <a class="row-text font-weight-bold">PASSWORD</a>
          <b-input
            :state="checkssid_ps()"
            v-model="ssid_ps"
            type="password"
            style="width: 10rem; border-radius: 0.5rem; height: 1.5rem; text-align: right;"
          />
          <b-button class="btn-wifi" :disabled="!checkwifi()" @click="sentWifi()">ENVIAR</b-button>
        </b-row>
      </div>
      <!-- end configure wifi -->
    </div>
    <!-- time to next ping -->
    <div class="content-card">
      <b-row class="inner-row">
        <a class="row-text font-weight-bold">Time to ping:</a>
        <a class="row-text" v-if="conf != null">{{ conf.body.sleep_sec }} sec.</a>
        <a class="row-text" v-else>No time saved yet.</a>
        <a class="row-text pending" v-if="pending != null">*{{ pending.body.sleep_sec }} sec</a>
      </b-row>
      <b-row v-if="edit" class="inner-row editing">
        <a class="row-text">New value:</a>
        <b-input
          v-model="new_config.body.sleep_sec"
          type="number"
          style="width: 5rem; border-radius: 0.5rem; height: 1.5rem; text-align: right;"
        />
        <a class="row-text">seconds</a>
      </b-row>
    </div>

    <!-- save configuration -->
    <div class="center">
      <b-button v-if="edit" class="save-btn" @click="createsConfig()">SAVE</b-button>
      <div v-else style="width: 100%">
        <b-button @click="edit = !edit" class="edit-btn">EDIT</b-button>
        <b-button @click="sentConfEvent()" class="conf-btn">
          sent
          <strong>conf</strong> event for
          <a v-if="receiver=='GLOBAL'">all devices</a>
          <a v-else-if="receiver > 1">this location devices</a>
          <a v-else>this device</a>
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangeParam",
  props: {
    scope: String,
    conf: null,
    pending: null,
    town: String,
    receiver: null
  },
  data() {
    return {
      ssid : '',
      ssid_ps : '',
      edit: false,
      new_sleep_sec: 0,
      new_config: {
        receiver: null,
        body: {
          sleep_sec: 0
        }
      }
    };
  },
  methods: {
    checkssid(){ return this.ssid.length > 6},
    checkssid_ps(){ return this.ssid_ps.length > 7},
    checkwifi(){ return this.checkssid() && this.checkssid_ps() },
    sentWifi() {
      this.$store
        .dispatch("tasks/new", {
          event: "WIFI",
          device: this.receiver,
          content : this.ssid + ";" + this.ssid_ps
        })
        .then(r => {
          if (r.status == 200) {
            this.makeToast(
              "success",
              "Added",
              `New task assigned to [${this.receiver}]`
            );
          } else {
            this.makeToast("danged", `oups ${r.status}`, `${r.data}`);
          }
        });
    },
    makeToast(variant, title, content) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true
      });
    },
    createsConfig() {
      // assign receiver
      this.new_config.receiver = this.receiver;
      if (this.new_config.body.sleep_sec > 14) {
        this.$store
          .dispatch("confs/sendConfiguration", this.new_config)
          .then(res => {
            if (res.status == 200) {
              this.makeToast("success", "Success", "New configuration added.");
              this.edit = false;
              this.$parent.$parent.refresh();
            } else {
              this.makeToast("danger", `Error ${res.status}`, res.data);
            }
          });
      } else {
        this.makeToast(
          "danger",
          "Bad time",
          "Time to ping should be higher or equal than 15 sec."
        );
      }
    },
    sentConfEvent() {
      this.$store
        .dispatch("tasks/new", {
          event: "CONF",
          device: this.receiver
        })
        .then(r => {
          if (r.status == 200) {
            this.makeToast(
              "success",
              "Added",
              `New task assigned to [${this.receiver}]`
            );
          } else {
            this.makeToast("danged", `oups ${r.status}`, `${r.data}`);
          }
        });
    }
  }
};
</script>

<style scoped>
.btn-wifi {
  width: 5rem;
  border-radius: 0.5rem;
  height: 1.5rem;
  text-align: center;
  margin-left: 2rem;
  padding: 0rem 0rem;
  background: #2c3e50;
}
.btn-wifi:hover{
  background: #4673a0
}

.save-btn {
  border-radius: 1rem;
  border: solid darkgreen 1px;
  color: darkgreen;
  background: white;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
  width: 100%;
}
.save-btn:hover {
  color: white;
  background: darkgreen;
  border: solid darkgreen 1px;
}
.edit-btn {
  border-radius: 1rem;
  border: solid #2c3e50 1px;
  color: #2c3e50;
  background: white;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
  width: 100%;
}

.edit-btn:hover {
  color: orange;
  border: solid orange 1px;
}

.conf-btn {
  text-transform: uppercase;
  margin-top: 0.5rem;
  border-radius: 1rem;
  border: solid #2c3e50 1px;
  color: #2c3e50;
  background: white;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
  width: 100%;
}

.conf-btn:hover {
  color: darkgreen;
  border: solid darkgreen 1px;
}

div.content-card {
  margin: 1rem 0 0 0;
  border: solid rgba(0, 39, 110, 0.24);
  border-width: 0 0 0 0.05rem;
  border-radius: 1rem;
  padding: 1rem 1rem 1rem 1rem;
  cursor: initial;
}
a.row-text {
  font-size: 1rem;
  padding: 0 0.5rem 0 0.5rem;
}
a.pending {
  color: brown;
}
.center {
  display: flex;
  justify-content: center;
}
.inner-row {
  padding-left: 1rem;
}
.editing {
  font-style: italic;
}
</style>