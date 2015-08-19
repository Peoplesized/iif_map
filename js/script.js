window.app || (window.app = {});

// 
// App launch
// 

$.getJSON('data/iif_status.json', function(data) {
  app.data = new Countries(data);
  app.filtered_data = new FilteredCollection(app.data);
  app.explorer = explorer(app.filtered_data);

  // app.explorer.on('change', function(changeObject) { 
  //   if (changeObject.selectedCountry != undefined) {
  //     if (changeObject.selectedCountry) { 
  //       return console.log('change selectedCountry to', changeObject.selectedCountry);
  //     } else {
  //       return console.log('reset selectedCountry ');
  //     }
  //   };
  //   return;
  // });

  window.m = drawMap(app.data);
  window.mo = m.vectorMap('get', 'mapObject');
  return;
});
