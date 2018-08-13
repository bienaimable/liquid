export function isPercentChangeStable(json, options) {
  let column = options.column;
  let threshold = options.threshold;
  for (var i = 1; i < json.length; i++) {
    let old_value = json[i - 1][column];
    let new_value = json[i][column];
    if (Math.abs(percentChange(new_value, old_value)) >= threshold) {
      return false;
    }
  }
  return true;
}

export function percentChange(new_value, old_value) {
  return (new_value - old_value) / old_value;
}

export function isRecentFeed(json, threshold) {
  var dates = [];
  for (var i in json) {
    dates.push(new Date(json[i].feed_import));
  }
  var maxDate = new Date(Math.max.apply(null, dates));
  const oneDay = 24*60*60*1000;
  var difference = (new Date() - maxDate)/oneDay;
  if (difference >= threshold) {
    return false;
  } else {
    return true;
  }
}

export function changeInValue(json, columnToCheck) {
  var current_value;
  for (var i = 0; i < json.length; i ++) {
    if (i === 0) {
      current_value = json[0][columnToCheck];
    }
    var next_value = json[i][columnToCheck];
    if (current_value !== next_value) {
      return {day : json[i].day, value : json[i][columnToCheck]};
    }
  }
  return false;
}

export function detectChangeInValue(json, columns) {
  var changes_list = [];
  for (var i in columns) {
    var col = columns[i];
    var check = changeInValue(json, col);
    if (check !== false) {
      changes_list.push({col_name : col, day : check.day, value : check.value});
    }
  }
  if (changes_list.length == 0) {
    return false;
  } else {
    var print_strings = [];
    for (var i in changes_list) {
      print_strings.push(changes_list[i].col_name + ' changed to ' + changes_list[i].value + ' on ' + changes_list[i].day);
    }
    return {changes : print_strings.join(', '), change_list : changes_list};
  }
}

export function detectChangeInCount(json, columnToCount){
  return changeInCount(getCounts(json, columnToCount));
}

export function getCounts(json, columnToCount) {
  var current_date = 0;
  var entry = -1;
  var counts = [];
  for (var i = 0; i < json.length; i ++) {
    if (json[i].day === current_date) {
      counts[entry].count += 1;
      counts[entry].values.push(json[i][columnToCount]);
    } else {
      entry += 1;
      current_date = json[i].day;
      counts[entry] = {day : current_date, count : 1, values : [json[i][columnToCount]]};
    }
  }
  return counts;
}

export function changeInCount(json){
  var current_count = 0;
  for (var i = 0; i < json.length; i ++) {
    if (i === 0) {
      current_count = json[i].count;
    } else {
      if (json[i].count !== current_count) {
        return {day : json[i].day, values : json[i].values.join(', ')};
      }
    }
  }
  return false;
}
