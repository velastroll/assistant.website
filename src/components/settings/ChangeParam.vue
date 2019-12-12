<template>
  <div>
    <div v-if="scope == 'GLOBAL'">
      <a>
        This is the global configuration. <br />
        You can edit it and save it in a way that devices auto-update it receive
        <strong> CONF </strong> event. <br />
        You can force this update sending the event <strong> CONF </strong> to
        all devices after you had saved it, setting the
        <a class="pending"> new values </a>.
      </a>
    </div>
    <div v-else-if="scope == 'location'">
      <a>
        <a v-if="conf != null">
        This is the configuration of all devices related to
        <strong> {{ town }} </strong></a>
        <a v-else class="pending"> No configuration is saved yet </a> <br />
        You can edit it and save it in a way that devices update it when it
        receive <strong> CONF </strong> event. <br />
        You can force this update sending the event <strong> CONF </strong> to
        all devices after you had saved it, setting the
        <a class="pending"> new values </a> for the devices of this location.</a
      >
    </div>
    <div v-else>
      <a>
        <a v-if="conf != null">
        This is the <strong> {{ conf.device }} </strong> device configuration </a>
        <a v-else class="pending"> No configuration is saved yet </a> <br />
        You can edit it and save it,
        <a class="pending"> generating the new values </a> in a way that devices
        updates it when receive <strong> CONF </strong> event.
      </a>
    </div>

    <!-- time to next ping -->
    <div class="content-card">
      <b-row class="inner-row">
        <a class="row-text font-weight-bold"> Time to ping:</a>
        <a class="row-text" v-if="conf != null">
          {{ conf.body.sleep_sec }} sec.
        </a>
        <a class="row-text" v-else> No time saved yet. </a>
        <a class="row-text pending" v-if="pending != null">
          *{{ pending.body.sleep_sec }} sec</a
        >
      </b-row>
      <b-row v-if="edit" class="inner-row editing">
        <a class="row-text"> New value: </a>
        <b-input
          v-model="new_config.body.sleep_sec"
          type="number"
          style="width: 5rem; border-radius: 0.5rem; height: 1.5rem; text-align: right;"
        />
        <a class="row-text"> seconds </a>
      </b-row>
    </div>

    <!-- save configuration -->
    <div class="center">
      <b-button v-if="edit" class="save-btn">SAVE</b-button>
      <b-button v-else @click="edit = !edit" class="edit-btn">EDIT</b-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    scope: String,
    conf: null,
    pending: null,
    town: String,
  },
  data() {
    return {
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
      createsConfig(){
          // assign receiver
          this.new_config.receiver = this.scope
            if (this.new_config.sleep_sec < 15) this.$parent.makeToast('danger', 'Bad time', 'Time to ping should be higher or equal than 15 sec.')
            else {
                this.$store
                    .dispatch("param/sendConfiguration", this.new_config)
                    .then( res => {
                        if (res.status == 200) {
                            this.$parent.makeToast('success', 'Success', 'New configuration added.')
                            this.$parent.refresh()
                        }
                        else {
                            this.$parent.makeToast('danger', 'Error ' + res.status, res.data)
                        }
                    })
            }
      }
  }
};
</script>

<style scoped>
.save-btn {
  border-radius: 1rem;
  border: solid darkgreen;
  color: darkgreen;
  background: white;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
}
.save-btn:hover {
  color: white;
  background: darkgreen;
  border-color: darkgreen;
}
.edit-btn {
  border-radius: 1rem;
  border: solid grey;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
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