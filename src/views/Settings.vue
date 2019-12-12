<template>
  <div class="main-panel">
    <!-- global -->
    <div class="heading-card">
      <div class="pointer" v-b-toggle.accordion-1>
        <a class="material-icons">vpn_lock</a>
        <a class="heading-title">Global parking</a>
      </div>
      <div>
        <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
          <ChangeParam scope="GLOBAL" :conf="globalC"/>
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
          <ChangeParam scope="location"  :conf="localeC" :town="town" />
        </b-collapse>
      </div>
    </div>
    <!-- device -->
    <div class="heading-card" v-if="d">
      <div class="pointer" v-b-toggle.accordion-3>
        <a class="material-icons">directions_bike</a>
        <a class="heading-title">Device {{d}}</a>
      </div>
      <div>
        <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
          <ChangeParam scope="device" :conf="deviceC" :pend="pendingC" />
        </b-collapse>
      </div>
    </div>
  </div>
</template>

<style>
div.pointer {
  cursor: pointer
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
div.heading-card:hover{
  background-color:rgb(250, 250, 250);
}
a.heading-title{
  font-size: 2rem; 
  margin-left: 1rem;
}
</style>

<script>
import ChangeParam from "@/components/settings/ChangeParam";
export default {
  name: "Param",
  components: {
    ChangeParam
  },
  data: function() {
    return {
      town: '',
      d: null,
      l: null,
      globalC : null,
      localeC : null,
      pendingC : null,
      deviceC : null
    };
  },
  updated: function() {},
  beforeUpdate: function() {},
  created() {},
  mounted: function() {
      console.log(this.$route.query)
      this.d = this.$route.query["d"];
      this.l = this.$route.query["l"] ;
      if (this.d != null){
        // check relation
        this.$store.dispatch("relation/get", {device: this.d}).then(r => {
            if (r.status == 200){
                this.town = r.data.info
            } else {
                this.town = null
            }
            this.$store.dispatch("confs/get", {device : this.d}).then( res => 
            {
                if (res.status == 200) {
                    this.globalC = res.data.global
                    this.localeC = res.data.location
                    this.pendingC = res.data.pendingConf
                    this.deviceC = res.data.deviceConf
                } else {
                    this.$parent.makeToast("danger", "Error "+res.status, res.data)
                }
            })
        })
        console.log("1")
      } else if (this.l != null){
          this.$store.dispatch("confs/get", {device : this.l}).then( res => {
              this.$store.dispatch("provinces/get", {postalcode: this.l}).then(r=>{
                  if (r.status == 200){
                      this.town = r.data.name
                      console.log(r.data.name)
                      console.log(this.town)
                  }
              })
              if (res.status == 200) {
                  this.globalC = res.data.global
                  this.localeC = res.data.deviceConf
            }else {
                this.$parent.makeToast("danger", "Error "+res.status, res.data)
            }
        })
        console.log("2")
      } else {
          this.$store.dispatch("confs/get", {device : 'GLOBAL'}).then( res => {
              if (res.status == 200) {
                  this.globalC = res.data.global
            }else {
                this.$parent.makeToast("danger", "Error "+res.status, res.data)
            }
        console.log("3")
        })

      }

  },
  methods: {
    makeToast(variant, title, content){
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true
      });
    },
    refresh(){
      // try to retrieve device identifier, then retrieve d+l+g config
      // else retrieve global configuration
    }
  }
};
</script>