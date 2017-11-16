/* global Polymer */

module.exports = require('../index.js')('budget-calculator');

if (typeof document !== 'undefined') {
  require('./style.scss');

  Polymer({
    is: 'budget-calculator',

    properties: {},

    // Use for one-time set-up before property values are set
    created: function() {},

    // Use for one-time configuration after local DOM is initialized
    ready: function() {},

    // Called after the element is attached to the document
    attached: function() {
      this.form = this.$['form'];
      this.form.addEventListener('submit', this.doAThing.bind(this), false);
    },

    // Called after the element is detached from the document
    detached: function() {
      this.button.removeEventListener('click', this.doAThing.bind(this), false);
    },

    doAThing: function(e) {
      e.preventDefault();
      console.log(e);
    },
  });
}
