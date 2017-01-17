// @flow
import { TemplateVar } from 'meteor/frozeman:template-var'
import { EthAccounts } from 'meteor/ethereum:accounts'
import { Template } from 'meteor/templating'

import Identity from '/client/lib/identity'

const tmpl = Template.Module_Account.extend()

tmpl.onRendered(function () {
  this.$('#logout').popup({ position: 'top center' })
  this.$('#viewAllAccounts, #linkKeybase').popup({ position: 'bottom center' })

  this.autorun(() => {
    if (TemplateVar.get('viewAllAccounts')) {
      requestAnimationFrame(() => {
        this.$('.dropdown').dropdown({
          onChange: (val) => {
            Identity.setCurrentEthereumAccount(val)
            TemplateVar.set(this, 'viewAllAccounts', false)
          },
        })
      })
      // Handling the case of a Keybase Eth keypair not loaded
      const addresses = EthAccounts.find().fetch().map(x => x.address)
      if (addresses.indexOf(Identity.current().ethereumAddress) === -1) {
        Identity.setCurrentEthereumAccount(addresses[0])
      }
    }
  })
})

tmpl.events({
  'click #viewAllAccounts': () => TemplateVar.set('viewAllAccounts', true),
  'click #unlinkIdentity': () => {
    const entity = Identity.current()
    Identity.setCurrent({
      identityProvider: 'anon',
      ethereumAddress: entity.ethereumAddress,
      data: {},
    })
  },
  'click #linkKeybase': async () => Identity.linkCurrent('keybase'),
})

tmpl.helpers({
  accounts: () => EthAccounts.find(),
})