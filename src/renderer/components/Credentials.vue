<template>
  <section>
    <div class="field">
      <p class="control has-icons-left has-icons-right">
        <input v-model="userNameModel" class="input" type="username" placeholder="Username">
        <span class="icon is-small is-left">
          <i class="fa fa-envelope"></i>
        </span>
        <span class="icon is-small is-right">
          <i class="fa fa-check"></i>
        </span>
      </p>
    </div>
    <div class="field">
      <p class="control has-icons-left">
        <input v-model="passwordModel" class="input" type="password" placeholder="Password">
        <span class="icon is-small is-left">
          <i class="fa fa-lock"></i>
        </span>
      </p>
    </div>
    <div class="field">
      <p class="control">
        <button @click="save()" class="button is-success">
          Save Credentials
        </button>
      </p>
    </div>
    <div class="field">
      <p class="control">
        <button @click="del()" class="button is-danger">
          Delete Credentials
        </button>
      </p>
    </div>
    <div class="field">
      <p class="control">
        <button @click="() => {this.$router.push({path: 'main'})}" class="button is-success">
          Go Back
        </button>
      </p>
    </div>
  </section>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import keytar from 'keytar'
  import { mapGetters } from 'vuex'
  export default {
    name: 'landing-page',
    components: { SystemInformation },
    created () {
      this.userNameModel = this.username()
    },
    data () {
      return {
        serviceName: 'pymkinspector',
        userNameModel: '',
        passwordModel: '',
        err: false,
        keytar: keytar
      }
    },
    methods: {
      save () {
        if (this.userNameModel.length > 0 && this.passwordModel.length > 0) {
          this.keytar.setPassword(this.serviceName, this.userNameModel, this.passwordModel)
          this.err = false
          this.$storage
            .set(`${this.serviceName}.json`, {username: this.userNameModel})
            .then((d) => {
              this.setCredentials(d.username)
              console.log('username stored')
            })
            .catch((err) => { console.log(`Err: username not stored ${err}`) })
          this.userNameModel = ''
          this.passwordModel = ''
        } else {
          this.err = true
        }
      },
      del () {
        this.keytar.deletePassword(this.serviceName, this.username).then((x) => {
          console.log(x)
        })
        this.$storage
          .set(`${this.serviceName}.json`, {username: ''})
          .then((d) => { console.log('credentials cleared') })
          .catch((err) => { console.log(`Err: credentials not deleted ${err}`) })
      },
      goBack () {
        this.$route.push('landing-page')
      },
      ...mapGetters([
        'username'
      ])
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  /** {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }*/
/*
  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }*/

 /* #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }*/

 /* main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }*/
</style>
