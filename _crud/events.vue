<template></template>
<script>
export default {
  data() {
    return {crudId: this.$uid()}
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qevent.entityNames.event"),
        apiRoute: 'apiRoutes.qevent.events',
        permission: null,
        extraFormFields: 'ievent.crud-fields.events',
        create: {
          title: this.$tr('ievent.cms.newEvent'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'rigth'},
            {
              name: 'parent', label: this.$tr('isite.cms.form.parent'), field: 'parent', align: 'left',
              format: val => val ? (val.title ? val.title : '-') : '-'
            },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ],
          requestParams: {}
        },
        update: {
          title: this.$tr('ievent.cms.updateEvent'),
          requestParams: {}
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          userId: {value: this.$store.state.quserAuth.userId},
          title: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.title')}*`,
              rules: [val => !!val || this.$tr('isite.cms.message.fieldRequired')]
            },
          },
          slug: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.slug')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          description: {
            value: '',
            type: 'html',
            props: {
              label: `${this.$tr('isite.cms.form.description')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
        },
        formRight: {
          date: {
            value: null,
            type: 'date',
            props: {
              label: `${this.$tr('isite.cms.form.date')}*`,
              rules: [val => !!val || this.$tr('isite.cms.message.fieldRequired')],
              options: (date) => date >= this.$moment().format('YYYY/MM/DD')
            },
          },
          hour: {
            value: null,
            type: 'hour',
            props: {
              label: `${this.$tr('isite.cms.form.hour')}*`,
              rules: [val => !!val || this.$tr('isite.cms.message.fieldRequired')],
              options: (hr, min, sec) => {
                //If is diferent day permit all times
                if (!this.crudInfo.date || (this.crudInfo.date) != this.$moment().format('YYYY/MM/DD'))
                  return true
                //Validate time same or up to current
                if (hr && (hr < this.$moment().format('h'))) return false
                if ((min !== null) && (min <= this.$moment().format('mm'))) return false
                return true
              }
            },
          },
          categoryId: {
            value: null,
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('modules/qevent/_crud/categories'),
              crudProps: {
                label: `${this.$tr('isite.cms.form.category')}*`,
                rules: [val => !!val || this.$tr('isite.cms.message.fieldRequired')],
              },
            },
          },
          departmentId: {
            value: null,
            type: 'select',
            props: {
              label: `${this.$tr('isite.cms.label.department')}*`,
              rules: [val => !!val || this.$tr('isite.cms.message.fieldRequired')],
            },
            loadOptions: {
              apiRoute: 'apiRoutes.quser.departments'
            }
          },
          isPublic: {
            value: 1,
            type: 'select',
            props: {
              label: `${this.$tr('isite.cms.form.type')}`,
              options: [
                {label: this.$tr('isite.cms.label.public'), value: 1},
                {label: this.$tr('isite.cms.label.private'), value: 0},
              ]
            }
          },
          status: {
            value: '1',
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.status'),
              options: [
                {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                {label: this.$tr('isite.cms.label.disabled'), value: '0'},
              ]
            },
          },
          mediasSingle: {
            value: {},
            type: 'media',
            props: {
              label: this.$tr('isite.cms.form.image'),
              zone: 'mainimage',
              entity: "Modules\\Ievent\\Entities\\Event",
              entityId: null
            }
          }
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    },
  },
  methods: {}
}
</script>
