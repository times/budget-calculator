/* global Polymer */

module.exports = require('../index.js')('budget-calculator');

if (typeof document !== 'undefined') {
  require('./style.scss');
  const dataset = require('./results.json');

  Polymer({
    is: 'budget-calculator',

    properties: {},

    // Use for one-time set-up before property values are set
    created: function() {},

    // Use for one-time configuration after local DOM is initialized
    ready: function() {
      // bug
      // dataset shows one empty slot, but it definitely isn't undefined
      // console.log(dataset, Object.keys(dataset), dataset['1']);

      this.sheetsMapping = [
        { sheet: '1', text: 'Single professional' },
        { sheet: '2', text: 'Self-employed entrepreneur' },
      ];
      this.displayDropdown(this.sheetsMapping);
    },

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
      const household = document.querySelector('input[name="person"]:checked')
        .value;

      // dropdown: will include the discrete list of cases from the dataset
      // if (this.dropdownVisible === true) {
      const dropdownSelection = document.getElementById('dropdown').options[
        document.getElementById('dropdown').selectedIndex
      ].value;
      // }
      const data = {
        income: cleanIncome,
        household,
        case: dropdownSelection,
      };
      this.showData(data);
    },

    displayDropdown: function(mapping) {
      const select = document.getElementById('dropdown');

      for (let i = 0; i < mapping.length; i++) {
        let option = document.createElement('option');
        option.setAttribute('value', mapping[i].text);
        option.appendChild(document.createTextNode(mapping[i].text));
        select.appendChild(option);
      }

      document.getElementById('dropdown').classList.add('visible');
      this.dropdownVisible = true;
    },

    showData: function(data) {
      const sheetIDObj = this.sheetsMapping.find(e => e.text === data.case);
      const sheetID = parseInt(sheetIDObj.sheet);
      console.log(dataset[sheetID]);

      // @TODO: test income
      // return corresponding object
      // set to this.allthethings
      // pick it up in the HTML
    },
  });
}
