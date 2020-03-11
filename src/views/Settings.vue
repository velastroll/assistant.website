<template>
  <div class="body-home">
    <!-- global -->
    <div class="heading-card">
      <div class="pointer" v-b-toggle.accordion-1>
        <a class="material-icons">vpn_lock</a>
        <a class="heading-title">Global</a>
      </div>
      <div>
        <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
          <ChangeParam scope="GLOBAL" :conf="globalC" receiver="GLOBAL" />
        </b-collapse>
      </div>
    </div>
    <!-- location -->
    <div class="heading-card" v-if="town">
      <div class="pointer" v-b-toggle.accordion-2>
        <a class="material-icons">house</a>
        <a class="heading-title">{{town}}</a>
      </div>
      <div>
        <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
          <ChangeParam scope="location" :conf="localeC" :town="town" :receiver="test" />
        </b-collapse>
      </div>
    </div>
    <!-- device -->
    <div class="heading-card" v-if="d">
      <div class="pointer" v-b-toggle.accordion-3>
        <a class="material-icons">settings_remote</a>
        <a class="heading-title">Dispositivo {{d}}</a>
      </div>
      <div>
        <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
          <ChangeParam scope="device" :conf="deviceC" :pending="pendingC" :receiver="d" />
        </b-collapse>
      </div>
    </div>
  </div>
</template>

<style>
.body-home {
  background-color: #f2f2f2;
  min-width: 100%;
  min-height: 100%;
  margin-top: -1rem;
}
.main-panel{
  min-width: 100vw;
  min-height: 100vh;
  background: whitesmoke;
}
div.pointer {
  cursor: pointer;
}
div.heading-card {
  min-width: 300px;
  margin: 1rem 1rem 1rem 1rem;
  padding: 1rem 2rem 1rem 2rem;
  background-color: white;
  border-radius: 1rem;
  border: solid rgba(0, 39, 110, 0.24);
  border-width: 0 0 0.1rem 0;
}
div.heading-card:hover {
  background-color: rgb(250, 250, 250);
}
a.heading-title {
  font-size: 2rem;
  margin-left: 1rem;
}
</style>

<script>
import ChangeParam from "@/components/settings/ChangeParam";

export default {
  name: "Settings",
  components: {
    ChangeParam
  },
  data: function() {
    return {
      town: "",
      d: null,
      l: null,
      globalC: null,
      localeC: null,
      pendingC: null,
      deviceC: null,
      test: null
    };
  },
  updated: function() {},
  beforeUpdate: function() {},
  created() {},
  mounted: function() {
    this.refresh();
  },
  methods: {
    makeToast(variant, title, content) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true
      });
    },
    refresh: function() {
      this.d = this.$route.query["d"];
      this.l = this.$route.query["l"];
      if (this.d != null) {
        // check relation
        this.$store.dispatch("relation/get", { device: this.d }).then(r => {
          if (r.status == 200) {
            this.town = r.data.info;
            // retrieve location of the device
            this.test = r.data.user.postcode;
          } else {
            // device has no town
            this.town = null;
          }
          this.$store.dispatch("confs/get", { device: this.d }).then(res => {
            if (res.status == 200) {
              this.globalC = res.data.global;
              this.localeC = res.data.location;
              this.pendingC = res.data.pendingConf;
              this.recalculePending();
              this.deviceC = res.data.deviceConf;
            } else {
              this.$parent.makeToast("danger", "Error " + res.status, res.data);
            }
          });
        });
      } else if (this.l != null) {
        this.$store.dispatch("confs/get", { device: this.l }).then(res => {
          this.$store
            .dispatch("provinces/get", { postalcode: this.l })
            .then(r => {
              if (r.status == 200) {
                this.town = r.data.name;
                this.test = r.data.postcode;
              }
            });
          if (res.status == 200) {
            this.globalC = res.data.global;
            this.localeC = res.data.deviceConf;
          } else {
            this.$parent.makeToast("danger", "Error " + res.status, res.data);
          }
        });
      } else {
        this.$store.dispatch("confs/get", { device: "GLOBAL" }).then(res => {
          if (res.status == 200) {
            this.test = res.data;
            this.globalC = res.data.global;
          } else {
            this.$parent.makeToast("danger", "Error " + res.status, res.data);
          }
        });
      }
    },
    recalculePending() {
      var p = this.pendingC;
      if (p != null) {
        try {
          if (p.timestamp < this.globalC.timestamp) {
            p = this.globalC;
          }
        } catch (e) {
          console.log(this.globalC);
        }
        try {
          if (p.timestamp < this.localeC.timestamp) {
            p = this.localeC;
          }
        } catch (e) {
          console.log(this.localeC);
        }
      }
      this.pendingC = p;
    }
  }
};
</script>