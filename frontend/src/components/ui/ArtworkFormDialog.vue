<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    max-width="640"
    persistent
    scrollable
  >
    <v-card style="background:#FFFAF8;border-radius:20px;overflow:hidden">

      <!-- HEADER -->
      <v-sheet dark color="brown darken-2" class="pa-6">
        <v-row align="center" justify="space-between" no-gutters>
          <v-row align="center" no-gutters class="flex-grow-1">
            <v-avatar
              size="42" color="brown darken-1" class="mr-4"
              style="border-radius:12px;border:1.5px solid rgba(255,255,255,0.2)"
            >
              <v-icon color="white" size="20">
                {{ isEdit ? 'mdi-pencil-outline' : 'mdi-image-plus' }}
              </v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-black white--text" style="font-family:'Georgia',serif;font-size:1.15rem;line-height:1.2">
                {{ isEdit ? 'Edit Artwork' : 'Upload Artwork' }}
              </div>
              <div class="caption mt-1" style="color:rgba(255,255,255,0.6)">
                {{ isEdit ? 'Update your artwork details' : 'Share your creation with the world' }}
              </div>
            </div>
          </v-row>
          <v-btn icon small :disabled="saving" @click="closeDialog"
            style="background:rgba(255,255,255,0.12);border:1.5px solid rgba(255,255,255,0.2)">
            <v-icon color="white" size="20">mdi-close</v-icon>
          </v-btn>
        </v-row>
      </v-sheet>

      <!-- BODY -->
      <v-card-text class="pa-0">
        <div class="pa-6" style="max-height:62vh;overflow-y:auto">

          <!-- Image upload zone -->
          <div
            class="d-flex align-center justify-center mb-2"
            style="cursor:pointer;overflow:hidden;transition:border-color 0.2s;border-radius:14px;min-height:180px;position:relative"
            :style="{
              border: previewUrl
                ? '2px solid #BCAAA4'
                : (dragging ? '2px dashed #8D6E63' : '2px dashed #D7CCC8'),
              background: dragging ? '#FFF0EB' : '#FFF5F2'
            }"
            @dragover.prevent="dragging=true"
            @dragleave.prevent="dragging=false"
            @drop.prevent="onDrop"
            @click="$refs.fileInput.click()"
          >
            <!-- Preview -->
            <img
              v-if="previewUrl"
              :src="previewUrl"
              style="width:100%;height:220px;object-fit:cover;display:block"
              alt="Preview"
            />

            <!-- Placeholder -->
            <div v-else class="text-center pa-6">
              <v-avatar size="64" color="brown lighten-5" class="mb-3">
                <v-icon size="32" color="brown lighten-2">mdi-cloud-upload-outline</v-icon>
              </v-avatar>
              <div class="body-2 mb-1" style="color:#6D4C41">
                Drop image here or
                <span class="font-weight-bold brown--text text--darken-2" style="text-decoration:underline">browse</span>
              </div>
              <div class="caption" style="color:#A1887F">JPG, PNG, WEBP · Max 10MB</div>
            </div>

            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              style="display:none"
              @change="onFileChange"
            />
          </div>

          <!-- Selected file name confirmation -->
          <div v-if="selectedFile" class="caption mb-1" style="color:#5D4037">
            <v-icon x-small color="green">mdi-check-circle</v-icon>
            {{ selectedFile.name }} ({{ (selectedFile.size / 1024).toFixed(0) }} KB) — ready to upload
          </div>

          <!-- Change image -->
          <v-btn
            v-if="previewUrl"
            x-small text color="brown darken-1"
            class="mb-2 font-weight-bold" style="letter-spacing:0"
            @click.stop="$refs.fileInput.click()"
          >
            <v-icon x-small left>mdi-camera-retake-outline</v-icon>Change image
          </v-btn>

          <!-- Image error -->
          <v-alert v-if="imageError" dense text type="error" color="red darken-2" class="mb-3 caption">
            {{ imageError }}
          </v-alert>

          <!-- TITLE -->
          <div class="caption font-weight-bold mb-1 mt-3" style="color:#5D4037;letter-spacing:0.06em;text-transform:uppercase">
            Title <span style="color:#EF5350">*</span>
          </div>
          <v-text-field
            v-model="form.title"
            outlined dense placeholder="e.g. Sunset Over the Peaks"
            background-color="white" color="brown darken-2"
            maxlength="100" hide-details="auto" class="mb-4"
            :error-messages="errors.title"
          />

          <!-- DESCRIPTION -->
          <div class="caption font-weight-bold mb-1" style="color:#5D4037;letter-spacing:0.06em;text-transform:uppercase">
            Description <span style="color:#EF5350">*</span>
          </div>
          <v-textarea
            v-model="form.description"
            outlined dense placeholder="Describe your artwork…"
            background-color="white" color="brown darken-2"
            rows="3" maxlength="1000" no-resize
            hide-details="auto" class="mb-4"
            :error-messages="errors.description"
          />

          <!-- PRICE + TYPE -->
          <v-row no-gutters style="gap:14px">
            <v-col style="flex:1;min-width:0">
              <div class="caption font-weight-bold mb-1" style="color:#5D4037;letter-spacing:0.06em;text-transform:uppercase">
                Price (₹) <span style="color:#EF5350">*</span>
              </div>
              <v-text-field
                v-model="form.price"
                outlined dense type="number" min="0" placeholder="0"
                background-color="white" color="brown darken-2" prefix="₹"
                hide-details="auto" class="mb-4"
                :error-messages="errors.price"
              />
            </v-col>
            <v-col style="flex:1;min-width:0">
              <div class="caption font-weight-bold mb-1" style="color:#5D4037;letter-spacing:0.06em;text-transform:uppercase">
                Type
              </div>
              <v-select
                v-model="form.type"
                outlined dense placeholder="Select type"
                background-color="white" color="brown darken-2"
                hide-details class="mb-4" :items="typeOptions"
              />
            </v-col>
          </v-row>

          <!-- FEATURED -->
          <v-card flat outlined style="border-radius:12px;border:1.5px solid #EDE0DA;background:#FFF5F2">
            <v-card-text class="pa-4">
              <v-row align="center" justify="space-between" no-gutters>
                <v-row align="center" no-gutters>
                  <v-icon size="18" color="brown lighten-1" class="mr-2">mdi-star-outline</v-icon>
                  <div>
                    <div class="body-2 font-weight-bold" style="color:#4A2C24">Mark as Featured</div>
                    <div class="caption" style="color:#A1887F">Featured artworks appear on the homepage</div>
                  </div>
                </v-row>
                <v-switch v-model="form.isFeatured" color="brown darken-2" hide-details inset dense class="mt-0 pt-0" />
              </v-row>
            </v-card-text>
          </v-card>

          <!-- API error -->
          <v-alert v-if="apiError" type="error" dense text color="red darken-3" class="mt-4 body-2">
            {{ apiError }}
          </v-alert>

        </div>
      </v-card-text>

      <!-- FOOTER -->
      <v-divider style="border-color:#EDE0DA" />
      <v-card-actions class="pa-5" style="background:#FFF8F5;justify-content:flex-end;gap:10px">
        <v-btn outlined rounded color="brown darken-1" class="font-weight-bold" style="letter-spacing:0" :disabled="saving" @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn depressed rounded dark color="brown darken-1" class="font-weight-bold" style="letter-spacing:0" :loading="saving" :disabled="saving" @click="submit">
          <v-icon left size="16" v-if="!saving">{{ isEdit ? 'mdi-check' : 'mdi-cloud-upload-outline' }}</v-icon>
          {{ isEdit ? 'Save Changes' : 'Upload Artwork' }}
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import artworkService from '@/services/artworkService'

export default {
  name: 'ArtworkFormDialog',

  props: {
    value:   { type: Boolean, default: false },
    artwork: { type: Object,  default: null  },
  },

  data: function() {
    return {
      form: { title: '', description: '', price: '', type: '', isFeatured: false },
      selectedFile: null,
      previewUrl:   null,
      dragging:     false,
      saving:       false,
      apiError:     '',
      imageError:   '',
      errors:       { title: '', description: '', price: '' },
      typeOptions: [
        { text: 'Painting',     value: 'painting'     },
        
        { text: 'Photography',  value: 'photography'  },
        { text: 'Illustration', value: 'illustration' },
      
      ],
    }
  },

  computed: {
    isEdit: function() { return !!this.artwork },
  },

  watch: {
    value: function(newVal) {
      if (newVal) {
        this.reset()
        if (this.artwork) {
          this.form.title       = this.artwork.title       || ''
          this.form.description = this.artwork.description || ''
          this.form.price       = this.artwork.price       || ''
          this.form.type        = this.artwork.type        || ''
          this.form.isFeatured  = !!this.artwork.isFeatured
          this.previewUrl       = this.artwork.image       || null
        }
      }
    },
  },

  methods: {
    reset: function() {
      this.form         = { title: '', description: '', price: '', type: '', isFeatured: false }
      this.selectedFile = null
      this.previewUrl   = null
      this.dragging     = false
      this.saving       = false
      this.apiError     = ''
      this.imageError   = ''
      this.errors       = { title: '', description: '', price: '' }
    },

    closeDialog: function() {
      if (this.saving) return
      this.reset()
      this.$emit('input', false)
    },

    onFileChange: function(e) {
      var file = e.target.files && e.target.files[0]
      if (file) {
        this.setFile(file)
      }
      // reset so same file can be reselected
      e.target.value = ''
    },

    onDrop: function(e) {
      this.dragging = false
      var file = e.dataTransfer.files && e.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        this.setFile(file)
      } else {
        this.imageError = 'Please drop an image file'
      }
    },

    setFile: function(file) {
      if (file.size > 10 * 1024 * 1024) {
        this.imageError = 'Image must be under 10MB'
        return
      }
      this.imageError   = ''
      this.imageError   = ''
      this.selectedFile = file
      this.previewUrl   = URL.createObjectURL(file)
    },

    validate: function() {
      var ok = true
      this.errors    = { title: '', description: '', price: '' }
      this.imageError = ''

      if (!this.form.title.trim())                         { this.errors.title       = 'Title is required';       ok = false }
      if (!this.form.description.trim())                   { this.errors.description = 'Description is required'; ok = false }
      if (!this.form.price || Number(this.form.price) <= 0){ this.errors.price       = 'Enter a valid price';     ok = false }
      if (!this.isEdit && !this.selectedFile)              { this.imageError         = 'Please select an artwork image'; ok = false }

      return ok
    },

    submit: function() {
      var self = this
      if (!self.validate()) return

      self.saving   = true
      self.apiError = ''

      var promise

      if (self.isEdit) {
        // Edit with new image → FormData
        if (self.selectedFile) {
          var fd = new FormData()
          fd.append('title',       self.form.title.trim())
          fd.append('description', self.form.description.trim())
          fd.append('price',       String(Number(self.form.price)))
          fd.append('type',        self.form.type || '')
          fd.append('isFeatured',  self.form.isFeatured ? 'true' : 'false')
          fd.append('image',       self.selectedFile)
          promise = artworkService.update(self.artwork._id, fd)
        } else {
          // Edit text only → JSON
          promise = artworkService.update(self.artwork._id, {
            title:       self.form.title.trim(),
            description: self.form.description.trim(),
            price:       Number(self.form.price),
            type:        self.form.type || '',
            isFeatured:  self.form.isFeatured,
          })
        }
        promise = promise.then(function(res) {
          self.$emit('saved', { artwork: res.data.artwork || res.data, mode: 'edit' })
          self.closeDialog()
        })

      } else {
        // CREATE — always FormData
        var formData = new FormData()
        formData.append('title',       self.form.title.trim())
        formData.append('description', self.form.description.trim())
        formData.append('price',       String(Number(self.form.price)))
        formData.append('type',        self.form.type || '')
        formData.append('isFeatured',  self.form.isFeatured ? 'true' : 'false')
        formData.append('image',       self.selectedFile, self.selectedFile.name)

        // Debug — confirm file is in FormData
        console.log('FILE CHECK:', self.selectedFile)
        console.log('FILE TYPE:', self.selectedFile instanceof File)
        for (var pair of formData.entries()) {
          console.log(pair[0], ':', pair[1])
        }

        promise = artworkService.create(formData)
          .then(function(res) {
            self.$emit('saved', { artwork: res.data.artwork || res.data, mode: 'create' })
            self.closeDialog()
          })
      }

      promise
        .catch(function(err) {
          var d = err.response && err.response.data
          self.apiError = (d && (d.message || d.error || d.msg))
            || 'Upload failed. Please try again.'
        })
        .finally(function() {
          self.saving = false
        })
    },
  },
}
</script>