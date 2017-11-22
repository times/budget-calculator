/* global Polymer */

module.exports = require('../index.js')('budget-calculator');

if (typeof document !== 'undefined') {
  require('./style.scss');
  const dataset = require('./2017.json');
  require('smoothscroll-polyfill').polyfill();

  Polymer({
    is: 'budget-calculator',

    properties: {
      noheadline: {
        type: String,
        value: '',
      },
    },

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
          text: 'Young graduate',
          label:
            'Single person, employed, working 30+ hours per week, with no children, paying student loan repayments',
          notes: '',
        },
        {
          sheet: '2',
          text: 'Single professional',
          label:
            'Single person, employed, working 30+ hours per week, with no children and no student debt',
          notes: '',
        },
        {
          sheet: '3',
          text: 'Entrepreneur',
          label:
            'Single person, self employed, working 30+ hours a week with no children',
          notes: '',
        },
        {
          sheet: '4',
          text: 'Single person, one child',
          label:
            'Single person, employed, working 30+ hours per week, with one child (over the age of one)',
          notes: '',
        },
        {
          sheet: '5',
          text: 'Family of three, both working',
          label:
            'Couple, both employed, working 30+ hours per week, assumed household income split 75% to one partner and 25% to other partner, with one child (over the age of one)',
          notes: '',
        },
        {
          sheet: '6',
          text: 'Family of three, one working',
          label:
            'Couple, one employed, working 30+ hours per week, with one child (over the age of one)',
          notes: '',
        },
        {
          sheet: '7',
          text: 'Working couple, no children',
          label:
            'Couple, both employed, working 30+ hours per week, assumed household income split 75% to one partner and 25% to other partner, with no children',
          notes: '',
        },
        {
          sheet: '8',
          text: 'Single pensioner',
          label: 'Single person, pensioner, aged 65-74',
          notes: '',
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

      this.incomeBar = this.$['incomeInput'];
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
      if (cleanIncome < 10000) {
        this.$$('.error').innerHTML =
          'PLEASE INPUT AN INCOME GREATER THAN £10,000.';
        return;
      }

      // dropdown: will include the discrete list of cases from the dataset
      // if (this.dropdownVisible === true) {
      const dropdownSelection = document.getElementById('dropdown').options[
        document.getElementById('dropdown').selectedIndex
      ].value;
      // }
      this.data = {
        income: cleanIncome,
        case: dropdownSelection,
      };
      this.showData(this.data);

      // send income input
      ga('send', 'event', 'budget-calculator', 'income', this.data.income);
    },

    displayDropdown: function(mapping) {
      const select = document.getElementById('dropdown');

      for (let i = 0; i < mapping.length; i++) {
        let option = document.createElement('option');
        option.setAttribute('value', mapping[i].text);
        option.appendChild(document.createTextNode(mapping[i].text));
        select.appendChild(option);
      }

      this.dropdownVisible = true;
    },

    showData: function(data) {
      // on mobile, scroll Y down by 200px on click.
      // this helps the reader to notice we changed things
      if (this.parentElement.clientWidth < 600) {
        window.scrollBy({ top: 200, left: 0, behavior: 'smooth' });
      }

      const sheetIDObj = this.sheetsMapping.find(e => e.text === data.case);
      const sheetID = parseInt(sheetIDObj.sheet);
      this.sheetLabel = sheetIDObj.label;
      this.sheetNotes = sheetIDObj.notes;

      // send selected case, eg entrepreneur, family of 3, etc.
      ga('send', 'event', 'budget-calculator', 'case', this.sheetLabel);
      ga(
        'send',
        'event',
        'budget-calculator',
        'unique_cases',
        this.data.income + ', ' + this.sheetLabel
      );

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
          } else if (prop === 'change_2018') {
            incomeBracket[prop + '_str'] =
              '+£' + incomeBracket[prop].toLocaleString();
          } else {
            incomeBracket[prop + '_str'] =
              '£' + incomeBracket[prop].toLocaleString();
          }
        }
      }

      this.incomeData = incomeBracket;

      document.getElementById('app-info').classList.add('visible');

      // bind click event on show more button
      const showMore = this.$['showMore'];
      showMore.addEventListener('click', e => {
        document.getElementsByClassName('notes')[0].classList.add('visible');
        document.getElementById('showMore').classList.add('invisible');
      });
    },
  });
}
