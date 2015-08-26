window.bootstrap_data || (window.bootstrap_data = {});bootstrap_data.iif_status_def = {"metadata":{"title":"IIF Status","short_name":"iif_status"},"definitions":[{"name":"region","title":"Region","geosearch":true,"multiple_select":false,"options":[{"title":"Africa","value":"africa"},{"title":"Asia","value":"asia"},{"title":"Central and Eastern Europe","value":"central_and_eastern_europe"},{"title":"Latin America and the Caribbean","value":"latin_america_and_the_caribbean"},{"title":"Northern Mediterranean","value":"northern_mediterranean"},{"title":"Other","value":"other"}]},{"name":"subregion","title":"Subregion","geosearch":true,"multiple_select":false,"value_from_title":true,"options":[{"title":"Andean","value":"andean"},{"title":"Caribbean","value":"caribbean"},{"title":"Central Africa","value":"central_africa"},{"title":"Central Asia","value":"central_asia"},{"title":"Central and Eastern Europe","value":"central_and_eastern_europe"},{"title":"East Asia","value":"east_asia"},{"title":"Eastern Africa","value":"eastern_africa"},{"title":"Mesoamerica","value":"mesoamerica"},{"title":"Northern Africa","value":"northern_africa"},{"title":"Northern Mediterranean","value":"northern_mediterranean"},{"title":"Other","value":"other"},{"title":"Pacific","value":"pacific"},{"title":"South Asia","value":"south_asia"},{"title":"South Cone","value":"south_cone"},{"title":"South East Asia","value":"south_east_asia"},{"title":"Southern Africa","value":"southern_africa"},{"title":"West Asia","value":"west_asia"},{"title":"Western Africa","value":"western_africa"}]},{"name":"party","title":"Party","infer_options_from_data":true,"title_field":"short_name","value_field":"iso2","description":"Some text to describe it","geosearch":true},{"name":"iif_or_plan","title":"IIF plan","description":"Whether or not it exists","options":[{"value":"iif","title":"IIF established","colour":"#F47730"},{"value":"plan","title":"No IIF, plan exists","colour":"#579DD4"},{"value":"no_plan","title":"No IIF, no plan","colour":"#005BA9"},{"value":"unknown","title":"No data","colour":"rgb(105, 40, 90)"}]},{"name":"iif_plan_start","title":"IIF plan start date","description":"Biennium","options":[{"value":"2014_2015","title":"Planned 2014-2015","colour":"#267EBA"},{"value":"2016_2017","title":"Planned 2016-2017","colour":"#39B6C5"},{"value":"2018_2019","title":"Planned 2018-2019","colour":"#9FDBB3"}]},{"name":"gm_supported","title":"GM supported","description":"Parties receiving GM support","options":[{"value":"received","title":"IIF established, received GM support","colour":"#7DC078"},{"value":"not_required","title":"No IIF, not receiving GM support","colour":"#B08CC5"},{"value":"not_received","title":"IIF established without GM support","colour":"pink"}]}],"views":[{"name":"iifs_established","title":"IIFs established","description":"The map shows Country and Regional parties with IIFs already established.","filterAttribute":"iif_or_plan"},{"name":"iifs_planned","title":"IIFs planned","description":"These are Voluntary National Targets. These include IIFs with no specific date.","filterAttribute":"iif_plan_start"},{"name":"gm_support","title":"GM support","description":"The map shows parties with IIFs established which have received support from GM. The GM has also supported development or facilitation of IFS/IIF in Palestine, Limpopo Basin, EFIR (as a text, as in case with SRAPs).","filterAttribute":"gm_supported"}]};