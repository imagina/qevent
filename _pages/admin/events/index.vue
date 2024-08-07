<template>
  <div id="pageEvents" :key="pageId">
    <!--Page Actions-->
    <div class="box box-auto-height q-mb-md">
      <page-actions :extra-actions="['new','search']" :title="$tr($route.meta.title)" @refresh="getData(true)"
                    @search="val => {search = val; getData()}" @new="$refs.eventCrud.create()"/>
    </div>

    <!--Content-->
    <div id="contentEvents" class="box relative-position">
      <!--Event crud-->
      <crud :crud-data="import('modules/qevent/_crud/events')" type="form-only" ref="eventCrud"
            @created="getData(true)" @updated="getData(true)"/>
      <!--Calendar-->
      <calendar :events-data="eventsData" :event-actions="eventActions"/>
      <!--Inner loading-->
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>
<script>
import {colors} from 'quasar'
//Components
import calendar from 'modules/qsite/_components/master/calendar'
import { eventBus } from 'src/plugins/utils'

export default {
  beforeUnmount() {
    eventBus.off('page.data.refresh')
  },
  props: {},
  components: {calendar},
  watch: {},
  validations() {
    return {}
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      pageId: this.$uid(),
      loading: false,
      eventsData: [],
      search: null,
      eventActions: [
        {
          label: this.$tr('isite.cms.label.update'),
          icon: 'fas fa-pen',
          color: 'green',
          callBack: (event) => this.$refs.eventCrud.update(event)
        }
      ]
    }
  },
  computed: {
    //Dynamic fields
    dynamicFields() {
      return {
        search: {
          value: null,
          type: 'search'
        }
      }
    }
  },
  methods: {
    async init() {
      //Set filters
      this.setFilters()
      //Get data
      this.getData()
      //Listen refresh event
      eventBus.on('page.data.refresh', () => {
        this.pageId = this.$uid()
        this.getData(true)
      })
      //Mobile main action
      eventBus.emit('setMobileMainAction', {
        icon: 'fas fa-plus',
        color: 'green',
        callBack: () => this.$refs.eventCrud.create()
      })
    },
    //Set filters
    setFilters() {
      this.$filter.setFilter({
        name: this.$route.name,
        fields: {
          categoryId: {
            value: null,
            type: 'treeSelect',
            props: {
              label: this.$tr('isite.cms.label.category')
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qevent.categories'
            }
          },
          departmentId: {
            value: null,
            type: 'treeSelect',
            props: {
              label: this.$tr('isite.cms.label.department')
            },
            loadOptions: {
              apiRoute: 'apiRoutes.quser.departments'
            }
          },
          status: {
            value: '1',
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.status'),
              clearable: true,
              options: [
                {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                {label: this.$tr('isite.cms.label.disabled'), value: '0'},
              ]
            },
          }
        },
        callBack: () => this.getData(true)
      })
    },
    //Get data
    async getData(refresh = false) {
      //Loading
      this.loading = true
      this.eventsData = []
      //Request data
      await Promise.all([
        this.getEvents(refresh),//Get events
        this.getUsersBirthday(refresh)//Get users birthday
      ])
      //Loading
      this.loading = false
    },
    //Get data
    getEvents(refresh = false) {
      return new Promise((resolve, reject) => {
        //Request params
        let requestParams = {
          refresh: refresh,
          params: {
            include: 'department,category',
            filter: {
              ...(this.$filter.values || {}),
              search: this.search,
            }
          }
        }
        //Request
        this.$crud.index('apiRoutes.qevent.events', requestParams).then(response => {
          //Transform events
          response.data.forEach(event => {
            this.eventsData.push({
              id: event.id,
              title: `${!parseInt(event.status) ? this.$tr('isite.cms.label.cancelled') : ''} ${event.title}`,
              color: parseInt(event.status) ? (event.category ? (event.category.options.color || '#26a69a') : '#26a69a') : '#e57373',
              icon: parseInt(event.status) ? 'fas fa-calendar' : 'fas fa-calendar-times',
              image: event?.mediaFiles?.mainimage.mediumThumb,
              date: event.date,
              mainDetails: [
                {
                  title: this.$tr('isite.cms.label.category'),
                  icon: 'fas fa-calendar-check',
                  value: event.category.title
                },
                {title: this.$tr('isite.cms.label.department'), icon: 'fas fa-users', value: event.department.title},
              ],
              extraDetails: [
                {
                  title: this.$tr('isite.cms.label.category'),
                  icon: 'fas fa-calendar-check',
                  value: event.category.title
                },
                {title: this.$tr('isite.cms.label.department'), icon: 'fas fa-users', value: event.department.title},
                {value: event.description}
              ]
            })
          })
          //Response
          resolve(response.data)
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            resolve(true)
          })
        })
      })
    },
    //Get birthdays
    getUsersBirthday(refresh = false) {
      return new Promise((resolve, reject) => {
        //Request params
        let requestParams = {refresh: refresh}
        //Request
        this.$crud.index('apiRoutes.quser.usersBirthday', requestParams).then(response => {
          //Transform events
          response.data.forEach(event => {
            this.eventsData.push({
              //id: event.id,
              title: event.fullName,
              color: '#e57373',
              icon: 'fas fa-birthday-cake',
              date: event.birthday,
              mainDetails: [
                {
                  title: this.$tr('isite.cms.label.category'),
                  icon: 'fas fa-calendar-check',
                  value: this.$tr('isite.cms.label.birthday')
                },
                {
                  title: this.$tr('isite.cms.label.department'),
                  icon: 'fas fa-users',
                  value: this.$tr('isite.cms.label.birthday')
                },
              ],
              extraDetails: [
                {
                  title: this.$tr('isite.cms.label.category'),
                  icon: 'fas fa-calendar-check',
                  value: this.$tr('isite.cms.label.birthday')
                },
                {
                  title: this.$tr('isite.cms.label.department'),
                  icon: 'fas fa-users',
                  value: this.$tr('isite.cms.label.birthday')
                }
              ]
            })
          })
          //Response
          resolve(response.data)
        }).then(error => {
          this.$apiResponse.handleError(error, () => {
            resolve(false)
          })
        })
      })
    }
  }
}
</script>
<style lang="scss">
#pageEvents {
  #contentEvents {
    padding: 0;
  }
}
</style>
