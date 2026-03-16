<template>
  <v-app style="background:#F8F3F0">

    <!-- HEADER -->
    <v-sheet dark color="brown darken-3" class="py-6">
      <v-container>
        <v-row align="center" no-gutters>
          <v-avatar color="brown darken-1" size="46" class="mr-4" style="border:2px solid rgba(255,255,255,0.2)">
            <v-icon color="white" size="22">mdi-chat</v-icon>
          </v-avatar>
          <div>
            <div class="text-h5 font-weight-black white--text" style="font-family:'Georgia',serif">Messages</div>
            <div class="body-2 mt-1" style="color:rgba(255,255,255,0.6)">Chat with artists about their work</div>
          </div>
        </v-row>
      </v-container>
    </v-sheet>

    <v-container class="py-6" style="max-width:1100px">
      <v-card flat style="border-radius:16px;border:1.5px solid #F0E8E4;overflow:hidden">
        <chat-panel :is-artist="false" ref="panel" />
      </v-card>
    </v-container>

  </v-app>
</template>

<script>
import ChatPanel from '@/components/ui/ChatPanel.vue'

export default {
  name: 'ChatView',
  components: { ChatPanel },
}
</script>