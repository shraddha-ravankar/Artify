<template>
  <v-row style="min-height:580px" no-gutters>

    <!-- LEFT: Conversation list -->
    <v-col cols="12" md="4" style="border-right:1px solid #F0E8E4">

      <div class="pa-3" style="border-bottom:1px solid #F0E8E4">
        <v-text-field
          v-model="search"
          dense outlined hide-details
          placeholder="Search conversations…"
          prepend-inner-icon="mdi-magnify"
          color="brown darken-2"
          background-color="white"
        />
      </div>

      <v-row v-if="chatsLoading" justify="center" class="py-8">
        <v-progress-circular indeterminate color="brown darken-1" size="28"/>
      </v-row>

      <div v-else-if="filteredChats.length === 0" class="text-center pa-8">
        <v-icon size="44" color="brown lighten-4">mdi-chat-outline</v-icon>
        <div class="body-2 mt-3" style="color:#A1887F">No conversations yet</div>
        <div class="caption mt-1" style="color:#BCAAA4">
          {{ isArtist ? 'Users will message you about your artworks' : 'Go to an artwork and message the artist' }}
        </div>
      </div>

      <v-list v-else class="pa-0" style="overflow-y:auto;max-height:520px">
        <v-list-item
          v-for="chat in filteredChats"
          :key="chat._id"
          @click="selectChat(chat)"
          style="border-bottom:1px solid #FAF5F2;cursor:pointer;padding:12px 16px;align-items:flex-start"
          :style="selectedChat && selectedChat._id === chat._id
            ? 'background:#FFF0EB;border-left:3px solid #5D4037'
            : 'border-left:3px solid transparent'"
        >
          <v-list-item-avatar size="40" color="brown darken-1" class="mt-1 mr-3" style="flex-shrink:0">
            <span class="white--text font-weight-bold body-2">
              {{ getOtherName(chat)[0] ? getOtherName(chat)[0].toUpperCase() : '?' }}
            </span>
          </v-list-item-avatar>

          <v-list-item-content style="overflow:hidden;padding:0">
            <v-row no-gutters align="center" justify="space-between">
              <span class="font-weight-bold" style="color:#2C1810;font-size:0.875rem">
                {{ getOtherName(chat) }}
              </span>
              <span class="caption" style="color:#BCAAA4;flex-shrink:0">{{ timeAgo(chat.createdAt) }}</span>
            </v-row>
            <div class="caption mt-1" style="color:#8D6E63;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              <v-icon x-small class="mr-1">mdi-image-outline</v-icon>
              {{ chat.artwork && chat.artwork.title || 'Artwork' }}
            </div>
            <div class="caption mt-1" style="color:#BCAAA4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              {{ chat.message }}
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-col>

    <!-- RIGHT: Conversation -->
    <v-col cols="12" md="8" style="display:flex;flex-direction:column">

      <!-- No chat selected -->
      <div v-if="!selectedChat"
        class="d-flex flex-column align-center justify-center"
        style="flex:1;min-height:500px">
        <v-avatar size="80" color="brown lighten-5" class="mb-4">
          <v-icon size="40" color="brown lighten-3">mdi-chat-processing-outline</v-icon>
        </v-avatar>
        <div class="font-weight-black" style="font-family:'Georgia',serif;font-size:1.2rem;color:#5D4037">
          Select a conversation
        </div>
        <div class="body-2 mt-2" style="color:#A1887F">Pick a chat from the left to start</div>
      </div>

      <template v-else>

        <!-- Header -->
        <div class="pa-4" style="border-bottom:1px solid #F0E8E4;background:white;flex-shrink:0">
          <v-row align="center" no-gutters>
            <div v-if="selectedChat.artwork && selectedChat.artwork.image"
              style="width:40px;height:40px;border-radius:8px;overflow:hidden;border:1.5px solid #EDE0DA;flex-shrink:0;margin-right:12px">
              <img :src="selectedChat.artwork.image"
                style="width:40px;height:40px;object-fit:cover;display:block"/>
            </div>
            <div>
              <div class="font-weight-black" style="color:#2C1810;font-size:0.95rem">
                {{ getOtherName(selectedChat) }}
              </div>
              <div class="caption" style="color:#A1887F">
                <v-icon x-small>mdi-image-outline</v-icon>
                {{ selectedChat.artwork && selectedChat.artwork.title }}
              </div>
            </div>
          </v-row>
        </div>

        <!-- Error -->
        <v-alert v-if="sendError" dense text type="error" color="red darken-2" class="ma-3 caption">
          {{ sendError }}
        </v-alert>

        <!-- Messages -->
        <div
          ref="msgBox"
          style="flex:1;overflow-y:auto;padding:16px;background:#FDFAF8;min-height:300px;max-height:400px"
        >
          <v-row v-if="msgsLoading" justify="center" class="py-6">
            <v-progress-circular indeterminate color="brown darken-1" size="28"/>
          </v-row>

          <div v-else-if="messages.length === 0" class="text-center py-10">
            <v-icon size="36" color="brown lighten-4">mdi-chat-outline</v-icon>
            <div class="caption mt-2" style="color:#A1887F">No messages yet — say hello!</div>
          </div>

          <div
            v-else
            v-for="msg in messages"
            :key="msg._id"
            class="mb-3"
            :class="isMine(msg) ? 'd-flex justify-end' : 'd-flex justify-start'"
          >
            <v-avatar v-if="!isMine(msg)" size="28" color="brown lighten-3"
              class="mr-2 align-self-end" style="flex-shrink:0">
              <span class="white--text" style="font-size:0.65rem;font-weight:700">
                {{ msg.sender && msg.sender.name ? msg.sender.name[0].toUpperCase() : '?' }}
              </span>
            </v-avatar>

            <div style="max-width:72%">
              <div class="pa-3"
                style="border-radius:16px;font-size:0.875rem;line-height:1.55;word-break:break-word"
                :style="isMine(msg)
                  ? 'background:linear-gradient(135deg,#5D4037,#795548);color:white;border-bottom-right-radius:4px'
                  : 'background:white;color:#2C1810;border:1.5px solid #F0E8E4;border-bottom-left-radius:4px'">
                {{ msg.message }}
              </div>
              <div class="caption mt-1"
                :class="isMine(msg) ? 'text-right' : 'text-left'"
                style="color:#BCAAA4;font-size:0.68rem">
                {{ msg.sender && msg.sender.name }} · {{ formatTime(msg.createdAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="pa-3" style="border-top:1px solid #F0E8E4;background:white;flex-shrink:0">
          <v-row no-gutters align="center" style="gap:8px">
            <v-text-field
              v-model="newMsg"
              dense outlined hide-details
              placeholder="Type a message…"
              background-color="white"
              color="brown darken-2"
              class="flex-grow-1"
              @keyup.enter="send"
            />
            <v-btn depressed fab small color="brown darken-1" dark
              :loading="sending"
              :disabled="!newMsg.trim()"
              @click="send">
              <v-icon size="18">mdi-send</v-icon>
            </v-btn>
          </v-row>
        </div>

      </template>
    </v-col>

  </v-row>
</template>

<script>
import chatService from '@/services/chatService'

export default {
  name: 'ChatPanel',

  props: {
    isArtist: { type: Boolean, default: false },
  },

  data: function() {
    return {
      chats:        [],
      chatsLoading: true,
      search:       '',
      selectedChat: null,
      messages:     [],
      msgsLoading:  false,
      newMsg:       '',
      sending:      false,
      sendError:    '',
    }
  },

  computed: {
    currentUser: function() {
      return this.$store.getters['auth/currentUser']
    },
    myId: function() {
      var u = this.currentUser
      if (!u) return ''
      return String(u._id || u.id || '')
    },
    filteredChats: function() {
      var q    = this.search.trim().toLowerCase()
      var self = this
      if (!q) return this.chats
      return this.chats.filter(function(c) {
        var name  = self.getOtherName(c).toLowerCase()
        var title = c.artwork && c.artwork.title ? c.artwork.title.toLowerCase() : ''
        return name.indexOf(q) !== -1 || title.indexOf(q) !== -1
      })
    },
  },

  created: function() {
    this.loadChats()
  },

  methods: {

    loadChats: function() {
      var self = this
      self.chatsLoading = true
      chatService.getChats()
        .then(function(res) {
          self.chats = res.data || []
        })
        .catch(function() {})
        .finally(function() { self.chatsLoading = false })
    },

    selectChat: function(chat) {
      var self = this
      self.selectedChat = chat
      self.messages     = []
      self.sendError    = ''
      self.msgsLoading  = true

      var otherId   = self.getOtherId(chat)
      var artworkId = chat.artwork && (chat.artwork._id || chat.artwork)

      if (!otherId || !artworkId) {
        self.msgsLoading = false
        return
      }

      chatService.getConversation(artworkId, otherId)
        .then(function(res) {
          self.messages = res.data || []
          self.$nextTick(function() { self.scrollBottom() })
        })
        .catch(function() {})
        .finally(function() { self.msgsLoading = false })
    },

    send: function() {
      var self = this
      var text = self.newMsg.trim()
      if (!text || !self.selectedChat) return

      self.sending   = true
      self.sendError = ''

      var otherId   = self.getOtherId(self.selectedChat)
      var artworkId = self.selectedChat.artwork && (self.selectedChat.artwork._id || self.selectedChat.artwork)

      if (!otherId || !artworkId) {
        self.sendError = 'Cannot identify conversation. Please reload.'
        self.sending   = false
        return
      }

      var payload = {
        artworkId:  artworkId,
        message:    text,
        receiverId: otherId,
      }

      chatService.sendMessage(payload)
        .then(function(res) {
          self.messages.push(res.data.data)
          self.newMsg = ''
          self.$nextTick(function() { self.scrollBottom() })
          self.loadChats()
        })
        .catch(function(err) {
          var msg = err.response && err.response.data
            && (err.response.data.message || err.response.data.error)
          self.sendError = msg || 'Failed to send message. Please try again.'
        })
        .finally(function() { self.sending = false })
    },

    // Extract the OTHER person's ID from a chat message doc
    getOtherId: function(chat) {
      if (!chat || !chat.sender || !chat.receiver) return ''
      var senderId   = String(chat.sender._id   || chat.sender.id   || chat.sender   || '')
      var receiverId = String(chat.receiver._id || chat.receiver.id || chat.receiver || '')
      var me = this.myId
      if (!me) return ''
      // Return whichever is NOT me
      return senderId === me ? receiverId : senderId
    },

    // Extract the OTHER person's name from a chat message doc
    getOtherName: function(chat) {
      if (!chat || !chat.sender || !chat.receiver) return 'Unknown'
      var senderId = String(chat.sender._id || chat.sender.id || chat.sender || '')
      var me       = this.myId
      if (senderId === me) {
        return chat.receiver.name || 'Unknown'
      }
      return chat.sender.name || 'Unknown'
    },

    isMine: function(msg) {
      if (!msg || !msg.sender) return false
      var senderId = String(msg.sender._id || msg.sender.id || msg.sender || '')
      return senderId === this.myId
    },

    scrollBottom: function() {
      var box = this.$refs.msgBox
      if (box) box.scrollTop = box.scrollHeight
    },

    timeAgo: function(d) {
      if (!d) return ''
      var s = (Date.now() - new Date(d)) / 1000
      if (s < 60)    return 'just now'
      if (s < 3600)  return Math.floor(s / 60)   + 'm ago'
      if (s < 86400) return Math.floor(s / 3600)  + 'h ago'
      return Math.floor(s / 86400) + 'd ago'
    },

    formatTime: function(d) {
      if (!d) return ''
      return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    },
  },
}
</script>