<template>
  <v-layout id="board" wrap>
    <v-flex xs12>
      <v-card flat>
        <v-toolbar class="elevation-0" dense>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
          <v-toolbar-title>Judul Board</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
    </v-flex>
    <v-flex xs12 class="board-container mt-2">
      <draggable
        v-model="boards"
        group="boards"
        tag="div"
        class="full-height no-wrap"
        draggable=".item"
        ghost-class="ghost"
      >
        <div v-for="list in boards" :key="list.id" class="list-container item">
          <v-card class="ma-0 px-2 py-3" color="tone" flat>
            <v-flex xs12 class="px-1">
              <strong>{{ list.title }}</strong>
            </v-flex>
            <v-flex xs12>
              <draggable v-model="list.cards" group="cards" tag="div" draggable=".cardItem" ghost-class="ghost">
                <v-card v-for="card in list.cards" :key="card.id" class="mb-2 cardItem">
                  <v-card-title class="pb-0">
                    {{ card.title }}
                  </v-card-title>
                  <v-card-actions>
                    <v-btn text>
                      Edit
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </draggable>
            </v-flex>
            <v-flex xs12 class="mt-1"
              ><v-btn block depressed text><v-icon small>mdi-plus</v-icon>Tambahkan Kartu</v-btn></v-flex
            >
          </v-card>
        </div>
        <div class="list-container">
          <v-btn block depressed><v-icon small>mdi-plus</v-icon>Tambahkan List</v-btn>
        </div>
      </draggable>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import draggable from 'vuedraggable';

@Component({
  components: {
    draggable
  }
})
export default class ProjectPage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  boards: any = [
    {
      id: 1,
      title: 'Judul List 1',
      cards: []
    },
    {
      id: 2,
      title: 'Judul List 2',
      cards: [
        {
          id: 1,
          title: 'Test Card 1'
        }
      ]
    },
    {
      id: 3,
      title: 'Judul List 3',
      cards: [
        {
          id: 2,
          title: 'Test Card 2'
        },
        {
          id: 3,
          title: 'Test Card 3'
        }
      ]
    }
  ];

  /* ------------------------------------
  => Setter and Getter
  ** (Adopt store variables to local state)
  ------------------------------------ */
  get isLoading(): boolean {
    return this.$store.state.project.isLoading;
  }

  /* ------------------------------------
  => Mounted (Lifecycle)
  ------------------------------------ */
  mounted(): void {
    // this.$store.dispatch('form/getForms');
  }

  /* ------------------------------------
  => Methods
  ------------------------------------ */
}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
  font-weight: 400;
}
.full-height {
  height: 100%;
}
.no-wrap {
  white-space: nowrap;
  overflow-x: scroll;
}
#board {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;
}
.board-container {
  height: 100%;
}
.list-container:first-child {
  margin-left: 8px;
}
.list-container {
  width: 272px;
  margin: 0 4px;
  height: 100%;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
}
.list {
  background-color: #ebecf0;
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  position: relative;
  white-space: normal;
}
.headline {
  font-size: 1rem!important;
}
.ghost {
  opacity: 0.2;
  background: var(--v-primary-base);
}
.list-background {
  background-color: var(--v-primary-base);
}
.test {
  background-color: #ebecf0;
}
</style>
