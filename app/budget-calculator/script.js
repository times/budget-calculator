/* global Polymer */

module.exports = require('../index.js')('budget-calculator');

if (typeof document !== 'undefined') {
  require('./style.scss');
  const dataset = require('./results.json');
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
          text: 'Single professional',
          label:
            'single person, employed, working 30+ hours per week, no children, no student debt',
          notes:
            "The figures include an estimate of the effect of the 0.5% rise in Insurance Premium Tax from October 2016 and 2% rise from 1 June 2017.  For 2017/18 this broadly equates to an average estimated increase of £28.75 for a family with motor, household, pet and private health totalling £1,500 per annum.  For 2018/19 the estimated increase compared to 2016/17 is £30.00 per annum.  These figures do not reflect the Chancellor's commitment to legislate to end the compensation culture surrounding whiplash claims which could save drivers an average of £40 on their premiums. The figures include changes to rates which had been announced previously, either at Budget 2016 or separately.",
        },
        {
          sheet: '2',
          text: 'Entrepreneur',
          label:
            'single person, self-employed, working 30+ hours per week, no children',
          notes:
            "The figures include an estimate of the effect of the 0.5% rise in Insurance Premium Tax from October 2016 and 2% rise from 1 June 2017.  For 2017/18 this broadly equates to an average estimated increase of £28.75 for a family with motor, household, pet and private health totalling £1,500 per annum.  For 2018/19 the estimated increase compared to 2016/17 is £30.00 per annum.  These figures do not reflect the Chancellor's commitment to legislate to end the compensation culture surrounding whiplash claims which could save drivers an average of £40 on their premiums. The figures include changes to rates which had been announced previously, either at Budget 2016 or separately.",
        },
        {
          sheet: '3',
          text: 'Single Parent, 1 child',
          label:
            'single person, working, 1 child (over the age of 1), working 30+ hours per week',
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
          } else if (prop === 'income_change_2018') {
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
