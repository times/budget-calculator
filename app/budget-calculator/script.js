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
      this.form.addEventListener(
        'submit',
        this.getDataFromUser.bind(this),
        false
      );
    },

    // Called after the element is detached from the document
    detached: function() {
      this.button.removeEventListener(
        'click',
        this.getDataFromUser.bind(this),
        false
      );
    },

    getDataFromUser: function(e) {
      e.preventDefault();
      this.$$('.error').innerHTML = '';

      // income from text box
      const income = this.$['incomeInput'].value.replace(/,/g, '');
      const cleanIncome = parseInt(income);
      if (isNaN(cleanIncome)) {
        this.$$('.error').innerHTML =
          'THERE HAS BEEN A PROBLEM PARSING YOUR INCOME.';
        return;
      }

      // household type: single or couple from radio checkboxes
      let household = null;
      const checkBoxesFormData = new FormData(this.form);
      for (const entry of checkBoxesFormData) {
        household = entry[1];
      }

      // dropdown: will include the discrete list of cases from the dataset
      if (this.dropdownVisible === true) {
        const dropdownSelection = document.getElementById('dropdown').options[
          document.getElementById('dropdown').selectedIndex
        ].value;
        this.data.dropdownSelection = dropdownSelection;

        // at this stage, the dropdown has been displayed
        // and the reader has made a choice.
        // we've got enough to display our things
        this.showData(this.data);
      }

      this.data = {
        cleanIncome,
        household,
      };
      this.displayDropdown();
    },

    displayDropdown: function() {
      document.getElementById('dropdownSection').classList.add('visible');
      this.dropdownVisible = true;
    },

    showData: function(data) {
      console.log(data);
    },
  });
}
