<template>
    <div 
    class="body-nav"
    style=" width: 100%; height: 100%; padding: 0 0 0 0; margin: 0 0 0 0;">
        <b-col align-v="center" style=" width: 100%">
            <br>
            <b-row style=" width: 100%; text-align: center; margin: 0 0 0 0;" class="justify-content-center" > 
                
                <b-col 
                    cols="12" style="max-width: 65px;min-width: 65px;"
                    @click='redirect("/")'
                >
                    <i class="material-icons icon-nav"> record_voice_over </i>
                </b-col>
            
                <b-col 
                    cols="12" style="max-width: 65px;min-width: 65px;"
                    @click='redirect("/users")'
                >
                    <i class="material-icons icon-nav"> wc </i>
                </b-col>
                    
                <b-col cols="12" style="max-width: 65px; min-width: 65px;"> 
                    <i class="material-icons icon-nav"> home_work </i>
                </b-col>
            </b-row>
        </b-col>
    </div>
</template>

<style>
.body-nav{
    background-color: #2c3e50;
}
.icon-nav{
    color: #ff1a8c;
    font-size: 2em;
    width: 100%
}

hr.nav{
    border-top: 1px solid #ff1a8c;
    margin-top: 10px;
    margin-bottom: 10px;
}

.icon-nav:hover{
    color: #ffb3ff;
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
    }
  }
};
</script>