<template>

<div id="k-circuit-search">

  <div id="k-input-search" class="k-input-wrap">
   <icon v-if="icon" icon="search"></icon>
   <input type="text" v-model="search" class="k-input" placeholder="Search for circuit" onshow="this.focus()" autofocus id="k-circuits-search-input">
  </div>

  <div id="search-result">
    <div class="item-search" :title="c.name" v-for="c in circuitsFiltered" @click="open_circuit(c)">
          <div class="item-content"><span>{{c.id}}</span></div>
          <div class="item-switch"><span>{{c.name}} </span><br /><b>Hops:</b> {{c.path | length}}</div>
          <div class="item-content"><b>Bandwidth:</b> {{c.bandwidth | humanize_bytes}}</div>
    </div>
  </div>

</div>
</template>
<style>
#search-result {
 -webkit-flex: 1 1 auto;
 overflow: auto;
 height: 85vh;
}
#k-circuit-search {
 color: #CCC;
 font-size: 0.9em;
 line-height: 1.2em;
}
#k-input-search {
 margin-bottom: 10px;
 width: 96%;
 font-size: 1.2em;
}

#k-input-search:hover *,
#k-input-search:hover {
 background: #111;
}

.item-search {
 clear: both;
 border-top: 1px solid #444;
 padding: 5px;
 margin-right: 10px;
 cursor: pointer;
}
.item-search:hover * {
 background: #111;
 color: #008690;
}
.item-content:hover {
 background: #111;
 color: #008690;
}

.item-switch span {
 font-weight: bold;
}
.item-content {
 color: #BBB;
 font-size: 0.9em;
}
</style>
<script>
import KytosBaseWithIcon from '../components/kytos/base/KytosBaseWithIcon';
import switchInfo from "../kytos/switchInfo.vue";
import * as d3 from 'd3';

export default {
  name: 'k-list-circuits',
  mixins: [KytosBaseWithIcon],
  props: ["content"],
  data () {
    return {
      search: '',
      circuits: [],
    }
  },
  filters: {
    length(items) {
      return Object.keys(items).length
    }
  },
  methods: {
    get_circuits () {
      var endpoint = "http://demo.kytos.io:8181/api/kytos/mef_eline/v1/circuits"
      var self = this
      d3.json(endpoint, function(error, result) {
        for (var key in result.circuits) {
          self.circuits.push(result.circuits[key])
        }
      })
    },
    open_switch (s) {
      var content = {"component": switchInfo,
                     "content": s,
                     "icon": "cog",
                     "title": "Switch Details",
                     "subtitle": s.connection}
      this.$kytos.eventBus.$emit("showInfoPanel", content)
    }
  },
  mounted () {
    this.get_circuits()
  },
  updated () {
    document.getElementById('k-circuits-search-input').focus()
  },
  computed: {
    circuitsFiltered() {
      self = this
      return this.circuits.filter(function(item) {
        var search = self.search.toLowerCase()
        return (item.name.toLowerCase().indexOf(search)>=0)
      })
    }
  }
}
</script>
