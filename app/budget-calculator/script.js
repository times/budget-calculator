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
        {
          sheet: '1',
          text: 'Single professional',
          label: 'single person, working 30+ hours per week, no children',
          notes:
            "The figures include an estimate of the effect of the 0.5% rise in Insurance Premium Tax from October 2016 and 2% rise from 1 June 2017.  For 2017/18 this broadly equates to an average estimated increase of £28.75 for a family with motor, household, pet and private health totalling £1,500 per annum.  For 2018/19 the estimated increase compared to 2016/17 is £30.00 per annum.  These figures do not reflect the Chancellor's commitment to legislate to end the compensation culture surrounding whiplash claims which could save drivers an average of £40 on their premiums. The figures include changes to rates which had been announced previously, either at Budget 2016 or separately.",
        },
        {
          sheet: '2',
          text: 'Self-employed entrepreneur',
          label: 'single self-employed person, working 30+ hours per week',
          notes:
            "The figures include an estimate of the effect of the 0.5% rise in Insurance Premium Tax from October 2016 and 2% rise from 1 June 2017.  For 2017/18 this broadly equates to an average estimated increase of £28.75 for a family with motor, household, pet and private health totalling £1,500 per annum.  For 2018/19 the estimated increase compared to 2016/17 is £30.00 per annum.  These figures do not reflect the Chancellor's commitment to legislate to end the compensation culture surrounding whiplash claims which could save drivers an average of £40 on their premiums. The figures include changes to rates which had been announced previously, either at Budget 2016 or separately.",
        },
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
      this.data = {
        income: cleanIncome,
        household,
        case: dropdownSelection,
      };
      this.showData(this.data);
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
      this.sheetLabel = sheetIDObj.label;
      this.sheetNotes = sheetIDObj.notes;

      // Sort rows in ascending order of income
      const dataFromTables = dataset[sheetID];
      const sortedDataFromTables = dataFromTables.sort(
        (a, b) => parseInt(a.income) - parseInt(b.income)
      );

      // Return last row to be in the bracket range
      const incomeBracket = sortedDataFromTables.reverse().find(income => {
        return income.income <= this.data.income;
      });

      // turn data into meaningful strings with £ sign and +/ in the right place
      for (const prop in incomeBracket) {
        if (incomeBracket.hasOwnProperty(prop)) {
          if (incomeBracket[prop] < 0) {
            incomeBracket[prop + '_str'] =
              '-£' + Math.abs(incomeBracket[prop]).toLocaleString();
          } else {
            incomeBracket[prop + '_str'] =
              '£' + incomeBracket[prop].toLocaleString();
          }
        }
      }

      this.incomeData = incomeBracket;

      document.getElementById('app-info').classList.add('visible');

      // @TODO: handle income < 10,000
    },
  });
}
