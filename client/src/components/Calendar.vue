<template>
  <v-row>
    <v-col>
      <div class="calender-title">
        <div>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
        <h3 class="calendar-actual-title">
          {{ title }}
        </h3>
      </div>
      <v-sheet height="64">
        <v-toolbar class="calendar-toolbar" flat color="white">
          <div class="flex-grow-1"></div>
          <v-btn outlined class="mr-4 calendar-today" @click="setToday">
            Today
          </v-btn>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent">
              <v-text-field
                v-model="name"
                type="text"
                label="event name (required)"
              ></v-text-field>
              <v-text-field
                v-model="details"
                type="text"
                label="detail"
              ></v-text-field>
              <v-text-field
                v-model="start"
                type="date"
                label="start date (required)"
              ></v-text-field>
              <v-text-field
                v-model="end"
                type="date"
                label="end date (required)"
              ></v-text-field>
              <v-text-field
                v-model="startTime"
                type="time"
                label="start time"
              ></v-text-field>
              <v-text-field
                v-model="endTime"
                type="time"
                label="end time"
              ></v-text-field>
              <v-text-field
                v-model="color"
                type="color"
                label="color (click to open color menu)"
              ></v-text-field>
              <!-- TODO: add invitees here -->
              <v-btn
                type="submit"
                color="primary"
                class="mr-4"
                @click.stop="dialog = false"
              >
                create event
              </v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :event-margin-bottom="3"
          :now="today"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="setDialog"
          @change="updateRange"
        ></v-calendar>
        <!--when pressing on an event -->
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" :width="350" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn @click="deleteEvent(selectedEvent._id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>
            <v-card-text>
              <p class="text-h7 text--primary">
                {{ selectedEvent.start + ' - ' + selectedEvent.end }}
              </p>
              <p>{{ selectedEvent.details }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                close
              </v-btn>
              <v-btn text @click="editDialog = true"> edit info </v-btn>
              <v-btn text @click="editDateDialog = true"> edit date </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-dialog v-model="editDialog" max-width="500">
          <v-card>
            <v-container>
              <v-form @submit.prevent="updateEvent(selectedEvent)">
                <v-text-field
                  v-model="selectedEvent.name"
                  type="text"
                  label="event name (required)"
                ></v-text-field>
                <v-text-field
                  v-model="selectedEvent.details"
                  type="text"
                  label="details"
                ></v-text-field>
                <v-text-field
                  v-model="selectedEvent.color"
                  type="color"
                  label="color (click to open color menu)"
                ></v-text-field>
                <!-- TODO: add invitees here -->
                <v-btn
                  type="submit"
                  color="primary"
                  class="mr-4"
                  @click.stop="editDialog = false"
                >
                  save
                </v-btn>
              </v-form>
            </v-container>
          </v-card>
        </v-dialog>
        <v-dialog v-model="editDateDialog" max-width="500">
          <v-card>
            <v-container>
              <div>
                <p class="font-weight-bold">Please change the date here</p>
                <p>Current start date: {{ selectedEvent.start }}</p>
                <p>Current end date: {{ selectedEvent.end }}</p>
              </div>
              <v-form @submit.prevent="updateDate(selectedEvent)">
                <v-text-field
                  v-model="selectedEvent.start"
                  type="date"
                  label="start date"
                ></v-text-field>
                <v-text-field
                  v-model="selectedEvent.end"
                  type="date"
                  label="end date"
                ></v-text-field>
                <v-text-field
                  v-model="selectedEvent.startTime"
                  type="time"
                  label="start time"
                ></v-text-field>
                <v-text-field
                  v-model="selectedEvent.endTime"
                  type="time"
                  label="end time"
                ></v-text-field>
                <!-- TODO: add invitees here -->
                <v-btn
                  type="submit"
                  color="primary"
                  class="mr-4"
                  @click.stop="editDateDialog = false"
                >
                  save
                </v-btn>
              </v-form>
            </v-container>
          </v-card>
        </v-dialog>
      </v-sheet>
      <v-row>
        <v-col>
          <v-sheet>
            <v-btn
              class="u-margin-right calendar-buttons-bottom"
              color="green"
              dark
              @click.stop="dialog = true"
            >
              New Event
            </v-btn>
            <v-btn
              class="calendar-buttons-bottom"
              color="red"
              outlined
              dark
              @click="deleteAllEvents"
            >
              Delete all events
            </v-btn>
          </v-sheet>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { Api } from '@/Api'
export default {
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days'
    },
    name: null,
    startTime: null,
    endTime: null,
    details: null,
    start: null,
    end: null,
    color: '#1976D2', // default event color
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false,
    editDialog: false,
    editDateDialog: false
  }),
  mounted() {
    this.getEvents()
  },
  computed: {
    title() {
      const { start, end } = this
      if (!start || !end) {
        return ''
      }
      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth
      const startYear = start.year
      const endYear = end.year
      const suffixYear = startYear === endYear ? '' : endYear
      const startDay = start.day + this.nth(start.day)
      const endDay = end.day + this.nth(end.day)
      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`
        case 'week':
        case '4day':
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
        case 'day':
          return `${startMonth} ${startDay} ${startYear}`
      }
      return ''
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC',
        month: 'long'
      })
    }
  },
  methods: {
    async getEvents() {
      Api.get('/events')
        .then((response) => {
          console.log('response')
          console.log(response.data)
          this.events = response.data
        })
        .catch((error) => {
          this.events = []
          console.log('error')
          console.log(error)
          if (error.response) {
            alert(
              'Oh no something went wrong when fetching events, Status code ' + error.response.status
            )
          } else {
            alert('Oops something went wrong when fetching events')
          }
        })
        .then(() => {
          console.log(this.events)
        })
    },
    setDialog({ date }) {
      this.dialog = true
      this.focus = date
    },
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = this.today
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    async addEvent() {
      // TODO: check if event time make sense, It cannot end before it starts.
      if (
        this.name &&
        this.start &&
        this.end &&
        this.startTime &&
        this.endTime
      ) {
        console.log('start: ' + this.start + ' end: ' + this.end)
        if (
          (this.startTime > this.endTime && this.start < this.end) ||
          (this.startTime < this.endTime && this.start <= this.end) ||
          this.start < this.end
        ) {
          const event = {
            name: this.name,
            start: this.start + ' ' + this.startTime,
            end: this.end + ' ' + this.endTime,
            details: this.details,
            color: this.color
          }
          await Api.post('/events', event).catch((error) => {
            console.log(error)
            if (error.response) {
              alert(
                'Failed to created the event, Status code ' +
                  error.response.status
              )
            } else {
              alert('Oops something went wrong when creating the event')
            }
          })
          this.getEvents()
          this.name = ''
          this.details = ''
          this.start = ''
          this.end = ''
        } else {
          alert('The event cannot end before it starts, plz check the time ;)')
        }
      } else {
        alert('You must enter event name, start/end date , and start/end time')
      }
    },
    editEvent(ev) {
      this.currentlyEditing = ev._id
    },
    async updateEvent(ev) {
      const updatedEvent = {
        name: ev.name,
        details: ev.details,
        color: ev.color
      }
      console.log(updatedEvent)
      Api.patch(`/events/${ev._id}`, updatedEvent).catch((error) => {
        console.log(error)
        if (error.response) {
          alert(
            'failed to update, Status code ' + error.response.status
          )
        } else {
          alert('Oops something went wrong')
        }
      })
      this.selectedOpen = false
      this.currentlyEditing = null
    },
    updateDate(ev) {
      if (ev.start && ev.end && ev.startTime && ev.endTime) {
        if (
          (this.startTime > this.endTime && this.start < this.end) ||
          (this.startTime < this.endTime && this.start <= this.end) ||
          this.start < this.end
        ) {
          const event = {
            start: ev.start + ' ' + ev.startTime,
            end: ev.end + ' ' + ev.endTime
          }
          Api.patch(`/events/${ev._id}`, event).catch((error) => {
            console.log(error)
            if (error.response) {
              alert(
                'failed to update, Status code ' +
                  error.response.status
              )
            } else {
              alert('Oops something went wrong ')
            }
          })
        } else {
          alert('The event cannot end before it starts, plz check the time ;)')
        }
      } else {
        alert('You must enter a time and a date')
      }
    },
    async deleteEvent(ev) {
      console.log('Delete event with id' + ev)
      Api.delete(`/events/${ev}`)
        .catch((error) => {
          console.log(error)
          if (error.response) {
            alert(
              'Oh no deletion failed, Status code ' + error.response.status
            )
          } else {
            alert('Oops something went wrong')
          }
        })
        .then((response) => {
          const index = this.events.findIndex((event) => event._id === ev)
          this.events.splice(index, 1)
        })
      this.selectedOpen = false
      this.getEvents()
    },
    deleteAllEvents() {
      Api.delete('/events').catch((error) => {
        console.log(error)
        if (error.response) {
          alert(
            'Oops something went wrong, Status code ' + error.response.status
          )
        } else {
          alert('Oops something went wrong ')
        }
      })
      this.getEvents()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    updateRange({ start, end }) {
      this.start = start
      this.end = end
    },
    nth(d) {
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    }
  }
}
</script>

<style scoped>
.calender-title {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  margin-top: 25px;
}

.calendar-actual-title {
  font-size: 25px;
}

.u-margin-right {
  margin-right: 10px;
}

.calendar-buttons-bottom {
  margin-top: 10px;
  margin-left: 10px;
}
</style>
