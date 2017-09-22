<template>
  <section class='popup'>
    <div class="popup-body">
      <table>
        <tbody>
          <tr v-for="t in test">
             <td> {{t.name}} </td>
             <td>  {{t.created}} </td>
             <td> {{t.numSession}} times  </td>
          </tr>
        </tbody>
      </table>
    </div>

  </section>
</template>

<script>
export default {
  name: 'PeopleTable',
  data () {
    return {
      test: [
        {
          name: 'Test Name',
          created: '10 days ago',
          job: 'Gilgamesh',
          mutualFriends: 10,
          numSession: 11
        },
        {
          name: 'Some other test',
          created: '2 weeks ago',
          job: 'Something else',
          mutualFriends: 10
        },
        {
          name: 'Test Name',
          created: '10 days ago',
          job: 'Gilgamesh',
          mutualFriends: 10,
          numSession: 11
        },
        {
          name: 'Some other test',
          created: '2 weeks ago',
          job: 'Something else',
          mutualFriends: 10
        },
        {
          name: 'Test Name',
          created: '10 days ago',
          job: 'Gilgamesh',
          mutualFriends: 10,
          numSession: 11
        },
        {
          name: 'Some other test',
          created: '2 weeks ago',
          job: 'Something else',
          mutualFriends: 10
        },
        {
          name: 'Test Name',
          created: '10 days ago',
          job: 'Gilgamesh',
          mutualFriends: 10,
          numSession: 11
        },
        {
          name: 'Some other test',
          created: '2 weeks ago',
          job: 'Something else',
          mutualFriends: 10
        }
      ]
    }
  }
}
</script>

<style lang="scss">
$striped-rows: true;
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
