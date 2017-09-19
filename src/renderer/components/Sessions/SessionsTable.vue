<template>
  <section class='popup'>
    <div class="popup-body">
      <div class="row" v-for="t in test">
        {{t.timestamp}}. {{t.totalPymk}} total and  {{t.numNew}} new people.
      </div>
    </div>

  </section>
</template>

<script>
export default {

  name: 'SessionsTable',
  data () {
    return {
      test: [
        {
          timestamp: '3rd of March',
          totalPymk: 127,
          numNew: 20
        },
        {
          timestamp: '3rd of March',
          totalPymk: 17,
          numNew: 220
        },
        {
          timestamp: '3rd of March',
          totalPymk: 127,
          numNew: 202
        },
        {
          timestamp: '3rd of March',
          totalPymk: 127,
          numNew: 0
        },
        {
          timestamp: '3rd of March',
          totalPymk: 127,
          numNew: 202
        },
        {
          timestamp: '3rd of March',
          totalPymk: 127,
          numNew: 0
        },
        {
          timestamp: '3rd of March',
          totalPymk: 127,
          numNew: 202
        },
        {
          timestamp: '3rd of March',
          totalPymk: 127,
          numNew: 0
        },
        {
          timestamp: '3rd of March',
          totalPymk: 127,
          numNew: 202
        },
        {
          timestamp: '3rd of March',
          totalPymk: 127,
          numNew: 0
        },
        {
          timestamp: '3rd of March',
          totalPymk: 127,
          numNew: 0
        },
        {
          timestamp: '3rd of March',
          totalPymk: 127,
          numNew: 202
        },
        {
          timestamp: '3rd of March',
          totalPymk: 127,
          numNew: 0
        },
        {
          timestamp: '3rd of March',
          totalPymk: 127,
          numNew: 0
        }
      ]
    }
  }
}
</script>

<style lang="scss">

.row {
  overflow-y: scroll;
  font-size: 16px
}
/* https://jsfiddle.net/r7ztu8oL/3/ */
.popup {
  background-color: #fff;
  border: 1px solid #ccc;
  position: fixed;
  top: 50%;
  left: 0;
  margin-left: 5%;
  width: 90%;
  max-height: 60%;
}

.popup-body {
  // margin-top: 40px;
  overflow-y: auto;
  height: 200px;
  display: block;
}

</style>
