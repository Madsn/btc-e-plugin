/*
 * Author: Mikkel Madsen - m@madsn.net
 * 2013-11-28
 */
'use strict';

function entry(rownum, pair, type, amount, price, total, element){
  this.rownum = rownum;
  this.pair = pair;
  this.type = type;
  this.amount = amount;
  this.price = price;
  this.total = total;
  this.element = element;
}

var recalculate = function(firstrow, thisrow, rows){
  var newAmount = (firstrow['amount'] + thisrow['amount']).toFixed(4);
  var avgPrice = ((firstrow['price']*firstrow['amount'] + thisrow['price']*thisrow['amount']) / newAmount).toFixed(4);
  var newTotal = (firstrow['total'] + thisrow['total']).toFixed(4);
  var thePair = firstrow['pair'].split('/');
  var rowNum = firstrow['rownum'];
  rows[rowNum].childNodes[5].innerHTML = newAmount.toString().replace(/\.?0*$/, '') + ' ' + thePair[0];
  rows[rowNum].childNodes[7].innerHTML = avgPrice.toString().replace(/\.?0*$/, '') + ' ' + thePair[1];
  rows[rowNum].childNodes[9].innerHTML = newTotal.toString().replace(/\.?0*$/, '') + ' ' + thePair[1];
};

var createEntry = function(i, rows){
  var pair = rows[i].childNodes[1].innerHTML;
  var type = rows[i].childNodes[3].innerText;
  var amount = parseFloat(rows[i].childNodes[5].innerHTML.split(' ')[0]);
  var price = parseFloat(rows[i].childNodes[7].innerHTML.split(' ')[0]);
  var total = parseFloat(rows[i].childNodes[9].innerHTML.split(' ')[0]);
  var element = rows[i];
  return new entry(i, pair, type, amount, price, total, element);
};

var consolidateTrades = function(){
  var table = document.getElementById('trade_list_con');
  var rows = table.childNodes[2].childNodes[1].childNodes;
  var firstRowEntry = null;
  var processQueue = {};

  var pair, lastPair, type, lastType, amount, price, total;
  for (var i =2;i<rows.length;i=i+2){
    pair = rows[i].childNodes[1].innerHTML;
    type = rows[i].childNodes[3].innerText;
    if (pair == lastPair && type == lastType) {
      if(!firstRowEntry){
        firstRowEntry = createEntry(i-2, rows);
      }
      processQueue[i] = {'firstrow': firstRowEntry, 'thisrow':createEntry(i, rows)};
    }else{
      firstRowEntry = null;
    }
    lastPair = pair;
    lastType = type;
  }
  for (var x in processQueue){
    var firstRow = processQueue[x]['firstrow'];
    var thisRow = processQueue[x]['thisrow'];
    recalculate(firstRow, thisRow, rows);
  }
  for (var x in processQueue){
    table.childNodes[2].childNodes[1].removeChild(processQueue[x]['thisrow']['element']);
  }
};
consolidateTrades();
document.addEventListener('DOMNodeInserted', consolidateTrades, false);
