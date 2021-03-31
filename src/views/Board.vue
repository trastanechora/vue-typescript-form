<template>
  <v-layout wrap class="full-width">
    <v-flex xs3 class="mb-4">
      <v-list two-line>
        <template v-for="(item, index) in items">
          <v-subheader v-if="item.header" :key="item.header" inset>
            {{ item.header }}
          </v-subheader>

          <v-divider v-else-if="item.divider" :key="index" inset></v-divider>

          <v-list-item v-else :key="item.title" ripple>
            <v-list-item-avatar>
              <img :src="item.avatar" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-html="item.title"></v-list-item-title>
              <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-flex>
    <v-flex xs9>
      <!-- BOARDS CONTENT GOES HERE -->
    </v-flex>
    <DialogConfirmation :dialog="dialog" :close-dialog="closeDeleteDialog" />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form, FormStatus } from '@/@types';
import { dateFormatter, statusFormatter } from '@/@utils';
import AppBar from '@/components/AppBar.vue';
import DialogConfirmation from '@/components/DialogConfirmation.vue';

@Component({
  components: { AppBar, DialogConfirmation }
})
export default class DashboardPage extends Vue {
  /* ------------------------------------
  => Local State Declaration
  ------------------------------------ */
  dialog: boolean = false;
  items: any = [
    {
      header: 'Today'
    },
    { divider: true },
    {
      avatar: 'https://picsum.photos/250/300?image=660',
      title: 'Meeting @ Noon',
      subtitle: `<span class="font-weight-bold">Spike Lee</span> &mdash; I'll be in your neighborhood`
    },
    {
      avatar: 'https://picsum.photos/250/300?image=821',
      title: 'Summer BBQ <span class="grey--text text--lighten-1"></span>',
      subtitle: '<span class="font-weight-bold">to Operations support</span> &mdash; Wish I could come.'
    },
    {
      avatar: 'https://picsum.photos/250/300?image=783',
      title: 'Yes yes',
      subtitle: '<span class="font-weight-bold">Bella</span> &mdash; Do you have Paris recommendations'
    },
    {
      header: 'Yesterday'
    },
    { divider: true },
    {
      avatar: 'https://picsum.photos/250/300?image=1006',
      title: 'Dinner tonight?',
      subtitle: '<span class="font-weight-bold">LaToya</span> &mdash; Do you want to hang out?'
    },
    {
      avatar: 'https://picsum.photos/250/300?image=146',
      title: 'So long',
      subtitle: '<span class="font-weight-bold">Nancy</span> &mdash; Do you see what time it is?'
    },
    {
      header: 'Last Week'
    },
    { divider: true },
    {
      avatar: 'https://picsum.photos/250/300?image=1008',
      title: 'Breakfast?',
      subtitle: '<span class="font-weight-bold">LaToya</span> &mdash; Do you want to hang out?'
    },
    {
      avatar: 'https://picsum.photos/250/300?image=839',
      title: 'Winter Porridge <span class="grey--text text--lighten-1"></span>',
      subtitle: '<span class="font-weight-bold">cc: Daniel</span> &mdash; Tell me more...'
    },
    {
      avatar: 'https://picsum.photos/250/300?image=145',
      title: 'Oui oui',
      subtitle: '<span class="font-weight-bold">Nancy</span> &mdash; Do you see what time it is?'
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
  formatDate(dateIsoString: string): string {
    const parsedDate = new Date(dateIsoString);
    return dateFormatter(parsedDate);
  }
  statusTextFormatter(status: FormStatus): string {
    return statusFormatter(status).text;
  }
  statusColorFormatter(status: FormStatus): string {
    return statusFormatter(status).color;
  }
  statusIconFormatter(status: FormStatus): string {
    return statusFormatter(status).icon;
  }
  checkDueDate(date: string): boolean {
    const dueDate = new Date(date);
    const today = new Date();
    return today > dueDate;
  }
  copyToClipboard(text: string): void {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    this.$store.dispatch('ui/showSnackbar', {
      open: true,
      message: 'Link telah berhasil disalin!',
      color: 'dark',
      timeout: 4000
    });
  }
  toResponseList(uuid: string): void {
    this.$router.push(`/dashboard/${uuid}`);
  }
  async addForm(): Promise<void> {
    await this.$store.dispatch('form/updateEditState', false);
    this.$router.push('/dashboard/form');
  }
  async editForm(item: Form): Promise<void> {
    await this.$store.dispatch('form/updateEditState', true);
    await this.$store.dispatch('form/updateSelectedForm', item);
    this.$router.push('/dashboard/form');
  }
  async showDeleteDialog(item: Form): Promise<void> {
    await this.$store.dispatch('form/updateSelectedForm', item);
    this.dialog = true;
  }
  closeDeleteDialog(): void {
    this.dialog = false;
  }
}
</script>

<style lang="stylus" scoped>
.v-btn {
  letter-spacing: normal;
  text-transform: none;
}
</style>
