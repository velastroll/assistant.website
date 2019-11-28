<template>
    <div 
    class="body-nav"
    style=" width: 100%; min-height: 100%; padding: 0 0 0 0; margin: 0 0 0 0;">
        <b-col align-v="center" style="width: 100%">
            <b-row style=" width: 100%; text-align: center; margin: 0 0 0 0;" class="justify-content-center" > 
                <div 
                    class="icontainer"
                    @click='redirect("/")'
                >
                    <i class="material-icons icon-nav" :style="isActive('/')"> record_voice_over </i>
                </div>
            
                <div 
                    class="icontainer"
                    @click='redirect("/users")'
                >
                    <i class="material-icons icon-nav" :style="isActive('/users')"> wc </i>
                </div>
                    
                <div 
                    class="icontainer"
                    @click='redirect("/provinces")'
                > 
                    <i class="material-icons icon-nav" :style="isActive('/provinces')"> home_work </i>
                </div>
                <div 
                    class="icontainer"
                    @click='redirect("/maps")'
                > 
                    <i class="material-icons icon-nav" :style="isActive('/maps')"> map </i>
                </div>
                <div 
                    class="icontainer"
                    @click='redirect("/settings")'
                > 
                    <i class="material-icons icon-nav" :style="isActive('/settings')"> settings </i>
                </div>
            </b-row>
        </b-col>
    </div>
</template>

<style>

br.margin-big-screen{
    display: none;
}
@media only screen and (min-width: 650px){
    br.margin-big-screen{
        display: inline;
    }
}

div.icontainer{
    font-size: 2rem;
    margin-left: 1rem;
    margin-right: 1rem;
}

.body-nav{
    background-color: #2c3e50;
}
.icon-nav{
    color: #ff1a8d80;
    font-size: 1.5rem;
    width: 100%
}

hr.nav{
    border-top: 1px solid #ff1a8d80;
    margin-top: 10px;
    margin-bottom: 10px;
}

.icon-nav:hover{
    color: #ff1a8c;
    cursor: pointer;
}

</style>

<script>
export default {
  name: "Nav",
  methods: {
    /* eslint-disable */
    redirect(url) {
      this.$parent.redirect(url)
    },
    isActive(fragment){
      if (this.$route.path == fragment || 
      (this.$route.path == '/stats' && fragment == '/users')) {
        return ' color: #ff1a8c; '
      }
    }
  }
};
</script>